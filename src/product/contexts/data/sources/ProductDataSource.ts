import { Product, CreateProductDTO } from "../../../entity/Product"
import { HttpClient } from "../../../../shared/HttpClient"

const API_URL = "http://127.0.0.1:8000"

export class ProductDataSource {

    async getProducts(): Promise<Product[]> {
        const res = await HttpClient(`${API_URL}/products`, 'GET')
        if (!res.ok) throw new Error('Error al obtener los productos')
        return res.json()
    }

    async createProduct(data: CreateProductDTO): Promise<Product> {
        const res = await HttpClient(`${API_URL}/products/create`, 'POST', JSON.stringify(data))
        if (!res.ok) throw new Error('Error al crear el producto')
        return res.json()
    }

}
