import { Link } from "@tanstack/react-router";
import { ProductImage } from "@/components/ProductImage";
import { CategoryIcon } from "@/components/CategoryIcon";
import type { Category, Product } from "@/lib/store";

export function CategoryCarousel({
  category,
  products,
}: {
  category: Category;
  products: Product[];
}) {
  if (products.length === 0) return null;
  // Duplicate list for seamless infinite loop
  const loop = [...products, ...products];
  // Slower for longer lists, but capped
  const duration = Math.min(60, Math.max(20, products.length * 4));

  return (
    <div className="group relative overflow-hidden rounded-2xl border bg-card shadow-soft">
      {/* Header */}
      <div className="flex items-center justify-between px-5 pt-4">
        <div className="flex items-center gap-2.5">
          <span className="grid h-9 w-9 place-items-center rounded-xl bg-secondary text-primary">
            <CategoryIcon slug={category.slug} className="h-4 w-4" />
          </span>
          <div>
            <h3 className="text-sm font-semibold leading-tight">{category.name}</h3>
            <p className="text-xs text-muted-foreground">
              {products.length} article{products.length > 1 ? "s" : ""}
            </p>
          </div>
        </div>
        <Link
          to="/category/$slug"
          params={{ slug: category.slug }}
          className="text-xs font-medium text-primary hover:underline"
        >
          Voir tout →
        </Link>
      </div>

      {/* Marquee */}
      <div
        className="relative mt-3 overflow-hidden pb-5 [mask-image:linear-gradient(to_right,transparent,black_6%,black_94%,transparent)]"
      >
        <div
          className="flex w-max gap-4 px-5 marquee-track group-hover:[animation-play-state:paused]"
          style={{ animationDuration: `${duration}s` }}
        >
          {loop.map((p, i) => (
            <Link
              key={`${p.id}-${i}`}
              to="/category/$slug"
              params={{ slug: category.slug }}
              className="group/item shrink-0 w-40"
            >
              <div className="relative grid h-40 place-items-center overflow-hidden rounded-xl bg-secondary transition-transform duration-300 group-hover/item:scale-[1.03] group-hover/item:shadow-lift">
                <ProductImage image={p.image} alt={p.name} fallbackSize="text-5xl" />
              </div>
              <div className="mt-2 truncate text-sm font-medium">{p.name}</div>
              <div className="text-xs font-semibold text-primary">
                {p.price.toFixed(2)} €
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
