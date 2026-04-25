"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

// ─── Auth Store ───────────────────────────────────────────────────────────────

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  company?: string;
  country?: string;
}

interface AuthState {
  user: AuthUser | null;
  isAuthenticated: boolean;
  login: (user: AuthUser) => void;
  logout: () => void;
  updateProfile: (data: Partial<AuthUser>) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      login: (user) => set({ user, isAuthenticated: true }),
      logout: () => {
        // Clear server-side cookie
        fetch("/api/auth/logout", { method: "POST" }).catch(() => {});
        set({ user: null, isAuthenticated: false });
      },
      updateProfile: (data) =>
        set((state) => ({
          user: state.user ? { ...state.user, ...data } : null,
        })),
    }),
    { name: "megacore-auth" },
  ),
);

// ─── Wishlist Store ───────────────────────────────────────────────────────────

export interface WishlistItem {
  productId: string;
  code: string;
  name: string;
  subCategory: string;
  image: string;
  moq: number;
  price: number | null;
  quantity: number;
  notes: string;
}

interface WishlistState {
  items: WishlistItem[];
  addItem: (item: Omit<WishlistItem, "quantity" | "notes">) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  updateNotes: (productId: string, notes: string) => void;
  clearWishlist: () => void;
  isInWishlist: (productId: string) => boolean;
}

export const useWishlistStore = create<WishlistState>()(
  persist(
    (set, get) => ({
      items: [],
      addItem: (item) => {
        const exists = get().items.find((i) => i.productId === item.productId);
        if (!exists) {
          set((state) => ({
            items: [...state.items, { ...item, quantity: item.moq, notes: "" }],
          }));
        }
      },
      removeItem: (productId) =>
        set((state) => ({
          items: state.items.filter((i) => i.productId !== productId),
        })),
      updateQuantity: (productId, quantity) =>
        set((state) => ({
          items: state.items.map((i) =>
            i.productId === productId ? { ...i, quantity } : i,
          ),
        })),
      updateNotes: (productId, notes) =>
        set((state) => ({
          items: state.items.map((i) =>
            i.productId === productId ? { ...i, notes } : i,
          ),
        })),
      clearWishlist: () => set({ items: [] }),
      isInWishlist: (productId) =>
        get().items.some((i) => i.productId === productId),
    }),
    { name: "megacore-wishlist" },
  ),
);

// ─── WhatsApp message generator ───────────────────────────────────────────────

const WHATSAPP_NUMBER = "923377270001";

export function generateWhatsAppURL(
  items: WishlistItem[],
  buyer?: { name?: string; company?: string; email?: string; country?: string },
): string {
  if (items.length === 0) return "";

  const lines: string[] = [];

  lines.push("Hello,");
  lines.push("");
  lines.push("I am contacting you from the Megacore International website.");
  lines.push("");

  if (buyer?.name || buyer?.company) {
    lines.push("Buyer Details:");
    if (buyer.name) lines.push(`Name: ${buyer.name}`);
    if (buyer.company) lines.push(`Company: ${buyer.company}`);
    if (buyer.email) lines.push(`Email: ${buyer.email}`);
    if (buyer.country) lines.push(`Country: ${buyer.country}`);
    lines.push("");
  }

  lines.push("I am interested in discussing an order for the following products:");
  lines.push("");

  items.forEach((item, i) => {
    lines.push(`${i + 1}. Product: ${item.name}`);
    lines.push(`   Code: ${item.code}`);
    lines.push(`   Category: ${item.subCategory}`);
    lines.push(`   Quantity: ${item.quantity} pcs`);
    if (item.notes) lines.push(`   Notes: ${item.notes}`);
    lines.push("");
  });

  lines.push("Please share product details, pricing, customization options, and next steps for order discussion.");
  lines.push("");
  lines.push("Thank you.");

  const message = lines.join("\n");
  const encoded = encodeURIComponent(message);
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encoded}`;
}
