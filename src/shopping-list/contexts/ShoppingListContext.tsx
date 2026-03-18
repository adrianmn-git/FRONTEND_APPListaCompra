"use client";

import React, { createContext, useState, useCallback } from "react"
import { ShoppingList, CreateShoppingListDTO } from "../entity/ShoppingList"
import { ShoppingListRepository } from "./data/ShoppingListRepository"
import { useNotification } from "@/notifications/hooks/useNotification"
import { useI18n } from "@/i18n/hooks/useI18n"

type ShoppingListContextType = {
    lists: ShoppingList[]
    getLists: () => Promise<void>
    getList: (id: string) => Promise<ShoppingList | null>
    createList: (name: string, shop: string, description?: string) => Promise<void>
    completeList: (id: string) => Promise<void>
    updateFinalPrice: (id: number, price: number) => Promise<void>
    updateList: (id: number, data: Partial<CreateShoppingListDTO>) => Promise<void>
    deleteList: (id: number) => Promise<void>
    isLoading: boolean
}

const ShoppingListContext = createContext<ShoppingListContextType | undefined>(undefined)

export const ShoppingListProvider = ({ children }: { children: React.ReactNode }) => {
    const [lists, setLists] = useState<ShoppingList[]>([])
    const [isLoading, setIsLoading] = useState(false)
    const { success, error } = useNotification()
    const { t } = useI18n()

    const repository = ShoppingListRepository.live() as unknown as ShoppingListRepository

    const getLists = async () => {
        setIsLoading(true)
        try {
            const allLists = await repository.getLists()
            setLists(allLists)
        } catch (e) {
            error(t("notifications.error_load_lists", { defaultValue: "Error loading lists" }))
        } finally {
            setIsLoading(false)
        }
    }

    const getList = async (id: string): Promise<ShoppingList | null> => {
        try {
            return await repository.getList(id)
        } catch (e) {
            error(t("notifications.error_get_list", { defaultValue: "Error loading list details" }))
            return null
        }
    }

    const createList = async (name: string, shop: string, description?: string) => {
        try {
            const newList = await repository.createList(name, shop, description)
            setLists((prev) => [...prev, newList])
            success(t("notifications.list_created", { name, defaultValue: `List "{{name}}" created` }))
        } catch (e) {
            error(t("notifications.error_create_list", { defaultValue: "Error creating list" }))
        }
    }
    
    const completeList = async (id: string) => {
        try {
            const updatedList = await repository.completeList(id)
            setLists((prev) => prev.map(l => l.id === updatedList.id ? updatedList : l))
            success(t("notifications.list_completed", { defaultValue: "List completed!" }))
        } catch (e) {
            error(t("notifications.error_complete_list", { defaultValue: "Error completing list" }))
        }
    }

    const updateFinalPrice = async (id: number, price: number) => {
        try {
            const updatedList = await repository.updateFinalPrice(id, price)
            setLists((prev) => prev.map(l => l.id === updatedList.id ? updatedList : l))
            success(t("notifications.price_saved", { defaultValue: "Price saved" }))
        } catch (e) {
            error(t("notifications.error_save_price", { defaultValue: "Error saving price" }))
        }
    }

    const updateList = async (id: number, data: Partial<CreateShoppingListDTO>) => {
        try {
            const updatedList = await repository.updateList(id, data)
            setLists((prev) => prev.map(l => l.id === updatedList.id ? updatedList : l))
            success(t("notifications.list_updated", { defaultValue: "List updated" }))
        } catch (e) {
            error(t("notifications.error_update_list", { defaultValue: "Error updating list" }))
        }
    }

    const deleteList = async (id: number) => {
        try {
            await repository.deleteList(id)
            setLists((prev) => prev.filter(l => l.id !== id))
            success(t("notifications.list_deleted", { defaultValue: "List deleted" }))
        } catch (e) {
            error(t("notifications.error_delete_list", { defaultValue: "Error deleting list" }))
        }
    }

    return (
        <ShoppingListContext.Provider
            value={{
                lists,
                getLists,
                getList,
                createList,
                completeList,
                updateFinalPrice,
                updateList,
                deleteList,
                isLoading
            }}
        >
            {children}
        </ShoppingListContext.Provider>
    )
}

export default ShoppingListContext