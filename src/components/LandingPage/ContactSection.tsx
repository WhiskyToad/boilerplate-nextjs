import React, { useState } from "react";
import { FiMail, FiMapPin, FiPhone, FiSend } from "react-icons/fi";

interface ContactSectionProps {
  title?: string;
  subtitle?: string;
  contactInfo?: {
    email?: string;
    phone?: string;
    address?: string;
  };
  formTitle?: string;
  includeForm?: boolean;
  formSubmitHandler?: (data: {
    name: string;
    email: string;
    subject: string;
    message: string;
  }) => Promise<boolean>;
}

const ContactSection: React.FC<ContactSectionProps> = ({
  title = "Get in Touch",
  subtitle = "We'd love to hear from you. Here's how you can reach us.",
  contactInfo = {
    email: "contact@example.com",
    phone: "+1 (555) 123-4567",
    address: "123 Main Street, City, Country",
  },
  formTitle = "Send us a message",
  includeForm = true,
  formSubmitHandler,
}) => {
  const [formState, setFormState] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const [formStatus, setFormStatus] = useState<
    "idle" | "submitting" | "success" | "error"
  >("idle");

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormState((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormStatus("submitting");

    try {
      // If custom handler is provided, use it
      if (formSubmitHandler) {
        const success = await formSubmitHandler(formState);
        setFormStatus(success ? "success" : "error");
      } else {
        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 1500));
        setFormStatus("success");
        // Reset form after successful submission
        setFormState({ name: "", email: "", subject: "", message: "" });
      }
    } catch (error) {
      setFormStatus("error");
    }
  };

  return (
    <section className="py-16 bg-base-200">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">{title}</h2>
          <p className="text-lg max-w-2xl mx-auto text-base-content/70">
            {subtitle}
          </p>
        </div>

        <div className="max-w-5xl mx-auto">
          <div
            className={`grid ${
              includeForm ? "grid-cols-1 lg:grid-cols-2" : "grid-cols-1"
            } gap-8`}
          >
            {/* Contact Information */}
            <div className="bg-base-100 p-8 rounded-lg shadow-md">
              <h3 className="text-2xl font-semibold mb-6">
                Contact Information
              </h3>
              <div className="space-y-6">
                {contactInfo.email && (
                  <div className="flex items-start gap-4">
                    <div className="p-3 bg-primary/10 rounded-full">
                      <FiMail size={24} className="text-primary" />
                    </div>
                    <div>
                      <h4 className="font-medium mb-1">Email</h4>
                      <a
                        href={`mailto:${contactInfo.email}`}
                        className="text-base-content/70 hover:text-primary transition-colors"
                      >
                        {contactInfo.email}
                      </a>
                    </div>
                  </div>
                )}

                {contactInfo.phone && (
                  <div className="flex items-start gap-4">
                    <div className="p-3 bg-primary/10 rounded-full">
                      <FiPhone size={24} className="text-primary" />
                    </div>
                    <div>
                      <h4 className="font-medium mb-1">Phone</h4>
                      <a
                        href={`tel:${contactInfo.phone.replace(/\s+/g, "")}`}
                        className="text-base-content/70 hover:text-primary transition-colors"
                      >
                        {contactInfo.phone}
                      </a>
                    </div>
                  </div>
                )}

                {contactInfo.address && (
                  <div className="flex items-start gap-4">
                    <div className="p-3 bg-primary/10 rounded-full">
                      <FiMapPin size={24} className="text-primary" />
                    </div>
                    <div>
                      <h4 className="font-medium mb-1">Address</h4>
                      <p className="text-base-content/70">
                        {contactInfo.address}
                      </p>
                    </div>
                  </div>
                )}
              </div>

              <div className="mt-8 pt-6 border-t border-base-300">
                <h4 className="font-medium mb-4">Follow Us</h4>
                <div className="flex gap-4">
                  {/* Social media icons would go here */}
                </div>
              </div>
            </div>

            {/* Contact Form */}
            {includeForm && (
              <div className="bg-base-100 p-8 rounded-lg shadow-md">
                <h3 className="text-2xl font-semibold mb-6">{formTitle}</h3>

                {formStatus === "success" ? (
                  <div className="bg-success/10 border border-success/30 text-success rounded-md p-4">
                    <p className="font-medium">Message sent successfully!</p>
                    <p className="text-sm mt-1">
                      We'll get back to you as soon as possible.
                    </p>
                    <button
                      className="btn btn-sm btn-ghost mt-3"
                      onClick={() => setFormStatus("idle")}
                    >
                      Send another message
                    </button>
                  </div>
                ) : formStatus === "error" ? (
                  <div className="bg-error/10 border border-error/30 text-error rounded-md p-4">
                    <p className="font-medium">
                      There was a problem sending your message.
                    </p>
                    <p className="text-sm mt-1">
                      Please try again or contact us directly.
                    </p>
                    <button
                      className="btn btn-sm btn-ghost mt-3"
                      onClick={() => setFormStatus("idle")}
                    >
                      Try again
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit}>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                      <div>
                        <label
                          htmlFor="name"
                          className="block text-sm font-medium mb-1"
                        >
                          Name
                        </label>
                        <input
                          type="text"
                          id="name"
                          name="name"
                          value={formState.name}
                          onChange={handleChange}
                          className="input input-bordered w-full"
                          required
                        />
                      </div>
                      <div>
                        <label
                          htmlFor="email"
                          className="block text-sm font-medium mb-1"
                        >
                          Email
                        </label>
                        <input
                          type="email"
                          id="email"
                          name="email"
                          value={formState.email}
                          onChange={handleChange}
                          className="input input-bordered w-full"
                          required
                        />
                      </div>
                    </div>
                    <div className="mb-4">
                      <label
                        htmlFor="subject"
                        className="block text-sm font-medium mb-1"
                      >
                        Subject
                      </label>
                      <input
                        type="text"
                        id="subject"
                        name="subject"
                        value={formState.subject}
                        onChange={handleChange}
                        className="input input-bordered w-full"
                        required
                      />
                    </div>
                    <div className="mb-6">
                      <label
                        htmlFor="message"
                        className="block text-sm font-medium mb-1"
                      >
                        Message
                      </label>
                      <textarea
                        id="message"
                        name="message"
                        value={formState.message}
                        onChange={handleChange}
                        className="textarea textarea-bordered w-full h-36"
                        required
                      ></textarea>
                    </div>
                    <button
                      type="submit"
                      className={`btn btn-primary ${
                        formStatus === "submitting" ? "loading" : ""
                      }`}
                      disabled={formStatus === "submitting"}
                    >
                      {formStatus === "submitting" ? (
                        "Sending..."
                      ) : (
                        <>
                          Send Message <FiSend className="ml-2" />
                        </>
                      )}
                    </button>
                  </form>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;
