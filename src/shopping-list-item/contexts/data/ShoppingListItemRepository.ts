import { ShoppingListItem, CreateShoppingListItemDTO } from '../../entity/ShoppingListItem';
import { ShoppingListItemDataSource } from './sources/ShoppingListItemDataSource';

export class ShoppingListItemRepository {

  static SHOPPINGLISTITEM_RECORDS = 'SHOPPINGLISTITEM'

  constructor(
    private readonly shoppingListItemDatasource: ShoppingListItemDataSource
  ) { }

  public static live(
    networkDatasource: () => ShoppingListItemDataSource = () =>
      new ShoppingListItemDataSource()
  ): ShoppingListItemDataSource {
    return new ShoppingListItemRepository(
      networkDatasource()
    );
  }

  async getItems(listId: number): Promise<ShoppingListItem[]> {
    return await this.shoppingListItemDatasource.getItems(listId);
  }

  async addItem(data: CreateShoppingListItemDTO): Promise<ShoppingListItem> {
    return await this.shoppingListItemDatasource.addItem(data);
  }

  async updateItem(itemId: number, updates: Partial<Pick<ShoppingListItem, 'quantity' | 'unit' | 'picked_up'>>): Promise<ShoppingListItem> {
    return await this.shoppingListItemDatasource.updateItem(itemId, updates);
  }

  async deleteItem(itemId: number): Promise<void> {
    return await this.shoppingListItemDatasource.deleteItem(itemId);
  }
};
