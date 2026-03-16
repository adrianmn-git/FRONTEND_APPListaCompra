"use client"

import { useContext } from 'react';
import ShoppingListItemsContext from '../contexts/ShoppingListItemsContext';

export const useShoppingListItems = () => {
  const context = useContext(ShoppingListItemsContext);
  if (context === undefined) {
    throw new Error('useShoppingListItems must be used within a ShoppingListItemsProvider');
  }
  return context;
};
