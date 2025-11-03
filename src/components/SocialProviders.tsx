import Image from "next/image";

const providers = [
  {
    name: "Google",
    icon: "/icons/google.svg",
  },
  {
    name: "Apple",
    icon: "/icons/apple.svg",
  },
] as const;

export default function SocialProviders() {
  return (
    <div className="grid gap-3">
      {providers.map((provider) => (
        <button
          key={provider.name}
          type="button"
          className="flex items-center justify-center gap-3 rounded-xl border border-light-300 bg-light-100 px-4 py-3 text-body-medium text-dark-900 transition hover:border-dark-900 hover:bg-light-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-dark-900"
          aria-label={`Continue with ${provider.name}`}
        >
          <Image
            src={provider.icon}
            alt=""
            width={20}
            height={20}
            className="h-5 w-5"
            aria-hidden="true"
          />
          <span className="font-medium">Continue with {provider.name}</span>
        </button>
      ))}
    </div>
  );
}
