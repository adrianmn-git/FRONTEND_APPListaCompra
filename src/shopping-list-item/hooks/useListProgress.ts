"use client"

import { useState, useEffect } from "react"
import { ShoppingListItemRepository } from "../contexts/data/ShoppingListItemRepository"
import { ShoppingListItemDataSource } from "../contexts/data/sources/ShoppingListItemDataSource"

export const useListProgress = (listId: number) => {
  const [data, setData] = useState({
    total: 0,
    picked: 0,
    isLoading: true
  })

  useEffect(() => {
    let isMounted = true

    const fetchProgress = async () => {
      try {
        const repository = ShoppingListItemRepository.live()
        const items = await repository.getItems(listId)
        
        if (isMounted) {
          setData({
            total: items.length,
            picked: items.filter(i => i.picked_up).length,
            isLoading: false
          })
        }
      } catch (error) {
        console.error("Error fetching list progress:", error)
        if (isMounted) {
          setData(prev => ({ ...prev, isLoading: false }))
        }
      }
    }

    fetchProgress()

    return () => {
      isMounted = false
    }
  }, [listId])

  return data
}
