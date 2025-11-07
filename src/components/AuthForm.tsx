"use client";

import Link from "next/link";
import type { InputHTMLAttributes, ReactNode } from "react";
import { useState } from "react";
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
    const [showPassword, setShowPassword] = useState(false);

    return (
        <section aria-labelledby="auth-heading" className="space-y-2">
            <div className="text-center">
                <p className="text-body text-dark-700">
                    {alternateAction.prompt}{" "}
                    <Link
                        href={alternateAction.href}
                        className=" text-body-medium underline text-dark-900"
                    >
                        {alternateAction.label}
                    </Link>
                </p>
                <h1 id="auth-heading" className="mt-3 text-heading-3 text-dark-900">
                    {title}
                </h1>
                <p className="mt-1 text-body text-dark-700">{subtitle}</p>
            </div>

            <SocialProviders />

            <div className="flex items-center gap-3">
                <hr className="h-px w-full border-0 bg-light-300" />
                <span className="shrink-0 text-caption text-dark-700">
                   Or sign up with
                </span>
                <hr className="h-px w-full border-0 bg-light-300" />
            </div>

            <form className="space-y-3" noValidate>
                {fields.map((field) => {
                    const isPassword = field.type === "password";

                    return (
                        <div key={field.name} className="space-y-1">
                            <label
                                htmlFor={field.name}
                                className="text-caption text-dark-900"
                            >
                                {field.label}
                            </label>

                            {isPassword ? (
                                <div className="relative">
                                    <input
                                        id={field.name}
                                        name={field.name}
                                        type={showPassword ? "text" : "password"}
                                        placeholder={field.placeholder}
                                        autoComplete={field.autoComplete}
                                        required={field.required}
                                        className="w-full rounded-xl border border-light-300 bg-light-100 px-4 py-3 pr-16 text-body text-dark-900 placeholder:text-dark-500 focus:outline-none focus:ring-2 focus:ring-dark-900/10"
                                    />

                                    <button
                                        type="button"
                                        className="absolute inset-y-0 right-0 flex items-center px-3 text-dark-900"
                                        onClick={() => setShowPassword((v) => !v)}
                                        aria-label={showPassword ? "Hide password" : "Show password"}
                                    >
                                        {showPassword ? (
                                            // закрите око
                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                                                 stroke-width="1.5" stroke="currentColor" className="size-4">
                                                <path strokeLinecap="round" strokeLinejoin="round"
                                                      d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z"/>
                                                <path strokeLinecap="round" strokeLinejoin="round"
                                                      d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"/>
                                            </svg>

                                        ) : (
                                            // відкрите око
                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                                                 stroke-width="1.5" stroke="currentColor" className="size-4">
                                                <path strokeLinecap="round" strokeLinejoin="round"
                                                      d="M3.98 8.223A10.477 10.477 0 0 0 1.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.451 10.451 0 0 1 12 4.5c4.756 0 8.773 3.162 10.065 7.498a10.522 10.522 0 0 1-4.293 5.774M6.228 6.228 3 3m3.228 3.228 3.65 3.65m7.894 7.894L21 21m-3.228-3.228-3.65-3.65m0 0a3 3 0 1 0-4.243-4.243m4.242 4.242L9.88 9.88"/>
                                            </svg>

                                        )}
                                    </button>
                                </div>
                            ) : (
                                <input
                                    id={field.name}
                                    name={field.name}
                                    type={field.type ?? "text"}
                                    placeholder={field.placeholder}
                                    autoComplete={field.autoComplete}
                                    required={field.required}
                                    className="w-full rounded-xl border border-light-300 bg-light-100 px-4 py-3 text-body text-dark-900 placeholder:text-dark-500 focus:outline-none focus:ring-2 focus:ring-dark-900/10"
                                />
                            )}
                        </div>
                    );
                })}

                <button
                    type="submit"
                    className="mt-2 w-full rounded-full bg-dark-900 px-6 py-3 text-body-medium text-light-100 hover:bg-dark-700 focus:outline-none focus:ring-2 focus:ring-dark-900/20"
                >
                    {submitLabel}
                </button>
            </form>

            {terms ? (
                <div className="text-center text-footnote text-dark-700">{terms}</div>
            ) : null}
        </section>
    );
}
