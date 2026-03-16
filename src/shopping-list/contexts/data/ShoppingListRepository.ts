import { ShoppingList, CreateShoppingListDTO } from "../../entity/ShoppingList"
import { ShoppingListDataSource } from "./sources/ShoppingListDataSource"

export class ShoppingListRepository {

    static SHOPPINGLIST_RECORDS = 'SHOPPINGLIST'

    constructor(
        private readonly shoppinglistDatasource: ShoppingListDataSource
    ) { }

    public static live(
        networkDatasource: () => ShoppingListDataSource = () =>
            new ShoppingListDataSource()
    ): ShoppingListDataSource {
        return new ShoppingListRepository(
            networkDatasource()
        ) as unknown as ShoppingListDataSource;
    }

    async getLists(): Promise<ShoppingList[]> {
        return await this.shoppinglistDatasource.getLists()
    }

    async getList(id: string): Promise<ShoppingList> {
        return await this.shoppinglistDatasource.getList(id)
    }

    async createList(name: string, shop: string, description?: string) {
        return await this.shoppinglistDatasource.createList(name, shop, description)
    }

    async updateFinalPrice(id: number, price: number) {
        return await this.shoppinglistDatasource.updateFinalPrice(id, price)
    }

    async updateList(id: number, data: Partial<CreateShoppingListDTO>) {
        return await this.shoppinglistDatasource.updateList(id, data)
    }

    async completeList(id: string) {
        return await this.shoppinglistDatasource.completeList(id)
    }

    async deleteList(id: number) {
        return await this.shoppinglistDatasource.deleteList(id)
    }
}