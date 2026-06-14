// src/components/layout/Sidebar.jsx

const NAV_ITEMS = [
  {
    id: "dashboard",
    label: "Resumen Cuadro de Mando",
    path: "M4 6a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2H6a2 2 0 01-2-2v-4zM14 16a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2h-2a2 2 0 01-2-2v-4z",
  },
  {
    id: "products",
    label: "Productos e Inventario",
    path: "M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01",
  },
  {
    id: "movements",
    label: "Historial de Movimientos",
    path: "M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z",
  },
  {
    id: "suppliers",
    label: "Proveedores",
    path: "M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z",
  },
  {
    id: "categories",
    label: "Categorías",
    path: "M7 7h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z",
  },
];

export default function Sidebar({ activeTab, setActiveTab }) {
  return (
    <aside className="lg:w-64 flex-shrink-0">

      {/* Navegación */}
      <nav className="flex lg:flex-col gap-1 p-1 bg-slate-100 lg:bg-transparent rounded-2xl overflow-x-auto lg:overflow-visible">
        {NAV_ITEMS.map(({ id, label, path }) => (
          <button
            key={id}
            onClick={() => setActiveTab(id)}
            className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold whitespace-nowrap transition-all duration-150 w-full ${
              activeTab === id
                ? "bg-white lg:bg-indigo-600 text-indigo-600 lg:text-white shadow-sm lg:shadow-md lg:shadow-indigo-100"
                : "text-slate-600 hover:text-slate-900 hover:bg-slate-200/50"
            }`}
          >
            <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={path} />
            </svg>
            {label}
          </button>
        ))}
      </nav>

      {/* Tarjeta de ayuda */}
      <div className="hidden lg:block mt-8 p-4 bg-gradient-to-br from-indigo-900 to-slate-900 text-white rounded-2xl relative overflow-hidden shadow-md">
        <div className="absolute right-0 bottom-0 opacity-10 pointer-events-none transform translate-y-4 translate-x-4">
          <svg className="w-32 h-32" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1"
              d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
          </svg>
        </div>
        <h4 className="text-sm font-bold mb-1">¿Necesitas ayuda?</h4>
        <p className="text-xs text-indigo-200 leading-relaxed mb-3">
          Recuerda mantener el stock por encima del nivel mínimo para evitar alertas de quiebre.
        </p>
        <div className="inline-flex items-center gap-1.5 text-xs text-indigo-300 font-semibold cursor-default">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
          Sistema Operativo
        </div>
      </div>

    </aside>
  );
}