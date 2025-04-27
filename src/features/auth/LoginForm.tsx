import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { supabase } from "@/features/supabase/client";
import { useLogin } from "@/features/auth/useLogin";
import { useSignup } from "@/features/auth/useSignup";
import Image from "next/image";
import { useAuthStore } from "../store/authStore";
import Link from "next/link";
import posthog from "posthog-js";

interface LoginFormProps {
  title?: string;
  description?: string;
  onLoginComplete?: () => void;
}

interface FormData {
  email: string;
  password: string;
  acceptTerms: boolean;
}

export function LoginForm({
  title = "Welcome Back",
  description = "Log in or sign up to continue",
  onLoginComplete,
}: LoginFormProps) {
  const { login } = useLogin();
  const { signup } = useSignup();
  const { setSession, user } = useAuthStore();
  const [isSignup, setIsSignup] = useState(false);
  const [verificationEmailSent, setVerificationEmailSent] = useState(false);
  const [signupEmail, setSignupEmail] = useState(""); // Store email for verification message

  const hasTriggeredCallback = useRef(false); // Prevents multiple calls

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    reset,
  } = useForm<FormData>({
    defaultValues: {
      email: "",
      password: "",
      acceptTerms: false,
    },
  });

  const acceptTerms = watch("acceptTerms");

  // Track form view when component mounts or when switching tabs
  useEffect(() => {
    posthog.capture("auth_form_view", { is_signup: isSignup });
  }, [isSignup]);

  useEffect(() => {
    if (!user) return;
    const { data: authListener } = supabase.auth.onAuthStateChange(
      (_event, newSession) => {
        setSession(newSession);

        if (newSession && onLoginComplete && !hasTriggeredCallback.current) {
          hasTriggeredCallback.current = true; // Ensure it only runs once
          onLoginComplete();
        }
      }
    );

    return () => {
      authListener?.subscription.unsubscribe();
    };
  }, [setSession, onLoginComplete, user]);

  const handleLogin = async (data: FormData) => {
    posthog.capture("login_attempt"); // Track login attempt
    await login({
      email: data.email,
      password: data.password,
    });
  };

  const handleSignup = async (data: FormData) => {
    if (!data.acceptTerms) {
      posthog.capture("signup_blocked", { reason: "terms_not_accepted" });
      return; // Prevent signup if terms not accepted
    }

    posthog.capture("signup_attempt"); // Track signup attempt
    setSignupEmail(data.email);

    const response = await signup({
      email: data.email,
      password: data.password,
    });

    // Check if signup was successful but needs email verification
    if (response?.data.user && !response.data.session) {
      posthog.capture("signup_verification_required", { email: data.email }); // Track verification needed
      setVerificationEmailSent(true);
      reset();
    } else if (response?.error) {
      posthog.capture("signup_failure", {
        error_message: response.error.message,
      }); // Track failure
    }
  };

  const handleOAuthLogin = async (
    provider: "facebook" | "github" | "google"
  ) => {
    posthog.capture("oauth_attempt", { provider }); // Track OAuth attempt
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider,
      options: {
        skipBrowserRedirect: true, // Prevent full-page redirect
      },
    });

    if (error) {
      posthog.capture("oauth_failure", {
        provider,
        error_message: error.message,
      }); // Track failure
      console.error("Login failed:", error.message);
    } else if (data?.url) {
      // Open a popup for authentication
      const authWindow = window.open(
        data.url,
        "_blank",
        "width=500,height=600"
      );

      // Poll for login completion
      const checkAuth = setInterval(async () => {
        const {
          data: { session },
        } = await supabase.auth.getSession();
        if (session) {
          authWindow?.close();
          clearInterval(checkAuth);
          setSession(session);
        }
      }, 1000);
    }
  };

  // Reset verification message and track tab switch
  useEffect(() => {
    setVerificationEmailSent(false);
  }, [isSignup]);

  const handleTabClick = (signupTab: boolean) => {
    if (signupTab !== isSignup) {
      posthog.capture(signupTab ? "switch_to_signup" : "switch_to_login");
      setIsSignup(signupTab);
    }
  };

  return (
    <div className="flex flex-col w-full max-w-md p-6 mx-auto gap-4">
      <h2 className="text-3xl font-bold text-center text-primary-800">
        {title}
      </h2>
      <p className="text-sm text-center text-primary-500">{description}</p>

      {/* Email verification alert */}
      {verificationEmailSent && (
        <div
          className="bg-success/10 border border-success text-success px-4 py-3 rounded-md shadow-sm"
          role="alert"
        >
          <div className="flex">
            <div className="py-1">
              <svg
                className="fill-current h-6 w-6 text-success mr-4"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
              >
                <path d="M2.93 17.07A10 10 0 1 1 17.07 2.93 10 10 0 0 1 2.93 17.07zm12.73-1.41A8 8 0 1 0 4.34 4.34a8 8 0 0 0 11.32 11.32zM9 11V9h2v6H9v-4zm0-6h2v2H9V5z" />
              </svg>
            </div>
            <div>
              <p className="font-bold">Check your inbox!</p>
              <p className="text-sm">
                We&apos;ve sent a verification email to{" "}
                <span className="font-semibold">{signupEmail}</span>. Please
                check your email and click the verification link to continue.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Tab navigation for login/signup */}
      <div className="flex w-full rounded-lg overflow-hidden border border-gray-200 mb-2 shadow-sm">
        <button
          className={`flex-1 py-3 text-center font-medium text-lg transition-colors ${
            !isSignup
              ? "bg-primary text-white"
              : "bg-gray-50 text-primary-700 hover:bg-gray-100"
          }`}
          onClick={() => handleTabClick(false)}
        >
          Login
        </button>
        <button
          className={`flex-1 py-3 text-center font-medium text-lg transition-colors ${
            isSignup
              ? "bg-primary text-white"
              : "bg-gray-50 text-primary-700 hover:bg-gray-100"
          }`}
          onClick={() => handleTabClick(true)}
        >
          Sign Up
        </button>
      </div>

      <form
        className="space-y-4"
        onSubmit={handleSubmit(isSignup ? handleSignup : handleLogin)}
      >
        <div>
          <label
            htmlFor="email"
            className="block text-sm font-medium text-primary-700"
          >
            Email:
          </label>
          <input
            placeholder="Enter your email"
            id="email"
            type="email"
            {...register("email", { required: "Email is required" })}
            className="w-full px-3 py-2 mt-1 text-black border rounded-md focus:outline-none focus:ring focus:ring-indigo-300"
          />
          {errors.email && (
            <p className="text-sm text-red-500">{errors.email.message}</p>
          )}
        </div>
        <div>
          <label
            htmlFor="password"
            className="block text-sm font-medium text-primary-700"
          >
            Password:
          </label>
          <input
            id="password"
            type="password"
            placeholder="Enter your password"
            {...register("password", {
              required: "Password is required",
              minLength: {
                value: 8,
                message: "Password must be at least 8 characters long",
              },
            })}
            className="w-full px-3 text-black py-2 mt-1 border rounded-md focus:outline-none focus:ring focus:ring-indigo-300"
          />
          {errors.password && (
            <p className="text-sm text-red-500">{errors.password.message}</p>
          )}
          <p className="text-sm text-primary-500 mt-2">
            {isSignup
              ? "Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, one number, and one special character."
              : ""}
          </p>
        </div>

        {/* Terms and Conditions checkbox - only show for signup */}
        {isSignup && (
          <div className="flex items-start">
            <div className="flex items-center h-5">
              <input
                id="acceptTerms"
                type="checkbox"
                {...register("acceptTerms", {
                  required: "You must accept the terms and conditions",
                })}
                className="checkbox checkbox-primary checkbox-sm"
              />
            </div>
            <div className="ml-3 text-sm">
              <label htmlFor="acceptTerms" className="text-primary-700">
                I agree to the{" "}
                <Link
                  href="/terms"
                  className="text-primary hover:underline"
                  target="_blank"
                >
                  Terms and Conditions
                </Link>{" "}
                and{" "}
                <Link
                  href="/privacy"
                  className="text-primary hover:underline"
                  target="_blank"
                >
                  Privacy Policy
                </Link>
              </label>
              {errors.acceptTerms && (
                <p className="text-sm text-red-500">
                  {errors.acceptTerms.message}
                </p>
              )}
            </div>
          </div>
        )}

        <button
          type="submit"
          className="btn btn-primary w-full"
          disabled={isSignup && !acceptTerms}
        >
          {isSignup ? "Sign Up" : "Login"}
        </button>
      </form>

      <div className="relative my-4">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-gray-300"></div>
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="px-2 bg-white text-primary-500">
            Or continue with
          </span>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-3">
        <button
          onClick={() => handleOAuthLogin("google")}
          className="flex cursor-pointer items-center justify-center px-4 py-2 text-sm font-medium text-primary-700 bg-gray-100 border rounded hover:bg-gray-200"
        >
          <Image
            src="https://www.svgrepo.com/show/355037/google.svg"
            alt="Google"
            width={20}
            height={20}
            className="w-5 h-5 mr-2"
          />
          Google
        </button>
        <button
          onClick={() => handleOAuthLogin("facebook")}
          className="flex cursor-pointer items-center justify-center px-4 py-2 text-sm font-medium text-primary-700 bg-gray-100 border rounded hover:bg-gray-200"
        >
          <Image
            src="https://www.svgrepo.com/show/157810/facebook.svg"
            alt="Facebook"
            width={20}
            height={20}
            className="w-5 h-5 mr-2"
          />
          Facebook
        </button>
        <button
          onClick={() => handleOAuthLogin("github")}
          className="flex cursor-pointer items-center justify-center px-4 py-2 text-sm font-medium text-primary-700 bg-gray-100 border rounded hover:bg-gray-200"
        >
          <Image
            src="https://www.svgrepo.com/show/341847/github.svg"
            alt="GitHub"
            width={20}
            height={20}
            className="w-5 h-5 mr-2"
          />
          GitHub
        </button>
      </div>

      {/* Footer with links to terms and privacy */}
      <div className="text-xs text-center text-primary-500 mt-6">
        By using Boost Toad, you agree to our{" "}
        <Link href="/terms" className="text-primary hover:underline">
          Terms of Service
        </Link>{" "}
        and{" "}
        <Link href="/privacy" className="text-primary hover:underline">
          Privacy Policy
        </Link>
      </div>
    </div>
  );
}
