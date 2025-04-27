import React, { useState } from "react";
import { supabase } from "@/features/supabase/client";
import { useAuthStore } from "@/features/store/authStore";
import { toast } from "react-hot-toast";

interface EmailSettings {
  email: string;
  marketingEmails: boolean;
  projectUpdates: boolean;
}

const EmailSettings = () => {
  const { user } = useAuthStore();
  const [isChangingEmail, setIsChangingEmail] = useState(false);

  const handleChangeEmail = async (data: {
    email: string;
    password: string;
  }) => {
    try {
      setIsChangingEmail(true);

      // Verify password
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email: user?.email || "",
        password: data.password,
      });

      if (signInError) {
        toast.error("Password is incorrect");
        return;
      }

      // Update email
      const { error } = await supabase.auth.updateUser({
        email: data.email,
      });

      if (error) throw error;

      toast.success("Verification email sent to your new email address");
      setIsChangeEmailModalOpen(false);
    } catch (error) {
      console.error("Error updating email:", error);
      toast.error("Failed to update email address");
    } finally {
      setIsChangingEmail(false);
    }
  };

  const [isChangeEmailModalOpen, setIsChangeEmailModalOpen] = useState(false);
  const [newEmail, setNewEmail] = useState("");
  const [password, setPassword] = useState("");

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Email Settings</h2>

      <div className="bg-base-200 p-6 rounded-lg mb-8">
        <h3 className="text-lg font-bold mb-2">Email Address</h3>
        <p className="text-base-content/70 mb-4">
          Your current email address is{" "}
          <span className="font-medium">{user?.email}</span>
        </p>
        <button
          className="btn btn-primary"
          onClick={() => setIsChangeEmailModalOpen(true)}
        >
          Change Email Address
        </button>
      </div>

      {/* Change Email Modal */}
      {isChangeEmailModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-base-100 rounded-lg shadow-xl max-w-md w-full p-6">
            <h3 className="text-xl font-bold mb-4">Change Email Address</h3>
            <p className="text-base-content/70 mb-6">
              Enter your new email address and current password to verify your
              identity.
            </p>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">
                  New Email Address
                </label>
                <input
                  type="email"
                  className="input input-bordered w-full"
                  value={newEmail}
                  onChange={(e) => setNewEmail(e.target.value)}
                  placeholder="Enter new email address"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Current Password
                </label>
                <input
                  type="password"
                  className="input input-bordered w-full"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                />
              </div>
            </div>

            <div className="flex justify-end gap-3 mt-6">
              <button
                className="btn btn-outline"
                onClick={() => {
                  setIsChangeEmailModalOpen(false);
                  setNewEmail("");
                  setPassword("");
                }}
              >
                Cancel
              </button>
              <button
                className="btn btn-primary"
                onClick={() => handleChangeEmail({ email: newEmail, password })}
                disabled={!newEmail || !password || isChangingEmail}
              >
                {isChangingEmail ? (
                  <>
                    <span className="loading loading-spinner loading-xs mr-2"></span>
                    Updating...
                  </>
                ) : (
                  "Update Email"
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EmailSettings;
