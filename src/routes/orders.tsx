import { createFileRoute, Link } from "@tanstack/react-router";
import { AppHeader } from "@/components/AppHeader";
import { useCurrentUser, useOrders } from "@/lib/store-hooks";

export const Route = createFileRoute("/orders")({
  component: MyOrders,
});

const STATUS_LABEL: Record<string, string> = {
  pending: "En attente",
  confirmed: "Confirmée",
  delivered: "Livrée",
  cancelled: "Annulée",
};

function MyOrders() {
  const user = useCurrentUser();
  const orders = useOrders();

  if (!user) {
    return (
      <div className="min-h-screen bg-background">
        <AppHeader />
        <div className="mx-auto max-w-md px-4 py-16 text-center">
          <p className="text-sm text-muted-foreground">Connectez-vous pour voir vos commandes.</p>
          <Link to="/auth" className="mt-4 inline-block text-sm text-primary">
            Se connecter
          </Link>
        </div>
      </div>
    );
  }

  const mine = orders.filter((o) => o.userEmail === user.email);

  return (
    <div className="min-h-screen bg-background">
      <AppHeader />
      <div className="mx-auto max-w-3xl px-4 py-8">
        <h1 className="text-2xl font-bold tracking-tight">Mes commandes</h1>
        {mine.length === 0 ? (
          <p className="mt-6 text-sm text-muted-foreground">Aucune commande pour le moment.</p>
        ) : (
          <ul className="mt-6 space-y-4">
            {mine.map((o) => (
              <li key={o.id} className="rounded-2xl border bg-card p-5 shadow-soft">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-semibold">Commande #{o.id}</div>
                    <div className="text-xs text-muted-foreground">
                      {new Date(o.createdAt).toLocaleString("fr-FR")} · {o.location}
                      {o.room ? ` — ${o.room}` : ""}
                    </div>
                  </div>
                  <span className="rounded-full bg-accent px-3 py-1 text-xs font-medium text-accent-foreground">
                    {STATUS_LABEL[o.status]}
                  </span>
                </div>
                <ul className="mt-3 divide-y text-sm">
                  {o.items.map((it) => (
                    <li key={it.productId} className="flex justify-between py-1.5">
                      <span>
                        {it.qty}× {it.name}
                      </span>
                      <span>{(it.price * it.qty).toFixed(2)} €</span>
                    </li>
                  ))}
                </ul>
                <div className="mt-3 flex justify-between border-t pt-3 font-bold">
                  <span>Total</span>
                  <span>{o.total.toFixed(2)} €</span>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
