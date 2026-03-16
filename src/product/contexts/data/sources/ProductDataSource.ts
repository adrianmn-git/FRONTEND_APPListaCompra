import { Product, CreateProductDTO } from "../../../entity/Product"

const API_URL = "http://127.0.0.1:8000"

export class ProductDataSource {

    async getProducts(): Promise<Product[]> {
        const res = await fetch(`${API_URL}/products`)
        if (!res.ok) throw new Error('Error al obtener los productos')
        return res.json()
    }

    async createProduct(data: CreateProductDTO): Promise<Product> {
        const res = await fetch(`${API_URL}/products/create`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
        })
        if (!res.ok) throw new Error('Error al crear el producto')
        return res.json()
    }

}
