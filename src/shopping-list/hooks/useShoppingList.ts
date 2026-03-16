"use client"

import { useContext } from "react";
import ShoppingListContext from "../contexts/ShoppingListContext";

export const useShoppingList = () => {
    const context = useContext(ShoppingListContext);
    if (!context) {
      throw new Error("useShoppingList debe ser usado dentro de CourseProvider");
    }
    return context;
  }; 