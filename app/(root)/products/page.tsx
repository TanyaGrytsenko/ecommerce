import Link from "next/link";

import Card from "@/src/components/Card";
import Filters from "@/src/components/catalog/Filters";
import Sort from "@/src/components/catalog/Sort";
import {
  COLOR_OPTIONS,
  GENDER_OPTIONS,
  PRICE_LABEL_LOOKUP,
  PRICE_OPTIONS,
  PRODUCTS,
  SIZE_OPTIONS,
} from "@/src/data/products";
import {
  buildUrl,
  getQueryValues,
  parseSearchParams,
  removeQueryKeys,
} from "@/src/lib/utils/query";

const CATEGORY_LINKS = [
  { label: "All", href: "/products" },
  { label: "Men", href: "/products?gender=men" },
  { label: "Women", href: "/products?gender=women" },
  { label: "Unisex", href: "/products?gender=unisex" },
  { label: "Kids", href: "/products?gender=kids" },
] as const;

const FILTER_LABEL_LOOKUP: Record<string, Record<string, string>> = {
  gender: Object.fromEntries(GENDER_OPTIONS.map((option) => [option.value, option.label])),
  size: Object.fromEntries(SIZE_OPTIONS.map((option) => [option.value, option.label])),
  color: Object.fromEntries(COLOR_OPTIONS.map((option) => [option.value, option.label])),
  price: PRICE_LABEL_LOOKUP,
};

const FILTER_GROUP_LABELS: Record<string, string> = {
  gender: "Gender",
  size: "Size",
  color: "Color",
  price: "Price",
};

const filterKeys = ["gender", "size", "color", "price"] as const;

type ProductsPageProps = {
  searchParams?: Record<string, string | string[] | undefined>;
};

const SORT_LABELS: Record<string, string> = {
  featured: "Featured",
  newest: "Newest",
  price_desc: "Price: High → Low",
  price_asc: "Price: Low → High",
};

function isWithinPrice(price: number, value: string) {
  const option = PRICE_OPTIONS.find((item) => item.value === value);

  if (!option) {
    return true;
  }

  if (!Number.isFinite(option.max)) {
    return price >= option.min;
  }

  if (option.min === 0) {
    return price < option.max;
  }

  return price >= option.min && price <= option.max;
}

function getSortOrder(sort: string | string[] | null | undefined) {
  if (!sort) {
    return "featured";
  }

  if (Array.isArray(sort)) {
    return sort[0] ?? "featured";
  }

  return sort;
}

export default function ProductsPage({ searchParams }: ProductsPageProps) {
  const query = parseSearchParams(searchParams ?? {});

  const genders = getQueryValues(query, "gender");
  const sizes = getQueryValues(query, "size");
  const colors = getQueryValues(query, "color");
  const prices = getQueryValues(query, "price");
  const sort = getSortOrder(query.sort);

  const filteredProducts = PRODUCTS.filter((product) => {
    if (genders.length > 0 && !product.genders.some((gender) => genders.includes(gender))) {
      return false;
    }

    if (sizes.length > 0 && !sizes.some((size) => product.sizes.includes(size))) {
      return false;
    }

    if (colors.length > 0 && !colors.some((color) => product.colors.includes(color))) {
      return false;
    }

    if (prices.length > 0) {
      const matchesPrice = prices.some((value) => isWithinPrice(product.price, value));

      if (!matchesPrice) {
        return false;
      }
    }

    return true;
  });

  const sortedProducts = filteredProducts
    .slice()
    .sort((a, b) => {
      switch (sort) {
        case "newest":
          return new Date(b.releaseDate).getTime() - new Date(a.releaseDate).getTime();
        case "price_desc":
          return b.price - a.price;
        case "price_asc":
          return a.price - b.price;
        default:
          return a.featuredRank - b.featuredRank;
      }
    });

  const activeFilters = filterKeys.flatMap((key) => {
    const values = getQueryValues(query, key);

    return values.map((value) => ({
      key,
      value,
      label: `${FILTER_GROUP_LABELS[key]}: ${
        FILTER_LABEL_LOOKUP[key]?.[value] ?? value
      }`,
    }));
  });

  const clearFiltersHref = buildUrl(
    "/products",
    removeQueryKeys(query, [...filterKeys, "page"])
  );

  return (
    <main className="bg-light-200">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-10">
          <header className="flex flex-col gap-6">
            <div className="space-y-3">
              <p className="text-caption uppercase tracking-wide text-dark-500">
                Nike Lifestyle
              </p>
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
                  <h2 className="text-heading-3 text-dark-900">
                    {sortedProducts.length} Styles
                  </h2>
                  <p className="text-body text-dark-700">
                    Sorted by {SORT_LABELS[sort] ?? "Featured"}
                  </p>
                </div>
                <Sort />
              </div>

              {activeFilters.length > 0 ? (
                <div className="mt-6 flex flex-wrap items-center gap-3">
                  <span className="text-caption uppercase tracking-wide text-dark-500">
                    Active filters
                  </span>
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

              {sortedProducts.length === 0 ? (
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
                  {sortedProducts.map((product) => (
                    <Card
                      key={product.id}
                      title={product.name}
                      description={`${product.description} Available in ${product.colors
                        .map((color) => FILTER_LABEL_LOOKUP.color[color] ?? color)
                        .join(", ")}.`}
                      imageSrc={product.image}
                      imageAlt={product.name}
                      badge={product.badge}
                      price={`$${product.price.toFixed(0)}`}
                      accent={product.accent}
                    />
                  ))}
                </div>
              )}
            </section>
          </div>
        </div>
      </div>
    </main>
  );
}

