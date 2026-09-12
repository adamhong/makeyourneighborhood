"use client";

import { useActionState, useState, useTransition } from "react";
import { createProposal, type FormState } from "@/app/actions";
import { ArrowRightIcon } from "@/components/icons";
import { DictationButton } from "@/components/submit/dictation-button";
import { ImageField } from "@/components/submit/image-field";
import { MapPlaceholder } from "@/components/submit/map-placeholder";
import { CATEGORIES, NEEDS, NEIGHBORHOODS, getNeighborhood, type NeedId } from "@/lib/constants";

const initialState: FormState = {};
const STEP_ONE_FIELDS = ["address", "neighborhood"];
const STEPS = [
  { number: 1, label: "Location" },
  { number: 2, label: "Your idea" },
] as const;

export function SubmitWizard() {
  const [state, formAction, pending] = useActionState(createProposal, initialState);
  const [, startTransition] = useTransition();
  const [step, setStep] = useState<1 | 2>(1);
  const [stepOneError, setStepOneError] = useState("");
  const [address, setAddress] = useState("");
  const [neighborhood, setNeighborhood] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [needs, setNeeds] = useState<NeedId[]>([]);

  // If the server rejects a step-one field, send the user back to fix it.
  const [handledState, setHandledState] = useState(state);
  if (state !== handledState) {
    setHandledState(state);
    if (Object.keys(state.errors ?? {}).some((key) => STEP_ONE_FIELDS.includes(key))) setStep(1);
  }

  const errors = state.errors ?? {};
  const hood = getNeighborhood(neighborhood);
  const needRank = (id: NeedId) => {
    const index = hood?.topNeeds.indexOf(id) ?? -1;
    return index === -1 ? NEEDS.length : index;
  };
  const suggestedNeeds = [...NEEDS].sort((a, b) => needRank(a.id) - needRank(b.id));

  function goToDetails() {
    if (!address.trim() || !neighborhood) {
      setStepOneError("Add an address and choose a neighborhood to continue.");
      return;
    }
    setStepOneError("");
    setStep(2);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function toggleNeed(id: NeedId) {
    setNeeds((current) => (current.includes(id) ? current.filter((need) => need !== id) : [...current, id]));
  }

  // Submit manually (instead of <form action>) so React doesn't reset the
  // form — that would drop chosen photos when validation fails.
  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    startTransition(() => formAction(formData));
  }

  return (
    <form onSubmit={handleSubmit} noValidate>
      <ol className="mb-6 grid grid-cols-2 gap-2">
        {STEPS.map(({ number, label }) => {
          const current = step === number;
          const done = step > number;
          return (
            <li
              key={number}
              aria-current={current ? "step" : undefined}
              className={`flex items-center gap-2 rounded-2xl border-2 px-4 py-3 text-sm font-bold ${
                current ? "border-ink bg-paper" : done ? "border-leaf/30 bg-mint" : "border-line bg-cream text-ink-soft"
              }`}
            >
              <span
                className={`grid h-7 w-7 place-items-center rounded-full text-xs ${
                  current ? "bg-tomato text-white" : done ? "bg-leaf text-white" : "bg-line"
                }`}
              >
                {done ? "✓" : number}
              </span>
              {label}
            </li>
          );
        })}
      </ol>

      {/* Step 1 — location */}
      <section hidden={step !== 1} className="card space-y-5 p-5 sm:p-8">
        <div>
          <h2 className="font-display text-3xl font-extrabold tracking-tight">Where is the space?</h2>
          <p className="mt-1 text-ink-soft">Enter the address and tap its neighborhood on the map.</p>
        </div>

        <div>
          <label htmlFor="address" className="field-label">Address or cross streets</label>
          <input
            id="address"
            name="address"
            value={address}
            onChange={(event) => setAddress(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === "Enter") {
                event.preventDefault();
                goToDetails();
              }
            }}
            placeholder="e.g. 24th St & Bryant St"
            autoComplete="street-address"
            className="field"
          />
          {errors.address && <p className="field-error">{errors.address}</p>}
        </div>

        <div>
          <label htmlFor="neighborhood" className="field-label">Neighborhood</label>
          <select
            id="neighborhood"
            name="neighborhood"
            value={neighborhood}
            onChange={(event) => setNeighborhood(event.target.value)}
            className="field"
          >
            <option value="">Choose a neighborhood</option>
            {NEIGHBORHOODS.map((n) => (
              <option key={n.name} value={n.name}>{n.name}</option>
            ))}
          </select>
          {errors.neighborhood && <p className="field-error">{errors.neighborhood}</p>}
        </div>

        <MapPlaceholder selected={neighborhood} onSelect={setNeighborhood} />

        {stepOneError && <p role="alert" className="field-error">{stepOneError}</p>}
        <div className="flex justify-end">
          <button type="button" onClick={goToDetails} className="btn-primary px-6 py-3">
            Next: your idea <ArrowRightIcon />
          </button>
        </div>
      </section>

      {/* Step 2 — the idea */}
      <div hidden={step !== 2} className="space-y-5">
        <section className="card space-y-6 p-5 sm:p-8">
          <div>
            <h2 className="font-display text-3xl font-extrabold tracking-tight">What could it become?</h2>
            <p className="mt-1 text-ink-soft">
              📍 {address || "Your space"} · {neighborhood || "San Francisco"}{" "}
              <button type="button" onClick={() => setStep(1)} className="font-bold text-tomato-dark underline underline-offset-2">
                Change
              </button>
            </p>
          </div>

          <ImageField
            name="existingImage"
            label="Photo of the space today"
            hint="Optional — upload a photo or paste an image link."
            error={errors.existingImage}
          />

          <div>
            <label htmlFor="title" className="field-label">Idea title</label>
            <input
              id="title"
              name="title"
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              maxLength={120}
              placeholder="e.g. A community bookstore on 24th Street"
              className="field"
            />
            {errors.title && <p className="field-error">{errors.title}</p>}
          </div>

          <div>
            <div className="mb-1.5 flex flex-wrap items-center justify-between gap-2">
              <label htmlFor="description" className="field-label mb-0">Describe your idea</label>
              <DictationButton />
            </div>
            <textarea
              id="description"
              name="description"
              value={description}
              onChange={(event) => setDescription(event.target.value)}
              rows={5}
              placeholder="What would happen here? Who would it serve? What makes this spot right for it?"
              className="field"
            />
            {errors.description && <p className="field-error">{errors.description}</p>}
          </div>

          <div>
            <label htmlFor="category" className="field-label">Category</label>
            <select
              id="category"
              name="category"
              value={category}
              onChange={(event) => setCategory(event.target.value)}
              className="field"
            >
              <option value="">Choose a category</option>
              {CATEGORIES.map((c) => (
                <option key={c.id} value={c.id}>{c.emoji} {c.label}</option>
              ))}
            </select>
            {errors.category && <p className="field-error">{errors.category}</p>}
          </div>
        </section>

        <section className="card overflow-hidden">
          <div className="bg-gradient-to-br from-lilac via-paper to-butter p-5 sm:p-8">
            <p className="chip bg-plum text-white">✨ AI neighborhood insights · preview</p>
            <h2 className="mt-3 font-display text-2xl font-extrabold tracking-tight">
              What {hood?.name ?? "this neighborhood"} is asking for
            </h2>
            <p className="mt-1 text-sm text-ink-soft">
              Suggestions based on local signals. Tap every need your idea would help with.
            </p>

            <div className="mt-5 grid gap-6 md:grid-cols-[1fr_1.5fr]">
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-ink-soft">This neighborhood already has</p>
                <ul className="mt-2 flex flex-wrap gap-2">
                  {(hood?.alreadyHas ?? ["Pick a neighborhood to see local context"]).map((item) => (
                    <li key={item} className="chip border border-line bg-white/80 text-ink-soft">✓ {item}</li>
                  ))}
                </ul>
              </div>
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-ink-soft">This neighborhood needs</p>
                <div className="mt-2 flex flex-wrap gap-2">
                  {suggestedNeeds.map((need) => {
                    const selected = needs.includes(need.id);
                    const topPick = hood?.topNeeds[0] === need.id;
                    return (
                      <button
                        key={need.id}
                        type="button"
                        onClick={() => toggleNeed(need.id)}
                        aria-pressed={selected}
                        className={`chip border-2 px-3.5 py-2 text-sm transition ${
                          selected ? "border-ink bg-ink text-cream" : "border-line bg-white text-ink hover:border-ink"
                        }`}
                      >
                        {need.emoji} {need.label}
                        {topPick && (
                          <span className="ml-1 rounded-full bg-sun px-1.5 py-0.5 text-[10px] font-extrabold uppercase text-ink">
                            Top pick
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
            {needs.map((need) => (
              <input key={need} type="hidden" name="needs" value={need} />
            ))}
          </div>
        </section>

        <section className="card p-5 sm:p-8">
          <ImageField
            name="inspirationImage"
            label="Inspiration image"
            hint="Show the vibe — a place you love, a sketch, or a photo from another city."
            error={errors.inspirationImage}
          />
        </section>

        {state.message && (
          <p role="alert" className="rounded-2xl bg-blush px-4 py-3 font-semibold text-tomato-dark">
            {state.message}
          </p>
        )}

        <div className="flex flex-wrap items-center justify-between gap-3">
          <button type="button" onClick={() => setStep(1)} className="btn-secondary">
            <ArrowRightIcon className="h-4 w-4 rotate-180" /> Back
          </button>
          <button type="submit" disabled={pending} className="btn-primary px-7 py-3 text-lg">
            {pending ? "Publishing…" : "Publish my idea"}
          </button>
        </div>
      </div>
    </form>
  );
}
