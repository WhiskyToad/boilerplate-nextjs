import { useRouter } from "next/router";
import Link from "next/link";
import Image from "next/image";
import { useAuthStore } from "@/features/store/authStore";
import { supabase } from "@/features/supabase/client";
import { useProjectTitles } from "@/features/services/Projects/useProjectTitles";
import { useProjectFormById } from "@/features/services/Projects/useProjectFormById";
import { useState, useEffect } from "react";
import {
  FiUser,
  FiLogOut,
  FiBookOpen,
  FiUsers,
  FiArrowRight,
} from "react-icons/fi";
import posthog from "posthog-js";

const Header = () => {
  const router = useRouter();
  const { user } = useAuthStore();
  const { data: projectTitles, isLoading } = useProjectTitles();

  // Extract project ID from URL if available
  const [activeProjectId, setActiveProjectId] = useState<string | null>(null);
  const { data: activeProject } = useProjectFormById(activeProjectId || "");

  // Update active project when route changes
  useEffect(() => {
    const pathParts = router.asPath.split("/");
    const projectIdIdx = pathParts.indexOf("projects") + 1;

    if (projectIdIdx > 0 && projectIdIdx < pathParts.length) {
      const potentialId = pathParts[projectIdIdx];
      if (potentialId !== "create" && potentialId.length > 0) {
        setActiveProjectId(potentialId);
      } else {
        setActiveProjectId(null);
      }
    } else {
      setActiveProjectId(null);
    }
  }, [router.asPath]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    posthog.reset(); // Reset PostHog user identification on logout
    router.push("/login"); // Redirect to login page
  };

  const onSelectProject = (projectId: string) => {
    if (projectId === "all") {
      router.push("/projects");
    } else {
      router.push(`/projects/${projectId}`);
    }
  };

  const isProjectPage = router.asPath.includes("/projects/") && activeProjectId;

  const handlePrimaryCTA = () => {
    posthog.capture("cta_clicked", {
      cta_text: "Generate Free Blueprint",
      location: "header_primary",
    });
    router.push("/create-project");
  };

  return (
    <>
      <div className="bg-base-100/90 text-base-content sticky top-0 z-30 flex h-16 w-full [transform:translate3d(0,0,0)] justify-center backdrop-blur transition-shadow duration-100 print:hidden">
        <nav className="navbar w-full">
          {/* Logo section */}
          <Link
            href="/"
            className="flex-1 flex-row flex items-center pl-4 cursor-pointer"
          >
            <div className="w-10 h-10 relative">
              <Image
                src="/logo/icon.png"
                alt="Boost Toad"
                width={40}
                height={40}
                priority
                className="object-contain"
              />
            </div>
            <h1 className="text-xl font-bold ml-2 hidden md:block">
              Boost Toad
            </h1>
          </Link>

          {/* Active Project Indicator (if on project page) */}
          {isProjectPage && activeProject && (
            <div className="flex-1 hidden md:flex">
              <div className="breadcrumbs text-sm">
                <ul>
                  <li>
                    <Link href="/projects">Projects</Link>
                  </li>
                  <li>
                    <Link href={`/projects/${activeProjectId}`}>
                      {activeProject.title}
                    </Link>
                  </li>
                </ul>
              </div>
            </div>
          )}

          <div className="flex-none flex items-center pr-4">
            {/* Learn Links - Visible only when logged in */}
            {user && (
              <>
                <Link href="/learn/lean-canvas" legacyBehavior>
                  <a className="btn btn-ghost mr-2 hidden md:flex items-center gap-1">
                    <FiBookOpen size={16} />
                    <span>Lean Canvas</span>
                  </a>
                </Link>
                <Link href="/learn/four-c-framework" legacyBehavior>
                  <a className="btn btn-ghost mr-2 hidden md:flex items-center gap-1">
                    <FiUsers size={16} />
                    <span>4C Framework</span>
                  </a>
                </Link>
                {/* Mobile Learn Links */}
                <Link href="/learn/lean-canvas" legacyBehavior>
                  <a className="btn btn-ghost btn-sm mr-1 md:hidden">
                    <FiBookOpen size={18} />
                  </a>
                </Link>
                <Link href="/learn/four-c-framework" legacyBehavior>
                  <a className="btn btn-ghost btn-sm mr-1 md:hidden">
                    <FiUsers size={18} />
                  </a>
                </Link>
              </>
            )}

            {/* Projects Dropdown - Visible only when logged in */}
            {user && (
              <div className="dropdown dropdown-end">
                <div tabIndex={0} role="button" className="btn btn-ghost">
                  <span className="hidden md:inline mr-2">Projects</span>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    className="w-4 h-4 stroke-current"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M6 9l6 6 6-6"
                    ></path>
                  </svg>
                </div>
                <ul
                  tabIndex={0}
                  className="dropdown-content menu p-2 shadow bg-base-100 rounded-box w-52 z-50"
                >
                  <li className="menu-title">
                    <span>Your Projects</span>
                  </li>
                  {isLoading ? (
                    <li>
                      <span className="opacity-70">Loading...</span>
                    </li>
                  ) : projectTitles && projectTitles.length > 0 ? (
                    projectTitles.map((project) => (
                      <li key={project.id}>
                        <button
                          className={`w-full text-left ${
                            activeProjectId === project.id
                              ? "active font-medium"
                              : ""
                          }`}
                          onClick={() => onSelectProject(project.id)}
                        >
                          {project.title}
                        </button>
                      </li>
                    ))
                  ) : (
                    <li>
                      <span className="opacity-70">No projects yet</span>
                    </li>
                  )}
                  <li className="menu-title pt-2">
                    <span>Options</span>
                  </li>
                  <li>
                    <Link href="/projects" className="font-medium">
                      View All Projects
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/create-project"
                      className="font-medium text-primary"
                    >
                      + Create Project
                    </Link>
                  </li>
                </ul>
              </div>
            )}

            {/* Simplified Logged Out Buttons with Clear Hierarchy */}
            {!user && (
              <>
                {/* Learn link - consistent button size */}
                <Link href="/learn/lean-canvas" legacyBehavior>
                  <a className="btn btn-ghost mr-3 hidden md:flex">Learn</a>
                </Link>

                {/* Pricing link - secondary importance */}
                <Link
                  href="/pricing"
                  className="btn btn-ghost mr-3 hidden md:flex"
                >
                  Pricing
                </Link>

                {/* Login link - tertiary action */}
                <Link
                  href="/login"
                  className="btn btn-ghost mr-4 hidden md:flex"
                >
                  Login
                </Link>

                {/* Primary CTA - Generate Free Blueprint */}
                <button
                  className="btn btn-primary btn-md flex items-center gap-1 group"
                  onClick={handlePrimaryCTA}
                >
                  <span>Create free project</span>
                  <FiArrowRight className="transition-transform group-hover:translate-x-1" />
                </button>

                {/* Mobile simplified menu */}
                <div className="dropdown dropdown-end md:hidden">
                  <div
                    tabIndex={0}
                    role="button"
                    className="btn btn-ghost btn-sm"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      className="inline-block w-5 h-5 stroke-current"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M4 6h16M4 12h16M4 18h16"
                      ></path>
                    </svg>
                  </div>
                  <ul
                    tabIndex={0}
                    className="menu dropdown-content mt-3 z-[1] p-2 shadow bg-base-100 rounded-box w-52"
                  >
                    <li>
                      <Link href="/learn/lean-canvas">Learn</Link>
                    </li>
                    <li>
                      <Link href="/pricing">Pricing</Link>
                    </li>
                    <li>
                      <Link href="/login">Login</Link>
                    </li>
                    <li className="mt-2">
                      <button
                        onClick={handlePrimaryCTA}
                        className="bg-primary text-primary-content"
                      >
                        Generate Free Blueprint
                      </button>
                    </li>
                  </ul>
                </div>
              </>
            )}

            {/* User Avatar Dropdown - Visible only when logged in */}
            {user && (
              <div className="dropdown dropdown-end ml-2">
                <div
                  tabIndex={0}
                  role="button"
                  className="btn btn-ghost btn-circle avatar"
                >
                  <div className="w-10 h-10 rounded-full flex items-center justify-center bg-base-300 text-base-content content-center">
                    <FiUser size={24} className="mx-auto" />
                  </div>
                </div>
                <ul
                  tabIndex={0}
                  className="dropdown-content menu p-2 shadow bg-base-100 rounded-box w-52 mt-2"
                >
                  <li>
                    <Link href="/account" className="flex items-center gap-2">
                      <FiUser size={16} />
                      <span>Account Settings</span>
                    </Link>
                  </li>
                  <li>
                    <button
                      onClick={handleLogout}
                      className="flex items-center gap-2"
                    >
                      <FiLogOut size={16} />
                      <span>Logout</span>
                    </button>
                  </li>
                </ul>
              </div>
            )}
          </div>
        </nav>
      </div>
    </>
  );
};

export default Header;
