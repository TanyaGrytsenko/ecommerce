import type { Metadata } from "next";
import Link from "next/link";
import AuthForm from "@/src/components/AuthForm";

export const metadata: Metadata = {
  title: "Sign In | Stride Collective",
};

export default function SignInPage() {
  return (
    <AuthForm
      title="Join Nike Today!"
      subtitle="Create your account to start your fitness journey"
      fields={[{
              name: "fullName",
              label: "Full Name",
              type: "text",
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
          autoComplete: "current-password",
          required: true,
        },
      ]}
      submitLabel="Sign In"
      alternateAction={{
        prompt: "Already have an account?",
        href: "/sign-up",
        label: "Sign Up",
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
