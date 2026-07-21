// Local storage-based store for the drinks e-commerce MVP.
// Not for production — no real auth, no server persistence.

export type Section = "spiritueux" | "sans_alcool" | "complementaires";

export interface Category {
  id: string;
  slug: string;
  name: string;
  section: Section;
  icon?: string;
  custom?: boolean;
}

export interface Product {
  id: string;
  name: string;
  categoryId: string;
  price: number; // in EUR
  description?: string;
  image?: string;
  stock?: number;
}

export interface CartItem {
  productId: string;
  qty: number;
}

export interface OrderItem {
  productId: string;
  name: string;
  price: number;
  qty: number;
}

export interface Order {
  id: string;
  userEmail: string;
  userName: string;
  location: string; // terrasse / bar / hotel / mini-bar / autre
  room?: string;
  note?: string;
  items: OrderItem[];
  total: number;
  status: "pending" | "confirmed" | "delivered" | "cancelled";
  createdAt: number;
}

export interface User {
  email: string;
  name: string;
  password: string; // plaintext, DEMO only
  role: "admin" | "customer";
}

export interface Settings {
  whatsappNumber: string; // E.164 without +, e.g. 33612345678
  businessName: string;
}

const K = {
  categories: "app.categories",
  products: "app.products",
  orders: "app.orders",
  users: "app.users",
  session: "app.session",
  settings: "app.settings",
  cart: "app.cart",
  seeded: "app.seeded.v3",
};

// ---- helpers ----
function read<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}
function write<T>(key: string, value: T) {
  if (typeof window === "undefined") return;
  localStorage.setItem(key, JSON.stringify(value));
  window.dispatchEvent(new CustomEvent("app:store-change", { detail: { key } }));
}
export const uid = () => Math.random().toString(36).slice(2, 10);
export const slugify = (s: string) =>
  s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

// ---- seed ----
const SEED_CATEGORIES: Omit<Category, "id">[] = [
  { slug: "whisky", name: "Whisky", section: "spiritueux", icon: "🥃" },
  { slug: "scotch-whisky", name: "Scotch Whisky", section: "spiritueux", icon: "🥃" },
  { slug: "bourbon", name: "Bourbon", section: "spiritueux", icon: "🥃" },
  { slug: "irish-whiskey", name: "Irish Whiskey", section: "spiritueux", icon: "🥃" },
  { slug: "japanese-whisky", name: "Japanese Whisky", section: "spiritueux", icon: "🥃" },
  { slug: "vins", name: "Vins", section: "spiritueux", icon: "🍷" },
  { slug: "champagnes", name: "Champagnes", section: "spiritueux", icon: "🍾" },
  { slug: "prosecco", name: "Prosecco & effervescents", section: "spiritueux", icon: "🥂" },
  { slug: "cognac", name: "Cognac", section: "spiritueux", icon: "🥃" },
  { slug: "armagnac", name: "Armagnac", section: "spiritueux", icon: "🥃" },
  { slug: "brandy", name: "Brandy", section: "spiritueux", icon: "🥃" },
  { slug: "biere", name: "Bière", section: "spiritueux", icon: "🍺" },
  { slug: "cidre", name: "Cidre", section: "spiritueux", icon: "🍏" },
  { slug: "rhum", name: "Rhum", section: "spiritueux", icon: "🥃" },
  { slug: "gin", name: "Gin", section: "spiritueux", icon: "🍸" },
  { slug: "tequila", name: "Tequila", section: "spiritueux", icon: "🥃" },
  { slug: "vodka", name: "Vodka", section: "spiritueux", icon: "🍸" },
  { slug: "liqueurs", name: "Liqueurs", section: "spiritueux", icon: "🍹" },
  { slug: "cream-liqueurs", name: "Cream Liqueurs", section: "spiritueux", icon: "🍶" },
  { slug: "aperitifs", name: "Apéritifs", section: "spiritueux", icon: "🍹" },
  { slug: "vermouth", name: "Vermouth", section: "spiritueux", icon: "🍸" },
  { slug: "rtd", name: "Cocktails RTD", section: "spiritueux", icon: "🍹" },
  { slug: "spiritueux-locaux", name: "Spiritueux locaux / artisanaux", section: "spiritueux", icon: "🏺" },

  { slug: "sans-alcool", name: "Boissons sans alcool", section: "sans_alcool", icon: "🥤" },
  { slug: "soft-drinks", name: "Soft drinks", section: "sans_alcool", icon: "🥤" },
  { slug: "jus", name: "Jus & nectars", section: "sans_alcool", icon: "🧃" },
  { slug: "eaux", name: "Eaux minérales", section: "sans_alcool", icon: "💧" },
  { slug: "energisantes", name: "Boissons énergisantes", section: "sans_alcool", icon: "⚡" },

  { slug: "nouveautes", name: "Nouveautés & tendances", section: "complementaires", icon: "✨" },
  { slug: "promotions", name: "Promotions & offres", section: "complementaires", icon: "🏷️" },
  { slug: "marques", name: "Marques partenaires", section: "complementaires", icon: "🤝" },
  { slug: "evenements", name: "Événements & activations", section: "complementaires", icon: "🎉" },
  { slug: "academy", name: "Formations produits", section: "complementaires", icon: "🎓" },
];

const SEED_PRODUCTS: Array<Omit<Product, "id" | "categoryId"> & { categorySlug: string }> = [
  { categorySlug: "whisky", name: "Jack Daniel's Old No.7", price: 32, description: "Whiskey Tennessee 70cl", image: "/__l5e/assets-v1/35bd96f1-bc7d-4bba-9fe0-688177e82368/jack.jpg" },
  { categorySlug: "scotch-whisky", name: "Glenfiddich 12 ans", price: 45, description: "Single Malt 70cl", image: "/__l5e/assets-v1/e801c0f7-274e-43ed-998d-38b39b8f4232/glenfiddich.jpg" },
  { categorySlug: "scotch-whisky", name: "Monkey Shoulder Batch 27", price: 42, description: "Blended Malt Scotch Whisky 70cl", image: "/__l5e/assets-v1/e3f78f62-5231-442c-bbf9-ecfd4b0ace65/IMG-20260720-WA0089.jpg" },
  { categorySlug: "bourbon", name: "Maker's Mark", price: 38, description: "Kentucky Bourbon 70cl", image: "/__l5e/assets-v1/adfc477f-ddf9-4ffa-ab78-7cdcb943f8e5/makers.jpg" },
  { categorySlug: "japanese-whisky", name: "Hibiki Harmony", price: 95, description: "Blend Japonais 70cl", image: "/__l5e/assets-v1/fe3fb1a7-365f-4838-b8bc-f744db2e2ac4/hibiki.jpg" },
  { categorySlug: "vins", name: "Château Margaux 2018", price: 120, description: "Bordeaux rouge", image: "/__l5e/assets-v1/db41bf4f-607f-494a-94db-39271790c681/margaux.jpg" },
  { categorySlug: "champagnes", name: "Moët & Chandon Impérial", price: 55, description: "Brut 75cl", image: "/__l5e/assets-v1/3b3f3129-8ff1-4e18-8fac-417c664d1156/moet.jpg" },
  { categorySlug: "champagnes", name: "Taittinger Brut Réserve", price: 48, description: "Champagne Reims 75cl", image: "/__l5e/assets-v1/a65fbc13-7966-4c71-b831-37abf41cb808/IMG-20260720-WA0088.jpg" },
  { categorySlug: "champagnes", name: "Charles Collin Brut", price: 35, description: "Champagne Fondé en 1952 75cl", image: "/__l5e/assets-v1/bd5cee9f-7f9e-4d96-b7b8-ca182eb2de3d/IMG-20260720-WA0094.jpg" },
  { categorySlug: "prosecco", name: "La Marca Prosecco", price: 18, description: "DOC 75cl", image: "/__l5e/assets-v1/1a692f97-d0c0-4256-9246-209d993ed816/lamarca.jpg" },
  { categorySlug: "prosecco", name: "Baron d'Arignac Ice Demi-Sec", price: 14, description: "Effervescent 75cl", image: "/__l5e/assets-v1/5456fc07-2f5f-4b0c-9fa2-882582dfd1bc/IMG-20260720-WA0095.jpg" },
  { categorySlug: "cognac", name: "Hennessy VS", price: 42, description: "Cognac 70cl", image: "/__l5e/assets-v1/13ccf75b-a38d-4125-8711-9ca203b770a0/hennessy.jpg" },
  { categorySlug: "biere", name: "Heineken", price: 4, description: "Pression 50cl", image: "/__l5e/assets-v1/2981c6d9-67d6-4d4c-accb-653096e037ae/heineken.jpg" },
  { categorySlug: "biere", name: "Guinness", price: 6, description: "Stout 50cl", image: "/__l5e/assets-v1/af9a23f6-57ca-4bd2-8350-f9049cd747b3/guinness.jpg" },
  { categorySlug: "rhum", name: "Diplomatico Reserva", price: 40, description: "Rhum vénézuélien 70cl", image: "/__l5e/assets-v1/569a6bc5-f4eb-4f4b-8b7d-c25443fb75a4/diplomatico.jpg" },
  { categorySlug: "gin", name: "Hendrick's", price: 35, description: "Gin écossais 70cl", image: "/__l5e/assets-v1/fee34e23-2e80-4f43-89a9-06b0bc9bf1ee/hendricks.jpg" },
  { categorySlug: "tequila", name: "Patrón Silver", price: 55, description: "Tequila 70cl", image: "/__l5e/assets-v1/2f12c11c-9236-4ee2-a1bb-21ab99668f9c/patron.jpg" },
  { categorySlug: "vodka", name: "Grey Goose", price: 45, description: "Vodka française 70cl", image: "/__l5e/assets-v1/0422e1ba-c1bf-4bb3-ad04-f71f2079b648/greygoose.jpg" },
  { categorySlug: "liqueurs", name: "Cointreau", price: 25, description: "Liqueur d'orange 70cl", image: "/__l5e/assets-v1/a97be582-5141-4581-bd80-adf345096836/cointreau.jpg" },
  { categorySlug: "aperitifs", name: "Aperol", price: 18, description: "Apéritif italien 70cl", image: "/__l5e/assets-v1/bf401304-0db0-439d-812a-1d015e17cae6/aperol.jpg" },
  { categorySlug: "soft-drinks", name: "Coca-Cola", price: 3, description: "Canette 33cl", image: "/__l5e/assets-v1/5396b0e7-13f1-4fb2-abe7-df77a0783ffb/coke.jpg" },
  { categorySlug: "soft-drinks", name: "Sprite", price: 3, description: "Canette 33cl", image: "/__l5e/assets-v1/fd1467af-3dce-4db0-a617-77e6cc1bb99c/sprite.jpg" },
  { categorySlug: "jus", name: "Jus d'orange pressé", price: 5, description: "Frais 25cl", image: "/__l5e/assets-v1/4014c4de-348c-4f93-8f55-e089425d834b/oj.jpg" },
  { categorySlug: "eaux", name: "Perrier", price: 3, description: "Eau gazeuse 33cl", image: "/__l5e/assets-v1/1e6aab1a-98b4-4849-857e-403e11afcfb6/perrier.jpg" },
  { categorySlug: "eaux", name: "Evian", price: 2.5, description: "Eau plate 50cl", image: "/__l5e/assets-v1/4e348ea1-b7c1-48d7-a88d-f0282da53dfa/evian.jpg" },
  { categorySlug: "energisantes", name: "Red Bull", price: 4.5, description: "Canette 25cl", image: "/__l5e/assets-v1/b52859d5-9acd-4ebf-837b-e145d8d9cfac/redbull.jpg" },
  { categorySlug: "sans-alcool", name: "Nozeco Sparkling Special Edition", price: 9, description: "Vin effervescent sans alcool 75cl — Vegan", image: "/__l5e/assets-v1/bef853bd-a3fc-40a3-9654-2fa69748f7e1/IMG-20260720-WA0090.jpg" },
  { categorySlug: "sans-alcool", name: "Nozeco Still Merlot 0.0", price: 8, description: "Vin rouge sans alcool 75cl — Vegan", image: "/__l5e/assets-v1/d9f9d664-145e-4d73-94dc-532617ef3fbb/IMG-20260720-WA0091.jpg" },
  { categorySlug: "sans-alcool", name: "Nozeco Still Chardonnay 0.0", price: 8, description: "Vin blanc sans alcool 75cl — Vegan", image: "/__l5e/assets-v1/217c273a-de2c-4f68-9355-8c9474c9b78d/IMG-20260720-WA0092.jpg" },
  { categorySlug: "sans-alcool", name: "Nozeco Buck's Fizz", price: 10, description: "Effervescent orange sans alcool 75cl", image: "/__l5e/assets-v1/a9712bad-ad0c-421d-aa5e-01c692b7e336/IMG-20260720-WA0093.jpg" },
  { categorySlug: "nouveautes", name: "Roku Gin", price: 38, description: "Nouveauté Japon", image: "/__l5e/assets-v1/985faf08-a570-478b-97b0-342ee12721b7/roku.jpg" },
  { categorySlug: "promotions", name: "Pack Mojito (-20%)", price: 48, description: "Rhum + citron vert + menthe", image: "/__l5e/assets-v1/2557be31-f9e5-4e32-973b-2a14a8af66d3/mojito.jpg" },
];

export function ensureSeed() {
  if (typeof window === "undefined") return;
  if (!localStorage.getItem(K.seeded)) {
    const categories: Category[] = SEED_CATEGORIES.map((c) => ({ ...c, id: uid() }));
    const bySlug = new Map(categories.map((c) => [c.slug, c.id]));
    const products: Product[] = SEED_PRODUCTS.map((p) => ({
      id: uid(),
      name: p.name,
      price: p.price,
      description: p.description,
      image: p.image,
      categoryId: bySlug.get(p.categorySlug)!,
    }));

    const users: User[] = [
      { email: "admin@bar.app", name: "Administrateur", password: "admin", role: "admin" },
    ];
    const settings: Settings = { whatsappNumber: "33612345678", businessName: "Le Comptoir" };

    write(K.categories, categories);
    write(K.products, products);
    write(K.users, users);
    write(K.settings, settings);
    write(K.orders, []);
    localStorage.setItem(K.seeded, "1");
  }

  // Sync product images from seed (for previously-seeded users)
  const imgSyncKey = "app.imgSync.v2";
  if (!localStorage.getItem(imgSyncKey)) {
    const imgByName = new Map(SEED_PRODUCTS.map((p) => [p.name, p.image]));
    const existing = read<Product[]>(K.products, []);
    let changed = false;
    const updated = existing.map((p) => {
      const newImg = imgByName.get(p.name);
      if (newImg && p.image !== newImg) {
        changed = true;
        return { ...p, image: newImg };
      }
      return p;
    });
    if (changed) write(K.products, updated);
    localStorage.setItem(imgSyncKey, "1");
  }
}

// ---- accessors ----
export const getCategories = () => read<Category[]>(K.categories, []);
export const setCategories = (v: Category[]) => write(K.categories, v);
export const getProducts = () => read<Product[]>(K.products, []);
export const setProducts = (v: Product[]) => write(K.products, v);
export const getOrders = () => read<Order[]>(K.orders, []);
export const setOrders = (v: Order[]) => write(K.orders, v);
export const getUsers = () => read<User[]>(K.users, []);
export const setUsers = (v: User[]) => write(K.users, v);
export const getSession = () => read<{ email: string } | null>(K.session, null);
export const setSession = (v: { email: string } | null) => write(K.session, v);
export const getSettings = () =>
  read<Settings>(K.settings, { whatsappNumber: "", businessName: "Le Comptoir" });
export const setSettings = (v: Settings) => write(K.settings, v);
export const getCart = () => read<CartItem[]>(K.cart, []);
export const setCart = (v: CartItem[]) => write(K.cart, v);

export function currentUser(): User | null {
  const s = getSession();
  if (!s) return null;
  return getUsers().find((u) => u.email === s.email) ?? null;
}
