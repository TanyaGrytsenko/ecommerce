import Link from "next/link";
import type { InputHTMLAttributes, ReactNode } from "react";
import SocialProviders from "./SocialProviders";

type AuthFormField = {
  name: string;
  label: string;
  type?: InputHTMLAttributes<HTMLInputElement>["type"];
  placeholder?: string;
  autoComplete?: string;
  required?: boolean;
};

interface AuthFormProps {
  title: string;
  subtitle: string;
  fields: AuthFormField[];
  submitLabel: string;
  alternateAction: {
    prompt: string;
    href: string;
    label: string;
  };
  terms?: ReactNode;
}

export default function AuthForm({
  title,
  subtitle,
  fields,
  submitLabel,
  alternateAction,
  terms,
}: AuthFormProps) {
  return (
    <section aria-labelledby="auth-heading" className="space-y-8">
      <div className="space-y-3">
        <h1 id="auth-heading" className="text-heading-3 text-dark-900">
          {title}
        </h1>
        <p className="text-body text-dark-700">
          {subtitle}
        </p>
      </div>

      <SocialProviders />

      <div className="flex items-center gap-4 text-caption text-dark-500">
        <span className="h-px flex-1 bg-light-300" aria-hidden />
        <span>Or continue with email</span>
        <span className="h-px flex-1 bg-light-300" aria-hidden />
      </div>

      <form className="space-y-4" noValidate>
        {fields.map((field) => (
          <div key={field.name} className="space-y-2">
            <label htmlFor={field.name} className="text-caption text-dark-700">
              {field.label}
            </label>
            <input
              id={field.name}
              name={field.name}
              type={field.type ?? "text"}
              placeholder={field.placeholder}
              autoComplete={field.autoComplete}
              required={field.required}
              className="w-full rounded-xl border border-light-300 bg-light-100 px-4 py-3 text-body text-dark-900 placeholder:text-dark-500 focus:border-dark-900 focus:outline-none focus:ring-2 focus:ring-dark-900/10"
            />
          </div>
        ))}

        <button
          type="submit"
          className="w-full rounded-xl bg-dark-900 px-4 py-3 text-body-medium text-light-100 transition hover:bg-dark-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-dark-900"
        >
          {submitLabel}
        </button>
      </form>

      {terms ? <div className="text-footnote text-dark-500">{terms}</div> : null}

      <p className="text-body text-dark-700">
        {alternateAction.prompt}{" "}
        <Link
          href={alternateAction.href}
          className="font-medium text-dark-900 underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-dark-900"
        >
          {alternateAction.label}
        </Link>
      </p>
    </section>
  );
}
