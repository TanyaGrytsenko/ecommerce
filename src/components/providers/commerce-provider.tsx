"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";

export interface CartItem {
  id: string;
  productId: string;
  slug: string;
  name: string;
  price: number;
  variant: string;
  variantLabel: string;
  size: string;
  image: string;
  quantity: number;
}

interface AddToCartPayload {
  productId: string;
  slug: string;
  name: string;
  price: number;
  variant: string;
  variantLabel: string;
  size: string;
  image: string;
}

interface CommerceContextValue {
  cart: CartItem[];
  favorites: string[];
  addToCart: (payload: AddToCartPayload) => void;
  toggleFavorite: (productId: string) => void;
  isFavorite: (productId: string) => boolean;
}

const CommerceContext = createContext<CommerceContextValue | undefined>(
  undefined
);

export function CommerceProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [favorites, setFavorites] = useState<string[]>([]);

  const addToCart = useCallback((payload: AddToCartPayload) => {
    setCart((previous) => {
      const identifier = `${payload.productId}-${payload.variant}-${payload.size}`;
      const existingIndex = previous.findIndex((item) => item.id === identifier);

      if (existingIndex !== -1) {
        const next = [...previous];
        const existing = next[existingIndex];

        next[existingIndex] = {
          ...existing,
          quantity: existing.quantity + 1,
        };

        return next;
      }

      return [
        ...previous,
        {
          id: identifier,
          productId: payload.productId,
          slug: payload.slug,
          name: payload.name,
          price: payload.price,
          variant: payload.variant,
          variantLabel: payload.variantLabel,
          size: payload.size,
          image: payload.image,
          quantity: 1,
        },
      ];
    });
  }, []);

  const toggleFavorite = useCallback((productId: string) => {
    setFavorites((previous) => {
      if (previous.includes(productId)) {
        return previous.filter((id) => id !== productId);
      }

      return [...previous, productId];
    });
  }, []);

  const isFavorite = useCallback(
    (productId: string) => favorites.includes(productId),
    [favorites]
  );

  const value = useMemo<CommerceContextValue>(
    () => ({ cart, favorites, addToCart, toggleFavorite, isFavorite }),
    [addToCart, cart, favorites, isFavorite, toggleFavorite]
  );

  return (
    <CommerceContext.Provider value={value}>
      {children}
    </CommerceContext.Provider>
  );
}

function useCommerceContext() {
  const context = useContext(CommerceContext);

  if (!context) {
    throw new Error("useCommerceContext must be used within CommerceProvider");
  }

  return context;
}

export function useCart() {
  const { cart, addToCart } = useCommerceContext();

  return { cart, addToCart };
}

export function useFavorites() {
  const { favorites, toggleFavorite, isFavorite } = useCommerceContext();

  return { favorites, toggleFavorite, isFavorite };
}
