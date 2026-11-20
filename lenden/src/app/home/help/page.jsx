"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Search,
  MessageCircle,
  ShieldCheck,
  CreditCard,
  UserRound,
  Wallet,
  ChevronDown,
  Headphones,
  Send,
  Mail,
  Clock,
  CircleHelp,
  FileText,
  LockKeyhole,
} from "lucide-react";

const faqs = [
  {
    question: "How can I send money to another user?",
    answer:
      "Go to Send Money from your dashboard, enter the receiver's account number and amount, then confirm the transaction using your PIN.",
  },
  {
    question: "How can I add money to my LenDen wallet?",
    answer:
      "Navigate to Add Money, select your preferred payment method, enter the amount and follow the instructions to complete the process.",
  },
  {
    question: "What should I do if my transaction fails?",
    answer:
      "First check your transaction history and wallet balance. If the amount was deducted but the transaction failed, contact our support team with your transaction details.",
  },
  {
    question: "How can I change my account information?",
    answer:
      "Visit your Profile section to view and update the account information available to you.",
  },
  {
    question: "Is my LenDen account secure?",
    answer:
      "LenDen is designed with account security in mind. Never share your password, PIN or OTP with anyone.",
  },
];

const topics = [
  {
    title: "Payments & Transactions",
    description: "Send money, add money and transaction issues",
    icon: CreditCard,
    color: "bg-purple-100 text-purple-700",
    search: "transaction",
  },
  {
    title: "Account & Profile",
    description: "Manage your account and profile information",
    icon: UserRound,
    color: "bg-blue-100 text-blue-700",
    search: "account",
  },
  {
    title: "Security & Privacy",
    description: "Keep your wallet and personal information safe",
    icon: ShieldCheck,
    color: "bg-green-100 text-green-700",
    search: "secure",
  },
  {
    title: "Wallet & Balance",
    description: "Questions about your wallet and balance",
    icon: Wallet,
    color: "bg-orange-100 text-orange-700",
    search: "wallet",
  },
];

export default function HelpSupport() {
  const [search, setSearch] = useState("");
  const [activeFaq, setActiveFaq] = useState(0);
  const [category, setCategory] = useState("General");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");

  const filteredFaqs = useMemo(() => {
    const value = search.toLowerCase().trim();

    if (!value) return faqs;

    return faqs.filter(
      (faq) =>
        faq.question.toLowerCase().includes(value) ||
        faq.answer.toLowerCase().includes(value),
    );
  }, [search]);

  const handleSubmit = (e) => {
    e.preventDefault();

    // Connect your support-ticket backend API here.
    alert("Support form UI is ready. Backend connection is pending.");
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="mx-auto max-w-5xl space-y-7">
        {/* Header */}
        <div className="flex items-center gap-3">
          <Link
            href="/home"
            className="flex h-10 w-10 items-center justify-center rounded-xl border border-gray-200 bg-white text-gray-600 transition hover:bg-purple-50 hover:text-purple-700"
          >
            <ArrowLeft size={19} />
          </Link>

          <div>
            <h1 className="text-2xl font-bold text-gray-900">Help & Support</h1>
            <p className="mt-1 text-sm text-gray-500">
              We are here to help you with anything.
            </p>
          </div>
        </div>

        {/* Hero */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-purple-800 via-purple-700 to-purple-500 p-7 text-white shadow-xl shadow-purple-100 md:p-10">
          <div className="relative z-10 max-w-xl">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-white/15">
              <Headphones size={27} />
            </div>

            <h2 className="text-2xl font-bold md:text-3xl">
              How can we help you?
            </h2>

            <p className="mt-3 text-sm leading-6 text-purple-100 md:text-base">
              Find answers to your questions or get in touch with our support
              team.
            </p>

            <div className="mt-6 flex max-w-lg items-center gap-3 rounded-xl bg-white px-4 py-3">
              <Search size={20} className="shrink-0 text-gray-400" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search for help..."
                className="w-full bg-transparent text-sm text-gray-800 outline-none placeholder:text-gray-400"
              />
            </div>
          </div>

          <div className="pointer-events-none absolute -right-12 -top-16 h-64 w-64 rounded-full border-[35px] border-white/10" />
          <div className="pointer-events-none absolute -bottom-28 right-36 h-64 w-64 rounded-full bg-white/5" />
        </div>

        {/* Help Topics */}
        <section>
          <div className="mb-4">
            <h2 className="text-lg font-bold text-gray-900">
              Browse Help Topics
            </h2>
            <p className="mt-1 text-sm text-gray-500">
              Choose a category to find relevant information.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            {topics.map((topic) => {
              const Icon = topic.icon;

              return (
                <button
                  key={topic.title}
                  onClick={() => setSearch(topic.search)}
                  className="flex items-center gap-4 rounded-2xl border border-gray-100 bg-white p-5 text-left shadow-sm transition hover:-translate-y-0.5 hover:border-purple-200 hover:shadow-md"
                >
                  <div
                    className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ${topic.color}`}
                  >
                    <Icon size={23} />
                  </div>

                  <div>
                    <h3 className="font-semibold text-gray-900">
                      {topic.title}
                    </h3>
                    <p className="mt-1 text-xs leading-5 text-gray-500">
                      {topic.description}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>
        </section>

        {/* FAQ */}
        <section className="rounded-3xl border border-gray-100 bg-white p-5 shadow-sm md:p-7">
          <div className="mb-6 flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-purple-100 text-purple-700">
              <CircleHelp size={23} />
            </div>

            <div>
              <h2 className="text-lg font-bold text-gray-900">
                Frequently Asked Questions
              </h2>
              <p className="text-sm text-gray-500">
                Quick answers to common questions.
              </p>
            </div>
          </div>

          <div className="space-y-3">
            {filteredFaqs.length > 0 ? (
              filteredFaqs.map((faq, index) => (
                <div
                  key={faq.question}
                  className="overflow-hidden rounded-xl border border-gray-200"
                >
                  <button
                    onClick={() =>
                      setActiveFaq(activeFaq === index ? -1 : index)
                    }
                    className="flex w-full items-center justify-between gap-4 p-4 text-left"
                  >
                    <span className="text-sm font-semibold text-gray-800">
                      {faq.question}
                    </span>

                    <ChevronDown
                      size={19}
                      className={`shrink-0 text-purple-600 transition ${
                        activeFaq === index ? "rotate-180" : ""
                      }`}
                    />
                  </button>

                  {activeFaq === index && (
                    <div className="border-t border-gray-100 bg-purple-50/50 px-4 py-4 text-sm leading-6 text-gray-600">
                      {faq.answer}
                    </div>
                  )}
                </div>
              ))
            ) : (
              <p className="py-8 text-center text-sm text-gray-500">
                No matching questions found.
              </p>
            )}
          </div>
        </section>

        {/* Contact Support */}
        <section className="grid gap-6 lg:grid-cols-5">
          <div className="space-y-4 lg:col-span-2">
            <div>
              <h2 className="text-xl font-bold text-gray-900">
                Still need help?
              </h2>
              <p className="mt-2 text-sm leading-6 text-gray-500">
                Can not find what you are looking for? Send us a message and we
                will help you out.
              </p>
            </div>

            <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-purple-100 text-purple-700">
                  <MessageCircle size={21} />
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-900">
                    Contact Support
                  </p>
                  <p className="text-xs text-gray-500">Send us your question</p>
                </div>
              </div>

              <div className="mt-5 space-y-4">
                <div className="flex items-center gap-3">
                  <Mail size={18} className="text-purple-600" />
                  <span className="text-sm text-gray-600">
                    Support through contact form
                  </span>
                </div>

                <div className="flex items-center gap-3">
                  <Clock size={18} className="text-purple-600" />
                  <span className="text-sm text-gray-600">
                    Response time may vary
                  </span>
                </div>

                <div className="flex items-center gap-3">
                  <FileText size={18} className="text-purple-600" />
                  <span className="text-sm text-gray-600">
                    Transaction-related assistance
                  </span>
                </div>
              </div>
            </div>

            <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4">
              <div className="flex items-center gap-2 text-amber-800">
                <LockKeyhole size={18} />
                <p className="text-sm font-semibold">Security Reminder</p>
              </div>
              <p className="mt-2 text-xs leading-5 text-amber-700">
                Never share your password, PIN or OTP with anyone, including
                someone claiming to be from LenDen support.
              </p>
            </div>
          </div>

          {/* Support Form */}
          <div className="rounded-3xl border border-gray-100 bg-white p-6 shadow-xl shadow-purple-100/50 lg:col-span-3 md:p-8">
            <h3 className="text-lg font-bold text-gray-900">
              Send us a message
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              Fill out the form below.
            </p>

            <form onSubmit={handleSubmit} className="mt-6 space-y-5">
              <div>
                <label className="mb-2 block text-sm font-semibold text-gray-700">
                  Issue Category
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full rounded-xl border-2 border-gray-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-purple-500"
                >
                  <option>General</option>
                  <option>Send Money</option>
                  <option>Cash Out</option>
                  <option>Add Money</option>
                  <option>Payment</option>
                  <option>Account & Security</option>
                  <option>Other</option>
                </select>
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-gray-700">
                  Subject
                </label>
                <input
                  required
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  placeholder="Briefly describe your issue"
                  className="w-full rounded-xl border-2 border-gray-200 px-4 py-3 text-sm outline-none transition focus:border-purple-500"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-gray-700">
                  Message
                </label>
                <textarea
                  required
                  rows={5}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Explain your issue in detail..."
                  className="w-full resize-none rounded-xl border-2 border-gray-200 px-4 py-3 text-sm outline-none transition focus:border-purple-500"
                />
              </div>

              <button
                type="submit"
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-purple-700 to-purple-500 py-4 font-semibold text-white shadow-lg shadow-purple-200 transition hover:from-purple-800 hover:to-purple-600"
              >
                <Send size={18} />
                Submit Request
              </button>
            </form>
          </div>
        </section>

        {/* Footer */}
        <p className="pb-4 text-center text-xs text-gray-400">
          © 2026 LenDen. All rights reserved.
        </p>
      </div>
    </div>
  );
}
