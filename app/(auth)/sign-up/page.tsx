import type { Metadata } from "next";
import Link from "next/link";
import AuthForm from "@/src/components/AuthForm";

export const metadata: Metadata = {
  title: "Create Account | Stride Collective",
};

export default function SignUpPage() {
  return (
    <AuthForm
      title="Join Stride Collective"
      subtitle="Create an account to unlock tailored training plans and exclusive drops."
      fields={[
        {
          name: "fullName",
          label: "Full name",
          placeholder: "Enter your full name",
          autoComplete: "name",
          required: true,
        },
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
          placeholder: "Minimum 8 characters",
          autoComplete: "new-password",
          required: true,
        },
      ]}
      submitLabel="Sign Up"
      alternateAction={{
        prompt: "Already have an account?",
        href: "/sign-in",
        label: "Sign in",
      }}
      terms={
        <p>
          By signing up, you agree to our{" "}
          <Link href="/terms" className="font-medium text-dark-900 underline-offset-4 hover:underline">
            Terms of Service
          </Link>{" "}
          and acknowledge our{" "}
          <Link href="/privacy" className="font-medium text-dark-900 underline-offset-4 hover:underline">
            Privacy Policy
          </Link>
          .
        </p>
      }
    />
  );
}
