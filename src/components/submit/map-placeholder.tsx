"use client";

import { PinIcon } from "@/components/icons";
import { NEIGHBORHOODS } from "@/lib/constants";

// Illustrated stand-in for a live map. Replace with a real map + geocoding later.
const LAND = "M3 6 L38 3 L60 5 L73 2 L87 7 L91 21 L87 36 L95 49 L90 67 L3 67 Z";

type MapPlaceholderProps = {
  selected: string;
  onSelect: (neighborhood: string) => void;
};

export function MapPlaceholder({ selected, onSelect }: MapPlaceholderProps) {
  return (
    <div className="relative overflow-hidden rounded-3xl border-2 border-line bg-ice">
      <svg viewBox="0 0 100 70" className="block h-auto w-full" role="img" aria-label="Illustrated map of San Francisco">
        <defs>
          <pattern id="streets" width="3.5" height="3.5" patternUnits="userSpaceOnUse">
            <path d="M3.5 0H0V3.5" fill="none" stroke="#2a1f1a" strokeOpacity="0.08" strokeWidth="0.25" />
          </pattern>
        </defs>
        <path d={LAND} fill="#fff3dc" stroke="#ecdcc6" strokeWidth="0.6" strokeLinejoin="round" />
        <path d={LAND} fill="url(#streets)" />
        <rect x="6" y="34" width="36" height="4" rx="1.5" fill="#bfe6cc" />
        <circle cx="45" cy="52" r="2.5" fill="#bfe6cc" />
        <path d="M58 5 L70 44 L60 67" fill="none" stroke="#ffc247" strokeOpacity="0.7" strokeWidth="0.8" strokeLinecap="round" />
      </svg>

      {NEIGHBORHOODS.map((neighborhood) => {
        const active = neighborhood.name === selected;
        return (
          <button
            key={neighborhood.name}
            type="button"
            onClick={() => onSelect(neighborhood.name)}
            aria-pressed={active}
            aria-label={`Choose ${neighborhood.name}`}
            style={{ left: `${neighborhood.x}%`, top: `${neighborhood.y}%` }}
            className={`group absolute -translate-x-1/2 -translate-y-full ${active ? "z-20" : "z-10 hover:z-30"}`}
          >
            <span className="flex flex-col items-center">
              <span
                className={`mb-0.5 whitespace-nowrap rounded-full px-2 py-0.5 text-[10px] font-bold shadow-sm transition sm:text-xs ${
                  active ? "bg-ink text-cream" : "bg-white text-ink opacity-0 group-hover:opacity-100 group-focus-visible:opacity-100"
                }`}
              >
                {neighborhood.name}
              </span>
              <PinIcon
                className={`h-6 w-6 drop-shadow transition sm:h-7 sm:w-7 ${
                  active ? "scale-125 text-tomato" : "text-plum/70 group-hover:text-tomato"
                }`}
              />
            </span>
          </button>
        );
      })}

      <p className="chip absolute bottom-3 left-3 bg-white/90 text-ink-soft shadow-sm">
        🗺️ Tap a pin · live map coming soon
      </p>
    </div>
  );
}
