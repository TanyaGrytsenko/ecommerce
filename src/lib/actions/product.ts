"use server";

import { and, desc, eq, sql } from "drizzle-orm";

import { db } from "../db";
import {
  brands,
  categories,
  colors,
  productImages,
  productVariants,
  products,
  sizes,
  type ProductRow,
} from "../db/schema";
import {
  buildProductQueryObject,
  parseFilterParams,
  type ProductFilterParams,
} from "../utils/query";

export interface ProductImageSummary {
  id: string;
  url: string;
  alt: string | null;
  colorId: string | null;
  isPrimary: boolean;
  position: number | null;
}

export interface ProductWithAggregates {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  gender: ProductRow["gender"];
  brand: { id: string; name: string } | null;
  category: { id: string; name: string } | null;
  minPrice: number | null;
  maxPrice: number | null;
  images: ProductImageSummary[];
}

export interface ProductVariantDetail {
  id: string;
  colorId: string;
  colorName: string | null;
  colorHex: string | null;
  sizeId: string;
  sizeLabel: string | null;
  price: number;
  stock: number;
  sku: string;
}

export interface ProductDetail extends ProductWithAggregates {
  metadata: ProductRow["metadata"];
  createdAt: ProductRow["createdAt"];
  variants: ProductVariantDetail[];
}

function coerceNumber(value: unknown): number | null {
  if (value === null || value === undefined) {
    return null;
  }

  if (typeof value === "number") {
    return Number.isFinite(value) ? value : null;
  }

  const parsed = Number(value);

  return Number.isFinite(parsed) ? parsed : null;
}

function parseJsonArray<T>(value: unknown): T[] {
  if (!value) {
    return [];
  }

  if (Array.isArray(value)) {
    return value as T[];
  }

  if (typeof value === "string") {
    try {
      const parsed = JSON.parse(value);

      return Array.isArray(parsed) ? (parsed as T[]) : [];
    } catch {
      return [];
    }
  }

  return [];
}

function normalizeImages(value: unknown): ProductImageSummary[] {
  const images = parseJsonArray<Partial<ProductImageSummary>>(value)
    .map((image) => ({
      ...image,
      alt: image.alt ?? null,
      colorId: image.colorId ?? null,
      isPrimary: Boolean(image.isPrimary),
      position:
        typeof image.position === "number"
          ? image.position
          : image.position
            ? Number(image.position)
            : null,
    }))
    .filter((image): image is ProductImageSummary => Boolean(image.id && image.url));

  return images.sort((a, b) => (a.position ?? 0) - (b.position ?? 0));
}

function mapVariants(value: unknown): ProductVariantDetail[] {
  return parseJsonArray<Partial<ProductVariantDetail>>(value)
    .map((variant) => {
      const priceValue = coerceNumber(variant.price);

      return {
        id: variant.id ?? "",
        colorId: variant.colorId ?? "",
        colorName: variant.colorName ?? null,
        colorHex: variant.colorHex ?? null,
        sizeId: variant.sizeId ?? "",
        sizeLabel: variant.sizeLabel ?? null,
        price: priceValue ?? 0,
        stock: Math.max(Number(variant.stock ?? 0), 0),
        sku: variant.sku ?? "",
      } satisfies ProductVariantDetail;
    })
    .filter((variant) => Boolean(variant.id));
}

export async function getAllProducts(
  params: ProductFilterParams
): Promise<{ products: ProductWithAggregates[]; totalCount: number }>;
export async function getAllProducts(
  params: URLSearchParams | Record<string, string | string[] | undefined>
): Promise<{ products: ProductWithAggregates[]; totalCount: number }>;
export async function getAllProducts(
  params:
    | ProductFilterParams
    | URLSearchParams
    | Record<string, string | string[] | undefined>
): Promise<{ products: ProductWithAggregates[]; totalCount: number }> {
  const isFilterParams =
    typeof params === "object" &&
    params !== null &&
    !Array.isArray(params) &&
    "page" in params &&
    "limit" in params;

  const filters = isFilterParams
    ? (params as ProductFilterParams)
    : parseFilterParams(params as URLSearchParams | Record<string, string | string[] | undefined>);

  const queryConfig = buildProductQueryObject(filters);
  const whereClause =
    queryConfig.where.length > 0 ? and(...queryConfig.where) : undefined;

  const colorFilter = queryConfig.colorFilterIds;

  const imageSelection = colorFilter.length
    ? sql`COALESCE(json_agg(DISTINCT jsonb_build_object(
        'id', ${productImages.id},
        'url', ${productImages.url},
        'alt', ${productImages.alt},
        'colorId', ${productImages.colorId},
        'isPrimary', ${productImages.isPrimary},
        'position', ${productImages.position}
      )) FILTER (WHERE ${productImages.colorId} = ANY(${sql.array(colorFilter, 'text')})), '[]'::json)`
    : sql`COALESCE(json_agg(DISTINCT jsonb_build_object(
        'id', ${productImages.id},
        'url', ${productImages.url},
        'alt', ${productImages.alt},
        'colorId', ${productImages.colorId},
        'isPrimary', ${productImages.isPrimary},
        'position', ${productImages.position}
      )) FILTER (WHERE ${productImages.isPrimary} = true OR ${productImages.colorId} IS NULL), '[]'::json)`;

  const baseQuery = db
    .select({
      id: products.id,
      name: products.name,
      slug: products.slug,
      description: products.description,
      gender: products.gender,
      brandId: brands.id,
      brandName: brands.name,
      categoryId: categories.id,
      categoryName: categories.name,
      minPrice: sql<string | null>`MIN(${productVariants.price})`,
      maxPrice: sql<string | null>`MAX(${productVariants.price})`,
      images: imageSelection,
    })
    .from(products)
    .innerJoin(productVariants, eq(productVariants.productId, products.id))
    .leftJoin(brands, eq(brands.id, products.brandId))
    .leftJoin(categories, eq(categories.id, products.categoryId))
    .leftJoin(productImages, eq(productImages.productId, products.id))
    .groupBy(
      products.id,
      brands.id,
      brands.name,
      categories.id,
      categories.name
    );

  const rows = await (whereClause ? baseQuery.where(whereClause) : baseQuery)
    .orderBy(
      ...(queryConfig.orderBy.length > 0
        ? queryConfig.orderBy
        : [desc(products.createdAt)])
    )
    .limit(queryConfig.limit)
    .offset(queryConfig.offset);

  const countQuery = db
    .select({ value: sql<number>`COUNT(DISTINCT ${products.id})` })
    .from(products)
    .innerJoin(productVariants, eq(productVariants.productId, products.id));

  const countResult = await (whereClause
    ? countQuery.where(whereClause)
    : countQuery);

  const totalCount = Number(countResult[0]?.value ?? 0);

  const productList: ProductWithAggregates[] = rows.map((row) => ({
    id: row.id,
    name: row.name,
    slug: row.slug,
    description: row.description ?? null,
    gender: row.gender,
    brand: row.brandId
      ? {
          id: row.brandId,
          name: row.brandName ?? "",
        }
      : null,
    category: row.categoryId
      ? {
          id: row.categoryId,
          name: row.categoryName ?? "",
        }
      : null,
    minPrice: coerceNumber(row.minPrice),
    maxPrice: coerceNumber(row.maxPrice),
    images: normalizeImages(row.images),
  }));

  return { products: productList, totalCount };
}

export async function getProduct(
  productId: string
): Promise<ProductDetail | null> {
  const variantImagesSelection = sql`COALESCE(json_agg(DISTINCT jsonb_build_object(
      'id', ${productImages.id},
      'url', ${productImages.url},
      'alt', ${productImages.alt},
      'colorId', ${productImages.colorId},
      'isPrimary', ${productImages.isPrimary},
      'position', ${productImages.position}
    )) FILTER (WHERE ${productImages.id} IS NOT NULL), '[]'::json)`;

  const variantsSelection = sql`COALESCE(json_agg(DISTINCT jsonb_build_object(
      'id', ${productVariants.id},
      'colorId', ${productVariants.colorId},
      'colorName', ${colors.name},
      'colorHex', ${colors.hex},
      'sizeId', ${productVariants.sizeId},
      'sizeLabel', ${sizes.label},
      'price', ${productVariants.price},
      'stock', ${productVariants.stock},
      'sku', ${productVariants.sku}
    )) FILTER (WHERE ${productVariants.id} IS NOT NULL), '[]'::json)`;

  const result = await db
    .select({
      id: products.id,
      name: products.name,
      slug: products.slug,
      description: products.description,
      gender: products.gender,
      brandId: brands.id,
      brandName: brands.name,
      categoryId: categories.id,
      categoryName: categories.name,
      metadata: products.metadata,
      createdAt: products.createdAt,
      minPrice: sql<string | null>`MIN(${productVariants.price})`,
      maxPrice: sql<string | null>`MAX(${productVariants.price})`,
      variants: variantsSelection,
      images: variantImagesSelection,
    })
    .from(products)
    .innerJoin(productVariants, eq(productVariants.productId, products.id))
    .leftJoin(brands, eq(brands.id, products.brandId))
    .leftJoin(categories, eq(categories.id, products.categoryId))
    .leftJoin(colors, eq(colors.id, productVariants.colorId))
    .leftJoin(sizes, eq(sizes.id, productVariants.sizeId))
    .leftJoin(productImages, eq(productImages.productId, products.id))
    .where(and(eq(products.id, productId), eq(products.isPublished, true)))
    .groupBy(
      products.id,
      brands.id,
      brands.name,
      categories.id,
      categories.name
    )
    .limit(1);

  const row = result[0];

  if (!row) {
    return null;
  }

  return {
    id: row.id,
    name: row.name,
    slug: row.slug,
    description: row.description ?? null,
    gender: row.gender,
    brand: row.brandId ? { id: row.brandId, name: row.brandName ?? "" } : null,
    category: row.categoryId
      ? { id: row.categoryId, name: row.categoryName ?? "" }
      : null,
    minPrice: coerceNumber(row.minPrice),
    maxPrice: coerceNumber(row.maxPrice),
    images: normalizeImages(row.images),
    metadata: row.metadata,
    createdAt: row.createdAt,
    variants: mapVariants(row.variants),
  };
}
