import React, { useState } from "react";
import { FiMail, FiCheck, FiAlertCircle } from "react-icons/fi";

interface NewsletterSignupProps {
  title?: string;
  description?: string;
  placeholderText?: string;
  buttonText?: string;
  successMessage?: string;
  errorMessage?: string;
  variant?: "default" | "primary" | "minimal" | "card";
  onSubmit?: (email: string) => Promise<boolean>;
}

const NewsletterSignup: React.FC<NewsletterSignupProps> = ({
  title = "Subscribe to Our Newsletter",
  description = "Get the latest updates, news and product offers sent straight to your inbox.",
  placeholderText = "Enter your email",
  buttonText = "Subscribe",
  successMessage = "Thank you for subscribing!",
  errorMessage = "Something went wrong. Please try again.",
  variant = "default",
  onSubmit,
}) => {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<
    "idle" | "loading" | "success" | "error"
  >("idle");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || status === "loading") return;

    setStatus("loading");

    try {
      // If onSubmit is provided, call it, otherwise simulate success
      if (onSubmit) {
        const success = await onSubmit(email);
        setStatus(success ? "success" : "error");
      } else {
        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 1000));
        setStatus("success");
      }
    } catch (error) {
      setStatus("error");
    }
  };

  const renderForm = () => (
    <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-2">
      <div className="relative flex-grow">
        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
          <FiMail className="text-base-content/50" />
        </div>
        <input
          type="email"
          className="input input-bordered w-full pl-10"
          placeholder={placeholderText}
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          disabled={status === "loading" || status === "success"}
        />
      </div>
      <button
        type="submit"
        className={`btn ${
          variant === "primary" ? "btn-primary" : "btn-secondary"
        } ${status === "loading" ? "loading" : ""}`}
        disabled={status === "loading" || status === "success"}
      >
        {status === "loading" ? "Subscribing..." : buttonText}
      </button>
    </form>
  );

  const getContainerClasses = () => {
    switch (variant) {
      case "primary":
        return "bg-primary text-primary-content p-8 rounded-lg";
      case "card":
        return "bg-base-200 p-8 rounded-lg shadow-lg";
      case "minimal":
        return "bg-transparent";
      default:
        return "bg-base-200 p-8 rounded-lg";
    }
  };

  return (
    <section className={`py-12 ${variant !== "minimal" ? "bg-base-100" : ""}`}>
      <div className="container mx-auto px-4">
        <div className={`max-w-xl mx-auto ${getContainerClasses()}`}>
          {title && (
            <h2
              className={`text-2xl font-bold mb-3 ${
                variant === "minimal" ? "text-center" : ""
              }`}
            >
              {title}
            </h2>
          )}
          {description && (
            <p
              className={`mb-6 ${
                variant === "primary" ? "opacity-90" : "text-base-content/70"
              } ${variant === "minimal" ? "text-center" : ""}`}
            >
              {description}
            </p>
          )}

          {status === "success" ? (
            <div className="flex items-center gap-2 p-4 bg-success/20 text-success rounded">
              <FiCheck className="text-success" />
              <span>{successMessage}</span>
            </div>
          ) : status === "error" ? (
            <div className="flex items-center gap-2 p-4 bg-error/20 text-error rounded">
              <FiAlertCircle className="text-error" />
              <span>{errorMessage}</span>
            </div>
          ) : (
            renderForm()
          )}

          {variant !== "minimal" && (
            <p className="text-xs mt-4 opacity-70">
              We respect your privacy. Unsubscribe at any time.
            </p>
          )}
        </div>
      </div>
    </section>
  );
};

export default NewsletterSignup;
