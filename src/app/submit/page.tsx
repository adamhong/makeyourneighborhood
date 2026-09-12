import type { Metadata } from "next";
import { SubmitWizard } from "@/components/submit/submit-wizard";

export const metadata: Metadata = { title: "Submit an idea" };

export default function SubmitPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6 sm:py-14">
      <p className="text-sm font-bold uppercase tracking-wider text-tomato-dark">Submit an idea</p>
      <h1 className="font-display text-4xl font-extrabold tracking-tight sm:text-5xl">
        Reimagine a space near you
      </h1>
      <p className="mt-2 max-w-xl text-ink-soft">
        Two quick steps. No account needed — your idea goes live right away for neighbors to support.
      </p>
      <div className="mt-8">
        <SubmitWizard />
      </div>
    </div>
  );
}
