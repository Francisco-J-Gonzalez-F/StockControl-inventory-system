import { useState, useMemo } from "react";

export function useProductFilters(products) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Todos");
  const [lowStockFilter, setLowStockFilter] = useState(false);

  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const matchesSearch =
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.sku.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (product.description &&
          product.description
            .toLowerCase()
            .includes(searchQuery.toLowerCase()));

      const matchesCategory =
        selectedCategory === "Todos" ||
        product.category === selectedCategory;

      const matchesLowStock =
        !lowStockFilter ||
        Number(product.quantity) <= Number(product.minStock);

      return (
        matchesSearch &&
        matchesCategory &&
        matchesLowStock
      );
    });
  }, [products, searchQuery, selectedCategory, lowStockFilter]);

  return {
    searchQuery,
    setSearchQuery,
    selectedCategory,
    setSelectedCategory,
    lowStockFilter,
    setLowStockFilter,
    filteredProducts,
  };
}