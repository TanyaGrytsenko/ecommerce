'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';

interface NavLink {
  label: string;
  href: string;
}

export interface NavbarProps {
  cartCount?: number;
  links?: NavLink[];
}

const DEFAULT_LINKS: NavLink[] = [
  { label: 'Men', href: '/men' },
  { label: 'Women', href: '/women' },
  { label: 'Kids', href: '/kids' },
  { label: 'Collections', href: '/collections' },
  { label: 'Contact', href: '/contact' },
];

export default function Navbar({ cartCount = 0, links = DEFAULT_LINKS }: NavbarProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen((prev) => !prev);
  };

  const closeMenu = () => setIsMenuOpen(false);

  return (
    <header className="w-full border-b border-[var(--color-light-300)] bg-[var(--color-light-100)] font-[family:var(--font-jost)]">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 md:py-6 lg:px-8">
        <div className="flex items-center gap-3">
          <Link href="/" aria-label="Nike home" className="relative h-8 w-10 shrink-0">
            <Image
              src="/logo.svg"
              alt="Nike logo"
              fill
              sizes="(max-width: 768px) 40px, 48px"
              priority
            />
          </Link>
          <nav aria-label="Primary" className="hidden lg:block">
            <ul className="flex items-center gap-8 text-[length:var(--text-body)] text-[color:var(--color-dark-900)]">
              {links.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-sm font-medium tracking-wide transition-colors duration-150 hover:text-[color:var(--color-green)] focus-visible:text-[color:var(--color-green)] focus-visible:outline-none"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        <div className="hidden items-center gap-6 text-sm font-medium text-[color:var(--color-dark-900)] lg:flex">
          <Link
            href="/search"
            className="transition-colors duration-150 hover:text-[color:var(--color-green)] focus-visible:text-[color:var(--color-green)] focus-visible:outline-none"
          >
            Search
          </Link>
          <Link
            href="/cart"
            className="flex items-center gap-1 rounded-full border border-[var(--color-light-300)] px-3 py-1 transition-colors duration-150 hover:border-[var(--color-dark-900)] hover:text-[color:var(--color-green)] focus-visible:border-[var(--color-dark-900)] focus-visible:text-[color:var(--color-green)] focus-visible:outline-none"
          >
            <span>My Cart</span>
            <span className="text-[color:var(--color-red)]">({cartCount})</span>
          </Link>
        </div>

        <button
          type="button"
          onClick={toggleMenu}
          className="flex h-10 w-10 items-center justify-center rounded-full border border-[var(--color-light-300)] text-[color:var(--color-dark-900)] transition-colors duration-150 hover:border-[var(--color-dark-900)] focus-visible:border-[var(--color-dark-900)] focus-visible:outline-none lg:hidden"
          aria-label="Toggle navigation menu"
          aria-expanded={isMenuOpen}
        >
          <span className="sr-only">Menu</span>
          <svg
            className="h-5 w-5"
            viewBox="0 0 20 20"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
          >
            <path
              d="M3 6h14M3 10h14M3 14h14"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
          </svg>
        </button>
      </div>

      <nav
        aria-label="Mobile"
        className={`border-t border-[var(--color-light-300)] bg-[var(--color-light-100)] lg:hidden ${
          isMenuOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
        } overflow-hidden transition-all duration-300 ease-in-out`}
      >
        <ul className="flex flex-col gap-2 px-4 py-4 text-sm text-[color:var(--color-dark-900)]">
          {links.map((link) => (
            <li key={`mobile-${link.label}`}>
              <Link
                href={link.href}
                className="block rounded-md px-3 py-2 font-medium transition-colors duration-150 hover:bg-[var(--color-light-200)] hover:text-[color:var(--color-green)] focus-visible:bg-[var(--color-light-200)] focus-visible:text-[color:var(--color-green)] focus-visible:outline-none"
                onClick={closeMenu}
              >
                {link.label}
              </Link>
            </li>
          ))}
          <li className="mt-2 border-t border-[var(--color-light-300)] pt-4">
            <Link
              href="/search"
              className="block rounded-md px-3 py-2 font-medium transition-colors duration-150 hover:bg-[var(--color-light-200)] hover:text-[color:var(--color-green)] focus-visible:bg-[var(--color-light-200)] focus-visible:text-[color:var(--color-green)] focus-visible:outline-none"
              onClick={closeMenu}
            >
              Search
            </Link>
          </li>
          <li>
            <Link
              href="/cart"
              className="flex items-center justify-between rounded-md border border-[var(--color-light-300)] px-3 py-2 font-medium transition-colors duration-150 hover:border-[var(--color-dark-900)] hover:text-[color:var(--color-green)] focus-visible:border-[var(--color-dark-900)] focus-visible:text-[color:var(--color-green)] focus-visible:outline-none"
              onClick={closeMenu}
            >
              <span>My Cart</span>
              <span className="text-[color:var(--color-red)]">({cartCount})</span>
            </Link>
          </li>
        </ul>
      </nav>
    </header>
  );
}
