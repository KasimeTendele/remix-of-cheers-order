import { createFileRoute } from "@tanstack/react-router";
import { useSettings } from "@/lib/store-hooks";
import { saveSettings } from "@/lib/store-hooks";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export const Route = createFileRoute("/admin/settings")({
  component: AdminSettings,
});

function AdminSettings() {
  const settings = useSettings();
  const [businessName, setBusinessName] = useState(settings.businessName);
  const [whatsapp, setWhatsapp] = useState(settings.whatsappNumber);

  useEffect(() => {
    setBusinessName(settings.businessName);
    setWhatsapp(settings.whatsappNumber);
  }, [settings.businessName, settings.whatsappNumber]);

  function save(e: React.FormEvent) {
    e.preventDefault();
    saveSettings({ businessName, whatsappNumber: whatsapp.replace(/[^\d]/g, "") });
    toast.success("Paramètres enregistrés");
  }

  return (
    <form onSubmit={save} className="max-w-lg space-y-4 rounded-2xl border bg-card p-6 shadow-soft">
      <h2 className="text-lg font-semibold">Paramètres de la boutique</h2>
      <label className="block">
        <span className="text-sm font-medium">Nom de l'établissement</span>
        <input
          value={businessName}
          onChange={(e) => setBusinessName(e.target.value)}
          className="mt-1 w-full rounded-lg border bg-background px-3 py-2 text-sm"
        />
      </label>
      <label className="block">
        <span className="text-sm font-medium">Numéro WhatsApp admin</span>
        <input
          value={whatsapp}
          onChange={(e) => setWhatsapp(e.target.value)}
          placeholder="33612345678"
          className="mt-1 w-full rounded-lg border bg-background px-3 py-2 text-sm"
        />
        <span className="mt-1 block text-xs text-muted-foreground">
          Format international sans "+", ex: 33612345678
        </span>
      </label>
      <button className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:opacity-90">
        Enregistrer
      </button>
    </form>
  );
}
