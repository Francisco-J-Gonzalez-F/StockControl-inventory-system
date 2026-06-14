import { useMemo } from "react";

export function useDashboardStats(products) {
  return useMemo(() => {
    const totalItems = products.reduce(
      (acc, p) => acc + Number(p.quantity),
      0
    );

    const totalValue = products.reduce(
      (acc, p) => acc + Number(p.quantity) * Number(p.price),
      0
    );

    const lowStockItems = products.filter(
      (p) => Number(p.quantity) <= Number(p.minStock)
    );

    const totalUniqueProducts = products.length;

    return {
      totalItems,
      totalValue,
      lowStockCount: lowStockItems.length,
      totalUniqueProducts,
      lowStockItems,
    };
  }, [products]);
}