"use client";

import Link from "next/link";
import React, { useState } from "react";

const Navbar = () => {
  const [showBalance, setShowBalance] = useState(false);
  const [balance, setBalance] = useState(null);
  const [loading, setLoading] = useState(false);

  // Fetch balance when button is clicked
  const handleBalance = async () => {
    // Hide balance without making an API call
    if (showBalance) {
      setShowBalance(false);
      return;
    }

    try {
      setLoading(true);

      const response = await fetch("http://localhost:8000/balance", {
        cache: "no-store",
      });

      const data = await response.json();

      if (response.ok) {
        setBalance(data.balance);
        setShowBalance(true);
      } else {
        console.log(data.message);
      }
    } catch (error) {
      console.log("Error fetching balance:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="navbar bg-base-100 shadow-sm">
        <div className="flex-1">
          <Link href="/home" className="text-xl font-bold">
            LenDen
          </Link>
        </div>

        <div className="flex gap-4 items-center">
          {/* Balance Section */}
          <div className="flex items-center gap-2">
            <span className="font-semibold">
              {showBalance ? `৳ ${balance}` : "৳ ••••••"}
            </span>

            <button
              onClick={handleBalance}
              disabled={loading}
              className="btn shadow-3xl rounded-2xl w-30 bg-gradient-to-r from-purple-600 to-purple-900 border-none text-white btn-sm btn-outline"
            >
              {loading
                ? "Loading..."
                : showBalance
                  ? "Hide Balance"
                  : "Show Balance"}
            </button>
          </div>

          {/* Profile Dropdown */}
          <div className="dropdown dropdown-end">
            <div
              tabIndex={0}
              role="button"
              className="btn btn-ghost btn-circle avatar"
            >
              <div className="w-10 rounded-full">
                <img
                  alt="Profile"
                  src="https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp"
                />
              </div>
            </div>

            <ul
              tabIndex={-1}
              className="menu menu-sm dropdown-content bg-base-100 rounded-box z-1 mt-3 w-52 p-2 shadow"
            >
              <li>
                <a className="justify-between">
                  Profile
                  <span className="badge">New</span>
                </a>
              </li>
              <li>
                <a>Settings</a>
              </li>
              <li>
                <a>Logout</a>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
