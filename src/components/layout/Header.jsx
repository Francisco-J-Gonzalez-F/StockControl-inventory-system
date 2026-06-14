// src/components/layout/Header.jsx
export default function Header({ onAddProduct, onRegisterMovement }) {
  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-30 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">

        {/* Logo y título */}
        <div className="flex items-center gap-3">
          <div className="bg-indigo-600 text-white p-2.5 rounded-xl shadow-md shadow-indigo-100">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
            </svg>
          </div>
          <div>
            <h1 className="text-xl font-bold text-slate-900 tracking-tight">StockControl</h1>
            <p className="text-xs text-slate-500 font-medium">Sistema de Control de Inventario</p>
          </div>
        </div>

        {/* Acciones rápidas */}
        <div className="flex items-center gap-3">
          <button
            onClick={onRegisterMovement}
            className="hidden md:flex items-center gap-2 px-4 h-10 bg-indigo-50 text-indigo-700 hover:bg-indigo-100 rounded-xl font-semibold text-sm transition-colors duration-150"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
            </svg>
            Registrar Movimiento
          </button>
          <button
            onClick={onAddProduct}
            className="flex items-center gap-2 px-4 h-10 bg-indigo-600 text-white hover:bg-indigo-700 rounded-xl font-semibold text-sm transition-all duration-150 shadow-md shadow-indigo-100 hover:shadow-indigo-200"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
            </svg>
            Nuevo Producto
          </button>
        </div>

      </div>
    </header>
  );
}