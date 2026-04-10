import { z } from "zod";
import { ShopType } from "./ShoppingList";

const SHOP_VALUES: [ShopType, ...ShopType[]] = [
  "mercadona", "alcampo", "sorli", "esclat", "bonpreusa", "caprabo", "carrefour"
];

export const createShoppingListSchema = z.object({
  name: z
    .string()
    .min(1, { error: "required_field" })
    .max(100, { error: "name_too_long" }),
  shop: z.enum(SHOP_VALUES),
  description: z
    .string()
    .max(500, { error: "description_too_long" })
    .optional()
    .default(""),
});

export const editShoppingListSchema = createShoppingListSchema;

export const finalPriceSchema = z.object({
  price: z
    .number({ error: "price_positive" })
    .positive({ error: "price_positive" })
    .max(99999, { error: "price_max" }),
});

export type CreateShoppingListFormData = z.infer<typeof createShoppingListSchema>;
export type FinalPriceFormData = z.infer<typeof finalPriceSchema>;
