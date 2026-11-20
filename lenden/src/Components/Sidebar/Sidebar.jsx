//
"use client";

import Link from "next/link";
import { useState } from "react";

// NEW: Current route detect করার জন্য usePathname import
import { usePathname } from "next/navigation";

import {
  Wallet,
  Send,
  PlusCircle,
  History,
  ReceiptText,
  Settings,
  HelpCircle,
  Menu,
  Banknote,
  Smartphone,
  Receipt,
  X,
} from "lucide-react";

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false);

  // NEW: বর্তমানে কোন page-এ আছি সেটা detect করবে
  const pathname = usePathname();

  // NEW: বর্তমান URL এবং menu URL match করলে true return করবে
  const isActive = (href) => pathname === href;

  const menuItems = [
    { name: "Send Money", href: "/home/send-money", icon: Send },
    { name: "Add Money", href: "/home/add-money", icon: PlusCircle },
    { name: "Cash Out", href: "/home/cash-out", icon: Banknote },
    {
      name: "Mobile Recharge",
      href: "/home/mobile-recharge",
      icon: Smartphone,
    },
    { name: "Pay Bill", href: "/home/pay-bill", icon: Receipt },
    {
      name: "Payment",
      href: "/home/payment",
      icon: ReceiptText,
    },
    { name: "Transactions", href: "/home/transactions", icon: History },
  ];

  const preferenceItems = [
    { name: "Settings", href: "/home/system-setting", icon: Settings },
    { name: "Help & Support", href: "/home/help", icon: HelpCircle },
  ];

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="fixed left-4 top-18 z-40 flex h-11 w-11 items-center justify-center rounded-xl bg-purple-700 text-white shadow-lg transition hover:bg-purple-800 md:hidden"
        aria-label="Open sidebar"
      >
        <Menu size={23} />
      </button>

      {/* Mobile Overlay */}
      {isOpen && (
        <button
          onClick={() => setIsOpen(false)}
          className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm md:hidden"
          aria-label="Close sidebar"
        />
      )}

      {/* Mobile Drawer */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-72 border-r border-purple-100 bg-base-100 px-4 py-6 shadow-2xl transition-transform duration-300 md:hidden ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="mb-5 flex justify-end">
          <button
            onClick={() => setIsOpen(false)}
            className="rounded-lg p-2 text-gray-500 transition hover:bg-purple-50 hover:text-purple-700"
            aria-label="Close sidebar"
          >
            <X size={22} />
          </button>
        </div>

        {/* Mobile Main Menu */}
        <p className="mb-3 px-3 text-xs font-bold uppercase tracking-wider text-purple-400">
          Main Menu
        </p>

        <ul className="space-y-1">
          {menuItems.map((item) => {
            const Icon = item.icon;

            // NEW: প্রতিটি menu item-এর active state
            const active = isActive(item.href);

            return (
              <li key={item.name}>
                <Link
                  href={item.href}
                  onClick={() => setIsOpen(false)}
                  // UPDATED: Active হলে purple background এবং dark text
                  className={`group flex items-center gap-3 rounded-xl px-3 py-3 text-sm transition-all ${
                    active
                      ? "bg-purple-100 font-semibold text-purple-800 shadow-sm"
                      : "font-medium text-base-content/70 hover:bg-purple-50 hover:text-purple-800"
                  }`}
                >
                  {/* UPDATED: Active icon-এর color পরিবর্তন হবে */}
                  <Icon
                    size={19}
                    className={active ? "text-purple-800" : "text-purple-600"}
                  />
                  {item.name}
                </Link>
              </li>
            );
          })}
        </ul>

        {/* Mobile Preferences */}
        <p className="mb-3 mt-9 px-3 text-xs font-bold uppercase tracking-wider text-purple-400">
          Preferences
        </p>

        <ul className="space-y-1">
          {preferenceItems.map((item) => {
            const Icon = item.icon;

            // NEW: Preferences-এর active state
            const active = isActive(item.href);

            return (
              <li key={item.name}>
                <Link
                  href={item.href}
                  onClick={() => setIsOpen(false)}
                  // UPDATED: Active style
                  className={`flex items-center gap-3 rounded-xl px-3 py-3 text-sm transition ${
                    active
                      ? "bg-purple-100 font-semibold text-purple-800 shadow-sm"
                      : "font-medium text-base-content/70 hover:bg-purple-50 hover:text-purple-800"
                  }`}
                >
                  {/* UPDATED: Active icon color */}
                  <Icon
                    size={19}
                    className={active ? "text-purple-800" : "text-purple-600"}
                  />
                  {item.name}
                </Link>
              </li>
            );
          })}
        </ul>

        <div className="mt-10 border-t border-purple-100 pt-4 text-center">
          <p className="text-xs text-purple-400">© 2026 LenDen</p>
        </div>
      </aside>

      {/* Desktop Sidebar */}
      <aside className="hidden min-h-screen w-60 shrink-0 border-r border-purple-100 bg-base-100 px-4 py-6 md:block">
        {/* Desktop Main Menu */}
        <p className="mb-3 px-3 text-xs font-bold uppercase tracking-wider text-purple-400">
          Main Menu
        </p>

        <ul className="space-y-1">
          {menuItems.map((item) => {
            const Icon = item.icon;

            // NEW: Desktop-এর active state
            const active = isActive(item.href);

            return (
              <li key={item.name}>
                <Link
                  href={item.href}
                  // UPDATED: Active style
                  className={`group flex items-center gap-3 rounded-xl px-3 py-3 text-sm transition-all ${
                    active
                      ? "bg-purple-100 font-semibold text-purple-800 shadow-sm"
                      : "font-medium text-base-content/70 hover:bg-purple-50 hover:text-purple-800"
                  }`}
                >
                  {/* UPDATED: Active icon color */}
                  <Icon
                    size={19}
                    className={active ? "text-purple-800" : "text-purple-600"}
                  />
                  {item.name}
                </Link>
              </li>
            );
          })}
        </ul>

        {/* Desktop Preferences */}
        <p className="mb-3 mt-9 px-3 text-xs font-bold uppercase tracking-wider text-purple-400">
          Preferences
        </p>

        <ul className="space-y-1">
          {preferenceItems.map((item) => {
            const Icon = item.icon;

            // NEW: Preferences-এর active state
            const active = isActive(item.href);

            return (
              <li key={item.name}>
                <Link
                  href={item.href}
                  // UPDATED: Active style
                  className={`flex items-center gap-3 rounded-xl px-3 py-3 text-sm transition ${
                    active
                      ? "bg-purple-100 font-semibold text-purple-800 shadow-sm"
                      : "font-medium text-base-content/70 hover:bg-purple-50 hover:text-purple-800"
                  }`}
                >
                  {/* UPDATED: Active icon color */}
                  <Icon
                    size={19}
                    className={active ? "text-purple-800" : "text-purple-600"}
                  />
                  {item.name}
                </Link>
              </li>
            );
          })}
        </ul>

        <div className="mt-10 border-t border-purple-100 pt-4 text-center">
          <p className="text-xs text-purple-400">© 2026 LenDen</p>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
