// src/pages/ProductsPage.jsx
export default function ProductsPage({
  filteredProducts,
  searchQuery,
  setSearchQuery,
  selectedCategory,
  setSelectedCategory,
  lowStockFilter,
  setLowStockFilter,
  categories,
  onAddProduct,
  onEditProduct,
  onDeleteProduct,
  onRegisterMovement,
}) {
  return (
    <div className="space-y-6 animate-fadeIn">

      {/* Filtros */}
      <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-100 shadow-sm flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="relative w-full md:w-80">
          <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
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
        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="py-2 px-3 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition-all bg-white"
          >
            <option value="Todos">Todas las Categorías</option>
            {categories.map((c) => (
              <option key={c} value={c}>{c}</option>
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
            <span className={`w-2.5 h-2.5 rounded-full ${lowStockFilter ? "bg-rose-500" : "bg-slate-300"}`}></span>
            Stock Bajo
          </button>
        </div>
      </div>

      {/* Tabla de productos */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="p-5 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h2 className="font-bold text-slate-900">Catálogo de Productos ({filteredProducts.length})</h2>
            <p className="text-xs text-slate-500">Gestión de existencias, precios y ubicaciones</p>
          </div>
          <button
            onClick={onAddProduct}
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
                <th className="py-4 px-6 text-right">Precio unitario</th>
                <th className="py-4 px-6 text-center">Disponible</th>
                <th className="py-4 px-6 text-center">Estado</th>
                <th className="py-4 px-6 text-right">Acción</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredProducts.map((product) => {
                const isLowStock = Number(product.quantity) <= Number(product.minStock);
                const isOut = Number(product.quantity) === 0;
                return (
                  <tr key={product.id} className="hover:bg-slate-50/50 transition-colors group">
                    <td className="py-4 px-6">
                      <span className="font-bold text-xs text-indigo-600 block">{product.sku}</span>
                      <span className="text-xs text-slate-400 mt-0.5 block">{product.location || "Sin ubicar"}</span>
                    </td>
                    <td className="py-4 px-6">
                      <span className="font-bold text-sm text-slate-900 block">{product.name}</span>
                      <span className="text-xs text-slate-400 block max-w-xs truncate">{product.description || "Sin descripción"}</span>
                    </td>
                    <td className="py-4 px-6">
                      <span className="inline-flex px-2.5 py-0.5 bg-slate-100 text-slate-600 rounded-full text-xs font-medium">
                        {product.category}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-right font-semibold text-slate-900 text-sm">
                      {new Intl.NumberFormat("es-ES", { style: "currency", currency: "EUR" }).format(product.price)}
                    </td>
                    <td className="py-4 px-6 text-center">
                      <span className={`inline-block px-3 py-1 rounded-lg text-sm font-bold ${
                        isOut ? "bg-rose-100 text-rose-700" : isLowStock ? "bg-amber-100 text-amber-700" : "bg-slate-100 text-slate-800"
                      }`}>
                        {product.quantity}
                      </span>
                      <span className="text-[10px] text-slate-400 block mt-1">Mín: {product.minStock}</span>
                    </td>
                    <td className="py-4 px-6 text-center">
                      {isOut ? (
                        <span className="inline-flex items-center gap-1.5 px-2 py-1 rounded-md text-xs font-bold text-rose-600 bg-rose-50">
                          <span className="w-1.5 h-1.5 rounded-full bg-rose-600"></span>Agotado
                        </span>
                      ) : isLowStock ? (
                        <span className="inline-flex items-center gap-1.5 px-2 py-1 rounded-md text-xs font-bold text-amber-600 bg-amber-50">
                          <span className="w-1.5 h-1.5 rounded-full bg-amber-600 animate-pulse"></span>Crítico
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 px-2 py-1 rounded-md text-xs font-bold text-emerald-600 bg-emerald-50">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-600"></span>Suficiente
                        </span>
                      )}
                    </td>
                    <td className="py-4 px-6 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button onClick={() => onRegisterMovement(product)} title="Ajustar Stock"
                          className="p-1.5 text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors">
                          <svg className="w-4.5 h-4.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                          </svg>
                        </button>
                        <button onClick={() => onEditProduct(product)} title="Editar Producto"
                          className="p-1.5 text-slate-600 hover:bg-slate-100 rounded-lg transition-colors">
                          <svg className="w-4.5 h-4.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                          </svg>
                        </button>
                        <button onClick={() => onDeleteProduct(product.id, product.name)} title="Eliminar"
                          className="p-1.5 text-rose-600 hover:bg-rose-50 rounded-lg transition-colors opacity-0 group-hover:opacity-100">
                          <svg className="w-4.5 h-4.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
              {filteredProducts.length === 0 && (
                <tr>
                  <td colSpan="7" className="text-center py-12 text-slate-400 text-sm">
                    No se encontraron productos que coincidan con la búsqueda.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}