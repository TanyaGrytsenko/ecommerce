import { SQL, alias, asc, desc, eq, ilike, inArray, or, sql } from "drizzle-orm";
import { parse, stringify, stringifyUrl, type ParsedQuery } from "query-string";

import { products, productVariants } from "../db/schema";

type SearchParamsRecord = Record<string, string | string[] | undefined>;

type QueryValue = string | string[] | null | undefined;

const ARRAY_FORMAT = "comma" as const;

export { type ParsedQuery };

export function parseSearchParams(
  input?: string | SearchParamsRecord | null
): ParsedQuery<string> {
  if (!input) {
    return {};
  }

  if (typeof input === "string") {
    return parse(input, { arrayFormat: ARRAY_FORMAT });
  }

  const queryString = stringify(input, {
    arrayFormat: ARRAY_FORMAT,
    skipEmptyString: true,
    skipNull: true,
  });

  if (!queryString) {
    return {};
  }

  return parse(queryString, { arrayFormat: ARRAY_FORMAT });
}

export function stringifyQuery(query: ParsedQuery<string>): string {
  return stringify(query, {
    arrayFormat: ARRAY_FORMAT,
    skipEmptyString: true,
    skipNull: true,
  });
}

export function buildUrl(pathname: string, query: ParsedQuery<string>): string {
  return stringifyUrl(
    { url: pathname, query },
    { arrayFormat: ARRAY_FORMAT, skipEmptyString: true, skipNull: true }
  );
}

export function getQueryValues(
  query: ParsedQuery<string>,
  key: string
): string[] {
  const value = query[key];

  if (!value) {
    return [];
  }

  if (Array.isArray(value)) {
    return value.filter((item): item is string => Boolean(item?.length));
  }

  return value.length ? [value] : [];
}

export function toggleQueryValue(
  query: ParsedQuery<string>,
  key: string,
  value: string
): ParsedQuery<string> {
  const currentValues = new Set(getQueryValues(query, key));

  if (currentValues.has(value)) {
    currentValues.delete(value);
  } else {
    currentValues.add(value);
  }

  return setQueryValue(query, key, Array.from(currentValues));
}

export function setQueryValue(
  query: ParsedQuery<string>,
  key: string,
  value: QueryValue
): ParsedQuery<string> {
  const next: ParsedQuery<string> = { ...query };

  if (value === undefined || value === null) {
    delete next[key];
    return next;
  }

  if (Array.isArray(value)) {
    const clean = value.filter((item) => item && item.length);

    if (clean.length === 0) {
      delete next[key];
      return next;
    }

    next[key] = clean;
    return next;
  }

  if (value.length === 0) {
    delete next[key];
    return next;
  }

  next[key] = value;
  return next;
}

export function removeQueryKeys(
  query: ParsedQuery<string>,
  keys: string[]
): ParsedQuery<string> {
  const next: ParsedQuery<string> = { ...query };

  for (const key of keys) {
    delete next[key];
  }

  return next;
}

export function isQueryEmpty(query: ParsedQuery<string>): boolean {
  return Object.keys(query).length === 0;
}

const SORT_OPTIONS = new Set(["price_asc", "price_desc", "latest"] as const);

const PRICE_RANGE_LOOKUP: Record<
  string,
  { min?: number; max?: number | typeof Number.POSITIVE_INFINITY }
> = {
  "under-100": { min: 0, max: 100 },
  "100-150": { min: 100, max: 150 },
  "150-200": { min: 150, max: 200 },
  "200-plus": { min: 200, max: Number.POSITIVE_INFINITY },
};

function toUniqueArray(values: Iterable<string>): string[] {
  const set = new Set<string>();

  for (const value of values) {
    if (!value) continue;
    set.add(value);
  }

  return Array.from(set);
}

type SearchParamsInput =
  | URLSearchParams
  | Record<string, string | string[] | undefined>
  | undefined;

function normalizeSearchParams(input: SearchParamsInput): Map<string, string[]> {
  const map = new Map<string, string[]>();

  if (!input) {
    return map;
  }

  if (input instanceof URLSearchParams) {
    input.forEach((value, key) => {
      if (!value) return;
      const existing = map.get(key) ?? [];
      existing.push(value);
      map.set(key, existing);
    });
    return map;
  }

  for (const [key, rawValue] of Object.entries(input)) {
    if (rawValue === undefined) continue;
    const values = Array.isArray(rawValue) ? rawValue : [rawValue];

    for (const item of values) {
      if (!item) continue;

      const parts = item
        .split(",")
        .map((part) => part.trim())
        .filter(Boolean);

      if (parts.length === 0) continue;

      const existing = map.get(key) ?? [];
      existing.push(...parts);
      map.set(key, existing);
    }
  }

  return map;
}

function getFirst(map: Map<string, string[]>, key: string): string | undefined {
  const values = map.get(key);

  return values?.[0];
}

function collectValues(map: Map<string, string[]>, keys: string[]): string[] {
  const collected: string[] = [];

  for (const key of keys) {
    const values = map.get(key);

    if (!values) continue;

    collected.push(...values);
  }

  return toUniqueArray(collected);
}

function parseNumber(value: string | undefined): number | undefined {
  if (!value) return undefined;

  const parsed = Number(value);

  return Number.isFinite(parsed) ? parsed : undefined;
}

export type SortByOption = "price_asc" | "price_desc" | "latest";

export interface ProductFilterParams {
  search?: string;
  categoryIds?: string[];
  brandIds?: string[];
  gender?: string;
  colorIds?: string[];
  priceMin?: number;
  priceMax?: number;
  sortBy?: SortByOption;
  page: number;
  limit: number;
}

export interface ProductQueryObject {
  where: SQL<unknown>[];
  orderBy: SQL<unknown>[];
  limit: number;
  offset: number;
  colorFilterIds: string[];
}

export function parseFilterParams(
  searchParams: SearchParamsInput
): ProductFilterParams {
  const map = normalizeSearchParams(searchParams);

  const search = getFirst(map, "search")?.trim();
  const gender = getFirst(map, "gender")?.trim();

  const sortParam = getFirst(map, "sort") ?? getFirst(map, "sortBy");
  const normalizedSortParam =
    sortParam === "featured"
      ? undefined
      : sortParam === "newest"
        ? "latest"
        : sortParam ?? undefined;
  const sortBy =
    normalizedSortParam && SORT_OPTIONS.has(normalizedSortParam as SortByOption)
      ? (normalizedSortParam as SortByOption)
      : undefined;

  const categoryIds = collectValues(map, ["category", "categoryId", "categoryIds"]);
  const brandIds = collectValues(map, ["brand", "brandId", "brandIds"]);
  const colorIds = collectValues(map, ["color", "colorId", "colorIds"]);

  let priceMin = parseNumber(getFirst(map, "priceMin"));
  let priceMax = parseNumber(getFirst(map, "priceMax"));

  const priceValues = collectValues(map, ["price", "priceId", "priceIds"]);

  if (priceValues.length > 0) {
    let minCandidate: number | undefined;
    let maxCandidate: number | undefined;
    let hasInfiniteMax = false;

    for (const priceValue of priceValues) {
      const range = PRICE_RANGE_LOOKUP[priceValue];

      if (!range) continue;

      if (typeof range.min === "number") {
        minCandidate = minCandidate === undefined ? range.min : Math.min(minCandidate, range.min);
      }

      if (range.max === Number.POSITIVE_INFINITY) {
        hasInfiniteMax = true;
      } else if (typeof range.max === "number") {
        maxCandidate = maxCandidate === undefined ? range.max : Math.max(maxCandidate, range.max);
      }
    }

    if (minCandidate !== undefined) {
      priceMin = priceMin === undefined ? minCandidate : Math.min(priceMin, minCandidate);
    }

    if (hasInfiniteMax) {
      priceMax = undefined;
    } else if (maxCandidate !== undefined) {
      priceMax = priceMax === undefined ? maxCandidate : Math.max(priceMax, maxCandidate);
    }
  }

  const page = Math.max(parseNumber(getFirst(map, "page")) ?? 1, 1);
  const limitRaw = parseNumber(getFirst(map, "limit")) ?? 12;
  const limit = Math.max(1, Math.min(limitRaw, 60));

  const params: ProductFilterParams = {
    page,
    limit,
  };

  if (search) {
    params.search = search;
  }

  if (gender) {
    params.gender = gender;
  }

  if (categoryIds.length > 0) {
    params.categoryIds = categoryIds;
  }

  if (brandIds.length > 0) {
    params.brandIds = brandIds;
  }

  if (colorIds.length > 0) {
    params.colorIds = colorIds;
  }

  if (priceMin !== undefined) {
    params.priceMin = priceMin;
  }

  if (priceMax !== undefined) {
    params.priceMax = priceMax;
  }

  if (sortBy) {
    params.sortBy = sortBy;
  }

  return params;
}

export function buildProductQueryObject(
  filters: ProductFilterParams
): ProductQueryObject {
  const where: SQL<unknown>[] = [eq(products.isPublished, true)];
  const orderBy: SQL<unknown>[] = [];
  const colorFilterIds = filters.colorIds ?? [];

  if (filters.search) {
    const query = `%${filters.search.replace(/%/g, "\\%").replace(/_/g, "\\_")}%`;
    where.push(
      or(
        ilike(products.name, query),
        ilike(sql`COALESCE(${products.description}, '')`, query)
      )
    );
  }

  if (filters.categoryIds?.length) {
    where.push(inArray(products.categoryId, filters.categoryIds));
  }

  if (filters.brandIds?.length) {
    where.push(inArray(products.brandId, filters.brandIds));
  }

  if (filters.gender) {
    where.push(eq(products.gender, filters.gender));
  }

  if (filters.colorIds?.length) {
    const variantAlias = alias(productVariants, "variant_color_filter");
    where.push(
      sql`EXISTS (SELECT 1 FROM ${variantAlias} WHERE ${variantAlias.productId} = ${products.id} AND ${variantAlias.colorId} = ANY(${sql.array(
        filters.colorIds,
        "text"
      )}))`
    );
  }

  if (filters.priceMin !== undefined) {
    const variantAlias = alias(productVariants, "variant_price_min");
    where.push(
      sql`EXISTS (SELECT 1 FROM ${variantAlias} WHERE ${variantAlias.productId} = ${products.id} AND ${variantAlias.price} >= ${filters.priceMin})`
    );
  }

  if (filters.priceMax !== undefined) {
    const variantAlias = alias(productVariants, "variant_price_max");
    where.push(
      sql`EXISTS (SELECT 1 FROM ${variantAlias} WHERE ${variantAlias.productId} = ${products.id} AND ${variantAlias.price} <= ${filters.priceMax})`
    );
  }

  let primarySort: SQL<unknown> | null = null;

  switch (filters.sortBy) {
    case "price_asc":
      primarySort = asc(sql`MIN(${productVariants.price})`);
      break;
    case "price_desc":
      primarySort = desc(sql`MAX(${productVariants.price})`);
      break;
    case "latest":
    default:
      primarySort = desc(products.createdAt);
      break;
  }

  if (primarySort) {
    orderBy.push(primarySort);
  }

  if (filters.sortBy && filters.sortBy !== "latest") {
    orderBy.push(desc(products.createdAt));
  }

  const offset = (filters.page - 1) * filters.limit;

  return {
    where,
    orderBy,
    limit: filters.limit,
    offset,
    colorFilterIds,
  };
}
