"use client";

import { useId, useState } from "react";
import type { ReactNode } from "react";

import { ChevronDown } from "lucide-react";

interface CollapsibleSectionProps {
  title: string;
  children: ReactNode;
  defaultOpen?: boolean;
}

export default function CollapsibleSection({
  title,
  children,
  defaultOpen = false,
}: CollapsibleSectionProps) {
  const sectionId = useId();
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <section className="border-t border-light-300 pt-6">
      <button
        type="button"
        onClick={() => setIsOpen((value) => !value)}
        className="flex w-full items-center justify-between gap-4 text-left text-heading-3 text-dark-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--color-dark-900)]"
        aria-expanded={isOpen}
        aria-controls={`${sectionId}-content`}
      >
        <span>{title}</span>
        <ChevronDown
          className={`h-5 w-5 transition-transform ${isOpen ? "rotate-180" : "rotate-0"}`}
          aria-hidden
        />
      </button>

      <div
        id={`${sectionId}-content`}
        className={`grid transition-[grid-template-rows] duration-300 ease-in-out ${
          isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
        }`}
      >
        <div className="overflow-hidden pt-4 text-body text-dark-700">
          {children}
        </div>
      </div>
    </section>
  );
}
