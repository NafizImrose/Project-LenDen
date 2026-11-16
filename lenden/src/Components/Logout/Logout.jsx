"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import { LogOut, X, ShieldAlert } from "lucide-react";

export default function LogoutModal({ open, onClose }) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogout = async () => {
    try {
      setLoading(true);

      await authClient.signOut();

      onClose();
      router.push("/login");
      router.refresh();
    } catch (error) {
      console.error("Logout failed:", error);
    } finally {
      setLoading(false);
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="relative w-full max-w-sm rounded-2xl bg-white p-6 shadow-2xl">
        {/* Close Button */}
        <button
          onClick={onClose}
          disabled={loading}
          className="absolute right-4 top-4 text-gray-400 hover:text-gray-700"
        >
          <X size={20} />
        </button>

        {/* Icon */}
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-red-50">
          <ShieldAlert size={30} className="text-red-500" />
        </div>

        {/* Content */}
        <div className="mt-5 text-center">
          <h2 className="text-xl font-bold text-gray-900">Confirm Logout</h2>

          <p className="mt-2 text-sm leading-6 text-gray-500">
            Are you sure you want to log out of your account? You will need to
            sign in again to access your wallet.
          </p>
        </div>

        {/* Actions */}
        <div className="mt-7 flex gap-3">
          <button
            onClick={onClose}
            disabled={loading}
            className="flex-1 rounded-xl border border-gray-200 px-4 py-3 text-sm font-semibold text-gray-700 hover:bg-gray-50 disabled:opacity-50"
          >
            Cancel
          </button>

          <button
            onClick={handleLogout}
            disabled={loading}
            className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-red-500 px-4 py-3 text-sm font-semibold text-white transition hover:bg-red-600 disabled:cursor-not-allowed disabled:opacity-60"
          >
            <LogOut size={17} />
            {loading ? "Logging out..." : "Yes, Logout"}
          </button>
        </div>
      </div>
    </div>
  );
}
