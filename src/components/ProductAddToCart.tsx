import { useState } from "react";
import { useCartActions } from "@/lib/store-hooks";
import { Plus, Minus, ShoppingCart } from "lucide-react";
import { toast } from "sonner";

const LOTS = [1, 6, 12, 24];

export function ProductAddToCart({
  productId,
  productName,
  price,
}: {
  productId: string;
  productName: string;
  price: number;
}) {
  const { add } = useCartActions();
  const [qty, setQty] = useState(1);

  const addToCart = () => {
    add(productId, qty);
    const suffix = qty > 1 ? "s" : "";
    toast.success(`${qty}× ${productName} ajouté${suffix} au panier`);
  };

  return (
    <div className="flex flex-col gap-2.5">
      <div className="flex items-center justify-between">
        <span className="text-lg font-bold text-primary">${price.toFixed(2)}</span>
        <div className="flex items-center gap-1 rounded-lg border p-1">
          <button
            type="button"
            onClick={() => setQty((q) => Math.max(1, q - 1))}
            className="grid h-7 w-7 place-items-center rounded hover:bg-secondary"
            aria-label="Diminuer"
          >
            <Minus className="h-3.5 w-3.5" />
          </button>
          <span className="w-6 text-center text-sm font-semibold">{qty}</span>
          <button
            type="button"
            onClick={() => setQty((q) => q + 1)}
            className="grid h-7 w-7 place-items-center rounded hover:bg-secondary"
            aria-label="Augmenter"
          >
            <Plus className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>

      <div className="flex flex-wrap gap-1.5">
        {LOTS.map((l) => (
          <button
            key={l}
            type="button"
            onClick={() => setQty(l)}
            className={`rounded-md px-2 py-1 text-xs font-medium transition ${
              qty === l
                ? "bg-primary text-primary-foreground"
                : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
            }`}
          >
            x{l}
          </button>
        ))}
      </div>

      <button
        type="button"
        onClick={addToCart}
        className="inline-flex w-full items-center justify-center gap-1.5 rounded-lg bg-primary px-3 py-2 text-sm font-semibold text-primary-foreground shadow-soft hover:opacity-90"
      >
        <ShoppingCart className="h-4 w-4" /> Ajouter
      </button>
    </div>
  );
}
