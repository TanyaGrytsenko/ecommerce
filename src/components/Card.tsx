import Image from 'next/image';
import Link from 'next/link';
import type { ReactNode } from 'react';

export type CardAccent = 'green' | 'orange' | 'red' | 'dark';

export interface CardProps {
  title: string;
  description: string;
  imageSrc: string;
  imageAlt: string;
  badge?: string;
  price?: string;
  href?: string;
  accent?: CardAccent;
  actionLabel?: string;
  footerContent?: ReactNode;
}

const ACCENT_STYLES: Record<CardAccent, string> = {
  green: 'text-[color:var(--color-green)]',
  orange: 'text-[color:var(--color-orange)]',
  red: 'text-[color:var(--color-red)]',
  dark: 'text-[color:var(--color-dark-900)]',
};

export default function Card({
  title,
  description,
  imageSrc,
  imageAlt,
  badge,
  price,
  href,
  accent = 'dark',
  actionLabel = 'Shop now',
  footerContent,
}: CardProps) {
  const content = (
    <article className="flex h-full flex-col overflow-hidden rounded-3xl border border-[var(--color-light-300)] bg-[var(--color-light-100)] shadow-sm transition-transform duration-200 hover:-translate-y-1">
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-[var(--color-light-200)]">
        <Image
          src={imageSrc}
          alt={imageAlt}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 360px"
          className="object-contain"
          priority={false}
        />
        {badge ? (
          <span className="absolute left-4 top-4 rounded-full bg-[var(--color-light-100)] px-3 py-1 text-xs font-medium text-[color:var(--color-orange)] shadow">
            {badge}
          </span>
        ) : null}
      </div>

      <div className="flex flex-1 flex-col gap-3 px-6 py-6 font-[family:var(--font-jost)]">
        <div className="flex items-start justify-between gap-4">
          <h3 className="text-[length:var(--text-heading-3)] font-medium leading-[var(--text-heading-3--line-height)] text-[color:var(--color-dark-900)]">
            {title}
          </h3>
          {price ? (
            <span className={`text-sm font-semibold ${ACCENT_STYLES[accent]}`}>
              {price}
            </span>
          ) : null}
        </div>

        <p className="text-sm leading-relaxed text-[color:var(--color-dark-700)]">
          {description}
        </p>

        <div className="mt-auto flex items-center justify-between gap-4 pt-2">
          <span className={`text-sm font-medium uppercase tracking-wide ${ACCENT_STYLES[accent]}`}>
            {actionLabel}
          </span>
          <svg
            className={`h-5 w-5 ${ACCENT_STYLES[accent]}`}
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
          >
            <path
              d="M5 12h14M13 6l6 6-6 6"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>

        {footerContent ? (
          <div className="pt-4 text-xs text-[color:var(--color-dark-500)]">
            {footerContent}
          </div>
        ) : null}
      </div>
    </article>
  );

  if (href) {
    return (
      <Link href={href} className="block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--color-dark-900)]">
        {content}
      </Link>
    );
  }

  return content;
}
