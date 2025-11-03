import Image from 'next/image';
import Link from 'next/link';

interface FooterLink {
  label: string;
  href: string;
}

interface FooterSection {
  title: string;
  links: FooterLink[];
}

export interface FooterProps {
  sections?: FooterSection[];
  socialLinks?: FooterLink[];
}

const DEFAULT_SECTIONS: FooterSection[] = [
  {
    title: 'Featured',
    links: [
      { label: 'Air Force 1', href: '/featured/air-force-1' },
      { label: 'Huarache', href: '/featured/huarache' },
      { label: 'Air Max 90', href: '/featured/air-max-90' },
      { label: 'Air Max 95', href: '/featured/air-max-95' },
    ],
  },
  {
    title: 'Shoes',
    links: [
      { label: 'All Shoes', href: '/shoes/all' },
      { label: 'Custom Shoes', href: '/shoes/custom' },
      { label: 'Jordan Shoes', href: '/shoes/jordan' },
      { label: 'Running Shoes', href: '/shoes/running' },
    ],
  },
  {
    title: 'Clothing',
    links: [
      { label: 'All Clothing', href: '/clothing/all' },
      { label: 'Modest Wear', href: '/clothing/modest' },
      { label: 'Hoodies & Pullovers', href: '/clothing/hoodies' },
      { label: 'Shirts & Tops', href: '/clothing/tops' },
    ],
  },
  {
    title: "Kids'",
    links: [
      { label: 'Infant & Toddler Shoes', href: '/kids/infant-toddler' },
      { label: "Kids' Shoes", href: '/kids/shoes' },
      { label: "Kids' Jordan", href: '/kids/jordan' },
      { label: 'Kids Basketball Shoes', href: '/kids/basketball' },
    ],
  },
];

const DEFAULT_SOCIAL: FooterLink[] = [
  { label: 'Instagram', href: 'https://instagram.com/nike' },
  { label: 'Facebook', href: 'https://facebook.com/nike' },
  { label: 'X', href: 'https://x.com/nike' },
];

const SOCIAL_ICON_MAP: Record<string, string> = {
  Instagram: '/instagram.svg',
  Facebook: '/facebook.svg',
  X: '/x.svg',
};

export default function Footer({
  sections = DEFAULT_SECTIONS,
  socialLinks = DEFAULT_SOCIAL,
}: FooterProps) {
  return (
    <footer className="w-full bg-[var(--color-dark-900)] text-[var(--color-light-100)]">
      <div className="mx-auto flex max-w-6xl flex-col gap-12 px-4 py-12 font-[family:var(--font-jost)] lg:flex-row lg:justify-between lg:px-8">
        <div className="flex flex-col gap-8">
          <Link href="/" aria-label="Nike home" className="relative h-8 w-12">
            <Image src="/logo.svg" alt="Nike logo" fill sizes="48px" className="object-contain invert" />
          </Link>
          <p className="max-w-xs text-sm leading-relaxed text-[color:var(--color-light-400)]">
            Exclusive sneakers, curated styles, and performance-ready gear made for every stride.
          </p>
          <div className="flex items-center gap-4">
            {socialLinks.map((social) => {
              const iconSrc = SOCIAL_ICON_MAP[social.label] ?? '/x.svg';
              return (
                <Link
                  key={social.label}
                  href={social.href}
                  aria-label={social.label}
                  className="flex h-10 w-10 items-center justify-center rounded-full border border-[color:var(--color-light-400)] transition-colors duration-150 hover:border-[color:var(--color-light-100)] focus-visible:border-[color:var(--color-light-100)] focus-visible:outline-none"
                >
                  <Image src={iconSrc} alt="" width={18} height={18} className="invert" />
                </Link>
              );
            })}
          </div>
        </div>

        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4 lg:gap-12">
          {sections.map((section) => (
            <div key={section.title} className="min-w-[160px] space-y-4">
              <h4 className="text-sm font-semibold uppercase tracking-widest text-[color:var(--color-light-400)]">
                {section.title}
              </h4>
              <ul className="space-y-3 text-sm text-[color:var(--color-light-300)]">
                {section.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="transition-colors duration-150 hover:text-[color:var(--color-light-100)] focus-visible:text-[color:var(--color-light-100)] focus-visible:outline-none"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      <div className="border-t border-[color:var(--color-dark-700)]">
        <div className="mx-auto flex max-w-6xl flex-col gap-4 px-4 py-6 text-xs text-[color:var(--color-light-400)] lg:flex-row lg:items-center lg:justify-between lg:px-8">
          <p>© {new Date().getFullYear()} Nike Inc. All Rights Reserved</p>
          <div className="flex flex-wrap items-center gap-4">
            {['Guides', 'Terms of Sale', 'Terms of Use', 'Privacy Policy'].map((item) => (
              <Link
                key={item}
                href={`/${item.toLowerCase().replace(/\s+/g, '-')}`}
                className="transition-colors duration-150 hover:text-[color:var(--color-light-100)] focus-visible:text-[color:var(--color-light-100)] focus-visible:outline-none"
              >
                {item}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
