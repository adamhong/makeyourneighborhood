"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { CATEGORIES, NEIGHBORHOODS, isNeedId } from "@/lib/constants";
import { ImageUploadError, resolveImage } from "@/lib/uploads";

// No accounts yet: every action is public. Add ownership and
// rate-limit checks here once accounts exist.

export type FormState = {
  ok?: boolean;
  message?: string;
  errors?: Record<string, string>;
};

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function readText(formData: FormData, key: string, maxLength: number): string {
  const value = formData.get(key);
  return typeof value === "string" ? value.trim().slice(0, maxLength) : "";
}

function readProposalId(formData: FormData): number | null {
  const id = Number(formData.get("proposalId"));
  return Number.isInteger(id) && id > 0 ? id : null;
}

function hasErrors(errors: Record<string, string>) {
  return Object.keys(errors).length > 0;
}

export async function createProposal(_prev: FormState, formData: FormData): Promise<FormState> {
  const address = readText(formData, "address", 200);
  const neighborhood = readText(formData, "neighborhood", 60);
  const title = readText(formData, "title", 120);
  const description = readText(formData, "description", 4000);
  const category = readText(formData, "category", 40);
  const needs = [...new Set(formData.getAll("needs").filter(isNeedId))];

  const errors: Record<string, string> = {};
  if (!address) errors.address = "Where is the space? Add an address or cross streets.";
  if (!NEIGHBORHOODS.some((n) => n.name === neighborhood)) errors.neighborhood = "Pick a neighborhood.";
  if (title.length < 4) errors.title = "Give your idea a short title (at least 4 characters).";
  if (description.length < 20) errors.description = "Tell neighbors a bit more (at least 20 characters).";
  if (!CATEGORIES.some((c) => c.id === category)) errors.category = "Choose a category.";

  let existingImageUrl: string | null = null;
  let inspirationImageUrl: string | null = null;
  if (!hasErrors(errors)) {
    for (const field of ["existingImage", "inspirationImage"] as const) {
      try {
        const url = await resolveImage(formData, field);
        if (field === "existingImage") existingImageUrl = url;
        else inspirationImageUrl = url;
      } catch (error) {
        if (!(error instanceof ImageUploadError)) throw error;
        errors[field] = error.message;
      }
    }
  }

  if (hasErrors(errors)) {
    return { errors, message: "A few things need attention before publishing." };
  }

  const proposal = await prisma.proposal.create({
    data: {
      title,
      description,
      address,
      neighborhood,
      category,
      needs,
      existingImageUrl,
      inspirationImageUrl,
    },
  });

  revalidatePath("/");
  revalidatePath("/ideas");
  redirect(`/ideas/${proposal.id}?created=1`);
}

export async function supportProposal(proposalId: number): Promise<number> {
  if (!Number.isInteger(proposalId) || proposalId < 1) throw new Error("Invalid proposal id");

  const { supportCount } = await prisma.proposal.update({
    where: { id: proposalId },
    data: { supportCount: { increment: 1 } },
    select: { supportCount: true },
  });

  revalidatePath(`/ideas/${proposalId}`);
  revalidatePath("/ideas");
  revalidatePath("/");
  return supportCount;
}

export async function addComment(_prev: FormState, formData: FormData): Promise<FormState> {
  const proposalId = readProposalId(formData);
  const authorName = readText(formData, "authorName", 60);
  const email = readText(formData, "email", 120);
  const body = readText(formData, "body", 2000);

  const errors: Record<string, string> = {};
  if (!authorName) errors.authorName = "Add your name.";
  if (email && !EMAIL_PATTERN.test(email)) errors.email = "That email doesn't look right.";
  if (!body) errors.body = "Write a comment.";
  if (!proposalId) return { message: "Something went wrong. Refresh and try again." };
  if (hasErrors(errors)) return { errors };

  await prisma.comment.create({
    data: { proposalId, authorName, email: email || null, body },
  });

  revalidatePath(`/ideas/${proposalId}`);
  return { ok: true, message: "Thanks for adding your voice!" };
}

export async function addInvestmentInterest(_prev: FormState, formData: FormData): Promise<FormState> {
  const proposalId = readProposalId(formData);
  const name = readText(formData, "name", 80);
  const email = readText(formData, "email", 120);
  const note = readText(formData, "note", 1000);
  const rawAmount = readText(formData, "amount", 20).replace(/[$,\s]/g, "");

  const errors: Record<string, string> = {};
  if (!name) errors.name = "Add your name.";
  if (!EMAIL_PATTERN.test(email)) errors.email = "Add an email so organizers can follow up.";

  let amount: number | null = null;
  if (rawAmount) {
    const parsed = Number(rawAmount);
    if (!Number.isFinite(parsed) || parsed <= 0) {
      errors.amount = "Enter an amount above $0, or leave it blank.";
    } else if (parsed > 10_000_000) {
      errors.amount = "For amounts over $10M, reach out to organizers directly.";
    } else {
      amount = Math.round(parsed);
    }
  }

  if (!proposalId) return { message: "Something went wrong. Refresh and try again." };
  if (hasErrors(errors)) return { errors };

  await prisma.investmentInterest.create({
    data: { proposalId, name, email, amount, note: note || null },
  });

  revalidatePath(`/ideas/${proposalId}`);
  revalidatePath("/ideas");
  return { ok: true, message: "Thank you! Organizers will reach out as this idea takes shape." };
}
