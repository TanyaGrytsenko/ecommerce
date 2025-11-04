import { parse, stringify, stringifyUrl, type ParsedQuery } from "query-string";

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
