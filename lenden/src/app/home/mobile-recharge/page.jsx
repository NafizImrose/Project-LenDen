"use client";

import { useEffect, useState } from "react";
import {
  ArrowLeft,
  Smartphone,
  ShieldCheck,
  LoaderCircle,
  Phone,
  Wallet,
} from "lucide-react";
import Link from "next/link";

const operators = [
  { name: "Grameenphone", short: "GP", color: "bg-blue-600" },
  { name: "Banglalink", short: "BL", color: "bg-orange-500" },
  { name: "Robi", short: "RB", color: "bg-red-600" },
  { name: "Airtel", short: "AT", color: "bg-rose-500" },
  { name: "Teletalk", short: "TT", color: "bg-green-600" },
];

const quickAmounts = [50, 100, 200, 500];

export default function MobileRecharge() {
  const [balance, setBalance] = useState(0);
  const [balanceLoading, setBalanceLoading] = useState(true);
  const [operator, setOperator] = useState("");
  const [phone, setPhone] = useState("");
  const [rechargeType, setRechargeType] = useState("Prepaid");
  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const inputs = document.querySelectorAll('input[type="number"]');

    const preventScroll = (e) => {
      e.preventDefault();
    };

    inputs.forEach((input) => {
      input.addEventListener("wheel", preventScroll, { passive: false });
    });

    return () => {
      inputs.forEach((input) => {
        input.removeEventListener("wheel", preventScroll);
      });
    };
  }, []);

  useEffect(() => {
    const fetchBalance = async () => {
      try {
        const res = await fetch("/api/backend/balance", {
          credentials: "include",
        });
        const data = await res.json();

        if (res.ok) setBalance(data.balance ?? data.data?.balance ?? 0);
      } catch (error) {
        console.error("Balance fetch error:", error);
      } finally {
        setBalanceLoading(false);
      }
    };

    fetchBalance();
  }, []);

  const handleRecharge = async (e) => {
    e.preventDefault();

    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/backend/mobile-recharge", {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          amount: Number(amount),
          recipientNumber: phone,
          operator: operator,
          rechargeType: rechargeType,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || "Transaction failed");
        return;
      }

      setBalance(data.balance);
      setAmount("");
      setPhone("");

      alert("Mobile recharge successful!");
    } catch (error) {
      console.log(error);
      setError("Something went wrong!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="mx-auto max-w-2xl space-y-6">
        {/* Header */}
        <div className="flex items-center gap-3">
          <Link
            href="/home"
            className="flex h-10 w-10 items-center justify-center rounded-xl border border-gray-200 bg-white text-gray-600 hover:bg-gray-100"
          >
            <ArrowLeft size={19} />
          </Link>
          <div>
            <h1 className="text-xl font-bold text-gray-900">Mobile Recharge</h1>
            <p className="text-sm text-gray-500">
              Recharge any mobile number instantly
            </p>
          </div>
        </div>

        {/* Balance Card */}
        <div className="rounded-3xl bg-gradient-to-r from-purple-700 to-indigo-600 p-7 text-white shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-purple-100">Available Balance</p>
              <div className="mt-2 flex items-center gap-2">
                {balanceLoading ? (
                  <LoaderCircle size={22} className="animate-spin" />
                ) : (
                  <h2 className="text-3xl font-bold">
                    ৳{Number(balance).toLocaleString("en-BD")}
                  </h2>
                )}
              </div>
            </div>
            <div className="rounded-2xl bg-white/15 p-3">
              <Wallet size={26} />
            </div>
          </div>
        </div>

        {/* Recharge Form */}
        <div className="overflow-hidden rounded-3xl border border-gray-100 bg-white shadow-sm">
          <div className="border-b border-gray-100 px-6 py-5">
            <div className="flex items-center gap-3">
              <div className="rounded-xl bg-purple-50 p-3 text-purple-600">
                <Smartphone size={21} />
              </div>
              <div>
                <h2 className="font-bold text-gray-900">Recharge Details</h2>
                <p className="text-xs text-gray-500">
                  Enter your mobile recharge information
                </p>
              </div>
            </div>
          </div>

          <form onSubmit={handleRecharge} className="space-y-6 p-6 md:p-8">
            {/* Operator */}
            <div>
              <label className="mb-3 block text-sm font-semibold text-gray-700">
                Select Operator
              </label>

              <div className="grid grid-cols-3 gap-3 sm:grid-cols-5">
                {operators.map((item) => (
                  <button
                    type="button"
                    key={item.name}
                    onClick={() => setOperator(item.name)}
                    className={`flex flex-col items-center gap-2 rounded-xl border p-3 transition ${
                      operator === item.name
                        ? "border-purple-500 bg-purple-50 ring-2 ring-purple-100"
                        : "border-gray-200 hover:border-purple-300"
                    }`}
                  >
                    <span
                      className={`${item.color} flex h-10 w-10 items-center justify-center rounded-full text-xs font-bold text-white`}
                    >
                      {item.short}
                    </span>
                    <span className="text-center text-[11px] font-medium text-gray-700">
                      {item.name}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Phone */}
            <div>
              <label className="mb-2 block text-sm font-semibold text-gray-700">
                Mobile Number
              </label>
              <div className="relative">
                <Phone
                  size={18}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                />
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="01XXXXXXXXX"
                  maxLength={11}
                  required
                  className="w-full rounded-xl border border-gray-200 py-3 pl-11 pr-4 text-sm outline-none transition focus:border-purple-500 focus:ring-2 focus:ring-purple-100"
                />
              </div>
            </div>

            {/* Recharge Type */}
            <div>
              <label className="mb-2 block text-sm font-semibold text-gray-700">
                Recharge Type
              </label>
              <div className="grid grid-cols-2 gap-3">
                {["Prepaid", "Postpaid"].map((type) => (
                  <button
                    type="button"
                    key={type}
                    onClick={() => setRechargeType(type)}
                    className={`rounded-xl border py-3 text-sm font-semibold transition ${
                      rechargeType === type
                        ? "border-purple-500 bg-purple-50 text-purple-700"
                        : "border-gray-200 text-gray-600 hover:border-purple-300"
                    }`}
                  >
                    {type}
                  </button>
                ))}
              </div>
            </div>

            {/* Amount */}
            <div>
              <label className="mb-3 block text-sm font-semibold text-gray-700">
                Recharge Amount
              </label>
              <div className="grid grid-cols-4 gap-2">
                {quickAmounts.map((value) => (
                  <button
                    type="button"
                    key={value}
                    onClick={() => setAmount(String(value))}
                    className={`rounded-xl border py-2.5 text-sm font-semibold transition ${
                      amount === String(value)
                        ? "border-purple-500 bg-purple-50 text-purple-700"
                        : "border-gray-200 text-gray-600 hover:border-purple-300"
                    }`}
                  >
                    ৳{value}
                  </button>
                ))}
              </div>

              <input
                type="number"
                min="1"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="Enter custom amount"
                required
                className="mt-3 w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-100"
              />
            </div>

            {/* Summary */}
            <div className="rounded-2xl bg-purple-50 p-4">
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Operator</span>
                <span className="font-semibold text-gray-800">
                  {operator || "Not selected"}
                </span>
              </div>
              <div className="mt-3 flex justify-between text-sm">
                <span className="text-gray-500">Recharge Type</span>
                <span className="font-semibold text-gray-800">
                  {rechargeType}
                </span>
              </div>
              <div className="mt-3 flex justify-between text-sm">
                <span className="text-gray-500">Total Amount</span>
                <span className="font-bold text-purple-700">
                  ৳{Number(amount || 0).toLocaleString("en-BD")}
                </span>
              </div>
            </div>

            <button
              type="submit"
              onClick={handleRecharge}
              disabled={
                loading ||
                !operator ||
                !/^01[3-9]\d{8}$/.test(phone) ||
                !amount ||
                Number(amount) <= 0
              }
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-purple-600 py-3.5 text-sm font-semibold text-white transition hover:bg-purple-700 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {loading && <LoaderCircle size={18} className="animate-spin" />}
              Continue to Recharge
            </button>
          </form>
        </div>

        <div className="flex items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-3">
          <ShieldCheck size={17} className="text-green-600" />
          <p className="text-xs text-gray-500">
            Your transaction is protected with secure verification.
          </p>
        </div>
      </div>
    </div>
  );
}
