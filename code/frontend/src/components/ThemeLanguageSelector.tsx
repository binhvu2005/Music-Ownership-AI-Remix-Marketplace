"use client";

import React from "react";
import { useTheme } from "../context/ThemeContext";
import { useLanguage } from "../context/LanguageContext";

export const ThemeLanguageSelector: React.FC = () => {
  const { theme, toggleTheme } = useTheme();
  const { language, setLanguage } = useLanguage();

  return (
    <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2 rounded-full border border-glass-border bg-glass-bg p-2 shadow-lg backdrop-blur-md">
      {/* Language Toggle Button */}
      <button
        onClick={() => setLanguage(language === "en" ? "vi" : "en")}
        className="flex h-9 w-9 items-center justify-center rounded-full text-xs font-bold transition-all hover:bg-primary/20 hover:scale-105"
        style={{ color: "var(--foreground)" }}
        title={language === "en" ? "Chuyển sang Tiếng Việt" : "Switch to English"}
      >
        {language === "en" ? "EN" : "VI"}
      </button>

      {/* Divider */}
      <div className="h-4 w-[1px]" style={{ backgroundColor: "var(--surface-border)" }} />

      {/* Theme Toggle Button */}
      <button
        onClick={toggleTheme}
        className="flex h-9 w-9 items-center justify-center rounded-full text-base transition-all hover:bg-primary/20 hover:scale-105"
        style={{ color: "var(--foreground)" }}
        title={theme === "dark" ? "Chuyển sang Giao diện Sáng" : "Switch to Dark Theme"}
      >
        {theme === "dark" ? "🌙" : "☀️"}
      </button>
    </div>
  );
};
