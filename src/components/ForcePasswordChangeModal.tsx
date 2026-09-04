"use client";

import { useEffect, useState } from "react";
import { ShieldAlert } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import Swal from "sweetalert2";

/**
 * Blocking password-change prompt shown when the logged-in account still
 * has force_password_change set - i.e. an Admin created/reset it with a
 * default password (see Admin's merchant/rider user form) and the person
 * hasn't picked their own yet. Deliberately has no close/skip affordance
 * and ignores backdrop clicks; it only unmounts itself once the password
 * change API call succeeds and clears the flag in AuthContext.
 */
export function ForcePasswordChangeModal() {
  const { user, changePassword } = useAuth();
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const isOpen = !!user?.force_password_change;

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (newPassword.length < 6) {
      setError("New password must be at least 6 characters");
      return;
    }
    if (newPassword !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setLoading(true);
    try {
      const result = await changePassword(currentPassword, newPassword);
      if (result.success) {
        Swal.fire({
          icon: "success",
          title: "Password updated",
          toast: true,
          position: "top-end",
          timer: 1400,
          showConfirmButton: false,
        });
      } else {
        setError(result.message || "Failed to update password");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="relative w-full max-w-sm bg-white rounded-xl shadow-2xl p-6">
        <div className="flex flex-col items-center text-center mb-4">
          <div className="w-12 h-12 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center mb-3">
            <ShieldAlert size={22} />
          </div>
          <h2 className="text-lg font-bold text-slate-900">Set a new password</h2>
          <p className="text-sm text-slate-500 mt-1">
            Your account is using a temporary password. Please set your own password to continue.
          </p>
        </div>

        <form className="space-y-3" onSubmit={handleSubmit}>
          {error && (
            <div className="rounded-md bg-red-50 p-3 text-sm text-red-700">{error}</div>
          )}

          <div>
            <label htmlFor="current-password" className="block text-xs font-medium text-slate-600 mb-1">
              Current (temporary) password
            </label>
            <Input
              id="current-password"
              type="password"
              autoComplete="current-password"
              required
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
            />
          </div>
          <div>
            <label htmlFor="new-password" className="block text-xs font-medium text-slate-600 mb-1">
              New password
            </label>
            <Input
              id="new-password"
              type="password"
              autoComplete="new-password"
              required
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />
          </div>
          <div>
            <label htmlFor="confirm-new-password" className="block text-xs font-medium text-slate-600 mb-1">
              Confirm new password
            </label>
            <Input
              id="confirm-new-password"
              type="password"
              autoComplete="new-password"
              required
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </div>

          <Button type="submit" className="w-full mt-2" disabled={loading}>
            {loading ? "Updating..." : "Update Password"}
          </Button>
        </form>
      </div>
    </div>
  );
}
