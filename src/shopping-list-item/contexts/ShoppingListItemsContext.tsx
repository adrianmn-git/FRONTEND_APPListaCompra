"use client";
import React, { createContext, useState } from 'react';

import { ShoppingListItem, CreateShoppingListItemDTO } from '../entity/ShoppingListItem';
import { ShoppingListItemRepository } from '../contexts/data/ShoppingListItemRepository';
import { useNotification } from '@/notifications/hooks/useNotification';
import { useI18n } from '@/i18n/hooks/useI18n';

interface ShoppingListItemsContextType {
    items: ShoppingListItem[];
    loading: boolean;
    error: string | null;
    loadItems: (listId: number) => Promise<void>;
    addItem: (data: CreateShoppingListItemDTO) => Promise<void>;
    updateItem: (itemId: number, updates: Partial<Pick<ShoppingListItem, 'quantity' | 'unit' | 'picked_up'>>) => Promise<void>;
    removeItem: (itemId: number) => Promise<void>;
}

const ShoppingListItemsContext = createContext<ShoppingListItemsContextType | undefined>(undefined);

export const ShoppingListItemsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [items, setItems] = useState<ShoppingListItem[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const { success, error: notifyError } = useNotification();
    const { t } = useI18n();

    const repository = ShoppingListItemRepository.live();

    const loadItems = async (listId: number) => {
        setLoading(true);
        setError(null);
        try {
            const fetchedItems = await repository.getItems(listId);
            setItems(fetchedItems);
        } catch (err: any) {
            const msg = err.message || 'Error al cargar los items';
            setError(msg);
            notifyError(t("notifications.error_load_items", { defaultValue: 'Error loading items' }));
        } finally {
            setLoading(false);
        }
    };

    const addItem = async (data: CreateShoppingListItemDTO) => {
        try {
            const newItem = await repository.addItem(data);
            setItems([...items, newItem]);
            success(t("notifications.item_added", { defaultValue: 'Item added successfully' }));
        } catch (err: any) {
            const msg = err.message || 'Error al añadir el item';
            setError(msg);
            notifyError(t("notifications.error_add_item", { defaultValue: 'Error adding item' }));
            throw err;
        }
    };

    const updateItem = async (itemId: number, updates: Partial<Pick<ShoppingListItem, 'quantity' | 'unit' | 'picked_up'>>) => {
        const previousItems = [...items];
        setItems(items.map(item => item.id === itemId ? { ...item, ...updates } : item));
        try {
            const updatedItem = await repository.updateItem(itemId, updates);
            setItems(items.map(item => item.id === itemId ? updatedItem : item));
            
            if (updates.picked_up !== undefined) {
                // Si solo cambió el estado de recogido, no mostramos toast para no saturar
            } else {
                success(t("notifications.item_updated", { defaultValue: 'Item updated' }));
            }
        } catch (err: any) {
            const msg = err.message || 'Error al actualizar el item';
            setError(msg);
            notifyError(t("notifications.error_update_item", { defaultValue: 'Error updating item' }));
            setItems(previousItems);
            throw err;
        }
    };

    const removeItem = async (itemId: number) => {
        const previousItems = [...items];
        setItems(items.filter(item => item.id !== itemId));
        try {
            await repository.deleteItem(itemId);
            success(t("notifications.item_removed", { defaultValue: 'Item removed' }));
        } catch (err: any) {
            const msg = err.message || 'Error al eliminar el item';
            setError(msg);
            notifyError(t("notifications.error_remove_item", { defaultValue: 'Error removing item' }));
            setItems(previousItems);
            throw err;
        }
    };

    return (
        <ShoppingListItemsContext.Provider value={{ items, loading, error, loadItems, addItem, updateItem, removeItem }}>
            {children}
        </ShoppingListItemsContext.Provider>
    );
};

export default ShoppingListItemsContext;