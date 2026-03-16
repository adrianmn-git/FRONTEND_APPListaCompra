"use client";

import React, { createContext, useState, useCallback } from "react"
import { ShoppingList, CreateShoppingListDTO } from "../entity/ShoppingList"
import { ShoppingListRepository } from "./data/ShoppingListRepository"
import { useNotification } from "@/notifications/hooks/useNotification"

type ShoppingListContextType = {
// ... existing types
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

    const repository = ShoppingListRepository.live() as unknown as ShoppingListRepository

    const getLists = async () => {
        setIsLoading(true)
        try {
            const allLists = await repository.getLists()
            setLists(allLists)
        } catch (e) {
            error("Error al cargar las listas de la compra")
        } finally {
            setIsLoading(false)
        }
    }

    const getList = async (id: string): Promise<ShoppingList | null> => {
        try {
            return await repository.getList(id)
        } catch (e) {
            error("Error al obtener el detalle de la lista")
            return null
        }
    }

    const createList = async (name: string, shop: string, description?: string) => {
        try {
            const newList = await repository.createList(name, shop, description)
            setLists((prev) => [...prev, newList])
            success(`Lista "${name}" creada correctamente`)
        } catch (e) {
            error("Error al crear la lista de la compra")
        }
    }
    
    const completeList = async (id: string) => {
        try {
            const updatedList = await repository.completeList(id)
            setLists((prev) => prev.map(l => l.id === updatedList.id ? updatedList : l))
            success("¡Compra finalizada con éxito!")
        } catch (e) {
            error("Error al finalizar la compra")
        }
    }

    const updateFinalPrice = async (id: number, price: number) => {
        try {
            const updatedList = await repository.updateFinalPrice(id, price)
            setLists((prev) => prev.map(l => l.id === updatedList.id ? updatedList : l))
            success("Precio final guardado")
        } catch (e) {
            error("Error al guardar el precio final")
        }
    }

    const updateList = async (id: number, data: Partial<CreateShoppingListDTO>) => {
        try {
            const updatedList = await repository.updateList(id, data)
            setLists((prev) => prev.map(l => l.id === updatedList.id ? updatedList : l))
            success("Lista actualizada correctamente")
        } catch (e) {
            error("Error al actualizar la lista")
        }
    }

    const deleteList = async (id: number) => {
        try {
            await repository.deleteList(id)
            setLists((prev) => prev.filter(l => l.id !== id))
            success("Lista eliminada")
        } catch (e) {
            error("Error al eliminar la lista")
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