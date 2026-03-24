import { IconDefinition } from "@fortawesome/fontawesome-svg-core"
import { 
  faAppleWhole, faBox, faBoxArchive, faBroom, faDrumstickBite, faGlassWater, 
  faGlassWhiskey, faIcicles, faSoap, faCarrot, faFish, faEgg, faBreadSlice,
  faBowlRice, faSeedling, faCookie, faCandyCane, faPepperHot, faBottleDroplet,
  faWineGlass, faBaby, faPaw
} from "@fortawesome/free-solid-svg-icons"
import { ProductCategory } from "../entity/Product"

export const CATEGORY_CONFIG: Record<ProductCategory, { i18nKey: string, defaultLabel: string, icon: IconDefinition, bg: string, text: string, border: string, solid: string }> = {
  fruit: { i18nKey: "categories.fruit", defaultLabel: "Fruit", icon: faAppleWhole, bg: "bg-emerald-50", text: "text-emerald-600", border: "border-emerald-100", solid: "bg-emerald-500" },
  vegetables: { i18nKey: "categories.vegetables", defaultLabel: "Vegetables", icon: faCarrot, bg: "bg-green-50", text: "text-green-600", border: "border-green-100", solid: "bg-green-500" },
  meat: { i18nKey: "categories.meat", defaultLabel: "Meat", icon: faDrumstickBite, bg: "bg-red-50", text: "text-red-600", border: "border-red-100", solid: "bg-red-500" },
  fish: { i18nKey: "categories.fish", defaultLabel: "Fish", icon: faFish, bg: "bg-cyan-50", text: "text-cyan-600", border: "border-cyan-100", solid: "bg-cyan-500" },
  dairy: { i18nKey: "categories.dairy", defaultLabel: "Dairy", icon: faGlassWater, bg: "bg-indigo-50", text: "text-indigo-600", border: "border-indigo-100", solid: "bg-indigo-500" },
  eggs: { i18nKey: "categories.eggs", defaultLabel: "Eggs", icon: faEgg, bg: "bg-yellow-50", text: "text-yellow-600", border: "border-yellow-100", solid: "bg-yellow-400" },
  bread: { i18nKey: "categories.bread", defaultLabel: "Bread", icon: faBreadSlice, bg: "bg-amber-50", text: "text-amber-700", border: "border-amber-200", solid: "bg-amber-500" },
  cereals: { i18nKey: "categories.cereals", defaultLabel: "Cereals", icon: faBowlRice, bg: "bg-orange-50", text: "text-orange-600", border: "border-orange-100", solid: "bg-orange-400" },
  pasta_rice: { i18nKey: "categories.pasta_rice", defaultLabel: "Pasta/Rice", icon: faBowlRice, bg: "bg-stone-50", text: "text-stone-600", border: "border-stone-100", solid: "bg-stone-400" },
  legumes: { i18nKey: "categories.legumes", defaultLabel: "Legumes", icon: faSeedling, bg: "bg-lime-50", text: "text-lime-700", border: "border-lime-100", solid: "bg-lime-500" },
  frozen: { i18nKey: "categories.frozen", defaultLabel: "Frozen", icon: faIcicles, bg: "bg-sky-50", text: "text-sky-600", border: "border-sky-100", solid: "bg-sky-400" },
  canned: { i18nKey: "categories.canned", defaultLabel: "Canned", icon: faBoxArchive, bg: "bg-zinc-50", text: "text-zinc-600", border: "border-zinc-100", solid: "bg-zinc-500" },
  snacks: { i18nKey: "categories.snacks", defaultLabel: "Snacks", icon: faCookie, bg: "bg-fuchsia-50", text: "text-fuchsia-600", border: "border-fuchsia-100", solid: "bg-fuchsia-500" },
  sweets: { i18nKey: "categories.sweets", defaultLabel: "Sweets", icon: faCandyCane, bg: "bg-pink-50", text: "text-pink-600", border: "border-pink-100", solid: "bg-pink-500" },
  sauces: { i18nKey: "categories.sauces", defaultLabel: "Sauces", icon: faBottleDroplet, bg: "bg-rose-50", text: "text-rose-600", border: "border-rose-100", solid: "bg-rose-500" },
  spices: { i18nKey: "categories.spices", defaultLabel: "Spices", icon: faPepperHot, bg: "bg-red-50", text: "text-red-700", border: "border-red-200", solid: "bg-red-600" },
  oil_vinegar: { i18nKey: "categories.oil_vinegar", defaultLabel: "Oil & Vinegar", icon: faBottleDroplet, bg: "bg-yellow-50", text: "text-yellow-700", border: "border-yellow-200", solid: "bg-yellow-500" },
  drinks: { i18nKey: "categories.drinks", defaultLabel: "Drinks", icon: faGlassWhiskey, bg: "bg-purple-50", text: "text-purple-600", border: "border-purple-100", solid: "bg-purple-500" },
  alcohol: { i18nKey: "categories.alcohol", defaultLabel: "Alcohol", icon: faWineGlass, bg: "bg-violet-50", text: "text-violet-600", border: "border-violet-100", solid: "bg-violet-500" },
  cleaning: { i18nKey: "categories.cleaning", defaultLabel: "Cleaning", icon: faBroom, bg: "bg-blue-50", text: "text-blue-600", border: "border-blue-100", solid: "bg-blue-500" },
  hygiene: { i18nKey: "categories.hygiene", defaultLabel: "Hygiene", icon: faSoap, bg: "bg-teal-50", text: "text-teal-700", border: "border-teal-100", solid: "bg-teal-500" },
  baby: { i18nKey: "categories.baby", defaultLabel: "Baby", icon: faBaby, bg: "bg-pink-50", text: "text-pink-400", border: "border-pink-100", solid: "bg-pink-300" },
  pets: { i18nKey: "categories.pets", defaultLabel: "Pets", icon: faPaw, bg: "bg-orange-50", text: "text-orange-700", border: "border-orange-200", solid: "bg-orange-500" },
  other: { i18nKey: "categories.other", defaultLabel: "Other", icon: faBox, bg: "bg-slate-50", text: "text-slate-600", border: "border-slate-100", solid: "bg-slate-500" },
}
