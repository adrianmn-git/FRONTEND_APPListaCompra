export type ShopType = 'mercadona' | 'alcampo' | 'sorli' | 'esclat' | 'bonpreusa' | 'caprabo' | 'carrefour';

export interface ShoppingList {
  id: number;
  name: string;
  shop: ShopType;
  description: string | null;
  final_price: number;
  created_at: string;
  closed_at: string | null;
  completed: boolean;
  items_count: number;
}

export type CreateShoppingListDTO = Pick<ShoppingList, 'name' | 'shop' | 'description'> & { final_price?: number };