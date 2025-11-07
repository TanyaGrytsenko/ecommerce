export interface ProductVariantImage {
  id: string;
  src: string;
  alt: string;
}

export interface ProductVariant {
  id: string;
  label: string;
  description: string;
  swatchClassName: string;
  images: ProductVariantImage[];
}

export interface ProductDetail {
  id: string;
  name: string;
  subtitle: string;
  price: number;
  compareAtPrice?: number;
  offerBadge?: string;
  offerDescription?: string;
  ratingLabel?: string;
  ratingValue: number;
  reviewCount: number;
  description: string;
  highlights: string[];
  details: { label: string; value: string }[];
  sizes: string[];
  variants: ProductVariant[];
  shippingSummary: string;
  returnsSummary: string;
  reviewsSummary?: string;
  recommendedProductIds: string[];
}

export const PRODUCT_DETAILS: Record<string, ProductDetail> = {
  "air-max-90-essential": {
    id: "air-max-90-essential",
    name: "Nike Air Max 90 SE",
    subtitle: "Women's Shoes",
    price: 140,
    compareAtPrice: 200,
    offerBadge: "Extra 40% off code SPORT",
    offerDescription:
      "Celebrate the classics with a seasonal color refresh and a limited-time member offer.",
    ratingLabel: "Highly Rated",
    ratingValue: 4.8,
    reviewCount: 112,
    description:
      "The Nike Air Max 90 SE lets its running roots show with the iconic Waffle outsole and stitched overlays, while plush foam and a visible Max Air unit keep every step cushioned.",
    highlights: [
      "Plush foam midsole with visible Max Air cushioning",
      "Premium leather and textile overlays for structure",
      "Iconic Waffle outsole delivers durable traction",
    ],
    details: [
      { label: "Shown", value: "Pink Foam/White/Metallic Silver" },
      { label: "Style", value: "DZ5632-104" },
      { label: "Fit", value: "True-to-size" },
      { label: "Cushion", value: "Air Max Unit" },
    ],
    sizes: ["5", "5.5", "6", "6.5", "7", "7.5", "8", "8.5", "9", "9.5"],
    variants: [
      {
        id: "pink-foam",
        label: "Pink Foam",
        description: "Pink Foam/Metallic Silver",
        swatchClassName: "bg-[color:#f5ccd9]",
        images: [
          {
            id: "pink-foam-1",
            src: "/shoes/shoe-1.jpg",
            alt: "Nike Air Max 90 SE in pink foam - lateral view",
          },
          {
            id: "pink-foam-2",
            src: "/shoes/shoe-6.avif",
            alt: "Nike Air Max 90 SE pink foam - angled view",
          },
          {
            id: "pink-foam-3",
            src: "/shoes/shoe-12.avif",
            alt: "Nike Air Max 90 SE pink foam - top down",
          },
          {
            id: "pink-foam-4",
            src: "/shoes/shoe-10.avif",
            alt: "Nike Air Max 90 SE pink foam - heel detail",
          },
        ],
      },
      {
        id: "white-summit",
        label: "Summit White",
        description: "Summit White/Photon Dust",
        swatchClassName: "bg-[color:#f4f2ed]",
        images: [
          {
            id: "summit-white-1",
            src: "/shoes/shoe-5.avif",
            alt: "Nike Air Max 90 SE summit white - lateral view",
          },
          {
            id: "summit-white-2",
            src: "/shoes/shoe-11.avif",
            alt: "Nike Air Max 90 SE summit white - lifestyle",
          },
          {
            id: "summit-white-3",
            src: "/shoes/shoe-13.avif",
            alt: "Nike Air Max 90 SE summit white - outsole",
          },
          {
            id: "summit-white-4",
            src: "/shoes/shoe-14.avif",
            alt: "Nike Air Max 90 SE summit white - close up",
          },
        ],
      },
      {
        id: "black-anthracite",
        label: "Black",
        description: "Black/Anthracite",
        swatchClassName: "bg-[color:#1f1f1f]",
        images: [
          {
            id: "black-1",
            src: "/shoes/shoe-3.webp",
            alt: "Nike Air Max 90 SE black - lateral view",
          },
          {
            id: "black-2",
            src: "/shoes/shoe-7.avif",
            alt: "Nike Air Max 90 SE black - angled",
          },
          {
            id: "black-3",
            src: "/shoes/shoe-9.avif",
            alt: "Nike Air Max 90 SE black - detail",
          },
        ],
      },
      {
        id: "sunrise",
        label: "Sunrise",
        description: "Vivid Sulfur/Volt",
        swatchClassName: "bg-[color:#f4c02f]",
        images: [
          {
            id: "sunrise-1",
            src: "/shoes/shoe-2.webp",
            alt: "Nike Air Max 90 SE sunrise - lateral",
          },
          {
            id: "sunrise-2",
            src: "/shoes/shoe-8.avif",
            alt: "Nike Air Max 90 SE sunrise - detail",
          },
          {
            id: "sunrise-3",
            src: "/shoes/shoe-15.avif",
            alt: "Nike Air Max 90 SE sunrise - outsole",
          },
        ],
      },
    ],
    shippingSummary:
      "Free standard shipping on orders $50+ and free 60-day returns for Nike Members.",
    returnsSummary:
      "Need to make a change? Start returns online and drop off at any Nike store or UPS location.",
    reviewsSummary: "Reviews are coming soon. Be the first to share how these feel on-foot.",
    recommendedProductIds: [
      "air-force-1-07",
      "air-max-97",
      "dunk-low-retro",
    ],
  },
};

export function getProductDetail(id: string) {
  return PRODUCT_DETAILS[id];
}
