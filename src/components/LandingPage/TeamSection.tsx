import React from "react";
import Image from "next/image";
import { FiTwitter, FiLinkedin, FiGithub } from "react-icons/fi";

interface TeamMember {
  name: string;
  role: string;
  bio?: string;
  imageSrc: string;
  socialLinks?: {
    twitter?: string;
    linkedin?: string;
    github?: string;
    [key: string]: string | undefined;
  };
}

interface TeamSectionProps {
  title?: string;
  subtitle?: string;
  team?: TeamMember[];
  layout?: "grid" | "list";
}

const TeamSection: React.FC<TeamSectionProps> = ({
  title = "Meet Our Team",
  subtitle = "The passionate people behind our product",
  team: propTeam,
  layout = "grid",
}) => {
  const defaultTeam = [
    {
      name: "Alex Johnson",
      role: "CEO & Founder",
      bio: "Alex has over 15 years of experience in the industry and leads our company vision.",
      imageSrc: "https://i.pravatar.cc/300?img=11",
      socialLinks: {
        twitter: "https://twitter.com",
        linkedin: "https://linkedin.com",
      },
    },
    {
      name: "Sarah Williams",
      role: "CTO",
      bio: "Sarah oversees all technical aspects and guides our product development.",
      imageSrc: "https://i.pravatar.cc/300?img=12",
      socialLinks: {
        twitter: "https://twitter.com",
        linkedin: "https://linkedin.com",
        github: "https://github.com",
      },
    },
    {
      name: "Michael Chen",
      role: "Head of Design",
      bio: "Michael ensures our product delivers the best user experience possible.",
      imageSrc: "https://i.pravatar.cc/300?img=13",
      socialLinks: {
        linkedin: "https://linkedin.com",
        github: "https://github.com",
      },
    },
    {
      name: "Emily Rodriguez",
      role: "Lead Developer",
      bio: "Emily leads our engineering team and brings our product vision to life.",
      imageSrc: "https://i.pravatar.cc/300?img=14",
      socialLinks: {
        twitter: "https://twitter.com",
        github: "https://github.com",
      },
    },
  ];

  const team = propTeam || defaultTeam;

  const renderSocialIcons = (socialLinks?: TeamMember["socialLinks"]) => {
    if (!socialLinks) return null;

    return (
      <div className="flex gap-3 justify-center md:justify-start mt-2">
        {socialLinks.twitter && (
          <a
            href={socialLinks.twitter}
            target="_blank"
            rel="noopener noreferrer"
            className="text-base-content/70 hover:text-primary transition-colors"
          >
            <FiTwitter size={18} />
          </a>
        )}
        {socialLinks.linkedin && (
          <a
            href={socialLinks.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            className="text-base-content/70 hover:text-primary transition-colors"
          >
            <FiLinkedin size={18} />
          </a>
        )}
        {socialLinks.github && (
          <a
            href={socialLinks.github}
            target="_blank"
            rel="noopener noreferrer"
            className="text-base-content/70 hover:text-primary transition-colors"
          >
            <FiGithub size={18} />
          </a>
        )}
      </div>
    );
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

        {layout === "grid" ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
            {team.map((member, index) => (
              <div
                key={index}
                className="bg-base-100 rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow"
              >
                <div className="aspect-square relative">
                  <Image
                    src={member.imageSrc}
                    alt={member.name}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="p-6 text-center">
                  <h3 className="text-xl font-semibold">{member.name}</h3>
                  <p className="text-primary font-medium mb-2">{member.role}</p>
                  {member.bio && (
                    <p className="text-base-content/70 text-sm mb-4">
                      {member.bio}
                    </p>
                  )}
                  {renderSocialIcons(member.socialLinks)}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="max-w-4xl mx-auto space-y-8">
            {team.map((member, index) => (
              <div
                key={index}
                className="flex flex-col md:flex-row gap-6 bg-base-100 rounded-lg p-6 shadow-md"
              >
                <div className="flex-shrink-0">
                  <div className="w-32 h-32 rounded-full overflow-hidden mx-auto relative">
                    <Image
                      src={member.imageSrc}
                      alt={member.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-semibold">{member.name}</h3>
                  <p className="text-primary font-medium mb-3">{member.role}</p>
                  {member.bio && (
                    <p className="text-base-content/70 mb-4">{member.bio}</p>
                  )}
                  {renderSocialIcons(member.socialLinks)}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default TeamSection;
