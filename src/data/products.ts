import type { CardAccent } from "@/src/components/Card";

export type Audience = "men" | "women" | "unisex" | "kids";

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  genders: Audience[];
  sizes: string[];
  colors: string[];
  image: string;
  badge?: string;
  accent?: CardAccent;
  releaseDate: string;
  featuredRank: number;
}

export interface FilterOption {
  value: string;
  label: string;
}

export interface PriceOption extends FilterOption {
  min: number;
  max: number;
}

export const GENDER_OPTIONS: FilterOption[] = [
  { value: "men", label: "Men" },
  { value: "women", label: "Women" },
  { value: "unisex", label: "Unisex" },
  { value: "kids", label: "Kids" },
];

export const SIZE_OPTIONS: FilterOption[] = [
  { value: "5", label: "US 5" },
  { value: "6", label: "US 6" },
  { value: "7", label: "US 7" },
  { value: "8", label: "US 8" },
  { value: "9", label: "US 9" },
  { value: "10", label: "US 10" },
  { value: "11", label: "US 11" },
  { value: "12", label: "US 12" },
];

export const COLOR_OPTIONS: FilterOption[] = [
  { value: "white", label: "White" },
  { value: "black", label: "Black" },
  { value: "red", label: "Red" },
  { value: "blue", label: "Blue" },
  { value: "green", label: "Green" },
  { value: "grey", label: "Grey" },
  { value: "silver", label: "Silver" },
  { value: "pink", label: "Pink" },
  { value: "multicolor", label: "Multicolor" },
];

export const PRICE_OPTIONS: PriceOption[] = [
  { value: "under-100", label: "Under $100", min: 0, max: 100 },
  { value: "100-150", label: "$100 - $150", min: 100, max: 150 },
  { value: "150-200", label: "$150 - $200", min: 150, max: 200 },
  { value: "200-plus", label: "$200 & Above", min: 200, max: Number.POSITIVE_INFINITY },
];

export const PRODUCTS: Product[] = [
  {
    id: "air-max-90-essential",
    name: "Nike Air Max 90 Essential",
    description: "Classic cushioning with updated materials for everyday wear.",
    price: 130,
    genders: ["men", "women"],
    sizes: ["6", "7", "8", "9", "10", "11"],
    colors: ["white", "red"],
    image: "/shoes/shoe-1.jpg",
    badge: "Best Seller",
    accent: "orange",
    releaseDate: "2024-03-18",
    featuredRank: 1,
  },
  {
    id: "pegasus-trail-4-goretex",
    name: "Nike Pegasus Trail 4 GORE-TEX",
    description: "Weather-ready trail runner with responsive React foam.",
    price: 160,
    genders: ["men", "women"],
    sizes: ["7", "8", "9", "10", "11", "12"],
    colors: ["black", "green"],
    image: "/shoes/shoe-2.webp",
    badge: "Storm Ready",
    accent: "green",
    releaseDate: "2024-09-01",
    featuredRank: 3,
  },
  {
    id: "metcon-9",
    name: "Nike Metcon 9",
    description: "Stable platform built for the heaviest gym sessions.",
    price: 150,
    genders: ["men", "women"],
    sizes: ["6", "7", "8", "9", "10", "11", "12"],
    colors: ["black", "grey"],
    image: "/shoes/shoe-3.webp",
    badge: "Training Essential",
    accent: "red",
    releaseDate: "2024-06-10",
    featuredRank: 5,
  },
  {
    id: "vomero-17",
    name: "Nike Vomero 17",
    description: "Plush cushioning with ZoomX for long-distance comfort.",
    price: 180,
    genders: ["men", "women"],
    sizes: ["7", "8", "9", "10", "11"],
    colors: ["blue", "white"],
    image: "/shoes/shoe-4.webp",
    badge: "Premium Cushion",
    accent: "green",
    releaseDate: "2024-07-22",
    featuredRank: 4,
  },
  {
    id: "air-force-1-07",
    name: "Nike Air Force 1 '07",
    description: "Iconic court style refined for modern streetwear.",
    price: 110,
    genders: ["men", "women", "unisex"],
    sizes: ["5", "6", "7", "8", "9", "10", "11", "12"],
    colors: ["white"],
    image: "/shoes/shoe-5.avif",
    badge: "Always Iconic",
    accent: "dark",
    releaseDate: "2023-12-01",
    featuredRank: 2,
  },
  {
    id: "free-run-5",
    name: "Nike Free Run 5",
    description: "Natural motion running shoe with flexible outsole grooves.",
    price: 100,
    genders: ["women", "unisex"],
    sizes: ["5", "6", "7", "8", "9"],
    colors: ["pink", "white"],
    image: "/shoes/shoe-6.avif",
    badge: "Lightweight",
    accent: "orange",
    releaseDate: "2024-04-05",
    featuredRank: 8,
  },
  {
    id: "zoom-fly-5",
    name: "Nike Zoom Fly 5",
    description: "Propulsive plate-powered runner built for tempo days.",
    price: 170,
    genders: ["men", "women"],
    sizes: ["7", "8", "9", "10", "11"],
    colors: ["blue", "black"],
    image: "/shoes/shoe-7.avif",
    badge: "Race Day",
    accent: "green",
    releaseDate: "2024-08-14",
    featuredRank: 6,
  },
  {
    id: "dunk-low-retro",
    name: "Nike Dunk Low Retro",
    description: "Heritage hoops style with vibrant seasonal hues.",
    price: 120,
    genders: ["men", "women", "unisex"],
    sizes: ["5", "6", "7", "8", "9", "10", "11"],
    colors: ["green", "white"],
    image: "/shoes/shoe-8.avif",
    badge: "Limited Color",
    accent: "orange",
    releaseDate: "2024-02-12",
    featuredRank: 7,
  },
  {
    id: "air-jordan-1-mid",
    name: "Air Jordan 1 Mid",
    description: "Legendary hoops silhouette with premium leather overlays.",
    price: 135,
    genders: ["men", "women", "unisex"],
    sizes: ["6", "7", "8", "9", "10", "11", "12"],
    colors: ["red", "black"],
    image: "/shoes/shoe-9.avif",
    badge: "Jordan Brand",
    accent: "red",
    releaseDate: "2024-05-30",
    featuredRank: 9,
  },
  {
    id: "lebron-xxi",
    name: "LeBron XXI",
    description: "Signature responsiveness built to dominate every position.",
    price: 200,
    genders: ["men", "women"],
    sizes: ["7", "8", "9", "10", "11", "12"],
    colors: ["multicolor", "black"],
    image: "/shoes/shoe-10.avif",
    badge: "Max Energy",
    accent: "green",
    releaseDate: "2024-10-05",
    featuredRank: 10,
  },
  {
    id: "air-zoom-structure-25",
    name: "Nike Air Zoom Structure 25",
    description: "Supportive stability runner with springy Zoom Air cushioning.",
    price: 140,
    genders: ["men", "women"],
    sizes: ["7", "8", "9", "10", "11"],
    colors: ["grey", "blue"],
    image: "/shoes/shoe-11.avif",
    badge: "Support",
    accent: "green",
    releaseDate: "2024-01-20",
    featuredRank: 11,
  },
  {
    id: "air-max-97",
    name: "Nike Air Max 97",
    description: "Streamlined waves with full-length visible Air cushioning.",
    price: 185,
    genders: ["men", "women"],
    sizes: ["6", "7", "8", "9", "10", "11"],
    colors: ["silver", "white"],
    image: "/shoes/shoe-12.avif",
    badge: "Icon Reborn",
    accent: "orange",
    releaseDate: "2024-03-01",
    featuredRank: 12,
  },
  {
    id: "air-max-dn",
    name: "Nike Air Max Dn",
    description: "Dynamic Air system for smooth heel-to-toe transitions.",
    price: 210,
    genders: ["men", "women"],
    sizes: ["7", "8", "9", "10", "11"],
    colors: ["black", "white"],
    image: "/shoes/shoe-13.avif",
    badge: "Newest Drop",
    accent: "green",
    releaseDate: "2024-11-01",
    featuredRank: 0,
  },
  {
    id: "nike-go-flyease",
    name: "Nike Go FlyEase",
    description: "Hands-free entry system built for effortless on-and-off.",
    price: 125,
    genders: ["unisex", "kids"],
    sizes: ["5", "6", "7", "8", "9"],
    colors: ["multicolor", "white"],
    image: "/shoes/shoe-14.avif",
    badge: "Hands-Free",
    accent: "green",
    releaseDate: "2024-09-14",
    featuredRank: 13,
  },
  {
    id: "nike-revolution-7",
    name: "Nike Revolution 7",
    description: "Entry-level cushioning with breathable mesh upper.",
    price: 75,
    genders: ["men", "women", "kids"],
    sizes: ["5", "6", "7", "8", "9", "10"],
    colors: ["black", "blue"],
    image: "/shoes/shoe-15.avif",
    badge: "Value Pick",
    accent: "green",
    releaseDate: "2024-02-28",
    featuredRank: 14,
  },
];

export const PRICE_LABEL_LOOKUP = PRICE_OPTIONS.reduce<Record<string, string>>(
  (acc, option) => {
    acc[option.value] = option.label;
    return acc;
  },
  {}
);
