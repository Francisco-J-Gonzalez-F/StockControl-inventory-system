import React, { useState } from "react";
import {
  INITIAL_PRODUCTS,
  INITIAL_CATEGORIES,
  INITIAL_SUPPLIERS,
  INITIAL_MOVEMENTS,
} from "./initialData";
import "./index.css";
import { useInventory } from "./hooks/useInventory";
import { useToast } from "./hooks/useToast";
import { useProductFilters } from "./hooks/useProductFilters";
import { useDashboardStats } from "./hooks/useDashboardStats";
//Paginas
import DashboardPage from "./components/dashboard/DashboardPage";
import ProductsPage   from "./pages/ProductsPage";
import MovementsPage  from "./pages/MovementsPage";
import SuppliersPage  from "./pages/SuppliersPage";
import CategoriesPage from "./pages/CategoriesPage";

//Modales
import ProductModal from "./components/modals/ProductModal";
import MovementModal from "./components/modals/MovementModal";
import SupplierModal from "./components/modals/SupplierModal";
//UI
import ToastContainer from "./components/ui/ToastContainer";
//layout
import Header  from "./components/layout/Header";
import Sidebar from "./components/layout/Sidebar";

export default function App() {
  // --- Estados de la Aplicación ---
  //llama a a los hooks personalizados para manejar el estado del inventario y las notificaciones

  const {
    products,
    setProducts,
    categories,
    setCategories,
    suppliers,
    setSuppliers,
    movements,
    setMovements,
  } = useInventory();

  const {
    searchQuery,
    setSearchQuery,
    selectedCategory,
    setSelectedCategory,
    lowStockFilter,
    setLowStockFilter,
    filteredProducts,
  } = useProductFilters(products);
  const dashboardStats = useDashboardStats(products);
  const { toasts, addToast, removeToast } = useToast();

  const [activeTab, setActiveTab] = useState("dashboard"); // 'dashboard', 'products', 'movements', 'suppliers', 'categories'

  // Estados de modales y formularios
  const [showProductModal, setShowProductModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [productForm, setProductForm] = useState({
    sku: "",
    name: "",
    category: "Tecnología",
    price: "",
    quantity: "",
    minStock: "",
    supplier: "",
    location: "",
    description: "",
  });

  const [showMovementModal, setShowMovementModal] = useState(false);
  const [movementForm, setMovementForm] = useState({
    productId: "",
    type: "entrada",
    quantity: "",
    reason: "",
  });

  const [showSupplierModal, setShowSupplierModal] = useState(false);
  const [editingSupplier, setEditingSupplier] = useState(null);
  const [supplierForm, setSupplierForm] = useState({
    name: "",
    contact: "",
    email: "",
    phone: "",
  });

  const [newCategoryName, setNewCategoryName] = useState("");
  // Notificaciones personalizadas (Sustituye a alert())

  // --- Handlers de Producto ---
  const handleOpenAddProduct = () => {
    setEditingProduct(null);
    setProductForm({
      sku: `PROD-${Math.floor(1000 + Math.random() * 9000)}`,
      name: "",
      category: categories[0] || "",
      price: "",
      quantity: "",
      minStock: "",
      supplier: suppliers[0]?.name || "",
      location: "",
      description: "",
    });
    setShowProductModal(true);
  };

  const handleOpenEditProduct = (product) => {
    setEditingProduct(product);
    setProductForm({ ...product });
    setShowProductModal(true);
  };

  const handleSaveProduct = (e) => {
    e.preventDefault();
    if (
      !productForm.sku ||
      !productForm.name ||
      !productForm.price ||
      productForm.quantity === "" ||
      !productForm.minStock
    ) {
      addToast("Por favor, rellene todos los campos obligatorios.", "error");
      return;
    }

    if (editingProduct) {
      // Edición
      const previousQty = Number(editingProduct.quantity);
      const newQty = Number(productForm.quantity);

      setProducts((prev) =>
        prev.map((p) =>
          p.id === editingProduct.id
            ? {
                ...productForm,
                price: Number(productForm.price),
                quantity: Number(productForm.quantity),
                minStock: Number(productForm.minStock),
              }
            : p,
        ),
      );

      // Registrar movimiento si cambió la cantidad manualmente
      if (previousQty !== newQty) {
        const difference = Math.abs(newQty - previousQty);
        const movementType = newQty > previousQty ? "entrada" : "salida";
        const newMovement = {
          id: `m-${Date.now()}`,
          date: new Date().toISOString().replace("T", " ").substring(0, 16),
          productId: editingProduct.id,
          productName: productForm.name,
          type: movementType,
          quantity: difference,
          reason: "Ajuste manual de stock por edición",
          user: "Admin",
        };
        setMovements((prev) => [newMovement, ...prev]);
      }

      addToast("Producto actualizado correctamente.", "success");
    } else {
      // Creación
      const newProduct = {
        ...productForm,
        id: `p-${Date.now()}`,
        price: Number(productForm.price),
        quantity: Number(productForm.quantity),
        minStock: Number(productForm.minStock),
      };

      // Validar SKU único
      if (
        products.some(
          (p) => p.sku.toLowerCase() === newProduct.sku.toLowerCase(),
        )
      ) {
        addToast("El SKU introducido ya existe.", "error");
        return;
      }

      setProducts((prev) => [...prev, newProduct]);

      // Registrar movimiento de stock inicial si es mayor que 0
      if (newProduct.quantity > 0) {
        const newMovement = {
          id: `m-${Date.now()}`,
          date: new Date().toISOString().replace("T", " ").substring(0, 16),
          productId: newProduct.id,
          productName: newProduct.name,
          type: "entrada",
          quantity: newProduct.quantity,
          reason: "Inventario inicial de producto",
          user: "Admin",
        };
        setMovements((prev) => [newMovement, ...prev]);
      }

      addToast("Producto añadido al inventario.", "success");
    }
    setShowProductModal(false);
  };

  const handleDeleteProduct = (id, name) => {
    if (
      confirm(
        `¿Está seguro de que desea eliminar el producto "${name}"? Se perderá el stock disponible.`,
      )
    ) {
      setProducts((prev) => prev.filter((p) => p.id !== id));
      addToast(`Producto "${name}" eliminado.`, "info");
    }
  };

  // --- Handlers de Entrada/Salida de Stock Rápido ---
  const handleOpenMovementModal = (product = null) => {
    setMovementForm({
      productId: product ? product.id : products[0]?.id || "",
      type: "entrada",
      quantity: "",
      reason: "",
    });
    setShowMovementModal(true);
  };

  const handleSaveMovement = (e) => {
    e.preventDefault();
    const { productId, type, quantity, reason } = movementForm;
    const qtyNum = Number(quantity);

    if (!productId || !qtyNum || qtyNum <= 0 || !reason.trim()) {
      addToast("Rellene la cantidad y el motivo de forma válida.", "error");
      return;
    }

    const product = products.find((p) => p.id === productId);
    if (!product) {
      addToast("Producto no encontrado.", "error");
      return;
    }

    if (type === "salida" && product.quantity < qtyNum) {
      addToast(
        `Stock insuficiente. Stock actual: ${product.quantity} unidades.`,
        "error",
      );
      return;
    }

    // Actualizar cantidad del producto
    const updatedQty =
      type === "entrada"
        ? product.quantity + qtyNum
        : product.quantity - qtyNum;
    setProducts((prev) =>
      prev.map((p) =>
        p.id === productId ? { ...p, quantity: updatedQty } : p,
      ),
    );

    // Agregar logs de movimientos
    const newMovement = {
      id: `m-${Date.now()}`,
      date: new Date().toISOString().replace("T", " ").substring(0, 16),
      productId,
      productName: product.name,
      type,
      quantity: qtyNum,
      reason,
      user: "Admin",
    };

    setMovements((prev) => [newMovement, ...prev]);
    setShowMovementModal(false);
    addToast(
      `Movimiento registrado: ${type === "entrada" ? "+" : "-"}${qtyNum} de ${product.name}`,
      "success",
    );
  };

  // --- Handlers de Proveedores ---
  const handleOpenAddSupplier = () => {
    setEditingSupplier(null);
    setSupplierForm({ name: "", contact: "", email: "", phone: "" });
    setShowSupplierModal(true);
  };

  const handleOpenEditSupplier = (supplier) => {
    setEditingSupplier(supplier);
    setSupplierForm({ ...supplier });
    setShowSupplierModal(true);
  };

  const handleSaveSupplier = (e) => {
    e.preventDefault();
    if (!supplierForm.name || !supplierForm.contact) {
      addToast("Nombre de proveedor y de contacto requeridos.", "error");
      return;
    }

    if (editingSupplier) {
      setSuppliers((prev) =>
        prev.map((s) =>
          s.id === editingSupplier.id
            ? { ...supplierForm, id: editingSupplier.id }
            : s,
        ),
      );
      addToast("Proveedor actualizado.", "success");
    } else {
      const newSupplier = { ...supplierForm, id: `s-${Date.now()}` };
      setSuppliers((prev) => [...prev, newSupplier]);
      addToast("Proveedor registrado con éxito.", "success");
    }
    setShowSupplierModal(false);
  };

  const handleDeleteSupplier = (id, name) => {
    if (confirm(`¿Seguro que desea eliminar al proveedor "${name}"?`)) {
      setSuppliers((prev) => prev.filter((s) => s.id !== id));
      addToast(`Proveedor "${name}" eliminado.`, "info");
    }
  };

  // --- Handlers de Categorías ---
  const handleAddCategory = (e) => {
    e.preventDefault();
    const cleanCat = newCategoryName.trim();
    if (!cleanCat) return;

    if (categories.some((c) => c.toLowerCase() === cleanCat.toLowerCase())) {
      addToast("La categoría ya existe.", "error");
      return;
    }

    setCategories((prev) => [...prev, cleanCat]);
    setNewCategoryName("");
    addToast(`Categoría "${cleanCat}" añadida.`, "success");
  };

  const handleDeleteCategory = (cat) => {
    const isUsed = products.some((p) => p.category === cat);
    if (isUsed) {
      addToast(
        `No se puede eliminar "${cat}" porque está siendo utilizada por uno o más productos.`,
        "error",
      );
      return;
    }

    setCategories((prev) => prev.filter((c) => c !== cat));
    addToast(`Categoría "${cat}" eliminada.`, "info");
  };

return (
  <div className="min-h-screen bg-slate-50 flex flex-col font-sans text-slate-800">

    <ToastContainer toasts={toasts} removeToast={removeToast} />

    <Header
      onAddProduct={handleOpenAddProduct}
      onRegisterMovement={handleOpenMovementModal}
    />

    <div className="max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 flex-1 py-8 flex flex-col lg:flex-row gap-8">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />

      <main className="flex-1 min-w-0">
        {activeTab === "dashboard" && (
          <DashboardPage
            dashboardStats={dashboardStats}
            movements={movements}
            categories={categories}
            products={products}
            setActiveTab={setActiveTab}
            handleOpenMovementModal={handleOpenMovementModal}
          />
        )}
        {activeTab === "products" && (
          <ProductsPage
            filteredProducts={filteredProducts}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            selectedCategory={selectedCategory}
            setSelectedCategory={setSelectedCategory}
            lowStockFilter={lowStockFilter}
            setLowStockFilter={setLowStockFilter}
            categories={categories}
            onAddProduct={handleOpenAddProduct}
            onEditProduct={handleOpenEditProduct}
            onDeleteProduct={handleDeleteProduct}
            onRegisterMovement={handleOpenMovementModal}
          />
        )}
        {activeTab === "movements" && (
          <MovementsPage
            movements={movements}
            onRegisterMovement={handleOpenMovementModal}
          />
        )}
        {activeTab === "suppliers" && (
          <SuppliersPage
            suppliers={suppliers}
            products={products}
            onAddSupplier={handleOpenAddSupplier}
            onEditSupplier={handleOpenEditSupplier}
            onDeleteSupplier={handleDeleteSupplier}
          />
        )}
        {activeTab === "categories" && (
          <CategoriesPage
            categories={categories}
            products={products}
            newCategoryName={newCategoryName}
            setNewCategoryName={setNewCategoryName}
            onAddCategory={handleAddCategory}
            onDeleteCategory={handleDeleteCategory}
          />
        )}
      </main>
    </div>

    {showProductModal && (
      <ProductModal
        editingProduct={editingProduct}
        productForm={productForm}
        setProductForm={setProductForm}
        categories={categories}
        suppliers={suppliers}
        onSave={handleSaveProduct}
        onClose={() => setShowProductModal(false)}
      />
    )}
    {showMovementModal && (
      <MovementModal
        products={products}
        movementForm={movementForm}
        setMovementForm={setMovementForm}
        onSave={handleSaveMovement}
        onClose={() => setShowMovementModal(false)}
      />
    )}
    {showSupplierModal && (
      <SupplierModal
        editingSupplier={editingSupplier}
        supplierForm={supplierForm}
        setSupplierForm={setSupplierForm}
        onSave={handleSaveSupplier}
        onClose={() => setShowSupplierModal(false)}
      />
    )}

    <footer className="bg-slate-900 text-slate-400 py-6 border-t border-slate-800 text-center mt-12">
      <div className="max-w-7xl mx-auto px-4 text-xs">
        <p className="font-semibold text-slate-300">
          StockControl - Suite Empresarial de Control de Inventario v1.2
        </p>
        <p className="mt-1 text-slate-500">
          Diseñado para la gestión ágil de almacenes, auditorías de stock,
          entradas y salidas de mercancía.
        </p>
      </div>
    </footer>

  </div>
);
}
