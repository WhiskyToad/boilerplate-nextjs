import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { supabase } from "@/features/supabase/client";
import { toast } from "react-hot-toast";
import { useRouter } from "next/router";
import { useAuthStore } from "../store/authStore";

interface PasswordData {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

const SecuritySettings = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deletePassword, setDeletePassword] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const router = useRouter();
  const { user } = useAuthStore();

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm<PasswordData>();

  const newPassword = watch("newPassword");

  const onChangePassword = async (data: PasswordData) => {
    try {
      setIsLoading(true);

      // Verify current password first by trying to sign in
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email: (await supabase.auth.getUser()).data.user?.email || "",
        password: data.currentPassword,
      });

      if (signInError) {
        toast.error("Current password is incorrect");
        return;
      }

      // Change password
      const { error } = await supabase.auth.updateUser({
        password: data.newPassword,
      });

      if (error) throw error;

      toast.success("Password updated successfully");
      reset();
    } catch (error) {
      console.error("Error updating password:", error);
      toast.error("Failed to update password");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteAccount = async () => {
    try {
      setIsDeleting(true);

      const response = await fetch("/api/delete-user", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ password: deletePassword, userId: user?.id }),
      });

      const responseData = await response.json();

      if (!response.ok) {
        if (
          response.status === 401 &&
          responseData.error === "Incorrect password"
        ) {
          toast.error("Password is incorrect");
        } else {
          console.error("Error deleting account:", responseData.error);
          toast.error(
            responseData.error || "Failed to delete account. Please try again."
          );
        }
        return;
      }

      // Sign out client-side and redirect on success
      await supabase.auth.signOut();
      toast.success("Account deleted successfully.");
      router.push("/");
    } catch (error) {
      console.error("Error calling delete account API:", error);
      toast.error("An unexpected error occurred. Failed to delete account.");
    } finally {
      if (document.getElementById("confirmPassword")) {
        setIsDeleting(false);
      }
      setDeletePassword("");
      setShowDeleteConfirm(false);
    }
  };

  return (
    <div className="space-y-10">
      <div>
        <h2 className="text-2xl font-bold mb-6">Change Password</h2>

        <form onSubmit={handleSubmit(onChangePassword)} className="space-y-6">
          <div>
            <label
              htmlFor="currentPassword"
              className="block text-sm font-medium mb-2"
            >
              Current Password
            </label>
            <input
              id="currentPassword"
              type="password"
              className="input input-bordered w-full max-w-md"
              {...register("currentPassword", {
                required: "Current password is required",
              })}
            />
            {errors.currentPassword && (
              <p className="text-error text-sm mt-1">
                {errors.currentPassword.message}
              </p>
            )}
          </div>

          <div>
            <label
              htmlFor="newPassword"
              className="block text-sm font-medium mb-2"
            >
              New Password
            </label>
            <input
              id="newPassword"
              type="password"
              className="input input-bordered w-full max-w-md"
              {...register("newPassword", {
                required: "New password is required",
                minLength: {
                  value: 8,
                  message: "Password must be at least 8 characters",
                },
              })}
            />
            {errors.newPassword && (
              <p className="text-error text-sm mt-1">
                {errors.newPassword.message}
              </p>
            )}
          </div>

          <div>
            <label
              htmlFor="confirmPassword"
              className="block text-sm font-medium mb-2"
            >
              Confirm New Password
            </label>
            <input
              id="confirmPassword"
              type="password"
              className="input input-bordered w-full max-w-md"
              {...register("confirmPassword", {
                required: "Please confirm your password",
                validate: (value) =>
                  value === newPassword || "Passwords do not match",
              })}
            />
            {errors.confirmPassword && (
              <p className="text-error text-sm mt-1">
                {errors.confirmPassword.message}
              </p>
            )}
          </div>

          <div>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <span className="loading loading-spinner loading-xs mr-2"></span>
                  Updating...
                </>
              ) : (
                "Update Password"
              )}
            </button>
          </div>
        </form>
      </div>

      <div className="pt-8 border-t border-base-300">
        <h2 className="text-2xl font-bold text-error mb-6">Danger Zone</h2>

        {!showDeleteConfirm ? (
          <div>
            <p className="mb-4 text-base-content/70">
              Once you delete your account, there is no going back. This action
              cannot be undone.
            </p>
            <button
              className="btn btn-error"
              onClick={() => setShowDeleteConfirm(true)}
            >
              Delete Account
            </button>
          </div>
        ) : (
          <div className="bg-error/10 p-6 rounded-lg border border-error">
            <h3 className="text-lg font-bold mb-2">Are you absolutely sure?</h3>
            <p className="mb-4">
              This will permanently delete your account, projects, and all
              associated data. Please enter your password to confirm.
            </p>

            <div className="mb-4">
              <label
                htmlFor="deleteConfirmPassword"
                className="block text-sm font-medium mb-2"
              >
                Your Password
              </label>
              <input
                id="deleteConfirmPassword"
                type="password"
                className="input input-bordered w-full max-w-md"
                value={deletePassword}
                onChange={(e) => setDeletePassword(e.target.value)}
                placeholder="Enter your password to confirm"
              />
            </div>

            <div className="flex gap-3">
              <button
                className="btn btn-outline"
                onClick={() => {
                  setShowDeleteConfirm(false);
                  setDeletePassword("");
                }}
              >
                Cancel
              </button>
              <button
                className="btn btn-error"
                onClick={handleDeleteAccount}
                disabled={!deletePassword || isDeleting}
              >
                {isDeleting ? (
                  <>
                    <span className="loading loading-spinner loading-xs mr-2"></span>
                    Deleting...
                  </>
                ) : (
                  "Permanently Delete Account"
                )}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SecuritySettings;
