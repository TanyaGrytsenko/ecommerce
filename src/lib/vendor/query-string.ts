export type ArrayFormat = "comma" | "none";

export interface ParseOptions {
  arrayFormat?: ArrayFormat;
}

export interface StringifyOptions extends ParseOptions {
  skipEmptyString?: boolean;
  skipNull?: boolean;
  sort?: boolean;
}

export type StringifyUrlOptions = StringifyOptions;

export type ParsedQueryValue = string | string[] | null | undefined;
export type ParsedQuery<T extends string = string> = Record<string, T | T[] | null>;
export type ParsedQueryInput = Record<string, ParsedQueryValue>;

const DEFAULT_ARRAY_FORMAT: ArrayFormat = "comma";

function decode(value: string) {
  try {
    return decodeURIComponent(value.replace(/\+/g, " "));
  } catch {
    return value;
  }
}

function encode(value: string) {
  return encodeURIComponent(value).replace(/%20/g, "+");
}

function toArray(value: ParsedQueryValue): string[] {
  if (value === undefined || value === null) {
    return [];
  }

  if (Array.isArray(value)) {
    return value.filter((item): item is string => typeof item === "string");
  }

  return typeof value === "string" ? [value] : [];
}

export function parse(input: string, options: ParseOptions = {}): ParsedQuery<string> {
  const source = input.startsWith("?") ? input.slice(1) : input;
  const arrayFormat = options.arrayFormat ?? DEFAULT_ARRAY_FORMAT;
  const result: Record<string, ParsedQueryValue> = {};

  if (!source) {
    return {};
  }

  for (const segment of source.split("&")) {
    if (!segment) continue;

    const [encodedKey, ...rest] = segment.split("=");
    const key = decode(encodedKey);

    if (!key) continue;

    if (rest.length === 0) {
      result[key] = null;
      continue;
    }

    const rawValue = rest.join("=");
    const decoded = decode(rawValue);

    const values = arrayFormat === "comma" ? decoded.split(",").map((item) => item.trim()) : [decoded];
    const cleanValues = values.filter((v) => v.length > 0);

    const existing = result[key];
    const aggregated = [
      ...toArray(existing),
      ...cleanValues,
    ];

    if (aggregated.length === 0) {
      result[key] = "";
    } else if (aggregated.length === 1) {
      result[key] = aggregated[0];
    } else {
      result[key] = aggregated;
    }
  }

  return result as ParsedQuery<string>;
}

export function stringify(
  query: ParsedQueryInput,
  options: StringifyOptions = {}
): string {
  const arrayFormat = options.arrayFormat ?? DEFAULT_ARRAY_FORMAT;
  const shouldSkipEmpty = options.skipEmptyString ?? false;
  const shouldSkipNull = options.skipNull ?? false;

  const keys = Object.keys(query);
  if (options.sort) {
    keys.sort();
  }

  const segments: string[] = [];

  for (const key of keys) {
    const value = query[key];

    if (value === undefined) continue;
    if (value === null) {
      if (!shouldSkipNull) {
        segments.push(encode(key));
      }
      continue;
    }

    const values = toArray(value);

    if (values.length === 0) {
      if (!shouldSkipEmpty) {
        segments.push(`${encode(key)}=`);
      }
      continue;
    }

    if (arrayFormat === "comma") {
      const filtered = shouldSkipEmpty
        ? values.filter((item) => item.length > 0)
        : values;

      if (filtered.length === 0 && shouldSkipEmpty) {
        continue;
      }

      segments.push(`${encode(key)}=${filtered.map((item) => encode(item)).join(",")}`);
      continue;
    }

    for (const item of values) {
      if (shouldSkipEmpty && item.length === 0) {
        continue;
      }
      segments.push(`${encode(key)}=${encode(item)}`);
    }
  }

  return segments.join("&");
}

export interface StringifyUrlInput {
  url: string;
  query?: ParsedQueryInput;
}

export function stringifyUrl(
  { url, query = {} }: StringifyUrlInput,
  options: StringifyUrlOptions = {}
): string {
  const [base, hash] = url.split("#");
  const queryString = stringify(query, options);

  if (!queryString) {
    return hash ? `${base}#${hash}` : base;
  }

  const hasExistingQuery = base.includes("?");
  const separator = hasExistingQuery ? (base.endsWith("?") || base.endsWith("&") ? "" : "&") : "?";
  const target = `${base}${separator}${queryString}`;

  return hash ? `${target}#${hash}` : target;
}

const queryString = {
  parse,
  stringify,
  stringifyUrl,
};

export default queryString;
