import type { Metadata } from "next";
import Link from "next/link";
import AuthForm from "@/src/components/AuthForm";

export const metadata: Metadata = {
  title: "Sign In | Stride Collective",
};

export default function SignInPage() {
  return (
    <AuthForm
      title="Welcome back"
      subtitle="Sign in to track your training milestones and manage your gear."
      fields={[
        {
          name: "email",
          label: "Email address",
          type: "email",
          placeholder: "you@example.com",
          autoComplete: "email",
          required: true,
        },
        {
          name: "password",
          label: "Password",
          type: "password",
          placeholder: "Enter your password",
          autoComplete: "current-password",
          required: true,
        },
      ]}
      submitLabel="Sign In"
      alternateAction={{
        prompt: "New to Stride Collective?",
        href: "/sign-up",
        label: "Create an account",
      }}
      terms={
        <p>
          By continuing you agree to our{" "}
          <Link href="/terms" className="font-medium text-dark-900 underline-offset-4 hover:underline">
            Terms of Service
          </Link>{" "}
          and{" "}
          <Link href="/privacy" className="font-medium text-dark-900 underline-offset-4 hover:underline">
            Privacy Policy
          </Link>
          .
        </p>
      }
    />
  );
}
