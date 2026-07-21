import { useEffect, useState, useCallback } from "react";
import {
  ensureSeed,
  getCart,
  setCart,
  getCategories,
  getProducts,
  getOrders,
  setOrders,
  currentUser,
  setSession,
  getUsers,
  setUsers,
  getSettings,
  setSettings,
  type CartItem,
  type Order,
  type User,
  type Settings,
  type Category,
  type Product,
  uid,
} from "./store";

export function useStoreVersion() {
  const [, setV] = useState(0);
  useEffect(() => {
    ensureSeed();
    setV((n) => n + 1);
    const bump = () => setV((n) => n + 1);
    window.addEventListener("app:store-change", bump);
    window.addEventListener("storage", bump);
    return () => {
      window.removeEventListener("app:store-change", bump);
      window.removeEventListener("storage", bump);
    };
  }, []);
}

export function useCategories(): Category[] {
  useStoreVersion();
  return typeof window === "undefined" ? [] : getCategories();
}
export function useProducts(): Product[] {
  useStoreVersion();
  return typeof window === "undefined" ? [] : getProducts();
}
export function useOrders(): Order[] {
  useStoreVersion();
  return typeof window === "undefined" ? [] : getOrders();
}
export function useUsers(): User[] {
  useStoreVersion();
  return typeof window === "undefined" ? [] : getUsers();
}
export function useSettings(): Settings {
  useStoreVersion();
  return typeof window === "undefined"
    ? { whatsappNumber: "", businessName: "Omar Drinks" }
    : getSettings();
}
export function useCurrentUser(): User | null {
  useStoreVersion();
  return typeof window === "undefined" ? null : currentUser();
}
export function useCart(): CartItem[] {
  useStoreVersion();
  return typeof window === "undefined" ? [] : getCart();
}

export function useCartActions() {
  const add = useCallback((productId: string, qty = 1) => {
    const cart = getCart();
    const existing = cart.find((i) => i.productId === productId);
    if (existing) existing.qty += qty;
    else cart.push({ productId, qty });
    setCart([...cart]);
  }, []);
  const remove = useCallback((productId: string) => {
    setCart(getCart().filter((i) => i.productId !== productId));
  }, []);
  const setQty = useCallback((productId: string, qty: number) => {
    if (qty <= 0) {
      setCart(getCart().filter((i) => i.productId !== productId));
      return;
    }
    const cart = getCart();
    const it = cart.find((i) => i.productId === productId);
    if (it) it.qty = qty;
    setCart([...cart]);
  }, []);
  const clear = useCallback(() => setCart([]), []);
  return { add, remove, setQty, clear };
}

export function login(email: string, password: string): User | null {
  const u = getUsers().find((x) => x.email === email && x.password === password);
  if (u) setSession({ email: u.email });
  return u ?? null;
}
export function register(email: string, name: string, password: string): User | null {
  const users = getUsers();
  if (users.find((u) => u.email === email)) return null;
  const u: User = { email, name, password, role: "customer" };
  users.push(u);
  setUsers(users);
  setSession({ email });
  return u;
}
export function logout() {
  setSession(null);
}

export function createOrder(order: Omit<Order, "id" | "createdAt" | "status">): Order {
  const o: Order = { ...order, id: uid(), createdAt: Date.now(), status: "pending" };
  setOrders([o, ...getOrders()]);
  return o;
}
export function updateOrderStatus(id: string, status: Order["status"]) {
  setOrders(getOrders().map((o) => (o.id === id ? { ...o, status } : o)));
}

export function saveSettings(s: Settings) {
  setSettings(s);
}
