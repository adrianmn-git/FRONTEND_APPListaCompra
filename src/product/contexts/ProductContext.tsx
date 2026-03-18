"use client";
import React, { createContext, useState } from 'react';

import { Product, CreateProductDTO } from '../entity/Product';
import { ProductRepository } from './data/ProductRepository';
import { useNotification } from '@/notifications/hooks/useNotification';
import { useI18n } from '@/i18n/hooks/useI18n';

interface ProductContextType {
    products: Product[];
    loading: boolean;
    error: string | null;
    loadProducts: () => Promise<void>;
    addProduct: (data: CreateProductDTO) => Promise<void>;
}

const ProductContext = createContext<ProductContextType | undefined>(undefined);

export const ProductProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const { success, error: notifyError } = useNotification();
    const { t } = useI18n();

    const repository = ProductRepository.live();

    const loadProducts = async () => {
        setLoading(true);
        setError(null);
        try {
            const fetchedProducts = await repository.getProducts();
            setProducts(fetchedProducts);
        } catch (err: any) {
            setError(err.message || 'Error al cargar los productos');
            notifyError(t("notifications.error_load_products", { defaultValue: 'Error loading products' }));
        } finally {
            setLoading(false);
        }
    };

    const addProduct = async (data: CreateProductDTO) => {
        try {
            const newProduct = await repository.createProduct(data);
            setProducts([...products, newProduct]);
            success(t("notifications.product_added_catalog", { name: data.name, defaultValue: `Product "{{name}}" added to catalog` }));
        } catch (err: any) {
            setError(err.message || 'Error al añadir el producto');
            notifyError(t("notifications.error_add_product", { defaultValue: 'Error adding product' }));
            throw err;
        }
    };

    return (
        <ProductContext.Provider value={{ products, loading, error, loadProducts, addProduct }}>
            {children}
        </ProductContext.Provider>
    );
};

export default ProductContext;
