import { createFileRoute } from "@tanstack/react-router";
import { useCategories, useProducts } from "@/lib/store-hooks";
import { setProducts, uid, type Product } from "@/lib/store";
import { useState } from "react";
import { Trash2 } from "lucide-react";
import { toast } from "sonner";
import { ProductImage } from "@/components/ProductImage";

export const Route = createFileRoute("/admin/products")({
  component: AdminProducts,
});

function AdminProducts() {
  const categories = useCategories();
  const products = useProducts();
  const [form, setForm] = useState({
    name: "",
    categoryId: "",
    price: "",
    description: "",
    image: "",
  });

  function submit(e: React.FormEvent) {
    e.preventDefault();
    const price = parseFloat(form.price);
    if (!form.name || !form.categoryId || isNaN(price)) return toast.error("Champs invalides");
    const p: Product = {
      id: uid(),
      name: form.name,
      categoryId: form.categoryId,
      price,
      description: form.description || undefined,
      image: form.image || undefined,
    };
    setProducts([...products, p]);
    setForm({ name: "", categoryId: "", price: "", description: "", image: "" });
    toast.success("Produit ajouté");
  }
  function remove(id: string) {
    setProducts(products.filter((p) => p.id !== id));
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_2fr]">
      <form onSubmit={submit} className="rounded-2xl border bg-card p-5 shadow-soft">
        <h2 className="text-lg font-semibold">Ajouter un produit</h2>
        <div className="mt-4 space-y-3">
          <Input label="Nom" value={form.name} onChange={(v) => setForm({ ...form, name: v })} />
          <label className="block">
            <span className="text-sm font-medium">Catégorie</span>
            <select
              value={form.categoryId}
              onChange={(e) => setForm({ ...form, categoryId: e.target.value })}
              className="mt-1 w-full rounded-lg border bg-background px-3 py-2 text-sm"
            >
              <option value="">— Sélectionner —</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </label>
          <Input label="Prix ($)" value={form.price} onChange={(v) => setForm({ ...form, price: v })} type="number" />
          <Input label="Description" value={form.description} onChange={(v) => setForm({ ...form, description: v })} />
          <Input label="Emoji / image" value={form.image} onChange={(v) => setForm({ ...form, image: v })} placeholder="🍸" />
          <button className="w-full rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:opacity-90">
            Ajouter
          </button>
        </div>
      </form>

      <div>
        <h2 className="text-lg font-semibold">{products.length} produit{products.length > 1 ? "s" : ""}</h2>
        <ul className="mt-4 divide-y rounded-2xl border bg-card">
          {products.map((p) => {
            const cat = categories.find((c) => c.id === p.categoryId);
            return (
              <li key={p.id} className="flex items-center gap-3 p-3">
                <div className="grid h-10 w-10 place-items-center overflow-hidden rounded-lg bg-secondary">
                  <ProductImage image={p.image} alt={p.name} fallbackSize="text-xl" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="truncate font-medium">{p.name}</div>
                  <div className="text-xs text-muted-foreground">{cat?.name ?? "—"}</div>
                </div>
                <div className="text-sm font-semibold">${p.price.toFixed(2)}</div>
                <button
                  onClick={() => remove(p.id)}
                  className="grid h-8 w-8 place-items-center rounded-lg text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}

function Input({
  label,
  value,
  onChange,
  type = "text",
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
  placeholder?: string;
}) {
  return (
    <label className="block">
      <span className="text-sm font-medium">{label}</span>
      <input
        type={type}
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        step={type === "number" ? "0.01" : undefined}
        className="mt-1 w-full rounded-lg border bg-background px-3 py-2 text-sm"
      />
    </label>
  );
}
