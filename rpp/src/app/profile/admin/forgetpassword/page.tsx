"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import GoBackButton from "@/components/GoBackButton";
import ErrorComponent from "@/components/error";

export default function ChangePasswordPage() {
  const router = useRouter();

  // Step 1: email
  const [email, setEmail] = useState("");

  // Step 2: modal + passwords
  const [showPopup, setShowPopup] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [isChecking, setIsChecking] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const [error, setError] = useState({ type: "", message: "" });

  const handleFindStudent = () => {
    setError({ type: "", message: "" });

    if (!email.trim()) {
      setError({ type: "error", message: "Please enter your student email." });
      return;
    }

    setIsChecking(true);

    // UI-only: simulate lookup
    setTimeout(() => {
      setIsChecking(false);
      setShowPopup(true);
    }, 500);
  };

  const closePopup = () => {
    setShowPopup(false);
    setNewPassword("");
    setConfirmPassword("");
    setError({ type: "", message: "" });
  };

  const handleSavePassword = () => {
    setError({ type: "", message: "" });

    if (!newPassword.trim()) {
      setError({ type: "error", message: "New password is required." });
      return;
    }

    if (newPassword.length < 8) {
      setError({
        type: "error",
        message: "Password must be at least 8 characters.",
      });
      return;
    }

    if (newPassword !== confirmPassword) {
      setError({
        type: "error",
        message: "Passwords do not match.",
      });
      return;
    }

    setIsSaving(true);

    // UI-only success
    setTimeout(() => {
      setIsSaving(false);
      setError({ type: "success", message: "Password updated successfully." });
      // Optional auto-close:
      // setTimeout(closePopup, 800);
    }, 700);
  };

  return (
    <div className="min-h-screen bg-amber-400 flex justify-center items-center px-4 py-10">
      {/* Main Card */}
      <div className="bg-white rounded-lg p-8 w-full max-w-lg shadow-md">
        <div className="flex justify-between items-center mb-4">
          <GoBackButton route="/profile" />
          
        </div>

        <ErrorComponent Type={error.type} Message={error.message} />

        <h1 className="text-2xl font-semibold text-gray-800 mb-2 text-center">
          Change Password
        </h1>
        <p className="text-sm text-gray-500 mb-6 text-center">
          Enter your student email to continue.
        </p>

        <div className="space-y-5">
          <div>
            <label className="block text-gray-700 font-bold mb-2">
              Student Email <span className="text-red-500">*</span>
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="student@umbc.edu"
              className="w-full px-4 py-2 border text-gray-700 border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-black"
            />
          </div>

          <button
            type="button"
            onClick={handleFindStudent}
            disabled={isChecking}
            className="w-full bg-black hover:bg-gray-800 text-white font-semibold py-2 rounded-md transition disabled:opacity-50"
          >
            {isChecking ? "Checking..." : "Continue"}
          </button>
        </div>
      </div>

      {/* Password Modal */}
      {showPopup && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-[4px] px-4">
          <div className="bg-white w-full max-w-md rounded-lg shadow-lg p-8 relative">
            

            <h2 className="text-xl font-semibold text-gray-800 text-center mb-1">
              Set New Password
            </h2>
            <p className="text-xs text-gray-500 text-center mb-6">
              Account: <span className="font-semibold">{email}</span>
            </p>

            <ErrorComponent Type={error.type} Message={error.message} />

            <div className="space-y-4">
              <div>
                <label className="block text-gray-700 font-bold mb-2">
                  New Password <span className="text-red-500">*</span>
                </label>
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Enter new password"
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-black"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Minimum 8 characters.
                </p>
              </div>

              <div>
                <label className="block text-gray-700 font-bold mb-2">
                  Confirm Password <span className="text-red-500">*</span>
                </label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Confirm new password"
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-black"
                />
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={closePopup}
                  className="w-1/2 bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-2 rounded-md"
                >
                  Cancel
                </button>

                <button
                  type="button"
                  onClick={handleSavePassword}
                  disabled={isSaving}
                  className="w-1/2 bg-black hover:bg-amber-600 text-white font-semibold py-2 rounded-md transition disabled:opacity-50"
                >
                  {isSaving ? "Saving..." : "Save"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
