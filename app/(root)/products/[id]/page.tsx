import Link from "next/link";
import { notFound } from "next/navigation";

import Card from "@/src/components/Card";
import CollapsibleSection from "@/src/components/CollapsibleSection";
import ProductGallery from "@/src/components/ProductGallery";
import SizePicker from "@/src/components/SizePicker";
import { getProductDetail } from "@/src/data/product-details";
import { PRODUCTS } from "@/src/data/products";
import { Heart, ShoppingBag, Star, Tag } from "lucide-react";

interface ProductPageProps {
  params: {
    id: string;
  };
}

function formatCurrency(value: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(value);
}

export default function ProductPage({ params }: ProductPageProps) {
  const product = getProductDetail(params.id);

  if (!product) {
    notFound();
  }

  const compareAtPrice = product.compareAtPrice ?? null;
  const discount = compareAtPrice
    ? Math.round((1 - product.price / compareAtPrice) * 100)
    : null;

  const recommendedProducts = product.recommendedProductIds
    .map((recommendedId) =>
      PRODUCTS.find((item) => item.id === recommendedId)
    )
    .filter(
      (item): item is (typeof PRODUCTS)[number] =>
        Boolean(item && item.image?.trim?.())
    );

  return (
    <main className="bg-light-100">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-12 lg:flex-row lg:items-start">
          <div className="lg:w-7/12">
            <ProductGallery title={product.name} variants={product.variants} />
          </div>

          <div className="flex flex-1 flex-col gap-8 lg:w-5/12">
            <section className="space-y-6">
              <div className="space-y-4">
                {product.ratingLabel ? (
                  <span className="inline-flex items-center gap-2 rounded-full bg-light-200 px-3 py-1 text-caption font-medium text-dark-700">
                    <Star className="h-4 w-4 text-[color:var(--color-orange)]" aria-hidden />
                    {product.ratingLabel}
                  </span>
                ) : null}

                <div className="space-y-2">
                  <p className="text-caption uppercase tracking-wide text-dark-500">{product.subtitle}</p>
                  <h1 className="text-heading-2 text-dark-900">{product.name}</h1>
                </div>

                <div className="flex flex-col gap-3">
                  <div className="flex flex-wrap items-center gap-3">
                    <span className="text-heading-3 text-dark-900">
                      {formatCurrency(product.price)}
                    </span>
                    {compareAtPrice ? (
                      <span className="text-body text-dark-500 line-through">
                        {formatCurrency(compareAtPrice)}
                      </span>
                    ) : null}
                    {discount ? (
                      <span className="rounded-full bg-[color:var(--color-red)] px-3 py-1 text-caption font-medium text-light-100">
                        Save {discount}%
                      </span>
                    ) : null}
                  </div>

                  <div className="flex items-center gap-2 text-body text-dark-700">
                    <Star className="h-4 w-4 text-[color:var(--color-orange)]" aria-hidden />
                    <span>
                      {product.ratingValue.toFixed(1)} • {product.reviewCount} reviews
                    </span>
                  </div>
                </div>

                {product.offerBadge ? (
                  <div className="flex flex-col gap-2 rounded-2xl bg-light-200 p-4">
                    <span className="inline-flex items-center gap-2 text-body-medium text-dark-900">
                      <Tag className="h-4 w-4" aria-hidden />
                      {product.offerBadge}
                    </span>
                    {product.offerDescription ? (
                      <p className="text-body text-dark-700">{product.offerDescription}</p>
                    ) : null}
                  </div>
                ) : null}

                <p className="text-body text-dark-700">{product.description}</p>
              </div>

              <SizePicker sizes={product.sizes} />

              <div className="flex flex-col gap-3 sm:flex-row">
                <button
                  type="button"
                  className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-[color:var(--color-dark-900)] px-6 py-4 text-body-medium font-medium text-light-100 transition hover:bg-[color:var(--color-dark-700)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--color-dark-900)] focus-visible:ring-offset-2"
                >
                  <ShoppingBag className="h-5 w-5" aria-hidden />
                  Add to Bag
                </button>
                <button
                  type="button"
                  className="inline-flex w-full items-center justify-center gap-2 rounded-full border border-light-300 px-6 py-4 text-body-medium font-medium text-dark-900 transition hover:border-[color:var(--color-dark-900)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--color-dark-900)]"
                >
                  <Heart className="h-5 w-5" aria-hidden />
                  Favorite
                </button>
              </div>
            </section>

            <section className="space-y-6">
              <div>
                <h2 className="text-heading-3 text-dark-900">Highlights</h2>
                <ul className="mt-4 space-y-3 text-body text-dark-700">
                  {product.highlights.map((highlight) => (
                    <li key={highlight} className="flex items-start gap-2">
                      <span aria-hidden className="mt-1 block h-2 w-2 rounded-full bg-[color:var(--color-dark-900)]" />
                      <span>{highlight}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h2 className="text-heading-3 text-dark-900">Product Information</h2>
                <dl className="mt-4 grid grid-cols-1 gap-x-6 gap-y-3 text-body text-dark-700 sm:grid-cols-2">
                  {product.details.map((detail) => (
                    <div key={detail.label} className="flex flex-col gap-1">
                      <dt className="text-caption uppercase tracking-wide text-dark-500">{detail.label}</dt>
                      <dd>{detail.value}</dd>
                    </div>
                  ))}
                </dl>
              </div>
            </section>

            <div className="space-y-4">
              <CollapsibleSection title="Product Details" defaultOpen>
                <p>
                  Crafted with layered textures and premium materials, the Air Max 90 SE stays true to the DNA of the original while introducing fresh color blocking for the season.
                </p>
              </CollapsibleSection>

              <CollapsibleSection title="Shipping & Returns" defaultOpen>
                <p>{product.shippingSummary}</p>
                <p className="mt-3">{product.returnsSummary}</p>
              </CollapsibleSection>

              <CollapsibleSection title="Reviews">
                <p>{product.reviewsSummary ?? "Reviews are coming soon."}</p>
              </CollapsibleSection>
            </div>
          </div>
        </div>

        <section className="mt-16 space-y-8">
          <div className="flex items-center justify-between">
            <h2 className="text-heading-2 text-dark-900">You Might Also Like</h2>
            <Link
              href="/products"
              className="text-caption font-medium text-dark-700 underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--color-dark-900)]"
            >
              Shop all
            </Link>
          </div>

          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {recommendedProducts.map((item) => (
              <Card
                key={item.id}
                title={item.name}
                description={item.description}
                imageSrc={item.image}
                imageAlt={item.name}
                badge={item.badge}
                price={formatCurrency(item.price)}
                accent={item.accent}
                href={`/products/${item.id}`}
              />
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
