"use client";

import { useSyncExternalStore } from "react";
import { DEFAULT_THEME, STORAGE_KEY, THEMES } from "@/lib/themes";

// The theme lives on <html data-theme>. The inline script in the layout sets
// it before first paint, so the picker only reads it and changes it.
const listeners = new Set();
const subscribe = (fn) => {
  listeners.add(fn);
  return () => listeners.delete(fn);
};
const read = () => document.documentElement.getAttribute("data-theme") || DEFAULT_THEME;
const readOnServer = () => DEFAULT_THEME;

function choose(id) {
  document.documentElement.setAttribute("data-theme", id);
  try {
    localStorage.setItem(STORAGE_KEY, id);
  } catch {
    // private mode or blocked storage: the choice just lasts until reload
  }
  listeners.forEach((fn) => fn());
}

export default function ThemePicker() {
  const current = useSyncExternalStore(subscribe, read, readOnServer);
  const mood = THEMES.find((t) => t.id === current)?.mood;

  return (
    <div className="picker">
      <p className="label">
        Redecorate<span className="hidden sm:inline"> / {mood}</span>
      </p>
      <div role="radiogroup" aria-label="Theme" className="picker-swatches">
        {THEMES.map((t) => (
          <button
            key={t.id}
            type="button"
            role="radio"
            aria-checked={t.id === current}
            aria-label={t.label}
            title={t.mood}
            onClick={() => choose(t.id)}
            className="swatch"
            style={{ "--sw-a": t.swatch[0], "--sw-b": t.swatch[1] }}
          />
        ))}
      </div>
    </div>
  );
}
