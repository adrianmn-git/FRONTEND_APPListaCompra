export type ProductCategory = 
  | 'fruit' | 'vegetables' | 'meat' | 'fish' | 'dairy' 
  | 'eggs' | 'bread' | 'cereals' | 'pasta_rice' | 'legumes' 
  | 'frozen' | 'canned' | 'snacks' | 'sweets' | 'sauces' 
  | 'spices' | 'oil_vinegar' | 'drinks' | 'alcohol' 
  | 'cleaning' | 'hygiene' | 'baby' | 'pets' | 'other';

export interface Product {
  id: number;
  name: string;
  category: ProductCategory;
  created_at: string;
}

export type CreateProductDTO = Omit<Product, 'id' | 'created_at'>;
