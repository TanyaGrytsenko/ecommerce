import Image from "next/image";
import Link from "next/link";

export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const year = new Date().getFullYear();

  return (
    <div className="relative flex min-h-screen flex-col bg-light-100 text-dark-900">
      <header className="flex items-center justify-between px-6 py-4 sm:px-10">
        <Link
          href="/"
          className="text-lg font-semibold text-dark-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-dark-900"
        >
          Stride Collective
        </Link>
        <p className="text-caption text-dark-500">
          Performance for every stride
        </p>
      </header>

      <div className="flex flex-1 flex-col lg:grid lg:grid-cols-12">
        <aside className="relative hidden overflow-hidden bg-dark-900 lg:col-span-5 lg:flex">
          <Image
            src="/hero-bg.png"
            alt="Gradient backdrop"
            fill
            priority
            sizes="(min-width: 1024px) 35vw, 100vw"
            className="object-cover opacity-60"
          />
          <div className="relative z-10 flex flex-1 flex-col justify-between p-10">
            <div>
              <span className="inline-flex items-center rounded-full bg-light-100/10 px-4 py-1 text-footnote uppercase tracking-[0.2em] text-light-100/80 ring-1 ring-light-100/20">
                Just Do It
              </span>
              <h1 className="mt-6 max-w-xs text-heading-2 text-light-100">
                Move with confidence every single day
              </h1>
              <p className="mt-4 max-w-sm text-body text-light-100/80">
                Join millions of athletes redefining their performance with footwear engineered for motion.
              </p>
            </div>
            <p className="text-footnote text-light-100/70">
              © {year} Stride Collective. All rights reserved.
            </p>
          </div>
          <Image
            src="/hero-shoe.png"
            alt="Featured running shoe"
            width={480}
            height={480}
            className="absolute -bottom-10 -right-10 hidden rotate-[-8deg] drop-shadow-2xl lg:block"
            priority
          />
        </aside>

        <main className="flex flex-1 items-center justify-center px-6 pb-12 pt-6 sm:px-10 lg:col-span-7 lg:px-16 lg:pb-16 lg:pt-10">
          <div className="w-full max-w-md space-y-10">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
