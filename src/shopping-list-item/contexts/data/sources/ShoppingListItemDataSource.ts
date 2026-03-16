import { ShoppingListItem, CreateShoppingListItemDTO } from "../../../entity/ShoppingListItem"

const API_URL = "http://127.0.0.1:8000"

export class ShoppingListItemDataSource {

    async getItems(listId: number): Promise<ShoppingListItem[]> {
        const res = await fetch(`${API_URL}/lists/${listId}/items`)
        if (!res.ok) throw new Error('Error al obtener los items')
        return res.json()
    }

    async addItem(data: CreateShoppingListItemDTO): Promise<ShoppingListItem> {
        const res = await fetch(`${API_URL}/items/add`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
        })
        if (!res.ok) throw new Error('Error al añadir el item')
        return res.json()
    }

    async updateItem(itemId: number, data: Partial<Pick<ShoppingListItem, 'quantity' | 'unit' | 'picked_up'>>): Promise<ShoppingListItem> {
        const res = await fetch(`${API_URL}/items/${itemId}/update`, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
        })
        if (!res.ok) throw new Error('Error al actualizar el item')
        return res.json()
    }

    async deleteItem(itemId: number): Promise<void> {
        const res = await fetch(`${API_URL}/items/${itemId}/delete`, {
            method: "DELETE",
        })
        if (!res.ok) throw new Error('Error al eliminar el item')
    }

}
