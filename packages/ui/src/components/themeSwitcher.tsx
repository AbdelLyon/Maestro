"use client";

import { Sun, Moon } from "lucide-react";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

export const ThemeSwitcher = () => {
  const [mounted, setMounted] = useState(false);
  const { setTheme, resolvedTheme } = useTheme();

  useEffect(() => {
    setMounted(true);
  }, []);

  const toggleTheme = () => {
    setTheme(resolvedTheme === "dark" ? "light" : "dark");
  };

  if (!mounted) {
    return (
      <button
        className="flex h-9 w-9 items-center justify-center rounded-full "
        aria-label="toggle theme"
      />
    );
  }

  return (
    <button
      type="button"
      aria-label={`Passer au mode ${
        resolvedTheme === "dark" ? "clair" : "sombre"
      }`}
      onClick={toggleTheme}
      className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-full transition-colors hover:bg-slate-200 dark:hover:bg-slate-800"
    >
      {resolvedTheme === "dark" ? (
        <Sun className="h-5 w-5 text-primary" />
      ) : (
        <Moon className="h-5 w-5 text-slate-700 dark:text-slate-200" />
      )}
    </button>
  );
};
