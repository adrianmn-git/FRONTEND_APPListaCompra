import { faBasketShopping, faBuilding, faCartShopping, faStore, faTruck } from "@fortawesome/free-solid-svg-icons"
import { IconDefinition } from "@fortawesome/fontawesome-svg-core"
import { ShopType } from "../entity/ShoppingList"

export const SHOP_CONFIG: Record<ShopType, { label: string, icon: IconDefinition, logoUrl: string, bg: string, text: string, border: string, solid: string }> = {
  mercadona: { label: "Mercadona", icon: faCartShopping, logoUrl: "/shops/logomercadona.png", bg: "bg-emerald-50", text: "text-emerald-600", border: "border-emerald-100", solid: "bg-emerald-500" },
  alcampo: { label: "Alcampo", icon: faStore, logoUrl: "/shops/logoalcampo.png", bg: "bg-red-50", text: "text-red-600", border: "border-red-100", solid: "bg-red-500" },
  sorli: { label: "Sorli", icon: faBuilding, logoUrl: "/shops/logosorli.png", bg: "bg-blue-50", text: "text-blue-600", border: "border-blue-100", solid: "bg-blue-500" },
  esclat: { label: "Esclat", icon: faStore, logoUrl: "/shops/logoesclat.png", bg: "bg-orange-50", text: "text-orange-600", border: "border-orange-100", solid: "bg-orange-500" },
  bonpreusa: { label: "Bonpreu", icon: faStore, logoUrl: "/shops/logobonpreu.png", bg: "bg-amber-50", text: "text-amber-600", border: "border-amber-100", solid: "bg-amber-500" },
  caprabo: { label: "Caprabo", icon: faBasketShopping, logoUrl: "/shops/logocaprabo.png", bg: "bg-indigo-50", text: "text-indigo-600", border: "border-indigo-100", solid: "bg-indigo-500" },
  carrefour: { label: "Carrefour", icon: faTruck, logoUrl: "/shops/logocarrefour.png", bg: "bg-sky-50", text: "text-sky-600", border: "border-sky-100", solid: "bg-sky-500" },
}
