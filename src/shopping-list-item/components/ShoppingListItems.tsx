"use client";

import React, { useEffect } from 'react';
import { useShoppingListItems } from '../hooks/useShoppingListItems';
import { ShoppingListItemCard } from './ShoppingListItemCard';

interface Props {
  listId: number;
}

export const ShoppingListItems: React.FC<Props> = ({ listId }) => {
  const { items, loading, error, loadItems } = useShoppingListItems();

  useEffect(() => {
    loadItems(listId);
  }, [listId, loadItems]);

  if (loading && items.length === 0) {
    return (
      <div className="flex justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 bg-red-50 text-red-600 rounded-xl border border-red-100 mb-4">
        {error}
      </div>
    );
  }

  if (items.length === 0) {
    return (
       <div className="text-center p-8 text-gray-500 bg-gray-50 rounded-2xl border border-dashed border-gray-200">
        No hay productos en esta lista.
      </div>
    );
  }

  return (
    <div className="w-full flex flex-col gap-1">
      {items.map(item => (
        <ShoppingListItemCard key={item.id} item={item} />
      ))}
    </div>
  );
};
