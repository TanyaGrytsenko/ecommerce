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
    <article className="group rounded-xl bg-light-100 ring-1 ring-light-300 transition-colors hover:ring-dark-500">
      <div className="relative aspect-square overflow-hidden rounded-t-xl bg-light-200">
        <Image
          src={imageSrc}
          alt={imageAlt}
          fill
          sizes="(min-width: 1280px) 360px, (min-width: 1024px) 300px, (min-width: 640px) 45vw, 90vw"
          className="object-cover transition-transform duration-300 group-hover:scale-105"
          priority={false}
        />
        {badge ? (
          <span className="absolute left-4 top-4 rounded-full bg-light-100 px-3 py-1 text-xs font-medium text-[color:var(--color-orange)] shadow">
            {badge}
          </span>
        ) : null}
      </div>

      <div className="flex flex-1 flex-col gap-3 px-6 py-6 font-[family:var(--font-jost)]">
        <div className="flex items-start justify-between gap-4">
          <h3 className="text-heading-3 text-dark-900">
            {title}
          </h3>
          {price ? (
            <span className={`text-body-medium text-dark-900`}>
              {price}
            </span>
          ) : null}
        </div>

        <p className="text-body text-dark-700">
          {description}
        </p>

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
