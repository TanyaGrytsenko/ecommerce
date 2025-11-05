import {
  boolean,
  index,
  integer,
  jsonb,
  numeric,
  pgEnum,
  pgTable,
  text,
  timestamp,
  uuid,
} from "drizzle-orm/pg-core";

export const genderEnum = pgEnum("gender", [
  "men",
  "women",
  "unisex",
  "kids",
]);

export const brands = pgTable(
  "brands",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    name: text("name").notNull(),
    slug: text("slug").notNull(),
    createdAt: timestamp("created_at", { mode: "date" })
      .defaultNow()
      .notNull(),
  }
);

export const categories = pgTable(
  "categories",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    name: text("name").notNull(),
    slug: text("slug").notNull(),
    createdAt: timestamp("created_at", { mode: "date" })
      .defaultNow()
      .notNull(),
  }
);

export const colors = pgTable(
  "colors",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    name: text("name").notNull(),
    hex: text("hex").notNull(),
  }
);

export const sizes = pgTable(
  "sizes",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    label: text("label").notNull(),
    sortOrder: integer("sort_order").default(0).notNull(),
  }
);

export const products = pgTable(
  "products",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    name: text("name").notNull(),
    slug: text("slug").notNull(),
    description: text("description"),
    isPublished: boolean("is_published").default(true).notNull(),
    brandId: uuid("brand_id")
      .notNull()
      .references(() => brands.id, { onDelete: "cascade" }),
    categoryId: uuid("category_id")
      .notNull()
      .references(() => categories.id, { onDelete: "cascade" }),
    gender: genderEnum("gender").notNull(),
    createdAt: timestamp("created_at", { mode: "date" })
      .defaultNow()
      .notNull(),
    metadata: jsonb("metadata"),
  },
  (table) => ({
    brandPublishedIdx: index("products_brand_published_idx").on(
      table.brandId,
      table.isPublished
    ),
    categoryPublishedIdx: index("products_category_published_idx").on(
      table.categoryId,
      table.isPublished
    ),
  })
);

export const productVariants = pgTable(
  "product_variants",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    productId: uuid("product_id")
      .notNull()
      .references(() => products.id, { onDelete: "cascade" }),
    sizeId: uuid("size_id")
      .notNull()
      .references(() => sizes.id, { onDelete: "cascade" }),
    colorId: uuid("color_id")
      .notNull()
      .references(() => colors.id, { onDelete: "cascade" }),
    sku: text("sku").notNull(),
    price: numeric("price", { precision: 12, scale: 2 }).notNull(),
    stock: integer("stock").default(0).notNull(),
    createdAt: timestamp("created_at", { mode: "date" })
      .defaultNow()
      .notNull(),
  }
);

export const productImages = pgTable(
  "product_images",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    productId: uuid("product_id")
      .notNull()
      .references(() => products.id, { onDelete: "cascade" }),
    url: text("url").notNull(),
    alt: text("alt"),
    colorId: uuid("color_id").references(() => colors.id, {
      onDelete: "cascade",
    }),
    isPrimary: boolean("is_primary").default(false).notNull(),
    position: integer("position").default(0).notNull(),
    createdAt: timestamp("created_at", { mode: "date" })
      .defaultNow()
      .notNull(),
  },
  (table) => ({
    colorIndex: index("product_images_color_product_idx").on(
      table.colorId,
      table.productId
    ),
  })
);

export const productAttributes = pgTable(
  "product_attributes",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    productId: uuid("product_id")
      .notNull()
      .references(() => products.id, { onDelete: "cascade" }),
    key: text("key").notNull(),
    value: text("value").notNull(),
  }
);

export type ProductRow = typeof products.$inferSelect;
export type ProductVariantRow = typeof productVariants.$inferSelect;
export type ProductImageRow = typeof productImages.$inferSelect;
