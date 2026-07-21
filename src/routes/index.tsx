import { createFileRoute, Link } from "@tanstack/react-router";
import { AppHeader } from "@/components/AppHeader";
import { ProductImage } from "@/components/ProductImage";
import { CategoryIcon } from "@/components/CategoryIcon";
import { CategoryCarousel } from "@/components/CategoryCarousel";
import { useCategories, useProducts } from "@/lib/store-hooks";
import { Sparkles, Tag, ArrowRight } from "lucide-react";
import heroBgAsset from "@/assets/hero-bg.jpg.asset.json";

export const Route = createFileRoute("/")({
  component: Home,
  head: () => ({
    meta: [
      { title: "Omar Drinks — Réservez vos boissons" },
      {
        name: "description",
        content:
          "Commandez vos boissons depuis votre terrasse, chambre, bar ou mini-bar. Whisky, vins, cocktails, sans-alcool et plus.",
      },
    ],
  }),
});

function Home() {
  const categories = useCategories();
  const products = useProducts();

  const spiritueux = categories.filter((c) => c.section === "spiritueux");
  const sansAlcool = categories.filter((c) => c.section === "sans_alcool");
  const compl = categories.filter((c) => c.section === "complementaires");
  const promos = products.filter(
    (p) => categories.find((c) => c.id === p.categoryId)?.slug === "promotions",
  );
  const nouveautes = products.filter(
    (p) => categories.find((c) => c.id === p.categoryId)?.slug === "nouveautes",
  );

  return (
    <div className="min-h-screen bg-background">
      <AppHeader />

      {/* Hero */}
      <section
        className="relative overflow-hidden border-b bg-cover bg-center"
        style={{ backgroundImage: `url(${heroBgAsset.url})` }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/60 to-black/40" />
        <div className="relative mx-auto max-w-6xl px-4 py-20 sm:py-28">
          <div className="max-w-2xl">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs font-medium text-white/90 backdrop-blur">
              <Sparkles className="h-3 w-3" /> Terrasse • Bar • Chambre • Mini-bar
            </span>
            <h1 className="mt-4 text-4xl font-bold tracking-tight text-white sm:text-5xl lg:text-6xl">
              Vos boissons préférées,
              <br />
              livrées où vous êtes.
            </h1>
            <p className="mt-4 text-lg text-white/80 sm:text-xl">
              Parcourez la carte, composez votre commande, on s'occupe du reste.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <a
                href="#categories"
                className="inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground shadow-soft hover:opacity-90"
              >
                Voir la carte <ArrowRight className="h-4 w-4" />
              </a>
              <Link
                to="/auth"
                className="inline-flex items-center gap-2 rounded-xl border border-white/30 bg-white/10 px-5 py-3 text-sm font-semibold text-white backdrop-blur hover:bg-white/20"
              >
                Créer un compte
              </Link>
            </div>
          </div>
        </div>
      </section>

      <Section title="Découvrez par catégorie" icon={<Sparkles className="h-4 w-4" />}>
        <div className="space-y-6">
          {categories.map((c) => {
            const list = products.filter((p) => p.categoryId === c.id);
            if (list.length === 0) return null;
            return <CategoryCarousel key={c.id} category={c} products={list} />;
          })}
        </div>
      </Section>

      {/* Promotions */}
      {promos.length > 0 && (
        <Section title="Promotions & offres" icon={<Tag className="h-4 w-4" />}>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {promos.map((p) => (
              <ProductMini key={p.id} name={p.name} price={p.price} image={p.image} />
            ))}
          </div>
        </Section>
      )}

      {nouveautes.length > 0 && (
        <Section title="Nouveautés & tendances" icon={<Sparkles className="h-4 w-4" />}>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {nouveautes.map((p) => (
              <ProductMini key={p.id} name={p.name} price={p.price} image={p.image} />
            ))}
          </div>
        </Section>
      )}

      {/* Categories */}
      <div id="categories">
        <Section title="Spiritueux & vins">
          <CategoryGrid list={spiritueux} products={products} />
        </Section>
        <Section title="Sans alcool">
          <CategoryGrid list={sansAlcool} products={products} />
        </Section>
        {compl.length > 0 && (
          <Section title="Rubriques complémentaires">
            <CategoryGrid list={compl} products={products} />
          </Section>
        )}
      </div>

      <footer className="border-t py-8 text-center text-xs text-muted-foreground">
        © {new Date().getFullYear()} Omar Drinks — Démo locale
      </footer>
    </div>
  );
}

function Section({
  title,
  icon,
  children,
}: {
  title: string;
  icon?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <section className="mx-auto max-w-6xl px-4 py-10">
      <h2 className="mb-5 flex items-center gap-2 text-xl font-semibold tracking-tight">
        {icon}
        {title}
      </h2>
      {children}
    </section>
  );
}

function CategoryGrid({
  list,
  products,
}: {
  list: Array<{ id: string; slug: string; name: string; icon?: string }>;
  products: Array<{ id: string; categoryId: string; image?: string }>;
}) {
  if (list.length === 0)
    return <p className="text-sm text-muted-foreground">Aucune catégorie.</p>;
  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
      {list.map((c) => {
        const preview = products.find((p) => p.categoryId === c.id && p.image);
        return (
          <Link
            key={c.id}
            to="/category/$slug"
            params={{ slug: c.slug }}
            className="group flex flex-col items-start gap-3 rounded-2xl border bg-card p-4 transition hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-lift"
          >
            <div className="grid h-24 w-full place-items-center overflow-hidden rounded-xl bg-secondary p-2">
              {preview?.image ? (
                <img
                  src={preview.image}
                  alt={c.name}
                  className="h-full w-full object-contain"
                  loading="lazy"
                />
              ) : (
                <CategoryIcon slug={c.slug} className="h-8 w-8 text-primary" />
              )}
            </div>
            <span className="text-sm font-medium leading-tight text-card-foreground group-hover:text-primary">
              {c.name}
            </span>
          </Link>
        );
      })}
    </div>
  );
}

function ProductMini({ name, price, image }: { name: string; price: number; image?: string }) {
  return (
    <div className="rounded-2xl border bg-card p-4 shadow-soft">
      <div className="mb-3 grid h-24 place-items-center overflow-hidden rounded-xl bg-secondary">
        <ProductImage image={image} alt={name} fallbackSize="text-4xl" />
      </div>
      <div className="text-sm font-semibold">{name}</div>
      <div className="mt-1 text-sm text-primary">{price.toFixed(2)} €</div>
    </div>
  );
}
