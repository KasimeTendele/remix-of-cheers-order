import { createFileRoute } from "@tanstack/react-router";
import { useCategories } from "@/lib/store-hooks";
import { setCategories, slugify, uid, type Category, type Section } from "@/lib/store";
import { useState } from "react";
import { Trash2 } from "lucide-react";
import { toast } from "sonner";
import { CategoryIcon } from "@/components/CategoryIcon";

export const Route = createFileRoute("/admin/categories")({
  component: AdminCategories,
});

const SECTIONS: { value: Section; label: string }[] = [
  { value: "spiritueux", label: "Spiritueux & vins" },
  { value: "sans_alcool", label: "Sans alcool" },
  { value: "complementaires", label: "Complémentaires" },
];

function AdminCategories() {
  const categories = useCategories();
  const [name, setName] = useState("");
  const [icon, setIcon] = useState("");
  const [section, setSection] = useState<Section>("complementaires");

  function add(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) return;
    const slug = slugify(name);
    if (categories.some((c) => c.slug === slug)) return toast.error("Catégorie déjà existante");
    const c: Category = {
      id: uid(),
      slug,
      name: name.trim(),
      section,
      icon: icon || undefined,
      custom: true,
    };
    setCategories([...categories, c]);
    setName("");
    setIcon("");
    toast.success("Catégorie ajoutée");
  }
  function remove(id: string) {
    setCategories(categories.filter((c) => c.id !== id));
  }

  const grouped = SECTIONS.map((s) => ({
    ...s,
    items: categories.filter((c) => c.section === s.value),
  }));

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_2fr]">
      <form onSubmit={add} className="rounded-2xl border bg-card p-5 shadow-soft">
        <h2 className="text-lg font-semibold">Ajouter une rubrique</h2>
        <div className="mt-4 space-y-3">
          <label className="block">
            <span className="text-sm font-medium">Nom</span>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="mt-1 w-full rounded-lg border bg-background px-3 py-2 text-sm"
            />
          </label>
          <label className="block">
            <span className="text-sm font-medium">Emoji</span>
            <input
              value={icon}
              onChange={(e) => setIcon(e.target.value)}
              placeholder="✨"
              className="mt-1 w-full rounded-lg border bg-background px-3 py-2 text-sm"
            />
          </label>
          <label className="block">
            <span className="text-sm font-medium">Section</span>
            <select
              value={section}
              onChange={(e) => setSection(e.target.value as Section)}
              className="mt-1 w-full rounded-lg border bg-background px-3 py-2 text-sm"
            >
              {SECTIONS.map((s) => (
                <option key={s.value} value={s.value}>
                  {s.label}
                </option>
              ))}
            </select>
          </label>
          <button className="w-full rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:opacity-90">
            Ajouter
          </button>
        </div>
      </form>

      <div className="space-y-6">
        {grouped.map((g) => (
          <div key={g.value}>
            <h3 className="mb-2 text-sm font-semibold uppercase tracking-wide text-muted-foreground">
              {g.label}
            </h3>
            <ul className="divide-y rounded-2xl border bg-card">
              {g.items.length === 0 && (
                <li className="p-4 text-sm text-muted-foreground">Vide</li>
              )}
              {g.items.map((c) => (
                <li key={c.id} className="flex items-center gap-3 p-3">
                  <CategoryIcon slug={c.slug} className="h-5 w-5 text-primary" />
                  <div className="flex-1">
                    <div className="font-medium">{c.name}</div>
                    <div className="text-xs text-muted-foreground">/{c.slug}</div>
                  </div>
                  <button
                    onClick={() => remove(c.id)}
                    className="grid h-8 w-8 place-items-center rounded-lg text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}
