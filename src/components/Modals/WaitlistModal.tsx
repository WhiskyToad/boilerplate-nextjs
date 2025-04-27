import { useState } from "react";
import BaseModal from "./BaseModal";
import { TextInput } from "../Inputs/TextInput";

interface WaitlistModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const WaitlistModal = ({ isOpen, onClose }: WaitlistModalProps) => {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!email) {
      setError("Email is required");
      return;
    }

    if (!/\S+@\S+\.\S+/.test(email)) {
      setError("Email is invalid");
      return;
    }

    try {
      const response = await fetch("/api/addEmail", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      if (!response.ok) {
        throw new Error("Failed to subscribe");
      }

      setEmail("");
      setSuccess("Successfully subscribed!");
      setTimeout(() => {
        setSuccess("");
        onClose();
      }, 3000);
    } catch {
      setError("Failed to subscribe");
    }
  };

  return (
    <BaseModal
      isOpen={isOpen}
      onClose={onClose}
      title="Join Our Waitlist!"
      actionButtons={
        <>
          <button className="btn" onClick={onClose}>
            Close
          </button>
          {!success && (
            <button
              type="submit"
              className="btn btn-primary"
              onClick={handleSubmit}
            >
              Sign Up
            </button>
          )}
        </>
      }
    >
      <div className="flex flex-col gap-2 text-center pb-12">
        <p>
          Join our waitlist and be among the first to experience how our app can
          boost your business from 0 to 1. Unlock new opportunities, streamline
          your operations, and watch your business grow with our innovative
          solutions. Don&apos;t miss out on the chance to transform your
          business!
        </p>
        <p>
          We hope you&apos;re as excited as we are about our upcoming app
          launch!
        </p>
        <form className="mt-4 mx-auto" onSubmit={handleSubmit}>
          <TextInput
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            errorMessage={error}
          />
          {success && <p className="text-green-500">{success}</p>}
        </form>
      </div>
    </BaseModal>
  );
};

export default WaitlistModal;
