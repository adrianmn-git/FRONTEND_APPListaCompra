import { useMemo, useEffect } from "react"
import { useShoppingList } from "@/shopping-list/hooks/useShoppingList"
import { useProduct } from "@/product/hooks/useProduct"
import { ShopType } from "@/shopping-list/entity/ShoppingList"
import { ProductCategory } from "@/product/entity/Product"
import { SHOP_CONFIG } from "@/shopping-list/utils/shopConfig"
import { CATEGORY_CONFIG } from "@/product/utils/categoryConfig"

export interface ShopStat {
  shop: ShopType;
  count: number;
  percentage: number;
}

export interface CategoryStat {
  category: ProductCategory;
  count: number;
  percentage: number;
}

export interface ExpenseStat {
  shop: ShopType;
  avgPrice: number;
}

export const useStatistics = () => {
  const { lists, getLists, isLoading: isLoadingLists } = useShoppingList()
  const { products, loadProducts, loading: isLoadingProducts } = useProduct()

  useEffect(() => {
    // If not loaded, we load them
    if (lists.length === 0) getLists()
    if (products.length === 0) loadProducts()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const totalLists = lists.length
  const completedLists = lists.filter(l => l.completed).length

  const listsByShop = useMemo(() => {
    if (totalLists === 0) return []
    const counts: Partial<Record<ShopType, number>> = {}
    lists.forEach(l => {
      counts[l.shop] = (counts[l.shop] || 0) + 1
    })
    
    return Object.entries(counts)
      .map(([shop, count]) => ({
        shop: shop as ShopType,
        count: count as number,
        percentage: ((count as number) / totalLists) * 100
      }))
      .sort((a, b) => b.count - a.count)
  }, [lists, totalLists])

  const expensesByShop = useMemo(() => {
    const completedWithPrices = lists.filter(l => l.completed && l.final_price && l.final_price > 0)
    if (completedWithPrices.length === 0) return []

    const shopTotals: Partial<Record<ShopType, { sum: number, count: number }>> = {}
    
    completedWithPrices.forEach(l => {
      if (!shopTotals[l.shop]) {
        shopTotals[l.shop] = { sum: 0, count: 0 }
      }
      shopTotals[l.shop]!.sum += l.final_price
      shopTotals[l.shop]!.count++
    })

    return Object.entries(shopTotals)
      .map(([shop, data]) => ({
        shop: shop as ShopType,
        avgPrice: (data!.sum / data!.count)
      }))
      .sort((a, b) => a.avgPrice - b.avgPrice)
  }, [lists])

  const cheapestShop = expensesByShop.length > 0 ? expensesByShop[0] : null

  const totalProducts = products.length

  const productsByCategory = useMemo(() => {
    if (totalProducts === 0) return []
    const counts: Partial<Record<ProductCategory, number>> = {}
    products.forEach(p => {
      counts[p.category] = (counts[p.category] || 0) + 1
    })
    
    return Object.entries(counts)
      .map(([category, count]) => ({
        category: category as ProductCategory,
        count: count as number,
        percentage: ((count as number) / totalProducts) * 100
      }))
      .sort((a, b) => b.count - a.count)
  }, [products, totalProducts])

  const totalSpent = useMemo(() => {
    return lists.filter(l => l.completed).reduce((acc, l) => acc + (l.final_price || 0), 0)
  }, [lists])

  const completionRate = totalLists > 0 ? (completedLists / totalLists) * 100 : 0

  const isLoading = isLoadingLists || isLoadingProducts

  return {
    totalLists,
    completedLists,
    totalSpent,
    completionRate,
    listsByShop,
    expensesByShop,
    cheapestShop,
    totalProducts,
    productsByCategory,
    isLoading
  }
}
