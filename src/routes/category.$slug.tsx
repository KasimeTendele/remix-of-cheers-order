import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { AppHeader } from "@/components/AppHeader";
import { ProductImage } from "@/components/ProductImage";
import { CategoryIcon } from "@/components/CategoryIcon";
import { ProductAddToCart } from "@/components/ProductAddToCart";
import { useCategories, useProducts } from "@/lib/store-hooks";
import { ArrowLeft } from "lucide-react";

export const Route = createFileRoute("/category/$slug")({
  component: CategoryPage,
});

function CategoryPage() {
  const { slug } = Route.useParams();
  const categories = useCategories();
  const products = useProducts();

  const cat = categories.find((c) => c.slug === slug);
  if (categories.length > 0 && !cat) throw notFound();
  if (!cat) return null;

  const items = products.filter((p) => p.categoryId === cat.id);

  return (
    <div className="min-h-screen bg-background">
      <AppHeader />
      <div className="mx-auto max-w-6xl px-4 py-8">
        <Link
          to="/"
          className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" /> Retour
        </Link>
        <div className="mt-4 flex items-center gap-3">
          <span className="grid h-12 w-12 place-items-center rounded-2xl bg-secondary text-primary">
            <CategoryIcon slug={cat.slug} className="h-6 w-6" />
          </span>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">{cat.name}</h1>
            <p className="text-sm text-muted-foreground">
              {items.length} article{items.length > 1 ? "s" : ""}
            </p>
          </div>
        </div>

        {items.length === 0 ? (
          <div className="mt-10 rounded-2xl border border-dashed p-10 text-center text-sm text-muted-foreground">
            Aucun article dans cette catégorie pour le moment.
          </div>
        ) : (
          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {items.map((p) => (
              <div key={p.id} className="flex flex-col rounded-2xl border bg-card p-4 shadow-soft">
                <div className="mb-3 grid h-32 place-items-center overflow-hidden rounded-xl bg-secondary">
                  <ProductImage image={p.image} alt={p.name} fallbackSize="text-5xl" />
                </div>
                <h3 className="font-semibold">{p.name}</h3>
                {p.description && (
                  <p className="mt-1 text-sm text-muted-foreground">{p.description}</p>
                )}
                <div className="mt-auto pt-4">
                  <ProductAddToCart productId={p.id} productName={p.name} price={p.price} />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
