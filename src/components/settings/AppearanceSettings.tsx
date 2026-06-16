"use client";

import { useEffect, useState } from "react";
import { Moon, Palette, Sun } from "lucide-react";
import {
  loadPreferences,
  savePreferences,
  type LoficeTheme,
} from "@/lib/officeTool/preferences";

const THEMES: { id: LoficeTheme; label: string; icon: typeof Sun }[] = [
  { id: "polaris", label: "폴라리스", icon: Palette },
  { id: "light", label: "밝게", icon: Sun },
  { id: "dark", label: "어둡게", icon: Moon },
];

export default function AppearanceSettings() {
  const [theme, setTheme] = useState<LoficeTheme>("polaris");

  useEffect(() => {
    setTheme(loadPreferences().theme);
  }, []);

  const pick = (t: LoficeTheme) => {
    setTheme(t);
    savePreferences({ theme: t });
  };

  return (
    <section className="space-y-2">
      <h2 className="text-sm font-semibold text-gray-800">모양</h2>
      <div className="grid grid-cols-3 gap-2">
        {THEMES.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            type="button"
            onClick={() => pick(id)}
            className={`flex flex-col items-center gap-1 p-3 rounded-xl border text-xs ${
              theme === id ? "border-[#2b579a] bg-blue-50 text-[#2b579a]" : "border-gray-100 bg-white text-gray-600"
            }`}
          >
            <Icon className="w-5 h-5" />
            {label}
          </button>
        ))}
      </div>
    </section>
  );
}
