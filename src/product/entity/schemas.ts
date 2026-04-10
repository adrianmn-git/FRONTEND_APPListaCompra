import { z } from "zod";
import { ProductCategory } from "./Product";
import { UnitType } from "../../shopping-list-item/entity/ShoppingListItem";

const CATEGORY_VALUES: [ProductCategory, ...ProductCategory[]] = [
  "fruit", "vegetables", "meat", "fish", "dairy",
  "eggs", "bread", "cereals", "pasta_rice", "legumes",
  "frozen", "canned", "snacks", "sweets", "sauces",
  "spices", "oil_vinegar", "drinks", "alcohol",
  "cleaning", "hygiene", "baby", "pets", "other"
];

const UNIT_VALUES: [UnitType, ...UnitType[]] = ["unit", "kg", "g", "l", "ml"];

export const createProductSchema = z.object({
  name: z
    .string()
    .min(1, { error: "required_field" })
    .max(100, { error: "name_too_long" }),
  category: z.enum(CATEGORY_VALUES),
});

export const addProductToListSchema = z.object({
  selectedListIds: z
    .array(z.number())
    .min(1, { error: "select_list" }),
  quantity: z
    .number()
    .min(1, { error: "quantity_min" }),
  unit: z.enum(UNIT_VALUES),
});

export type CreateProductFormData = z.infer<typeof createProductSchema>;
export type AddProductToListFormData = z.infer<typeof addProductToListSchema>;
