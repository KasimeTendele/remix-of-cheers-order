import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { AppHeader } from "@/components/AppHeader";
import {
  useCart,
  useProducts,
  useCurrentUser,
  useSettings,
  useCartActions,
} from "@/lib/store-hooks";
import { createOrder } from "@/lib/store-hooks";
import { useState } from "react";
import { toast } from "sonner";

export const Route = createFileRoute("/checkout")({
  component: Checkout,
});

const LOCATIONS = ["Terrasse", "Bar", "Chambre / Hôtel", "Mini-bar", "Autre"];

function Checkout() {
  const cart = useCart();
  const products = useProducts();
  const user = useCurrentUser();
  const settings = useSettings();
  const { clear } = useCartActions();
  const navigate = useNavigate();

  const [location, setLocation] = useState(LOCATIONS[0]);
  const [room, setRoom] = useState("");
  const [note, setNote] = useState("");

  const lines = cart
    .map((i) => {
      const p = products.find((x) => x.id === i.productId);
      return p ? { name: p.name, price: p.price, qty: i.qty, productId: p.id } : null;
    })
    .filter((x): x is NonNullable<typeof x> => !!x);
  const total = lines.reduce((s, l) => s + l.price * l.qty, 0);

  if (!user) {
    return (
      <div className="min-h-screen bg-background">
        <AppHeader />
        <div className="mx-auto max-w-md px-4 py-16 text-center">
          <h1 className="text-xl font-semibold">Connectez-vous pour commander</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Vous devez créer un compte ou vous connecter pour finaliser votre commande.
          </p>
          <Link
            to="/auth"
            className="mt-6 inline-flex rounded-xl bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground hover:opacity-90"
          >
            Se connecter
          </Link>
        </div>
      </div>
    );
  }

  if (lines.length === 0) {
    return (
      <div className="min-h-screen bg-background">
        <AppHeader />
        <div className="mx-auto max-w-md px-4 py-16 text-center">
          <h1 className="text-xl font-semibold">Panier vide</h1>
          <Link to="/" className="mt-4 inline-block text-sm text-primary">
            Retour à la carte
          </Link>
        </div>
      </div>
    );
  }

  function submit(e: React.FormEvent) {
    e.preventDefault();
    const order = createOrder({
      userEmail: user!.email,
      userName: user!.name,
      location,
      room: room || undefined,
      note: note || undefined,
      items: lines.map(({ productId, name, price, qty }) => ({ productId, name, price, qty })),
      total,
    });

    // Build WhatsApp message
    const linesText = lines
      .map((l) => `• ${l.qty}× ${l.name} — $${(l.price * l.qty).toFixed(2)}`)
      .join("\n");
    const msg = `🛎️ Nouvelle commande #${order.id}\n\n👤 ${user!.name} (${user!.email})\n📍 ${location}${
      room ? ` — ${room}` : ""
    }\n\n${linesText}\n\n💰 Total: $${total.toFixed(2)}${note ? `\n\n📝 ${note}` : ""}`;

    clear();
    toast.success("Commande envoyée !");

    if (settings.whatsappNumber) {
      const url = `https://wa.me/${encodeURIComponent(settings.whatsappNumber)}?text=${encodeURIComponent(msg)}`;
      window.open(url, "_blank");
    }
    navigate({ to: "/orders" });
  }

  return (
    <div className="min-h-screen bg-background">
      <AppHeader />
      <div className="mx-auto max-w-2xl px-4 py-8">
        <h1 className="text-2xl font-bold tracking-tight">Finaliser la commande</h1>

        <form onSubmit={submit} className="mt-6 space-y-6">
          <div className="rounded-2xl border bg-card p-5">
            <h2 className="mb-4 text-sm font-semibold uppercase tracking-wide text-muted-foreground">
              Livraison
            </h2>
            <label className="block">
              <span className="text-sm font-medium">Emplacement</span>
              <select
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="mt-1 w-full rounded-lg border bg-background px-3 py-2 text-sm"
              >
                {LOCATIONS.map((l) => (
                  <option key={l}>{l}</option>
                ))}
              </select>
            </label>
            <label className="mt-4 block">
              <span className="text-sm font-medium">Table / Chambre (optionnel)</span>
              <input
                value={room}
                onChange={(e) => setRoom(e.target.value)}
                placeholder="Ex: Table 12, Chambre 305"
                className="mt-1 w-full rounded-lg border bg-background px-3 py-2 text-sm"
              />
            </label>
            <label className="mt-4 block">
              <span className="text-sm font-medium">Note (optionnel)</span>
              <textarea
                value={note}
                onChange={(e) => setNote(e.target.value)}
                rows={3}
                className="mt-1 w-full rounded-lg border bg-background px-3 py-2 text-sm"
              />
            </label>
          </div>

          <div className="rounded-2xl border bg-card p-5">
            <h2 className="mb-4 text-sm font-semibold uppercase tracking-wide text-muted-foreground">
              Récapitulatif
            </h2>
            <ul className="divide-y">
              {lines.map((l) => (
                <li key={l.productId} className="flex justify-between py-2 text-sm">
                  <span>
                    {l.qty}× {l.name}
                  </span>
                  <span className="font-medium">${(l.price * l.qty).toFixed(2)}</span>
                </li>
              ))}
            </ul>
            <div className="mt-3 flex justify-between border-t pt-3 text-base font-bold">
              <span>Total</span>
              <span>${total.toFixed(2)}</span>
            </div>
          </div>

          <button
            type="submit"
            className="w-full rounded-xl bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground shadow-soft hover:opacity-90"
          >
            Envoyer la commande (WhatsApp)
          </button>
          <p className="text-center text-xs text-muted-foreground">
            La commande sera transmise à l'admin sur WhatsApp et enregistrée dans le tableau de bord.
          </p>
        </form>
      </div>
    </div>
  );
}
