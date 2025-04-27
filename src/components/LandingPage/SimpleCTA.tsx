import React from "react";
import { useRouter } from "next/router";
import Image from "next/image";

const SimpleCTA = ({ onCtaClick }: { onCtaClick?: () => void }) => {
  const router = useRouter();

  return (
    <section className="py-16 bg-base-100">
      <div className="container mx-auto px-4 text-center max-w-3xl">
        <div className="flex items-center justify-center mb-6">
          <div className="w-24 h-24 relative">
            <Image
              src="/logo/icon.png"
              alt="Boost Toad"
              width={96}
              height={96}
              className="object-contain"
            />
          </div>
        </div>
        <h2 className="text-3xl font-bold mb-4">
          Ready to Build Your Next Big Thing?
        </h2>
        <p className="mb-8 text-lg text-base-content/70">
          Get the support you need to transform your concept into a launched
          product in less time.
        </p>
        <button
          className="btn btn-primary btn-lg"
          onClick={() => {
            onCtaClick?.();
            router.push("/create-project");
          }}
        >
          Start Your Project Now
        </button>
      </div>
    </section>
  );
};

export default SimpleCTA;
