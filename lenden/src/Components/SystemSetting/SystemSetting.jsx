"use client";

import { useEffect, useState } from "react";
import { Moon, Sun, Settings, Palette } from "lucide-react";

export default function SettingsPage() {
  // Load saved theme as the initial state
  const [darkMode, setDarkMode] = useState(() => {
    if (typeof window === "undefined") return false;

    return localStorage.getItem("theme") === "dark";
  });

  // Sync React state with the HTML document
  useEffect(() => {
    document.documentElement.classList.toggle("dark", darkMode);
  }, [darkMode]);

  // Toggle theme
  const handleThemeToggle = () => {
    const newTheme = !darkMode;

    setDarkMode(newTheme);

    localStorage.setItem("theme", newTheme ? "dark" : "light");
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8 transition-colors dark:bg-gray-950">
      <div className="mx-auto max-w-2xl">
        {/* Page Header */}
        <div className="mb-8 flex items-center gap-3">
          <div className="rounded-xl bg-purple-100 p-3 dark:bg-purple-900/40">
            <Settings className="h-6 w-6 text-purple-700 dark:text-purple-300" />
          </div>

          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              Settings
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Manage your account preferences
            </p>
          </div>
        </div>

        {/* Appearance Section */}
        <div className="overflow-hidden rounded-3xl border border-gray-100 bg-white shadow-xl shadow-purple-100/50 dark:border-gray-800 dark:bg-gray-900 dark:shadow-none">
          <div className="border-b border-gray-100 p-6 dark:border-gray-800">
            <div className="flex items-center gap-2">
              <Palette className="h-5 w-5 text-purple-600 dark:text-purple-400" />
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                Appearance
              </h2>
            </div>

            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              Customize how LenDen looks on your device.
            </p>
          </div>

          {/* Dark Mode Option */}
          <div className="flex items-center justify-between gap-4 p-6">
            <div className="flex items-center gap-3">
              <div className="rounded-xl bg-purple-100 p-3 dark:bg-purple-900/40">
                {darkMode ? (
                  <Moon className="h-5 w-5 text-purple-700 dark:text-purple-300" />
                ) : (
                  <Sun className="h-5 w-5 text-purple-700 dark:text-purple-300" />
                )}
              </div>

              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white">
                  Dark Theme
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {darkMode ? "Dark mode is enabled" : "Dark mode is disabled"}
                </p>
              </div>
            </div>

            {/* Toggle Button */}
            <button
              type="button"
              onClick={handleThemeToggle}
              aria-label="Toggle dark theme"
              aria-pressed={darkMode}
              className={`relative h-7 w-12 rounded-full transition-colors ${
                darkMode ? "bg-purple-600" : "bg-gray-300"
              }`}
            >
              <span
                className={`absolute top-1 h-5 w-5 rounded-full bg-white shadow transition-transform ${
                  darkMode ? "translate-x-6" : "translate-x-1"
                }`}
              />
            </button>
          </div>
        </div>

        <p className="mt-5 text-center text-xs text-gray-400 dark:text-gray-500">
          More settings will be available soon.
        </p>
      </div>
    </div>
  );
}
