import { z } from "zod";
import { UnitType } from "./ShoppingListItem";

const UNIT_VALUES: [UnitType, ...UnitType[]] = ["unit", "kg", "g", "l", "ml"];

export const addShoppingListItemSchema = z.object({
  productId: z
    .number({ error: "select_product" })
    .positive({ error: "select_product" }),
  quantity: z
    .number()
    .min(1, { error: "quantity_min" }),
  unit: z.enum(UNIT_VALUES),
});

export type AddShoppingListItemFormData = z.infer<typeof addShoppingListItemSchema>;
