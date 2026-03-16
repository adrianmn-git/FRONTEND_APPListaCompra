import { Product, CreateProductDTO } from "../../entity/Product"
import { ProductDataSource } from "./sources/ProductDataSource"

export class ProductRepository {

    static PRODUCT_RECORDS = 'PRODUCT'

    constructor(
        private readonly productDatasource: ProductDataSource
    ) { }

    public static live(
        networkDatasource: () => ProductDataSource = () =>
            new ProductDataSource()
    ): ProductDataSource {
        return new ProductRepository(
            networkDatasource()
        );
    }

    async getProducts(): Promise<Product[]> {
        return await this.productDatasource.getProducts()
    }

    async createProduct(data: CreateProductDTO): Promise<Product> {
        return await this.productDatasource.createProduct(data)
    }

}
