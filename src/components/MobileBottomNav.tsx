import { Link } from "@tanstack/react-router";
import { Home, LayoutGrid, ShoppingBag, ClipboardList, User } from "lucide-react";
import { useCart, useCurrentUser } from "@/lib/store-hooks";

export function MobileBottomNav() {
  const cart = useCart();
  const user = useCurrentUser();
  const count = cart.reduce((s, i) => s + i.qty, 0);

  const items = [
    { to: "/", label: "Accueil", icon: Home, exact: true },
    { to: "/#categories", label: "Carte", icon: LayoutGrid },
    { to: "/cart", label: "Panier", icon: ShoppingBag, badge: count },
    user
      ? { to: "/orders", label: "Commandes", icon: ClipboardList }
      : { to: "/auth", label: "Compte", icon: User },
  ] as const;

  return (
    <>
      {/* spacer so page content isn't hidden behind the fixed nav */}
      <div className="h-20 md:hidden" aria-hidden />
      <nav
        className="fixed inset-x-0 bottom-0 z-50 border-t bg-background/95 backdrop-blur-lg md:hidden"
        style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
      >
        <ul className="mx-auto flex max-w-md items-stretch justify-around">
          {items.map((it) => {
            const Icon = it.icon;
            const isHash = it.to.includes("#");
            const content = (
              <div className="relative flex flex-1 flex-col items-center justify-center gap-0.5 py-2.5 text-muted-foreground active:scale-95 active:text-primary transition">
                <div className="relative">
                  <Icon className="h-6 w-6" strokeWidth={1.8} />
                  {"badge" in it && it.badge && it.badge > 0 ? (
                    <span className="absolute -right-2 -top-1.5 grid min-w-[18px] place-items-center rounded-full bg-primary px-1 text-[10px] font-bold text-primary-foreground">
                      {it.badge}
                    </span>
                  ) : null}
                </div>
                <span className="text-[11px] font-medium tracking-tight">
                  {it.label}
                </span>
              </div>
            );
            return (
              <li key={it.to} className="flex flex-1">
                {isHash ? (
                  <a href={it.to} className="flex flex-1">
                    {content}
                  </a>
                ) : (
                  <Link
                    to={it.to}
                    className="flex flex-1"
                    activeProps={{ className: "text-primary [&_svg]:text-primary [&_span]:text-primary" }}
                    activeOptions={{ exact: (it as { exact?: boolean }).exact ?? false }}
                  >
                    {content}
                  </Link>
                )}
              </li>
            );
          })}
        </ul>
      </nav>
    </>
  );
}
