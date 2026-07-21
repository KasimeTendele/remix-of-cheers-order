import {
  Wine, Beer, Martini, GlassWater, Sparkles, Tag, Handshake,
  PartyPopper, GraduationCap, Coffee, Zap, Droplet, Apple,
  FlaskConical, Grape, Milk,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

const MAP: Record<string, LucideIcon> = {
  whisky: FlaskConical,
  "scotch-whisky": FlaskConical,
  bourbon: FlaskConical,
  "irish-whiskey": FlaskConical,
  "japanese-whisky": FlaskConical,
  vins: Wine,
  champagnes: Wine,
  prosecco: Wine,
  cognac: FlaskConical,
  armagnac: FlaskConical,
  brandy: FlaskConical,
  biere: Beer,
  cidre: Apple,
  rhum: FlaskConical,
  gin: Martini,
  tequila: FlaskConical,
  vodka: Martini,
  liqueurs: Martini,
  "cream-liqueurs": Milk,
  aperitifs: Martini,
  vermouth: Martini,
  rtd: Martini,
  "spiritueux-locaux": Grape,
  "sans-alcool": GlassWater,
  "soft-drinks": Coffee,
  jus: GlassWater,
  eaux: Droplet,
  energisantes: Zap,
  nouveautes: Sparkles,
  promotions: Tag,
  marques: Handshake,
  evenements: PartyPopper,
  academy: GraduationCap,
};

export function CategoryIcon({
  slug,
  className = "h-6 w-6",
}: {
  slug: string;
  className?: string;
}) {
  const Icon = MAP[slug] ?? Wine;
  return <Icon className={className} strokeWidth={1.6} />;
}
