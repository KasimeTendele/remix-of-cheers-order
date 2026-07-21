import { Link, useNavigate } from "@tanstack/react-router";
import { ShoppingBag, User, LogOut, LayoutDashboard, Wine } from "lucide-react";
import { useCart, useCurrentUser, logout } from "@/lib/store-hooks";

export function AppHeader() {
  const cart = useCart();
  const user = useCurrentUser();
  const navigate = useNavigate();
  const cartCount = cart.reduce((s, i) => s + i.qty, 0);

  return (
    <header className="sticky top-0 z-40 border-b bg-background/80 backdrop-blur-lg">
      <div className="mx-auto flex h-16 max-w-6xl items-center gap-4 px-4">
        <Link to="/" className="flex items-center gap-2 font-semibold">
          <div className="grid h-9 w-9 place-items-center rounded-xl gradient-accent text-primary-foreground shadow-soft">
            <Wine className="h-4 w-4" />
          </div>
          <span className="text-lg tracking-tight">Omar Drinks</span>
        </Link>
        <nav className="ml-auto flex items-center gap-1">
          {user?.role === "admin" && (
            <Link
              to="/admin"
              className="hidden items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground hover:bg-secondary hover:text-foreground sm:inline-flex"
            >
              <LayoutDashboard className="h-4 w-4" /> Admin
            </Link>
          )}
          {user ? (
            <>
              <Link
                to="/orders"
                className="hidden rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground hover:bg-secondary hover:text-foreground sm:inline-flex"
              >
                Mes commandes
              </Link>
              <span className="hidden text-sm text-muted-foreground sm:inline">
                {user.name}
              </span>
              <button
                onClick={() => {
                  logout();
                  navigate({ to: "/" });
                }}
                className="grid h-9 w-9 place-items-center rounded-lg text-muted-foreground hover:bg-secondary hover:text-foreground"
                aria-label="Se déconnecter"
              >
                <LogOut className="h-4 w-4" />
              </button>
            </>
          ) : (
            <Link
              to="/auth"
              className="inline-flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground hover:bg-secondary hover:text-foreground"
            >
              <User className="h-4 w-4" /> Connexion
            </Link>
          )}
          <Link
            to="/cart"
            className="relative inline-flex items-center gap-1.5 rounded-lg bg-primary px-3 py-2 text-sm font-medium text-primary-foreground shadow-soft hover:opacity-90"
          >
            <ShoppingBag className="h-4 w-4" />
            <span className="hidden sm:inline">Panier</span>
            {cartCount > 0 && (
              <span className="ml-1 grid min-w-5 place-items-center rounded-full bg-primary-foreground px-1.5 text-xs font-semibold text-primary">
                {cartCount}
              </span>
            )}
          </Link>
        </nav>
      </div>
    </header>
  );
}
