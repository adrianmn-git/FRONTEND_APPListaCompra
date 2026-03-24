import { ShoppingList } from "@/shopping-list/entity/ShoppingList";

export interface ScanResultItem {
  product_name: string;
  quantity: number;
  unit: string;
}

export interface ScanResult {
  list: ShoppingList;
  items_created: number;
  items: ScanResultItem[];
}
