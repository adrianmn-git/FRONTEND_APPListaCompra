import { Product } from '../../product/entity/Product';

export type UnitType = 'unit' | 'kg' | 'g' | 'l' | 'ml';

export interface ShoppingListItem {
  id: number;
  shopping_list: number;
  product: Product;
  quantity: number;
  unit: UnitType;
  picked_up: boolean;
  added_at: string;
}

export type CreateShoppingListItemDTO = {
  shopping_list: number;
  product: number;
  quantity: number;
  unit: UnitType;
};
