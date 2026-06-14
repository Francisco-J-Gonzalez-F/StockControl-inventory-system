import { useState } from "react";
import {
  INITIAL_PRODUCTS,
  INITIAL_CATEGORIES,
  INITIAL_SUPPLIERS,
  INITIAL_MOVEMENTS,
} from "../initialData";

export function useInventory() {
  const [products, setProducts] = useState(INITIAL_PRODUCTS);
  const [categories, setCategories] = useState(INITIAL_CATEGORIES);
  const [suppliers, setSuppliers] = useState(INITIAL_SUPPLIERS);
  const [movements, setMovements] = useState(INITIAL_MOVEMENTS);

  return {
    products,
    setProducts,
    categories,
    setCategories,
    suppliers,
    setSuppliers,
    movements,
    setMovements,
  };
}
