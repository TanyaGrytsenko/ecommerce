import Link from "next/link";

import Card from "@/src/components/Card";
import Filters from "@/src/components/Filters";
import Sort from "@/src/components/Sort";
import { getAllProducts } from "@/src/lib/actions/product";
import {
  buildUrl,
  parseFilterParams,
  parseSearchParams,
  removeQueryKeys,
  type ParsedQuery,
} from "@/src/lib/utils/query";

const CATEGORY_LINKS = [
  { label: "All", href: "/products" },
  { label: "Men", href: "/products?gender=men" },
  { label: "Women", href: "/products?gender=women" },
  { label: "Unisex", href: "/products?gender=unisex" },
  { label: "Kids", href: "/products?gender=kids" },
] as const;

const SORT_LABELS: Record<string, string> = {
  featured: "Featured",
  latest: "Newest",
  newest: "Newest",
  price_desc: "Price: High → Low",
  price_asc: "Price: Low → High",
};

type ProductsPageProps = {
  searchParams?: Record<string, string | string[] | undefined>;
};

function formatPrice(minPrice: number | null, maxPrice: number | null): string | undefined {
  if (minPrice === null && maxPrice === null) {
    return undefined;
  }

  const min = minPrice ?? maxPrice ?? null;
  const max = maxPrice ?? minPrice ?? null;

  if (min === null && max === null) {
    return undefined;
  }

  if (min !== null && max !== null) {
    if (Math.abs(min - max) < 0.01) {
      return `$${min.toFixed(2)}`;
    }

    return `$${min.toFixed(2)} - $${max.toFixed(2)}`;
  }

  const value = min ?? max;

  if (value === null) {
    return undefined;
  }

  return `$${value.toFixed(2)}`;
}

function buildActiveFilters(query: ParsedQuery<string>): { key: string; value: string; label: string }[] {
  const active: { key: string; value: string; label: string }[] = [];

  const searchValue = typeof query.search === "string" ? query.search.trim() : "";

  if (searchValue) {
    active.push({ key: "search", value: searchValue, label: `Search: ${searchValue}` });
  }

  const genderValues = Array.isArray(query.gender)
    ? (query.gender as string[])
    : typeof query.gender === "string"
      ? [query.gender]
      : [];

  for (const value of genderValues) {
    active.push({ key: "gender", value, label: `Gender: ${value}` });
  }

  const categoryValues = Array.isArray(query.category)
    ? (query.category as string[])
    : typeof query.category === "string"
      ? [query.category]
      : [];

  const categoryIds = Array.isArray(query.categoryIds)
    ? (query.categoryIds as string[])
    : typeof query.categoryIds === "string"
      ? [query.categoryIds]
      : [];

  for (const value of [...categoryValues, ...categoryIds]) {
    active.push({ key: "category", value, label: `Category: ${value}` });
  }

  const brandValues = Array.isArray(query.brand)
    ? (query.brand as string[])
    : typeof query.brand === "string"
      ? [query.brand]
      : [];

  const brandIds = Array.isArray(query.brandIds)
    ? (query.brandIds as string[])
    : typeof query.brandIds === "string"
      ? [query.brandIds]
      : [];

  for (const value of [...brandValues, ...brandIds]) {
    active.push({ key: "brand", value, label: `Brand: ${value}` });
  }

  const colorValues = Array.isArray(query.color)
    ? (query.color as string[])
    : typeof query.color === "string"
      ? [query.color]
      : [];

  const colorIds = Array.isArray(query.colorIds)
    ? (query.colorIds as string[])
    : typeof query.colorIds === "string"
      ? [query.colorIds]
      : [];

  for (const value of [...colorValues, ...colorIds]) {
    active.push({ key: "color", value, label: `Color: ${value}` });
  }

  if (typeof query.priceMin === "string") {
    active.push({ key: "priceMin", value: query.priceMin, label: `Min price: $${query.priceMin}` });
  }

  if (typeof query.priceMax === "string") {
    active.push({ key: "priceMax", value: query.priceMax, label: `Max price: $${query.priceMax}` });
  }

  return active;
}

export default async function ProductsPage({ searchParams }: ProductsPageProps) {
  const parsedQuery = parseSearchParams(searchParams ?? {});
  const filterParams = parseFilterParams(searchParams);
  const sortParam = parsedQuery.sort;
  const sortKey = Array.isArray(sortParam) ? sortParam[0] : sortParam ?? "latest";

  const { products, totalCount } = await getAllProducts(filterParams);

  const activeFilters = buildActiveFilters(parsedQuery);

  const clearFiltersHref = buildUrl(
    "/products",
    removeQueryKeys(parsedQuery, [
      "search",
      "gender",
      "category",
      "categoryId",
      "categoryIds",
      "brand",
      "brandId",
      "brandIds",
      "color",
      "colorId",
      "colorIds",
      "priceMin",
      "priceMax",
      "page",
    ])
  );

  return (
    <main className="bg-light-200">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-10">
          <header className="flex flex-col gap-6">
            <div className="space-y-3">
              <p className="text-caption uppercase tracking-wide text-dark-500">Nike Lifestyle</p>
              <h1 className="text-heading-2 text-dark-900">Shop Sneakers</h1>
              <p className="max-w-2xl text-body text-dark-700">
                Discover Nike footwear built for movement, designed for all-day energy.
              </p>
            </div>

            <nav className="flex flex-wrap gap-3" aria-label="Category filters">
              {CATEGORY_LINKS.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="rounded-full border border-transparent bg-light-100 px-4 py-2 text-body text-dark-700 transition hover:border-dark-900 hover:text-dark-900"
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </header>

          <div className="flex flex-col gap-10 lg:flex-row lg:items-start">
            <Filters />

            <section className="flex-1">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h2 className="text-heading-3 text-dark-900">{totalCount} Styles</h2>
                  <p className="text-body text-dark-700">Sorted by {SORT_LABELS[sortKey] ?? "Featured"}</p>
                </div>
                <Sort />
              </div>

              {activeFilters.length > 0 ? (
                <div className="mt-6 flex flex-wrap items-center gap-3">
                  <span className="text-caption uppercase tracking-wide text-dark-500">Active filters</span>
                  {activeFilters.map((filter) => (
                    <span
                      key={`${filter.key}-${filter.value}`}
                      className="inline-flex items-center rounded-full bg-light-100 px-4 py-2 text-caption text-dark-700"
                    >
                      {filter.label}
                    </span>
                  ))}
                  <Link
                    href={clearFiltersHref}
                    className="text-caption text-dark-500 underline-offset-4 hover:text-dark-900 hover:underline"
                  >
                    Clear filters
                  </Link>
                </div>
              ) : null}

              {products.length === 0 ? (
                <div className="mt-12 rounded-3xl border border-light-300 bg-light-100 p-12 text-center">
                  <h3 className="text-heading-3 text-dark-900">No products found</h3>
                  <p className="mt-3 text-body text-dark-700">
                    Adjust your filters or explore a different category to discover more Nike styles.
                  </p>
                  <Link
                    href={clearFiltersHref}
                    className="mt-6 inline-flex items-center justify-center rounded-full bg-dark-900 px-6 py-3 text-body-medium text-light-100 transition hover:bg-dark-700"
                  >
                    Reset filters
                  </Link>
                </div>
              ) : (
                <div className="mt-8 grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
                  {products.map((product) => {
                    const [primaryImage] = product.images;
                    const priceLabel = formatPrice(product.minPrice, product.maxPrice);

                    return (
                      <Card
                        key={product.id}
                        title={product.name}
                        description={
                          product.description ??
                          `${product.brand?.name ?? "Nike"} • ${product.category?.name ?? "Lifestyle"}`
                        }
                        imageSrc={primaryImage?.url ?? "/shoes/shoe-1.jpg"}
                        imageAlt={primaryImage?.alt ?? product.name}
                        badge={product.brand?.name ?? undefined}
                        price={priceLabel}
                        accent="dark"
                        footerContent={product.category?.name}
                      />
                    );
                  })}
                </div>
              )}
            </section>
          </div>
        </div>
      </div>
    </main>
  );
}
