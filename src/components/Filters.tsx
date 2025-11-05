"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

import {
  COLOR_OPTIONS,
  GENDER_OPTIONS,
  PRICE_OPTIONS,
  SIZE_OPTIONS,
} from "@/src/data/products";
import {
  buildUrl,
  getQueryValues,
  parseSearchParams,
  removeQueryKeys,
  toggleQueryValue,
  type ParsedQuery,
} from "@/src/lib/utils/query";

const FILTER_GROUPS = [
  { key: "gender", label: "Gender", options: GENDER_OPTIONS },
  { key: "size", label: "Size", options: SIZE_OPTIONS },
  { key: "color", label: "Color", options: COLOR_OPTIONS },
  { key: "price", label: "Price", options: PRICE_OPTIONS },
] as const;

const RESET_KEYS = ["page"];

type FilterKey = (typeof FILTER_GROUPS)[number]["key"];

type SelectedMap = Record<FilterKey, Set<string>>;

function useSelectedFilters(searchQuery: ParsedQuery<string>): SelectedMap {
  return useMemo(() => {
    const map = {} as SelectedMap;

    for (const group of FILTER_GROUPS) {
      map[group.key] = new Set(getQueryValues(searchQuery, group.key));
    }

    return map;
  }, [searchQuery]);
}

function FilterContent({
  selectedMap,
  onToggle,
  onClear,
  expandedState,
  setExpandedState,
  activeCount,
}: {
  selectedMap: SelectedMap;
  onToggle: (key: FilterKey, value: string) => void;
  onClear: () => void;
  expandedState: Record<FilterKey, boolean>;
  setExpandedState: (updater: (prev: Record<FilterKey, boolean>) => Record<FilterKey, boolean>) => void;
  activeCount: number;
}) {
  return (
    <div className="flex h-full flex-col gap-6">
      <div className="flex items-center justify-between">
        <h2 className="text-heading-3 text-dark-900">Filters</h2>
        <button
          type="button"
          onClick={onClear}
          disabled={activeCount === 0}
          className="text-body-medium text-dark-700 transition hover:text-dark-900 disabled:cursor-not-allowed disabled:text-light-400"
        >
          Clear all
        </button>
      </div>

      <div className="space-y-6">
        {FILTER_GROUPS.map((group) => {
          const isExpanded = expandedState[group.key];

          return (
            <section key={group.key} className="border-b border-light-300 pb-4 last:border-none">
              <button
                type="button"
                className="flex w-full items-center justify-between text-left text-body-medium text-dark-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-dark-900"
                onClick={() =>
                  setExpandedState((prev) => ({
                    ...prev,
                    [group.key]: !prev[group.key],
                  }))
                }
                aria-expanded={isExpanded}
              >
                <span>{group.label}</span>
                <span className="text-caption text-dark-500">
                  {isExpanded ? "−" : "+"}
                </span>
              </button>

              {isExpanded ? (
                <div className="mt-4 space-y-3">
                  {group.options.map((option) => {
                    const optionId = `${group.key}-${option.value}`;
                    const isChecked = selectedMap[group.key].has(option.value);

                    return (
                      <label
                        key={option.value}
                        htmlFor={optionId}
                        className="flex items-center gap-3 text-body text-dark-700"
                      >
                        <input
                          id={optionId}
                          type="checkbox"
                          className="h-4 w-4 rounded border-light-400 text-dark-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-dark-900"
                          checked={isChecked}
                          onChange={() => onToggle(group.key, option.value)}
                        />
                        <span>{option.label}</span>
                      </label>
                    );
                  })}
                </div>
              ) : null}
            </section>
          );
        })}
      </div>
    </div>
  );
}

export default function Filters() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [expandedState, setExpandedState] = useState<Record<FilterKey, boolean>>(
    () => {
      const initial = {} as Record<FilterKey, boolean>;

      for (const group of FILTER_GROUPS) {
        initial[group.key] = true;
      }

      return initial;
    }
  );

  const query = useMemo(
    () => parseSearchParams(searchParams.toString()),
    [searchParams]
  );

  const selectedMap = useSelectedFilters(query);
  const activeFilterCount = useMemo(
    () =>
      FILTER_GROUPS.reduce(
        (count, group) => count + selectedMap[group.key].size,
        0
      ),
    [selectedMap]
  );

  useEffect(() => {
    if (!isDrawerOpen) return;

    const original = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = original;
    };
  }, [isDrawerOpen]);

  const handleToggle = useCallback(
    (key: FilterKey, value: string) => {
      const nextQuery = removeQueryKeys(
        toggleQueryValue(query, key, value),
        RESET_KEYS
      );
      const nextUrl = buildUrl(pathname, nextQuery);

      router.push(nextUrl, { scroll: false });
      setIsDrawerOpen(false);
    },
    [pathname, query, router]
  );

  const handleClear = useCallback(() => {
    const filterKeys = FILTER_GROUPS.map((group) => group.key);
    const nextQuery = removeQueryKeys(
      removeQueryKeys(query, filterKeys),
      RESET_KEYS
    );

    router.push(buildUrl(pathname, nextQuery), { scroll: false });
    setIsDrawerOpen(false);
  }, [pathname, query, router]);

  return (
    <div className="w-full lg:w-64">
      <div className="flex items-center justify-between lg:hidden">
        <button
          type="button"
          onClick={() => setIsDrawerOpen(true)}
          className="flex items-center gap-2 rounded-full border border-dark-900 px-4 py-2 text-body-medium text-dark-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-dark-900"
        >
          <span>Filters</span>
          <span className="text-caption text-dark-500">(
            {FILTER_GROUPS.reduce(
              (count, group) => count + selectedMap[group.key].size,
              0
            )}
            )
          </span>
        </button>
      </div>

      <aside className="hidden rounded-2xl border border-light-300 bg-light-100 p-6 shadow-sm lg:block">
        <FilterContent
          selectedMap={selectedMap}
          onToggle={handleToggle}
          onClear={handleClear}
          expandedState={expandedState}
          setExpandedState={setExpandedState}
          activeCount={activeFilterCount}
        />
      </aside>

      {isDrawerOpen ? (
        <div className="fixed inset-0 z-40 flex lg:hidden" role="dialog" aria-modal="true">
          <div
            className="flex-1 bg-dark-900/40"
            onClick={() => setIsDrawerOpen(false)}
          />
          <aside className="relative h-full w-80 max-w-full translate-x-0 bg-light-100 p-6 shadow-xl">
            <button
              type="button"
              className="mb-4 text-body-medium text-dark-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-dark-900"
              onClick={() => setIsDrawerOpen(false)}
            >
              Close
            </button>

            <FilterContent
              selectedMap={selectedMap}
              onToggle={handleToggle}
              onClear={handleClear}
              expandedState={expandedState}
              setExpandedState={setExpandedState}
              activeCount={activeFilterCount}
            />
          </aside>
        </div>
      ) : null}
    </div>
  );
}
