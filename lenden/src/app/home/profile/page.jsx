"use client";

import { useEffect, useRef, useState } from "react";
import {
  UserRound,
  Mail,
  MapPin,
  CalendarDays,
  Clock,
  Camera,
  Pencil,
  X,
  Save,
  ShieldCheck,
  Upload,
} from "lucide-react";

export default function ProfilePage() {
  const [profile, setProfile] = useState({
    name: "",
    email: "",
    address: "",
    dob: "",
    createTime: "",
    profilePicture: "",
  });

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState(profile);
  const [preview, setPreview] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  const fileRef = useRef(null);

  // Fetch Profile
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await fetch("/api/backend/profile", {
          method: "GET",
          credentials: "include",
        });

        const info = await res.json();

        if (!res.ok) {
          throw new Error(info.message || "Failed to fetch profile");
        }

        const userProfile = {
          name: info.name || "",
          email: info.email || "",
          address: info.address || "",
          dob: info.dob || "",
          createTime: info.createTime || "",
          profilePicture: info.profilePicture || "",
        };

        setProfile(userProfile);
        setFormData(userProfile);
      } catch (error) {
        console.error("Profile fetch error:", error);
      }
    };

    fetchProfile();
  }, []);

  // Update Profile
  const handleUpdate = async (e) => {
    e.preventDefault();

    if (isSaving) return;

    setIsSaving(true);

    try {
      const res = await fetch("/api/backend/profile", {
        method: "PATCH",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: formData.name,
          address: formData.address,
          dob: formData.dob,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Profile update failed");
      }

      if (!data.profile) {
        throw new Error("Updated profile data not received");
      }

      const updatedProfile = {
        name: data.profile.name || "",
        email: data.profile.email || "",
        address: data.profile.address || "",
        dob: data.profile.dob || "",
        createTime: data.profile.createTime || "",
        profilePicture: data.profile.profilePicture || "",
      };

      setProfile(updatedProfile);
      setFormData(updatedProfile);
      setPreview("");

      setIsModalOpen(false);

      alert("Profile updated successfully!");
    } catch (error) {
      console.error("Profile update error:", error);
      alert(error.message || "Something went wrong!");
    } finally {
      setIsSaving(false);
    }
  };

  // Open Edit Modal
  const handleEdit = () => {
    setFormData(profile);
    setPreview(profile.profilePicture);
    setIsModalOpen(true);
  };

  // Handle Input Changes
  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle Image Selection
  const handleImageChange = (e) => {
    const file = e.target.files?.[0];

    if (!file) return;

    if (!file.type.startsWith("image/")) {
      alert("Please select an image file.");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      alert("Image size must be less than 5MB.");
      return;
    }

    const imageUrl = URL.createObjectURL(file);

    setPreview(imageUrl);
  };

  // Format Date
  const formatDate = (date) => {
    if (!date) return "Not added yet";

    return new Date(date).toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    });
  };

  const avatar = profile.profilePicture;

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="mx-auto max-w-4xl space-y-7">
        {/* Page Heading */}
        <div>
          <h1 className="text-2xl font-bold text-gray-900">My Profile</h1>
          <p className="mt-1 text-sm text-gray-500">
            Manage your personal information and account details.
          </p>
        </div>

        {/* Profile Header */}
        <div className="overflow-hidden rounded-3xl border border-gray-100 bg-white shadow-xl shadow-purple-100/50">
          <div className="h-32 bg-gradient-to-r from-purple-800 via-purple-600 to-purple-500 md:h-40" />

          <div className="px-6 pb-7 md:px-9">
            <div className="-mt-14 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
              <div className="flex items-end gap-4">
                <div className="flex h-28 w-28 shrink-0 items-center justify-center overflow-hidden rounded-2xl border-4 border-white bg-purple-100 text-purple-700 shadow-md">
                  {avatar ? (
                    <img
                      src={avatar}
                      alt="Profile"
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <UserRound size={55} strokeWidth={1.5} />
                  )}
                </div>

                <div className="pb-1">
                  <h2 className="text-3xl font-bold text-white">
                    {profile.name || "Your Name"}
                  </h2>

                  <p className="mt-1 font-bold text-sm text-gray-500">
                    {profile.email}
                  </p>

                  <div className="mt-2 flex items-center gap-1.5 text-xs font-medium text-green-600">
                    <ShieldCheck size={15} />
                    Verified Account
                  </div>
                </div>
              </div>

              <button
                onClick={handleEdit}
                className="flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-purple-700 to-purple-500 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-purple-200 transition hover:from-purple-800 hover:to-purple-600"
              >
                <Pencil size={17} />
                Update Profile
              </button>
            </div>
          </div>
        </div>

        {/* Personal Information */}
        <div className="rounded-3xl border border-gray-100 bg-white p-6 shadow-sm md:p-8">
          <div className="mb-6">
            <h3 className="text-lg font-bold text-gray-900">
              Personal Information
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              Your personal details associated with LenDen.
            </p>
          </div>

          <div className="grid gap-6 sm:grid-cols-2">
            <InfoItem
              icon={<UserRound size={19} />}
              label="Full Name"
              value={profile.name}
            />

            <InfoItem
              icon={<Mail size={19} />}
              label="Email Address"
              value={profile.email}
            />

            <InfoItem
              icon={<MapPin size={19} />}
              label="Address"
              value={profile.address}
            />

            <InfoItem
              icon={<CalendarDays size={19} />}
              label="Date of Birth"
              value={formatDate(profile.dob)}
            />
          </div>
        </div>

        {/* Account Information */}
        <div className="rounded-3xl border border-gray-100 bg-white p-6 shadow-sm md:p-8">
          <h3 className="text-lg font-bold text-gray-900">
            Account Information
          </h3>

          <p className="mt-1 text-sm text-gray-500">
            Information about your LenDen account.
          </p>

          <div className="mt-6 flex items-center gap-4 rounded-2xl bg-purple-50 p-5">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-purple-100 text-purple-700">
              <Clock size={23} />
            </div>

            <div>
              <p className="text-xs font-medium text-gray-500">Member Since</p>

              <p className="mt-1 font-semibold text-gray-900">
                {profile.createTime
                  ? formatDate(profile.createTime)
                  : "Not available"}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Edit Profile Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/50 p-4 backdrop-blur-sm">
          <div className="my-auto w-full max-w-xl overflow-hidden rounded-3xl bg-white shadow-2xl">
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-gray-100 px-6 py-5">
              <div>
                <h2 className="text-xl font-bold text-gray-900">
                  Update Profile
                </h2>

                <p className="mt-1 text-xs text-gray-500">
                  Update your personal information.
                </p>
              </div>

              <button
                onClick={() => setIsModalOpen(false)}
                disabled={isSaving}
                className="flex h-9 w-9 items-center justify-center rounded-full bg-gray-100 text-gray-600 transition hover:bg-red-50 hover:text-red-500"
              >
                <X size={19} />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleUpdate} className="space-y-5 p-6">
              {/* Profile Picture Upload */}
              <div className="flex flex-col items-center">
                <div className="relative">
                  <div className="flex h-24 w-24 items-center justify-center overflow-hidden rounded-full border-4 border-purple-100 bg-purple-50 text-purple-700">
                    {preview ? (
                      <img
                        src={preview}
                        alt="Preview"
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <UserRound size={43} />
                    )}
                  </div>

                  <button
                    type="button"
                    onClick={() => fileRef.current?.click()}
                    className="absolute bottom-0 right-0 flex h-9 w-9 items-center justify-center rounded-full border-2 border-white bg-purple-600 text-white shadow-md hover:bg-purple-700"
                  >
                    <Camera size={17} />
                  </button>
                </div>

                <input
                  ref={fileRef}
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                />

                <button
                  type="button"
                  onClick={() => fileRef.current?.click()}
                  className="mt-3 flex items-center gap-2 text-sm font-semibold text-purple-700 hover:text-purple-800"
                >
                  <Upload size={15} />
                  Upload Profile Picture
                </button>

                <p className="mt-1 text-xs text-gray-400">
                  JPG, PNG or WEBP · Maximum 5MB
                </p>
              </div>

              {/* Name */}
              <div>
                <label className="mb-2 block text-sm font-semibold text-gray-700">
                  Full Name
                </label>

                <input
                  type="text"
                  name="name"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Enter your full name"
                  className="w-full rounded-xl border-2 border-gray-200 px-4 py-3 text-sm outline-none transition focus:border-purple-500"
                />
              </div>

              {/* Email */}
              <div>
                <label className="mb-2 block text-sm font-semibold text-gray-700">
                  Email Address
                </label>

                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  disabled
                  className="w-full cursor-not-allowed rounded-xl border-2 border-gray-200 bg-gray-100 px-4 py-3 text-sm outline-none"
                />

                <p className="mt-1 text-xs text-gray-400">
                  Email cannot be changed here.
                </p>
              </div>

              {/* Address */}
              <div>
                <label className="mb-2 block text-sm font-semibold text-gray-700">
                  Address
                </label>

                <textarea
                  name="address"
                  rows={2}
                  value={formData.address}
                  onChange={handleChange}
                  placeholder="Enter your address"
                  className="w-full resize-none rounded-xl border-2 border-gray-200 px-4 py-3 text-sm outline-none transition focus:border-purple-500"
                />
              </div>

              {/* DOB */}
              <div>
                <label className="mb-2 block text-sm font-semibold text-gray-700">
                  Date of Birth
                </label>

                <input
                  type="date"
                  name="dob"
                  value={formData.dob}
                  onChange={handleChange}
                  className="w-full rounded-xl border-2 border-gray-200 px-4 py-3 text-sm outline-none transition focus:border-purple-500"
                />
              </div>

              {/* Actions */}
              <div className="flex flex-col-reverse gap-3 border-t border-gray-100 pt-5 sm:flex-row sm:justify-end">
                <button
                  type="button"
                  disabled={isSaving}
                  onClick={() => setIsModalOpen(false)}
                  className="rounded-xl border border-gray-200 px-6 py-3 text-sm font-semibold text-gray-600 transition hover:bg-gray-50 disabled:opacity-50"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={isSaving}
                  className="flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-purple-700 to-purple-500 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-purple-200 transition hover:from-purple-800 hover:to-purple-600 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  <Save size={17} />
                  {isSaving ? "Saving..." : "Save Changes"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

// Reusable Info Component
function InfoItem({ icon, label, value }) {
  return (
    <div className="flex items-start gap-3">
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-purple-50 text-purple-700">
        {icon}
      </div>

      <div className="min-w-0">
        <p className="text-xs font-medium text-gray-500">{label}</p>

        <p className="mt-1 break-words text-sm font-semibold text-gray-900">
          {value || "Not added yet"}
        </p>
      </div>
    </div>
  );
}
