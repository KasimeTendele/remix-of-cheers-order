import { createFileRoute } from "@tanstack/react-router";
import { useOrders, updateOrderStatus } from "@/lib/store-hooks";
import type { Order } from "@/lib/store";

export const Route = createFileRoute("/admin/")({
  component: AdminOrders,
});

const STATUSES: Order["status"][] = ["pending", "confirmed", "delivered", "cancelled"];
const LABEL: Record<Order["status"], string> = {
  pending: "En attente",
  confirmed: "Confirmée",
  delivered: "Livrée",
  cancelled: "Annulée",
};
const COLOR: Record<Order["status"], string> = {
  pending: "bg-yellow-100 text-yellow-800",
  confirmed: "bg-blue-100 text-blue-800",
  delivered: "bg-emerald-100 text-emerald-800",
  cancelled: "bg-red-100 text-red-800",
};

function AdminOrders() {
  const orders = useOrders();
  const stats = {
    total: orders.length,
    pending: orders.filter((o) => o.status === "pending").length,
    revenue: orders
      .filter((o) => o.status !== "cancelled")
      .reduce((s, o) => s + o.total, 0),
  };

  return (
    <div>
      <div className="grid gap-4 sm:grid-cols-3">
        <Stat label="Commandes" value={stats.total.toString()} />
        <Stat label="En attente" value={stats.pending.toString()} />
        <Stat label="Chiffre d'affaires" value={`$${stats.revenue.toFixed(2)}`} />
      </div>

      <h2 className="mt-8 text-lg font-semibold">Toutes les commandes</h2>
      {orders.length === 0 ? (
        <p className="mt-4 rounded-xl border border-dashed p-8 text-center text-sm text-muted-foreground">
          Aucune commande pour le moment.
        </p>
      ) : (
        <ul className="mt-4 space-y-3">
          {orders.map((o) => (
            <li key={o.id} className="rounded-2xl border bg-card p-5 shadow-soft">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <div className="font-semibold">#{o.id} · {o.userName}</div>
                  <div className="text-xs text-muted-foreground">
                    {o.userEmail} · {new Date(o.createdAt).toLocaleString("fr-FR")}
                  </div>
                  <div className="mt-1 text-sm">
                    📍 {o.location}
                    {o.room ? ` — ${o.room}` : ""}
                  </div>
                  {o.note && (
                    <div className="mt-1 text-sm italic text-muted-foreground">"{o.note}"</div>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <span className={`rounded-full px-2.5 py-1 text-xs font-medium ${COLOR[o.status]}`}>
                    {LABEL[o.status]}
                  </span>
                  <select
                    value={o.status}
                    onChange={(e) => updateOrderStatus(o.id, e.target.value as Order["status"])}
                    className="rounded-lg border bg-background px-2 py-1 text-sm"
                  >
                    {STATUSES.map((s) => (
                      <option key={s} value={s}>
                        {LABEL[s]}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <ul className="mt-3 divide-y text-sm">
                {o.items.map((it) => (
                  <li key={it.productId} className="flex justify-between py-1.5">
                    <span>{it.qty}× {it.name}</span>
                    <span>${(it.price * it.qty).toFixed(2)}</span>
                  </li>
                ))}
              </ul>
              <div className="mt-2 flex justify-between border-t pt-2 font-bold">
                <span>Total</span>
                <span>${o.total.toFixed(2)}</span>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border bg-card p-5 shadow-soft">
      <div className="text-sm text-muted-foreground">{label}</div>
      <div className="mt-1 text-2xl font-bold">{value}</div>
    </div>
  );
}
