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
import DashboardPage from "./components/dashboard/DashboardPage";
import ProductModal from "./components/modals/ProductModal";
import MovementModal from "./components/modals/MovementModal";
import SupplierModal from "./components/modals/SupplierModal";
import ToastContainer from "./components/ui/ToastContainer";

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
      {/* Toast Notifications */}
      <ToastContainer toasts={toasts} removeToast={removeToast} />

      {/* Header Superior */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-30 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-indigo-600 text-white p-2.5 rounded-xl shadow-md shadow-indigo-100">
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
                />
              </svg>
            </div>
            <div>
              <h1 className="text-xl font-bold text-slate-900 tracking-tight">
                StockControl
              </h1>
              <p className="text-xs text-slate-500 font-medium">
                Sistema de Control de Inventario
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => handleOpenMovementModal()}
              className="hidden md:flex items-center gap-2 px-4 h-10 bg-indigo-50 text-indigo-700 hover:bg-indigo-100 rounded-xl font-semibold text-sm transition-colors duration-150"
            >
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"
                />
              </svg>
              Registrar Movimiento
            </button>
            <button
              onClick={handleOpenAddProduct}
              className="flex items-center gap-2 px-4 h-10 bg-indigo-600 text-white hover:bg-indigo-700 rounded-xl font-semibold text-sm transition-all duration-150 shadow-md shadow-indigo-100 hover:shadow-indigo-200"
            >
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M12 4v16m8-8H4"
                />
              </svg>
              Nuevo Producto
            </button>
          </div>
        </div>
      </header>

      {/* Contenido Principal con Layout de Sidebar Responsivo */}
      <div className="max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 flex-1 py-8 flex flex-col lg:flex-row gap-8">
        {/* Barra Lateral / Navegación */}
        <aside className="lg:w-64 flex-shrink-0">
          <nav className="flex lg:flex-col gap-1 p-1 bg-slate-100 lg:bg-transparent rounded-2xl overflow-x-auto lg:overflow-visible">
            <button
              onClick={() => setActiveTab("dashboard")}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold whitespace-nowrap transition-all duration-150 w-full ${
                activeTab === "dashboard"
                  ? "bg-white lg:bg-indigo-600 text-indigo-600 lg:text-white shadow-sm lg:shadow-md lg:shadow-indigo-100"
                  : "text-slate-600 hover:text-slate-900 hover:bg-slate-200/50"
              }`}
            >
              <svg
                className="w-5 h-5 flex-shrink-0"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 6a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2H6a2 2 0 01-2-2v-4zM14 16a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2h-2a2 2 0 01-2-2v-4z"
                />
              </svg>
              Resumen Cuadro de Mando
            </button>

            <button
              onClick={() => setActiveTab("products")}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold whitespace-nowrap transition-all duration-150 w-full ${
                activeTab === "products"
                  ? "bg-white lg:bg-indigo-600 text-indigo-600 lg:text-white shadow-sm lg:shadow-md lg:shadow-indigo-100"
                  : "text-slate-600 hover:text-slate-900 hover:bg-slate-200/50"
              }`}
            >
              <svg
                className="w-5 h-5 flex-shrink-0"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"
                />
              </svg>
              Productos e Inventario
            </button>

            <button
              onClick={() => setActiveTab("movements")}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold whitespace-nowrap transition-all duration-150 w-full ${
                activeTab === "movements"
                  ? "bg-white lg:bg-indigo-600 text-indigo-600 lg:text-white shadow-sm lg:shadow-md lg:shadow-indigo-100"
                  : "text-slate-600 hover:text-slate-900 hover:bg-slate-200/50"
              }`}
            >
              <svg
                className="w-5 h-5 flex-shrink-0"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              Historial de Movimientos
            </button>

            <button
              onClick={() => setActiveTab("suppliers")}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold whitespace-nowrap transition-all duration-150 w-full ${
                activeTab === "suppliers"
                  ? "bg-white lg:bg-indigo-600 text-indigo-600 lg:text-white shadow-sm lg:shadow-md lg:shadow-indigo-100"
                  : "text-slate-600 hover:text-slate-900 hover:bg-slate-200/50"
              }`}
            >
              <svg
                className="w-5 h-5 flex-shrink-0"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                />
              </svg>
              Proveedores
            </button>

            <button
              onClick={() => setActiveTab("categories")}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold whitespace-nowrap transition-all duration-150 w-full ${
                activeTab === "categories"
                  ? "bg-white lg:bg-indigo-600 text-indigo-600 lg:text-white shadow-sm lg:shadow-md lg:shadow-indigo-100"
                  : "text-slate-600 hover:text-slate-900 hover:bg-slate-200/50"
              }`}
            >
              <svg
                className="w-5 h-5 flex-shrink-0"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M7 7h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
              Categorías
            </button>
          </nav>

          <div className="hidden lg:block mt-8 p-4 bg-gradient-to-br from-indigo-900 to-slate-900 text-white rounded-2xl relative overflow-hidden shadow-md">
            <div className="absolute right-0 bottom-0 opacity-10 pointer-events-none transform translate-y-4 translate-x-4">
              <svg
                className="w-32 h-32"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="1"
                  d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
                />
              </svg>
            </div>
            <h4 className="text-sm font-bold mb-1">¿Necesitas ayuda?</h4>
            <p className="text-xs text-indigo-200 leading-relaxed mb-3">
              Recuerda mantener el stock por encima del nivel mínimo para evitar
              alertas de quiebre.
            </p>
            <div className="inline-flex items-center gap-1.5 text-xs text-indigo-300 font-semibold cursor-default">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              Sistema Operativo
            </div>
          </div>
        </aside>

        {/* Sección de Contenido Activo */}
        <main className="flex-1 min-w-0">
          {activeTab === "products" && (
            <div className="space-y-6 animate-fadeIn">
              {/* Filtros e interactividad */}
              <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-100 shadow-sm flex flex-col md:flex-row gap-4 items-center justify-between">
                {/* Input de Búsqueda */}
                <div className="relative w-full md:w-80">
                  <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                      />
                    </svg>
                  </span>
                  <input
                    type="text"
                    placeholder="Buscar por SKU, Nombre..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition-all bg-slate-50/50"
                  />
                </div>

                {/* Filtros de Categoría y Stock Mínimo */}
                <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="py-2 px-3 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition-all bg-white"
                  >
                    <option value="Todos">Todas las Categorías</option>
                    {categories.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>

                  <button
                    onClick={() => setLowStockFilter(!lowStockFilter)}
                    className={`flex items-center gap-2 py-2 px-4 rounded-xl text-sm font-semibold border transition-all ${
                      lowStockFilter
                        ? "bg-rose-50 border-rose-200 text-rose-700 font-bold ring-2 ring-rose-100"
                        : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50"
                    }`}
                  >
                    <span
                      className={`w-2.5 h-2.5 rounded-full ${lowStockFilter ? "bg-rose-500" : "bg-slate-300"}`}
                    ></span>
                    Stock Bajo
                  </button>
                </div>
              </div>

              {/* Tabla de Productos Principal */}
              <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
                <div className="p-5 border-b border-slate-100 flex items-center justify-between">
                  <div>
                    <h2 className="font-bold text-slate-900">
                      Catálogo de Productos ({filteredProducts.length})
                    </h2>
                    <p className="text-xs text-slate-500">
                      Gestión de existencias, precios y ubicaciones
                    </p>
                  </div>
                  <button
                    onClick={handleOpenAddProduct}
                    className="px-3 py-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-xs font-bold rounded-lg transition-colors"
                  >
                    + Nuevo Registro
                  </button>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-slate-50/70 border-b border-slate-100 text-slate-400 text-xs font-bold uppercase tracking-wider">
                        <th className="py-4 px-6">SKU / Ubicación</th>
                        <th className="py-4 px-6">Detalle de Producto</th>
                        <th className="py-4 px-6">Categoría</th>
                        <th className="py-4 px-6 text-right">
                          Precio unitario
                        </th>
                        <th className="py-4 px-6 text-center">Disponible</th>
                        <th className="py-4 px-6 text-center">Estado</th>
                        <th className="py-4 px-6 text-right">Acción</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {filteredProducts.map((product) => {
                        const isLowStock =
                          Number(product.quantity) <= Number(product.minStock);
                        const isOut = Number(product.quantity) === 0;

                        return (
                          <tr
                            key={product.id}
                            className="hover:bg-slate-50/50 transition-colors group"
                          >
                            <td className="py-4 px-6">
                              <span className="font-bold text-xs text-indigo-600 block">
                                {product.sku}
                              </span>
                              <span className="text-xs text-slate-400 mt-0.5 block">
                                {product.location || "Sin ubicar"}
                              </span>
                            </td>
                            <td className="py-4 px-6">
                              <span className="font-bold text-sm text-slate-900 block">
                                {product.name}
                              </span>
                              <span className="text-xs text-slate-400 block max-w-xs truncate">
                                {product.description || "Sin descripción"}
                              </span>
                            </td>
                            <td className="py-4 px-6">
                              <span className="inline-flex px-2.5 py-0.5 bg-slate-100 text-slate-600 rounded-full text-xs font-medium">
                                {product.category}
                              </span>
                            </td>
                            <td className="py-4 px-6 text-right font-semibold text-slate-900 text-sm">
                              {new Intl.NumberFormat("es-ES", {
                                style: "currency",
                                currency: "EUR",
                              }).format(product.price)}
                            </td>
                            <td className="py-4 px-6 text-center">
                              <span
                                className={`inline-block px-3 py-1 rounded-lg text-sm font-bold ${
                                  isOut
                                    ? "bg-rose-100 text-rose-700"
                                    : isLowStock
                                      ? "bg-amber-100 text-amber-700"
                                      : "bg-slate-100 text-slate-800"
                                }`}
                              >
                                {product.quantity}
                              </span>
                              <span className="text-[10px] text-slate-400 block mt-1">
                                Mín: {product.minStock}
                              </span>
                            </td>
                            <td className="py-4 px-6 text-center">
                              {isOut ? (
                                <span className="inline-flex items-center gap-1.5 px-2 py-1 rounded-md text-xs font-bold text-rose-600 bg-rose-50">
                                  <span className="w-1.5 h-1.5 rounded-full bg-rose-600"></span>
                                  Agotado
                                </span>
                              ) : isLowStock ? (
                                <span className="inline-flex items-center gap-1.5 px-2 py-1 rounded-md text-xs font-bold text-amber-600 bg-amber-50">
                                  <span className="w-1.5 h-1.5 rounded-full bg-amber-600 animate-pulse"></span>
                                  Crítico
                                </span>
                              ) : (
                                <span className="inline-flex items-center gap-1.5 px-2 py-1 rounded-md text-xs font-bold text-emerald-600 bg-emerald-50">
                                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-600"></span>
                                  Suficiente
                                </span>
                              )}
                            </td>
                            <td className="py-4 px-6 text-right">
                              <div className="flex items-center justify-end gap-2">
                                <button
                                  onClick={() =>
                                    handleOpenMovementModal(product)
                                  }
                                  title="Ajustar Stock"
                                  className="p-1.5 text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                                >
                                  <svg
                                    className="w-4.5 h-4.5"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                  >
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      strokeWidth="2"
                                      d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"
                                    />
                                  </svg>
                                </button>
                                <button
                                  onClick={() => handleOpenEditProduct(product)}
                                  title="Editar Producto"
                                  className="p-1.5 text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
                                >
                                  <svg
                                    className="w-4.5 h-4.5"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                  >
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      strokeWidth="2"
                                      d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                                    />
                                  </svg>
                                </button>
                                <button
                                  onClick={() =>
                                    handleDeleteProduct(
                                      product.id,
                                      product.name,
                                    )
                                  }
                                  title="Eliminar"
                                  className="p-1.5 text-rose-600 hover:bg-rose-50 rounded-lg transition-colors opacity-0 group-hover:opacity-100"
                                >
                                  <svg
                                    className="w-4.5 h-4.5"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                  >
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      strokeWidth="2"
                                      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                                    />
                                  </svg>
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                      {filteredProducts.length === 0 && (
                        <tr>
                          <td
                            colSpan="7"
                            className="text-center py-12 text-slate-400 text-sm"
                          >
                            No se encontraron productos que coincidan con la
                            búsqueda.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}
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

          {/* TAB 3: REGISTRO DE MOVIMIENTOS */}
          {activeTab === "movements" && (
            <div className="space-y-6 animate-fadeIn">
              <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h2 className="font-bold text-slate-900">
                    Historial Completo de Flujos
                  </h2>
                  <p className="text-xs text-slate-500">
                    Transacciones de stock y auditoría de inventario
                  </p>
                </div>
                <button
                  onClick={() => handleOpenMovementModal()}
                  className="flex items-center justify-center gap-2 px-4 py-2 bg-indigo-600 text-white hover:bg-indigo-700 rounded-xl font-semibold text-xs transition-colors"
                >
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M12 4v16m8-8H4"
                    />
                  </svg>
                  Registrar Entrada o Salida
                </button>
              </div>

              {/* Listado de Auditoría */}
              <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-slate-50 border-b border-slate-100 text-slate-400 text-xs font-bold uppercase tracking-wider">
                        <th className="py-4 px-6">Fecha y Hora</th>
                        <th className="py-4 px-6">Producto</th>
                        <th className="py-4 px-6">Tipo</th>
                        <th className="py-4 px-6 text-center">Unidades</th>
                        <th className="py-4 px-6">Motivo o Justificación</th>
                        <th className="py-4 px-6">Usuario</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {movements.map((mov) => (
                        <tr
                          key={mov.id}
                          className="text-sm hover:bg-slate-50/40"
                        >
                          <td className="py-4 px-6 text-xs text-slate-500 font-medium">
                            {mov.date}
                          </td>
                          <td className="py-4 px-6 font-bold text-slate-900">
                            {mov.productName}
                          </td>
                          <td className="py-4 px-6">
                            <span
                              className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold ${
                                mov.type === "entrada"
                                  ? "bg-emerald-50 text-emerald-700"
                                  : "bg-rose-50 text-rose-700"
                              }`}
                            >
                              <span
                                className={`w-1.5 h-1.5 rounded-full ${mov.type === "entrada" ? "bg-emerald-500" : "bg-rose-500"}`}
                              ></span>
                              {mov.type === "entrada" ? "Entrada" : "Salida"}
                            </span>
                          </td>
                          <td className="py-4 px-6 text-center font-bold text-slate-950">
                            {mov.type === "entrada" ? "+" : "-"}
                            {mov.quantity}
                          </td>
                          <td className="py-4 px-6 text-slate-600 text-xs">
                            {mov.reason}
                          </td>
                          <td className="py-4 px-6">
                            <span className="px-2 py-0.5 bg-slate-100 text-slate-600 rounded text-xs font-semibold">
                              {mov.user}
                            </span>
                          </td>
                        </tr>
                      ))}
                      {movements.length === 0 && (
                        <tr>
                          <td
                            colSpan="6"
                            className="text-center py-12 text-slate-400 text-sm"
                          >
                            Ninguna transacción ha sido registrada aún.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: PROVEEDORES */}
          {activeTab === "suppliers" && (
            <div className="space-y-6 animate-fadeIn">
              <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h2 className="font-bold text-slate-900">
                    Directorio de Proveedores
                  </h2>
                  <p className="text-xs text-slate-500">
                    Administración de canales de abastecimiento y contactos
                  </p>
                </div>
                <button
                  onClick={handleOpenAddSupplier}
                  className="px-4 py-2 bg-indigo-600 text-white hover:bg-indigo-700 rounded-xl font-semibold text-xs transition-colors"
                >
                  + Agregar Proveedor
                </button>
              </div>

              {/* Grid de Proveedores */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {suppliers.map((sup) => {
                  const associatedCount = products.filter(
                    (p) => p.supplier === sup.name,
                  ).length;

                  return (
                    <div
                      key={sup.id}
                      className="bg-white border border-slate-100 shadow-sm rounded-2xl p-5 hover:shadow-md transition-shadow flex flex-col justify-between"
                    >
                      <div>
                        <div className="flex items-start justify-between">
                          <div className="bg-indigo-50 text-indigo-700 p-2.5 rounded-xl">
                            <svg
                              className="w-5 h-5"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                              />
                            </svg>
                          </div>
                          <div className="flex gap-1.5">
                            <button
                              onClick={() => handleOpenEditSupplier(sup)}
                              className="p-1 hover:bg-slate-100 rounded text-slate-500 hover:text-slate-900"
                            >
                              <svg
                                className="w-4 h-4"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth="2"
                                  d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                                />
                              </svg>
                            </button>
                            <button
                              onClick={() =>
                                handleDeleteSupplier(sup.id, sup.name)
                              }
                              className="p-1 hover:bg-rose-50 rounded text-slate-400 hover:text-rose-600"
                            >
                              <svg
                                className="w-4 h-4"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth="2"
                                  d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                                />
                              </svg>
                            </button>
                          </div>
                        </div>

                        <h3 className="font-bold text-slate-900 text-base mt-4">
                          {sup.name}
                        </h3>
                        <p className="text-xs text-slate-400 mt-0.5">
                          Contacto: {sup.contact}
                        </p>

                        <div className="mt-4 space-y-2 text-xs text-slate-600 border-t border-slate-50 pt-3">
                          <div className="flex items-center gap-2">
                            <svg
                              className="w-4 h-4 text-slate-400"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                              />
                            </svg>
                            <span>{sup.email || "Sin correo electrónico"}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <svg
                              className="w-4 h-4 text-slate-400"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M3 5a2 2 0 012-2h3.28a1 1 0 01.94.725l.548 2.2a1 1 0 01-.321.988l-1.305.98a10.582 10.582 0 004.872 4.872l.98-1.305a1 1 0 01.988-.321l2.2.548a1 1 0 01.725.94V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                              />
                            </svg>
                            <span>{sup.phone || "Sin teléfono"}</span>
                          </div>
                        </div>
                      </div>

                      <div className="mt-5 pt-3 border-t border-slate-50 flex items-center justify-between text-xs font-semibold text-slate-500">
                        <span>Productos Suministrados</span>
                        <span className="px-2.5 py-0.5 bg-indigo-50 text-indigo-700 rounded-full">
                          {associatedCount}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* TAB 5: CATEGORIAS */}
          {activeTab === "categories" && (
            <div className="space-y-6 animate-fadeIn">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Formulario Nueva Categoría */}
                <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm h-fit">
                  <h3 className="font-bold text-slate-900 mb-1">
                    Nueva Categoría
                  </h3>
                  <p className="text-xs text-slate-500 mb-4">
                    Añada etiquetas de clasificación para catalogar stock
                  </p>

                  <form onSubmit={handleAddCategory} className="space-y-4">
                    <div>
                      <label className="text-xs font-bold text-slate-500 block mb-1">
                        Nombre
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="Ej. Herramientas, Limpieza..."
                        value={newCategoryName}
                        onChange={(e) => setNewCategoryName(e.target.value)}
                        className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                      />
                    </div>
                    <button
                      type="submit"
                      className="w-full h-10 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-semibold text-xs transition-colors"
                    >
                      Añadir Categoría
                    </button>
                  </form>
                </div>

                {/* Listado de Categorías Existentes */}
                <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm md:col-span-2">
                  <h3 className="font-bold text-slate-900 mb-1 font-sans">
                    Categorías Registradas
                  </h3>
                  <p className="text-xs text-slate-500 mb-4">
                    Etiquetas activas dentro del catálogo general
                  </p>

                  <div className="divide-y divide-slate-50">
                    {categories.map((cat) => {
                      const count = products.filter(
                        (p) => p.category === cat,
                      ).length;

                      return (
                        <div
                          key={cat}
                          className="py-3 flex items-center justify-between group"
                        >
                          <div>
                            <span className="font-bold text-slate-800 text-sm">
                              {cat}
                            </span>
                            <span className="text-xs text-slate-400 block mt-0.5">
                              {count} productos en stock con esta etiqueta
                            </span>
                          </div>

                          <button
                            onClick={() => handleDeleteCategory(cat)}
                            className="p-1.5 text-rose-600 hover:bg-rose-50 rounded-lg transition-colors opacity-0 group-hover:opacity-100"
                            title="Eliminar categoría"
                          >
                            <svg
                              className="w-4 h-4"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                              />
                            </svg>
                          </button>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* --- MODAL DE PRODUCTO (AGREGAR / EDITAR) --- */}
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

      {/* --- MODAL REGISTRO DE MOVIMIENTOS RÁPIDO (ENTRADA / SALIDA) --- */}
      {showMovementModal && (
        <MovementModal
          products={products}
          movementForm={movementForm}
          setMovementForm={setMovementForm}
          onSave={handleSaveMovement}
          onClose={() => setShowMovementModal(false)}
        />
      )}

      {/* --- MODAL PROVEEDORES (AGREGAR / EDITAR) --- */}
      {showSupplierModal && (
        <SupplierModal
          editingSupplier={editingSupplier}
          supplierForm={supplierForm}
          setSupplierForm={setSupplierForm}
          onSave={handleSaveSupplier}
          onClose={() => setShowSupplierModal(false)}
        />
      )}

      {/* Footer General */}
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
