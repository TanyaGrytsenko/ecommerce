"use client";

import { useCallback, useMemo } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

import {
  buildUrl,
  parseSearchParams,
  removeQueryKeys,
  setQueryValue,
} from "@/src/lib/utils/query";

const SORT_OPTIONS = [
  { value: "featured", label: "Featured" },
  { value: "newest", label: "Newest" },
  { value: "price_desc", label: "Price: High → Low" },
  { value: "price_asc", label: "Price: Low → High" },
] as const;

export default function Sort() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const query = useMemo(
    () => parseSearchParams(searchParams.toString()),
    [searchParams]
  );

  const selectedSort = useMemo(() => {
    const value = query.sort;

    if (!value) {
      return "featured";
    }

    if (Array.isArray(value)) {
      return value[0] ?? "featured";
    }

    return value;
  }, [query.sort]);

  const handleChange = useCallback(
    (value: string) => {
      const nextQuery = removeQueryKeys(
        setQueryValue(query, "sort", value === "featured" ? null : value),
        ["page"]
      );

      router.push(buildUrl(pathname, nextQuery), { scroll: false });
    },
    [pathname, query, router]
  );

  return (
    <label className="flex items-center gap-3 text-body text-dark-700">
      <span className="text-body-medium text-dark-900">Sort by</span>
      <span className="relative">
        <select
          className="appearance-none rounded-full border border-light-400 bg-light-100 px-4 py-2 pr-8 text-body text-dark-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-dark-900"
          value={selectedSort}
          onChange={(event) => handleChange(event.target.value)}
        >
          {SORT_OPTIONS.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-caption text-dark-500">
          ▾
        </span>
      </span>
    </label>
  );
}
