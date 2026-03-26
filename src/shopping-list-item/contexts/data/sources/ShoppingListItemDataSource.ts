import { ShoppingListItem, CreateShoppingListItemDTO } from "../../../entity/ShoppingListItem"
import { HttpClient } from "../../../../shared/HttpClient"

const API_URL = "http://127.0.0.1:8000"

export class ShoppingListItemDataSource {

    async getItems(listId: number): Promise<ShoppingListItem[]> {
        const res = await HttpClient(`${API_URL}/lists/${listId}/items`, 'GET')
        if (!res.ok) throw new Error('Error al obtener los items')
        return res.json()
    }

    async addItem(data: CreateShoppingListItemDTO): Promise<ShoppingListItem> {
        const res = await HttpClient(`${API_URL}/items/add`, 'POST', JSON.stringify(data))
        if (!res.ok) throw new Error('Error al añadir el item')
        return res.json()
    }

    async updateItem(itemId: number, data: Partial<Pick<ShoppingListItem, 'quantity' | 'unit' | 'picked_up'>>): Promise<ShoppingListItem> {
        const res = await HttpClient(`${API_URL}/items/${itemId}/update`, 'PATCH', JSON.stringify(data))
        if (!res.ok) throw new Error('Error al actualizar el item')
        return res.json()
    }

    async deleteItem(itemId: number): Promise<void> {
        const res = await HttpClient(`${API_URL}/items/${itemId}/delete`, 'DELETE')
        if (!res.ok) throw new Error('Error al eliminar el item')
    }

}
