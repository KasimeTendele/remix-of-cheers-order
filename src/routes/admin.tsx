import { createFileRoute, Link, Outlet, useRouterState, redirect } from "@tanstack/react-router";
import { AppHeader } from "@/components/AppHeader";
import { currentUser } from "@/lib/store";

export const Route = createFileRoute("/admin")({
  beforeLoad: () => {
    if (typeof window === "undefined") return;
    const u = currentUser();
    if (!u || u.role !== "admin") {
      throw redirect({ to: "/auth" });
    }
  },
  component: AdminLayout,
});

const TABS: Array<{ to: string; label: string; exact?: boolean }> = [
  { to: "/admin", label: "Commandes", exact: true },
  { to: "/admin/products", label: "Produits" },
  { to: "/admin/categories", label: "Catégories" },
  { to: "/admin/settings", label: "Paramètres" },
];

function AdminLayout() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  return (
    <div className="min-h-screen bg-background">
      <AppHeader />
      <div className="mx-auto max-w-6xl px-4 py-8">
        <h1 className="text-2xl font-bold tracking-tight">Tableau de bord</h1>
        <nav className="mt-5 flex flex-wrap gap-1 rounded-xl bg-secondary p-1">
          {TABS.map((t) => {
            const active = t.exact ? pathname === t.to : pathname.startsWith(t.to);
            return (
              <Link
                key={t.to}
                to={t.to as "/admin"}
                className={`rounded-lg px-4 py-2 text-sm font-medium transition ${
                  active ? "bg-background shadow-sm" : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {t.label}
              </Link>
            );
          })}
        </nav>
        <div className="mt-6">
          <Outlet />
        </div>
      </div>
    </div>
  );
}
