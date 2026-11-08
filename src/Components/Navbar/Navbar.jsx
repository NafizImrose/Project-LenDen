"use client";
import Link from "next/link";
import React, { useState } from "react";

const Navbar = () => {
  const [showBalance, setShowBalance] = useState(false);

  // Temporary balance
  const balance = 12500;

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
              onClick={() => setShowBalance(!showBalance)}
              className="btn shadow-3xl rounded-2xl w-30 bg-gradient-to-r from-purple-600 to-purple-900 border-none text-white btn-sm btn-outline"
            >
              {showBalance ? "Hide Balance" : "Show Balance"}
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
