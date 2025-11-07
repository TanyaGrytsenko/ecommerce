export interface ProductVariantImage {
  src: string;
  alt: string;
}

export interface ProductVariantOption {
  id: string;
  value: string;
  label: string;
  colorFamily: string;
  thumbnail: string;
  gallery: ProductVariantImage[];
}

export interface ProductSizeOption {
  value: string;
  label: string;
  disabled?: boolean;
}

export interface RecommendationProduct {
  slug: string;
  name: string;
  category: string;
  image: string;
  price: number;
  label?: string;
  colorsAvailable: number;
}

export interface ProductDetail {
  slug: string;
  name: string;
  category: string;
  price: number;
  promoMessage: string;
  badge: string;
  description: string;
  details: string[];
  styleCode: string;
  colorDescription: string;
  rating: number;
  ratingCount: number;
  defaultVariant: string;
  variants: ProductVariantOption[];
  sizes: ProductSizeOption[];
  shipping: string;
  returns: string;
  reviews: {
    count: number;
    average: number;
    summary: string;
  };
  recommendations: RecommendationProduct[];
}

export const PRODUCT_DETAILS: ProductDetail[] = [
  {
    slug: "nike-air-max-90-se",
    name: "Nike Air Max 90 SE",
    category: "Women's Shoes",
    price: 140,
    promoMessage: "Extra 20% off w/ code SPORT",
    badge: "Highly Rated",
    description:
      "The icon that helped define an era keeps the same plush cushioning and bold lines you love. Updated materials and color blocking celebrate 90s running DNA while feeling fresh for right now.",
    details: [
      "Plush padded collar feels soft around the ankle",
      "Visible Air unit delivers responsive cushioning under every step",
      "Foam midsole and Waffle outsole combine classic comfort with durable traction",
      "Shown: White/Dark Team Red/Metallic Silver",
      "Style: FN0134-100",
    ],
    styleCode: "FN0134-100",
    colorDescription: "Color Shown: White/Dark Team Red/Metallic Silver",
    rating: 4.7,
    ratingCount: 126,
    defaultVariant: "dark-team-red",
    variants: [
      {
        id: "dark-team-red",
        value: "dark-team-red",
        label: "White/Dark Team Red",
        colorFamily: "White & Red",
        thumbnail: "/products/nike-air-max-90-se/air-max-90-main.jpg",
        gallery: [
          {
            src: "/products/nike-air-max-90-se/air-max-90-main.jpg",
            alt: "Nike Air Max 90 SE in white and red - lateral view",
          },
          {
            src: "/products/nike-air-max-90-se/air-max-90-detail-1.webp",
            alt: "Detail of Nike Air Max 90 SE midsole",
          },
          {
            src: "/products/nike-air-max-90-se/air-max-90-detail-2.webp",
            alt: "Nike Air Max 90 SE outsole detail",
          },
          {
            src: "/products/nike-air-max-90-se/air-max-90-variant-rose.avif",
            alt: "Nike Air Max 90 SE angled view",
          },
        ],
      },
      {
        id: "photon-dust-rose",
        value: "photon-dust-rose",
        label: "Photon Dust/Medium Soft Pink",
        colorFamily: "Grey & Pink",
        thumbnail:
          "/products/nike-air-max-90-se/air-max-90-variant-rose.avif",
        gallery: [
          {
            src: "/products/nike-air-max-90-se/air-max-90-variant-rose.avif",
            alt: "Nike Air Max 90 SE in grey and pink - lateral view",
          },
          {
            src: "/products/nike-air-max-90-se/air-max-90-main.jpg",
            alt: "Nike Air Max 90 SE heel and collar detail",
          },
          {
            src: "/products/nike-air-max-90-se/air-max-90-detail-1.webp",
            alt: "Air Max unit close up",
          },
          {
            src: "/products/nike-air-max-90-se/air-max-90-detail-2.webp",
            alt: "Nike Air Max 90 SE outsole lugs",
          },
        ],
      },
      {
        id: "white-black",
        value: "white-black",
        label: "Summit White/Black",
        colorFamily: "White & Black",
        thumbnail:
          "/products/nike-air-max-90-se/air-max-90-variant-white.avif",
        gallery: [
          {
            src: "/products/nike-air-max-90-se/air-max-90-variant-white.avif",
            alt: "Nike Air Max 90 SE in white and black - lateral view",
          },
          {
            src: "/products/nike-air-max-90-se/air-max-90-main.jpg",
            alt: "Nike Air Max 90 SE toe box detail",
          },
          {
            src: "/products/nike-air-max-90-se/air-max-90-detail-1.webp",
            alt: "Nike Air Max 90 SE bubble detail",
          },
          {
            src: "/products/nike-air-max-90-se/air-max-90-detail-2.webp",
            alt: "Nike Air Max 90 SE outsole close up",
          },
        ],
      },
    ],
    sizes: [
      { value: "5", label: "US 5" },
      { value: "5.5", label: "US 5.5" },
      { value: "6", label: "US 6" },
      { value: "6.5", label: "US 6.5", disabled: true },
      { value: "7", label: "US 7" },
      { value: "7.5", label: "US 7.5" },
      { value: "8", label: "US 8" },
      { value: "8.5", label: "US 8.5" },
      { value: "9", label: "US 9" },
      { value: "9.5", label: "US 9.5", disabled: true },
      { value: "10", label: "US 10" },
      { value: "10.5", label: "US 10.5" },
      { value: "11", label: "US 11" },
      { value: "11.5", label: "US 11.5" },
      { value: "12", label: "US 12", disabled: true },
    ],
    shipping:
      "Free standard shipping and 60-day returns for Nike Members. Orders arrive in 3-5 business days with expedited options available at checkout.",
    returns:
      "You can return your order for any reason within 60 days. Sneaker releases and certain items are subject to special return policies noted on the product page.",
    reviews: {
      count: 10,
      average: 4.7,
      summary: "4.7 out of 5 stars (10 Reviews)",
    },
    recommendations: [
      {
        slug: "air-force-1-07",
        name: "Nike Air Force 1 '07",
        category: "Women's Shoes",
        image: "/shoes/shoe-5.avif",
        price: 110,
        label: "Best Seller",
        colorsAvailable: 4,
      },
      {
        slug: "dunk-low-retro",
        name: "Nike Dunk Low Retro",
        category: "Women's Shoes",
        image: "/shoes/shoe-8.avif",
        price: 120,
        label: "Extra 20% off",
        colorsAvailable: 6,
      },
      {
        slug: "metcon-9",
        name: "Nike Metcon 9",
        category: "Training",
        image: "/shoes/shoe-3.webp",
        price: 150,
        label: "Top Rated",
        colorsAvailable: 5,
      },
    ],
  },
];

export function getProductDetail(slug: string): ProductDetail | undefined {
  return PRODUCT_DETAILS.find((product) => product.slug === slug);
}
