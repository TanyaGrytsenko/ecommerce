import { Metadata } from "next";
import { notFound } from "next/navigation";

import Image from "next/image";

import Filters from "@/src/components/Filters";
import ProductActions from "@/src/components/product/ProductActions";
import ProductGallery from "@/src/components/product/ProductGallery";
import {
  getProductDetail,
  type ProductVariantOption,
} from "@/src/data/product-detail";
import {
  getQueryValues,
  parseSearchParams,
} from "@/src/lib/utils/query";

type ProductPageProps = {
  params: { slug: string };
  searchParams?: Record<string, string | string[] | undefined>;
};

function formatCurrency(value: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(value);
}

function getActiveVariant(
  variants: ProductVariantOption[],
  selectedColor: string,
  defaultVariant: string
) {
  return (
    variants.find((variant) => variant.value === selectedColor) ??
    variants.find((variant) => variant.value === defaultVariant) ??
    variants[0]
  );
}

export function generateMetadata({
  params,
}: Pick<ProductPageProps, "params">): Metadata {
  const product = getProductDetail(params.slug);

  if (!product) {
    return { title: "Product not found" };
  }

  return {
    title: `${product.name} | Nike`,
    description: product.description,
  };
}

export default function ProductDetailPage({
  params,
  searchParams,
}: ProductPageProps) {
  const product = getProductDetail(params.slug);

  if (!product) {
    notFound();
  }

  const query = parseSearchParams(searchParams ?? {});
  const [colorParam] = getQueryValues(query, "color");
  const [sizeParam] = getQueryValues(query, "size");

  const activeVariant = getActiveVariant(
    product.variants,
    colorParam ?? product.defaultVariant,
    product.defaultVariant
  );

  const selectedSize = sizeParam ?? null;
  const priceLabel = formatCurrency(product.price);

  return (
    <main className="bg-light-200">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-10 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)] lg:items-start">
          <ProductGallery
            images={activeVariant.gallery}
            variantId={activeVariant.id}
            productName={product.name}
          />

          <div className="space-y-8">
            <header className="space-y-4">
              <div className="flex flex-wrap items-center gap-3">
                <span className="inline-flex items-center gap-2 rounded-full bg-light-100 px-4 py-2 text-caption text-dark-900">
                  <svg
                    aria-hidden="true"
                    focusable="false"
                    className="h-4 w-4"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <path d="M12 17.27 18.18 21l-1.64-7.03L22 9.24l-7.19-.62L12 2 9.19 8.62 2 9.24l5.46 4.73L5.82 21z" />
                  </svg>
                  {product.badge}
                </span>
                <span className="text-caption uppercase tracking-wide text-dark-500">
                  {product.category}
                </span>
              </div>

              <div className="space-y-2">
                <h1 className="text-heading-2 text-dark-900">{product.name}</h1>
                <div className="flex flex-wrap items-baseline justify-between gap-3">
                  <p className="text-heading-3 text-dark-900">{priceLabel}</p>
                  <span className="text-body-medium text-[var(--color-green)]">
                    {product.promoMessage}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2 text-body text-dark-700">
                <svg
                  aria-hidden="true"
                  focusable="false"
                  className="h-4 w-4 text-[var(--color-green)]"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M12 17.27 18.18 21l-1.64-7.03L22 9.24l-7.19-.62L12 2 9.19 8.62 2 9.24l5.46 4.73L5.82 21z" />
                </svg>
                <span>
                  {product.reviews.summary}
                </span>
              </div>
            </header>

            <Filters
              variants={product.variants}
              sizes={product.sizes}
              defaultVariant={product.defaultVariant}
              sizeGuideHref="#size-guide"
            />

            <ProductActions
              productId={product.slug}
              slug={product.slug}
              name={product.name}
              price={product.price}
              image={activeVariant.gallery[0]?.src ?? product.variants[0].thumbnail}
              selectedVariant={activeVariant.value}
              selectedVariantLabel={activeVariant.label}
              selectedSize={selectedSize}
            />

            <section className="space-y-4">
              <h2 className="text-heading-3 text-dark-900">Product Details</h2>
              <p className="text-body text-dark-700">{product.description}</p>
              <ul className="space-y-2 text-body text-dark-700">
                {product.details.map((detail) => (
                  <li key={detail} className="flex items-start gap-2">
                    <span className="mt-1 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-dark-900" aria-hidden="true" />
                    <span>{detail}</span>
                  </li>
                ))}
              </ul>
            </section>

            <section id="size-guide" className="space-y-4">
              <details className="rounded-2xl bg-light-100 p-4 text-body text-dark-700">
                <summary className="cursor-pointer list-none text-body-medium text-dark-900">
                  Shipping &amp; Returns
                </summary>
                <p className="mt-3 text-body text-dark-700">{product.shipping}</p>
              </details>

              <details className="rounded-2xl bg-light-100 p-4 text-body text-dark-700">
                <summary className="cursor-pointer list-none text-body-medium text-dark-900">
                  Reviews ({product.reviews.count})
                </summary>
                <div className="mt-3 flex items-center gap-2 text-body text-dark-700">
                  <div className="flex items-center gap-1 text-[var(--color-green)]">
                    {Array.from({ length: 5 }).map((_, index) => (
                      <svg
                        key={index}
                        aria-hidden="true"
                        focusable="false"
                        className="h-4 w-4"
                        viewBox="0 0 24 24"
                        fill={index < Math.round(product.reviews.average) ? "currentColor" : "none"}
                        stroke="currentColor"
                      >
                        <path d="M12 17.27 18.18 21l-1.64-7.03L22 9.24l-7.19-.62L12 2 9.19 8.62 2 9.24l5.46 4.73L5.82 21z" />
                      </svg>
                    ))}
                  </div>
                  <span>{product.reviews.summary}</span>
                </div>
              </details>
            </section>
          </div>
        </div>

        <section className="mt-16 space-y-8">
          <div className="flex flex-col gap-2">
            <h2 className="text-heading-3 text-dark-900">You Might Also Like</h2>
            <p className="text-body text-dark-700">
              Fresh picks inspired by how other members style their Air Max.
            </p>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {product.recommendations.map((item) => (
              <article
                key={item.slug}
                className="group rounded-3xl bg-light-100 p-4 shadow-sm transition hover:shadow-md focus-within:shadow-md"
              >
                <div className="relative overflow-hidden rounded-2xl">
                  {item.label ? (
                    <span className="absolute left-4 top-4 rounded-full bg-dark-900 px-3 py-1 text-footnote uppercase tracking-wide text-light-100">
                      {item.label}
                    </span>
                  ) : null}
                  <Image
                    src={item.image}
                    alt={item.name}
                    width={400}
                    height={320}
                    className="h-48 w-full rounded-2xl object-cover"
                  />
                </div>
                <div className="mt-4 space-y-1">
                  <h3 className="text-body-medium text-dark-900">{item.name}</h3>
                  <p className="text-caption text-dark-500">{item.category}</p>
                  <p className="text-caption text-dark-500">
                    {item.colorsAvailable} colours
                  </p>
                  <p className="text-body-medium text-dark-900">
                    {formatCurrency(item.price)}
                  </p>
                </div>
              </article>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
