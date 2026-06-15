export default function DashboardPage({
  dashboardStats,
  movements,
  categories,
  products,
  setActiveTab,
  handleOpenMovementModal,
}) {
  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Tarjetas de Métricas Generales */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-4">
          <div className="p-3.5 bg-indigo-50 text-indigo-600 rounded-xl">
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
                d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
              />
            </svg>
          </div>
          <div>
            <p className="text-xs text-slate-500 font-semibold uppercase tracking-wider">
              Productos Únicos
            </p>
            <p className="text-2xl font-bold text-slate-950 mt-1">
              {dashboardStats.totalUniqueProducts}
            </p>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-4">
          <div className="p-3.5 bg-emerald-50 text-emerald-600 rounded-xl">
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
            <p className="text-xs text-slate-500 font-semibold uppercase tracking-wider">
              Unidades Totales
            </p>
            <p className="text-2xl font-bold text-slate-950 mt-1">
              {dashboardStats.totalItems}
            </p>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-4">
          <div className="p-3.5 bg-amber-50 text-amber-600 rounded-xl">
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
                d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <div>
            <p className="text-xs text-slate-500 font-semibold uppercase tracking-wider">
              Valor del Inventario
            </p>
            <p className="text-2xl font-bold text-slate-950 mt-1">
              ${dashboardStats.totalValue.toLocaleString()} MXN
            </p>
          </div>
        </div>

        <div
          className={`bg-white p-5 rounded-2xl border shadow-sm flex items-center gap-4 transition-all duration-300 ${dashboardStats.lowStockCount > 0 ? "border-rose-100 bg-rose-50/20" : "border-slate-100"}`}
        >
          <div
            className={`p-3.5 rounded-xl ${dashboardStats.lowStockCount > 0 ? "bg-rose-100 text-rose-600 animate-pulse" : "bg-slate-100 text-slate-500"}`}
          >
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
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
          </div>
          <div>
            <p className="text-xs text-slate-500 font-semibold uppercase tracking-wider">
              Alertas de Stock
            </p>
            <p
              className={`text-2xl font-bold mt-1 ${dashboardStats.lowStockCount > 0 ? "text-rose-600" : "text-slate-950"}`}
            >
              {dashboardStats.lowStockCount}
            </p>
          </div>
        </div>
      </div>

      {/* Contenido Visual Interactivo del Dashboard */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Tabla/Lista de Alertas Críticas de Stock */}
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-bold text-slate-900">
                Alertas Críticas de Stock Mínimo
              </h3>
              <p className="text-xs text-slate-500">
                Productos que necesitan reabastecimiento urgente
              </p>
            </div>
            {dashboardStats.lowStockCount > 0 && (
              <span className="px-2.5 py-1 bg-rose-100 text-rose-700 rounded-full text-xs font-bold">
                Reabastecer
              </span>
            )}
          </div>

          {dashboardStats.lowStockItems.length === 0 ? (
            <div className="text-center py-10">
              <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-3">
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
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
              <p className="text-slate-600 font-semibold text-sm">
                ¡Inventario Excelente!
              </p>
              <p className="text-slate-400 text-xs mt-1">
                Todos los productos tienen niveles de stock correctos.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-100 text-slate-400 text-xs font-bold">
                    <th className="pb-3">SKU</th>
                    <th className="pb-3">Producto</th>
                    <th className="pb-3 text-center">Mínimo</th>
                    <th className="pb-3 text-center">Disponible</th>
                    <th className="pb-3 text-right">Acción</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {dashboardStats.lowStockItems.map((p) => (
                    <tr key={p.id} className="text-sm hover:bg-slate-50/50">
                      <td className="py-3 font-semibold text-xs text-indigo-600">
                        {p.sku}
                      </td>
                      <td className="py-3 font-medium text-slate-900">
                        {p.name}
                      </td>
                      <td className="py-3 text-center text-slate-500 font-medium">
                        {p.minStock}
                      </td>
                      <td className="py-3 text-center font-bold text-rose-600 bg-rose-50/30 rounded-lg">
                        {p.quantity}
                      </td>
                      <td className="py-3 text-right">
                        <button
                          onClick={() => handleOpenMovementModal(p)}
                          className="px-3 py-1 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 rounded-lg text-xs font-semibold transition-colors"
                        >
                          Abastecer
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Resumen Gráfico e Info Rápida de Distribución */}
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex flex-col justify-between">
          <div>
            <h3 className="font-bold text-slate-900 mb-1">
              Distribución de Productos
            </h3>
            <p className="text-xs text-slate-500 mb-5">
              Categorías con más valor en stock
            </p>

            <div className="space-y-4">
              {categories.map((cat, idx) => {
                const catProducts = products.filter((p) => p.category === cat);
                const catVal = catProducts.reduce(
                  (acc, p) => acc + p.price * p.quantity,
                  0,
                );
                const percentage =
                  dashboardStats.totalValue > 0
                    ? (catVal / dashboardStats.totalValue) * 100
                    : 0;
                const colors = [
                  "bg-indigo-600",
                  "bg-emerald-500",
                  "bg-amber-500",
                  "bg-sky-500",
                  "bg-purple-500",
                ];
                const activeColor = colors[idx % colors.length];

                return (
                  <div key={cat} className="space-y-1">
                    <div className="flex justify-between text-xs font-semibold">
                      <span className="text-slate-600">{cat}</span>
                      <span className="text-slate-950">
                        {percentage.toFixed(1)}%
                      </span>
                    </div>
                    <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                      <div
                        className={`${activeColor} h-full rounded-full transition-all duration-500`}
                        style={{ width: `${percentage}%` }}
                      ></div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="mt-6 pt-5 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <span>Valores calculados en tiempo real</span>
            <button
              onClick={() => setActiveTab("products")}
              className="text-indigo-600 font-bold hover:underline"
            >
              Ver catálogo &rarr;
            </button>
          </div>
        </div>
      </div>

      {/* Registro de Movimientos Recientes */}
      <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="font-bold text-slate-900">
              Actividad de Stock Reciente
            </h3>
            <p className="text-xs text-slate-500">
              Últimos flujos de entrada y salida registrados
            </p>
          </div>
          <button
            onClick={() => setActiveTab("movements")}
            className="text-xs font-bold text-indigo-600 hover:underline"
          >
            Ver historial completo
          </button>
        </div>

        <div className="space-y-3">
          {movements.slice(0, 4).map((mov) => (
            <div
              key={mov.id}
              className="flex flex-col sm:flex-row sm:items-center justify-between p-3.5 bg-slate-50/50 hover:bg-slate-50 rounded-xl border border-slate-100 gap-3"
            >
              <div className="flex items-start gap-3">
                <div
                  className={`p-2 rounded-lg flex-shrink-0 ${mov.type === "entrada" ? "bg-emerald-50 text-emerald-600" : "bg-rose-50 text-rose-600"}`}
                >
                  {mov.type === "entrada" ? (
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
                        d="M16 17l-4 4m0 0l-4-4m4 4V3"
                      />
                    </svg>
                  ) : (
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
                        d="M8 7l4-4m0 0l4 4m-4-4v18"
                      />
                    </svg>
                  )}
                </div>
                <div>
                  <p className="font-semibold text-sm text-slate-900">
                    {mov.productName}
                  </p>
                  <div className="flex flex-wrap items-center gap-x-2 text-xs text-slate-400 mt-0.5">
                    <span className="font-medium text-slate-500">
                      {mov.reason}
                    </span>
                    <span>&bull;</span>
                    <span>{mov.date}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between sm:justify-end gap-3 border-t sm:border-t-0 pt-2 sm:pt-0 border-slate-100">
                <span
                  className={`text-sm font-bold ${mov.type === "entrada" ? "text-emerald-600" : "text-rose-600"}`}
                >
                  {mov.type === "entrada" ? "+" : "-"}
                  {mov.quantity} uds.
                </span>
                <span className="px-2 py-0.5 bg-slate-200 text-slate-600 rounded text-[10px] font-semibold">
                  {mov.user}
                </span>
              </div>
            </div>
          ))}
          {movements.length === 0 && (
            <p className="text-center py-6 text-slate-400 text-sm">
              No hay registro de movimientos.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
