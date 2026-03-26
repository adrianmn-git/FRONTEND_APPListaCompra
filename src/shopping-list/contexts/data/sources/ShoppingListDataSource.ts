import { ShoppingList, CreateShoppingListDTO } from "../../../entity/ShoppingList"
import { HttpClient } from "../../../../shared/HttpClient"

const API_URL = "http://127.0.0.1:8000"

export class ShoppingListDataSource {

    async getLists(): Promise<ShoppingList[]> {
        const res = await HttpClient(`${API_URL}/lists`, 'GET')
        return res.json()
    }

    async getList(id: string): Promise<ShoppingList> {
        const res = await HttpClient(`${API_URL}/lists/${id}`, 'GET')
        return res.json()
    }

    async createList(name: string, shop: string, description?: string): Promise<ShoppingList> {
        const res = await HttpClient(`${API_URL}/lists/create`, 'POST', JSON.stringify({ name, shop, description }))
        return res.json()
    }

    async updateFinalPrice(id: number, price: number): Promise<ShoppingList> {
        const res = await HttpClient(`${API_URL}/lists/${id}/price/${price}`, 'PATCH')
        if (!res.ok) throw new Error('Error al actualizar el precio final')
        return res.json()
    }

    async updateList(id: number, data: Partial<CreateShoppingListDTO>): Promise<ShoppingList> {
        const res = await HttpClient(`${API_URL}/lists/${id}/update`, 'PATCH', JSON.stringify(data))
        if (!res.ok) throw new Error('Error al actualizar la lista')
        return res.json()
    }

    async completeList(id: string): Promise<ShoppingList> {
        const res = await HttpClient(`${API_URL}/lists/${id}/complete`, 'PATCH')
        if (!res.ok) throw new Error('Error al completar la lista')
        return res.json()
    }

    async deleteList(id: number): Promise<void> {
        const res = await HttpClient(`${API_URL}/lists/${id}/delete`, 'DELETE')
        if (!res.ok) throw new Error('Error al eliminar la lista')
    }
}