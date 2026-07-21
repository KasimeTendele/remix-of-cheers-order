import { createFileRoute, Link } from "@tanstack/react-router";
import { AppHeader } from "@/components/AppHeader";
import { ProductImage } from "@/components/ProductImage";
import { useCart, useProducts, useCartActions } from "@/lib/store-hooks";
import { Minus, Plus, Trash2, ShoppingBag } from "lucide-react";

export const Route = createFileRoute("/cart")({
  component: CartPage,
});

function CartPage() {
  const cart = useCart();
  const products = useProducts();
  const { setQty, remove } = useCartActions();

  const lines = cart
    .map((i) => {
      const p = products.find((x) => x.id === i.productId);
      return p ? { ...i, product: p } : null;
    })
    .filter((x): x is NonNullable<typeof x> => !!x);

  const total = lines.reduce((s, l) => s + l.product.price * l.qty, 0);

  return (
    <div className="min-h-screen bg-background">
      <AppHeader />
      <div className="mx-auto max-w-3xl px-4 py-8">
        <h1 className="text-2xl font-bold tracking-tight">Votre panier</h1>

        {lines.length === 0 ? (
          <div className="mt-10 rounded-2xl border border-dashed p-10 text-center">
            <ShoppingBag className="mx-auto h-10 w-10 text-muted-foreground" />
            <p className="mt-3 text-sm text-muted-foreground">Votre panier est vide.</p>
            <Link
              to="/"
              className="mt-5 inline-flex rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:opacity-90"
            >
              Découvrir la carte
            </Link>
          </div>
        ) : (
          <>
            <ul className="mt-6 divide-y rounded-2xl border bg-card">
              {lines.map((l) => (
                <li key={l.productId} className="flex items-center gap-3 p-4">
                  <div className="grid h-14 w-14 place-items-center overflow-hidden rounded-lg bg-secondary">
                    <ProductImage image={l.product.image} alt={l.product.name} fallbackSize="text-2xl" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="truncate font-medium">{l.product.name}</div>
                    <div className="text-sm text-muted-foreground">
                      {l.product.price.toFixed(2)} € × {l.qty}
                    </div>
                  </div>
                  <div className="flex items-center gap-1 rounded-lg border p-1">
                    <button
                      onClick={() => setQty(l.productId, l.qty - 1)}
                      className="grid h-7 w-7 place-items-center rounded hover:bg-secondary"
                    >
                      <Minus className="h-3.5 w-3.5" />
                    </button>
                    <span className="w-6 text-center text-sm font-semibold">{l.qty}</span>
                    <button
                      onClick={() => setQty(l.productId, l.qty + 1)}
                      className="grid h-7 w-7 place-items-center rounded hover:bg-secondary"
                    >
                      <Plus className="h-3.5 w-3.5" />
                    </button>
                  </div>
                  <button
                    onClick={() => remove(l.productId)}
                    className="grid h-9 w-9 place-items-center rounded-lg text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </li>
              ))}
            </ul>

            <div className="mt-6 rounded-2xl border bg-card p-5 shadow-soft">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Total</span>
                <span className="text-2xl font-bold">{total.toFixed(2)} €</span>
              </div>
              <Link
                to="/checkout"
                className="mt-4 flex w-full items-center justify-center rounded-xl bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground hover:opacity-90"
              >
                Passer la commande
              </Link>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
