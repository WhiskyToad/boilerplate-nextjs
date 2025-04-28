import React from "react";
import Image from "next/image";

interface ClientLogosProps {
  title?: string;
  subtitle?: string;
  logos?: Array<{
    src: string;
    alt: string;
    width?: number;
    height?: number;
    href?: string;
  }>;
  grayscale?: boolean;
}

const ClientLogos: React.FC<ClientLogosProps> = ({
  title = "Trusted by Innovative Companies",
  subtitle = "Join hundreds of businesses that rely on our platform",
  logos: propLogos,
  grayscale = true,
}) => {
  const defaultLogos = [
    {
      src: "/logos/logo1.svg",
      alt: "Company 1",
      width: 120,
      height: 40,
      href: "#",
    },
    {
      src: "/logos/logo2.svg",
      alt: "Company 2",
      width: 120,
      height: 40,
      href: "#",
    },
    {
      src: "/logos/logo3.svg",
      alt: "Company 3",
      width: 120,
      height: 40,
      href: "#",
    },
    {
      src: "/logos/logo4.svg",
      alt: "Company 4",
      width: 120,
      height: 40,
      href: "#",
    },
    {
      src: "/logos/logo5.svg",
      alt: "Company 5",
      width: 120,
      height: 40,
      href: "#",
    },
  ];

  const logos = propLogos || defaultLogos;

  return (
    <section className="py-10 bg-base-200">
      <div className="container mx-auto px-4">
        {(title || subtitle) && (
          <div className="text-center mb-10">
            {title && <h2 className="text-2xl font-semibold mb-2">{title}</h2>}
            {subtitle && (
              <p className="text-base-content/70 text-lg">{subtitle}</p>
            )}
          </div>
        )}

        <div className="flex flex-wrap justify-center items-center gap-x-12 gap-y-8">
          {logos.map((logo, index) => (
            <div key={index} className="flex items-center justify-center">
              {logo.href ? (
                <a
                  href={logo.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="transition-opacity hover:opacity-80"
                >
                  <Image
                    src={logo.src}
                    alt={logo.alt}
                    width={logo.width || 120}
                    height={logo.height || 40}
                    className={`${
                      grayscale ? "grayscale hover:grayscale-0" : ""
                    } transition-all`}
                  />
                </a>
              ) : (
                <Image
                  src={logo.src}
                  alt={logo.alt}
                  width={logo.width || 120}
                  height={logo.height || 40}
                  className={`${
                    grayscale ? "grayscale hover:grayscale-0" : ""
                  } transition-all`}
                />
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ClientLogos;
