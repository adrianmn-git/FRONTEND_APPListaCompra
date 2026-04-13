import { faBasketShopping, faBuilding, faCartShopping, faStore, faTruck } from "@fortawesome/free-solid-svg-icons"
import { IconDefinition } from "@fortawesome/fontawesome-svg-core"
import { ShopType } from "../entity/ShoppingList"

interface ShopConfigEntry {
  label: string
  icon: IconDefinition
  logoUrl: string
  bg: string
  text: string
  border: string
  solid: string
  gradient: string
  hexColor: string
}

export const SHOP_CONFIG: Record<ShopType, ShopConfigEntry> = {
  mercadona: { label: "Mercadona", icon: faCartShopping, logoUrl: "/shops/logomercadona.png", bg: "bg-emerald-50", text: "text-emerald-600", border: "border-emerald-100", solid: "bg-emerald-500", gradient: "from-emerald-400 to-green-600", hexColor: "#10b981" },
  alcampo:   { label: "Alcampo",   icon: faStore,        logoUrl: "/shops/logoalcampo.png",   bg: "bg-red-50",     text: "text-red-600",     border: "border-red-100",     solid: "bg-red-500",     gradient: "from-rose-500 to-red-600",    hexColor: "#ef4444" },
  sorli:     { label: "Sorli",     icon: faBuilding,     logoUrl: "/shops/logosorli.png",     bg: "bg-blue-50",    text: "text-blue-600",    border: "border-blue-100",    solid: "bg-blue-500",    gradient: "from-blue-500 to-indigo-600",  hexColor: "#3b82f6" },
  esclat:    { label: "Esclat",    icon: faStore,        logoUrl: "/shops/logoesclat.png",    bg: "bg-orange-50",  text: "text-orange-600",  border: "border-orange-100",  solid: "bg-orange-500",  gradient: "from-red-500 to-orange-600",  hexColor: "#f97316" },
  bonpreusa: { label: "Bonpreu",   icon: faStore,        logoUrl: "/shops/logobonpreu.png",   bg: "bg-amber-50",   text: "text-amber-600",   border: "border-amber-100",   solid: "bg-amber-500",   gradient: "from-amber-400 to-orange-500", hexColor: "#f59e0b" },
  caprabo:   { label: "Caprabo",   icon: faBasketShopping, logoUrl: "/shops/logocaprabo.png", bg: "bg-indigo-50",  text: "text-indigo-600",  border: "border-indigo-100",  solid: "bg-indigo-500",  gradient: "from-indigo-500 to-blue-700",  hexColor: "#6366f1" },
  carrefour: { label: "Carrefour", icon: faTruck,        logoUrl: "/shops/logocarrefour.png", bg: "bg-sky-50",     text: "text-sky-600",     border: "border-sky-100",     solid: "bg-sky-500",     gradient: "from-sky-400 to-blue-600",    hexColor: "#0ea5e9" },
}

// Default theme for unknown shops
export const DEFAULT_SHOP_THEME: ShopConfigEntry = {
  label: "Supermercado",
  icon: faStore,
  logoUrl: "",
  bg: "bg-slate-50",
  text: "text-slate-600",
  border: "border-slate-100",
  solid: "bg-slate-500",
  gradient: "from-slate-400 to-slate-600",
  hexColor: "#6366f1",
}

// Get full config for a shop, with fallback
export function getShopConfig(shop: string): ShopConfigEntry {
  return SHOP_CONFIG[shop as ShopType] ?? DEFAULT_SHOP_THEME
}

// Get shop label
export function getShopLabel(shop: string): string {
  return SHOP_CONFIG[shop as ShopType]?.label ?? shop
}

// Get shop icon
export function getShopIcon(shop: string): IconDefinition {
  return SHOP_CONFIG[shop as ShopType]?.icon ?? faStore
}

// Get shop hex color (for inline styles like SVG strokes)
export function getShopHexColor(shop: string): string {
  return SHOP_CONFIG[shop as ShopType]?.hexColor ?? DEFAULT_SHOP_THEME.hexColor
}

// Get shop gradient classes
export function getShopGradient(shop: string): string {
  return SHOP_CONFIG[shop as ShopType]?.gradient ?? DEFAULT_SHOP_THEME.gradient
}
