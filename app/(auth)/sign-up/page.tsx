import type { Metadata } from "next";
import Link from "next/link";
import AuthForm from "@/src/components/AuthForm";

export const metadata: Metadata = {
  title: "Create Account | Stride Collective",
};

export default function SignUpPage() {
  return (
    <AuthForm
      title="Join Nike Today!"
      subtitle="Create your account to start your fitness journey"
      fields={[
        {
          name: "fullName",
          label: "Full Name",
          placeholder: "Enter your full name",
          autoComplete: "name",
          required: true,
        },
        {
          name: "email",
          label: "Email",
          type: "email",
          placeholder: "johndoe@gmail.com",
          autoComplete: "email",
          required: true,
        },
        {
          name: "password",
          label: "Password",
          type: "password",
          placeholder: "minimum 8 characters",
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
              By continuing you agree to our{" "}
              <Link href="/terms" className="underline hover:text-dark-900">
                  Terms of Service
              </Link>{" "}
              and{" "}
              <Link href="/privacy" className="underline hover:text-dark-900">
                  Privacy Policy
              </Link>
              .
          </p>
      }
    />
  );
}
