import React from "react";
import { useRouter } from "next/router";
import Image from "next/image";

interface SimpleCTAProps {
  title?: string;
  description?: string;
  buttonText?: string;
  buttonLink?: string;
  logoSrc?: string;
  onCtaClick?: () => void;
}

const SimpleCTA: React.FC<SimpleCTAProps> = ({
  title = "Ready to Get Started?",
  description = "Get the support you need to transform your concept into reality.",
  buttonText = "Start Your Project Now",
  buttonLink = "/create-project",
  logoSrc = "/logo/icon.png",
  onCtaClick,
}) => {
  const router = useRouter();

  const handleClick = () => {
    onCtaClick?.();
    router.push(buttonLink);
  };

  return (
    <section className="py-16 bg-base-100">
      <div className="container mx-auto px-4 text-center max-w-3xl">
        {logoSrc && (
          <div className="flex items-center justify-center mb-6">
            <div className="w-24 h-24 relative">
              <Image
                src={logoSrc}
                alt="Logo"
                width={96}
                height={96}
                className="object-contain"
              />
            </div>
          </div>
        )}
        <h2 className="text-3xl font-bold mb-4">{title}</h2>
        <p className="mb-8 text-lg text-base-content/70">{description}</p>
        <button className="btn btn-primary btn-lg" onClick={handleClick}>
          {buttonText}
        </button>
      </div>
    </section>
  );
};

export default SimpleCTA;
