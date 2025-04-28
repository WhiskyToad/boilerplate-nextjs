import React from "react";
import Link from "next/link";
import Image from "next/image";
import getSiteConfig from "@/utils/siteConfig";

const Hero: React.FC = () => {
  const config = getSiteConfig();
  const hero = config.get("landing.hero", {});

  return (
    <section className="hero min-h-[80vh] bg-base-200">
      <div className="hero-content flex-col lg:flex-row-reverse max-w-7xl mx-auto px-4 py-20">
        {hero.image && (
          <div className="lg:w-1/2">
            <Image
              src={hero.image}
              width={600}
              height={400}
              alt="Hero illustration"
              className="max-w-full rounded-lg shadow-2xl"
            />
          </div>
        )}
        <div className="lg:w-1/2 lg:pr-8">
          <h1 className="text-5xl font-bold">{hero.title}</h1>
          <p className="py-6 text-xl">{hero.subtitle}</p>
          <div className="flex flex-wrap gap-4">
            {hero.primaryCTA && (
              <Link href={hero.primaryCTA.url} className="btn btn-primary">
                {hero.primaryCTA.text}
              </Link>
            )}
            {hero.secondaryCTA && (
              <Link href={hero.secondaryCTA.url} className="btn btn-outline">
                {hero.secondaryCTA.text}
              </Link>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
