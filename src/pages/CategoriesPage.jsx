// src/pages/CategoriesPage.jsx
export default function CategoriesPage({
  categories,
  products,
  newCategoryName,
  setNewCategoryName,
  onAddCategory,
  onDeleteCategory,
}) {
  return (
    <div className="space-y-6 animate-fadeIn">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

        {/* Formulario nueva categoría */}
        <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm h-fit">
          <h3 className="font-bold text-slate-900 mb-1">Nueva Categoría</h3>
          <p className="text-xs text-slate-500 mb-4">Añada etiquetas de clasificación para catalogar stock</p>
          <form onSubmit={onAddCategory} className="space-y-4">
            <div>
              <label className="text-xs font-bold text-slate-500 block mb-1">Nombre</label>
              <input
                type="text"
                required
                placeholder="Ej. Herramientas, Limpieza..."
                value={newCategoryName}
                onChange={(e) => setNewCategoryName(e.target.value)}
                className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
              />
            </div>
            <button type="submit"
              className="w-full h-10 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-semibold text-xs transition-colors">
              Añadir Categoría
            </button>
          </form>
        </div>

        {/* Listado de categorías */}
        <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm md:col-span-2">
          <h3 className="font-bold text-slate-900 mb-1">Categorías Registradas</h3>
          <p className="text-xs text-slate-500 mb-4">Etiquetas activas dentro del catálogo general</p>
          <div className="divide-y divide-slate-50">
            {categories.map((cat) => {
              const count = products.filter((p) => p.category === cat).length;
              return (
                <div key={cat} className="py-3 flex items-center justify-between group">
                  <div>
                    <span className="font-bold text-slate-800 text-sm">{cat}</span>
                    <span className="text-xs text-slate-400 block mt-0.5">
                      {count} productos en stock con esta etiqueta
                    </span>
                  </div>
                  <button onClick={() => onDeleteCategory(cat)}
                    className="p-1.5 text-rose-600 hover:bg-rose-50 rounded-lg transition-colors opacity-0 group-hover:opacity-100"
                    title="Eliminar categoría">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              );
            })}
          </div>
        </div>

      </div>
    </div>
  );
}