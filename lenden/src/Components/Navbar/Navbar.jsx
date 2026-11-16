"use client";

import Link from "next/link";
import React, { useEffect, useState } from "react";
import LogoutModal from "../Logout/Logout";
import { error } from "better-auth/api";

const Navbar = () => {
  const [showBalance, setShowBalance] = useState(false);
  const [balance, setBalance] = useState(0);
  const [loading, setLoading] = useState(false);
  const [showLogout, setShowLogout] = useState(false);
  const [name, setName] = useState("");

  useEffect(() => {
    //code
    fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/profile-name`, {
      method: "GET",
      credentials: "include",
    })
      .then(async (res) => {
        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.message || "failed..");
        }
        return data;
      })
      .then((data) => {
        setName(data.name);
      })
      .catch((error) => {
        console.log("name error:", error);
      });
  }, []);

  // Fetch balance when button is clicked
  const handleBalance = async () => {
    // Hide balance without making an API call
    if (showBalance) {
      setShowBalance(false);
      return;
    }

    try {
      setLoading(true);

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/balance`,
        {
          method: "GET",
          credentials: "include",
          cache: "no-store",
        },
      );

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
      <div className="navbar bg-base-100 shadow-sm px-10 ">
        <div className="flex-1 min-w-0">
          <Link
            href="/home"
            className="flex items-center gap-2 sm:gap-2.5 w-fit"
          >
            <div className="h-9 w-9 sm:h-11 sm:w-11 shrink-0 overflow-hidden rounded-xl">
              <img
                src="/Images/lenden-logo.png"
                alt="LenDen Logo"
                className="h-full w-full object-contain"
              />
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight bg-gradient-to-r from-purple-700 via-purple-600 to-fuchsia-600 bg-clip-text text-transparent whitespace-nowrap">
              LenDen
            </h1>
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
          <div className="mother flex flex-col justify-center items-center">
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
                  <Link
                    href="/"
                    onClick={(e) => {
                      e.preventDefault();
                      setShowLogout(true);
                    }}
                  >
                    Logout
                  </Link>
                </li>
              </ul>
            </div>
            <div className="profile-name">
              <h2 className="text-sm text-purple-800 font-bold">{name}</h2>
            </div>
          </div>
        </div>
      </div>

      {/* Logout Confirmation Modal */}
      <LogoutModal open={showLogout} onClose={() => setShowLogout(false)} />
    </div>
  );
};

export default Navbar;
