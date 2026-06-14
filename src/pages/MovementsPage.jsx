// src/pages/MovementsPage.jsx
export default function MovementsPage({ movements, onRegisterMovement }) {
  return (
    <div className="space-y-6 animate-fadeIn">

      <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-bold text-slate-900">Historial Completo de Flujos</h2>
          <p className="text-xs text-slate-500">Transacciones de stock y auditoría de inventario</p>
        </div>
        <button
          onClick={() => onRegisterMovement()}
          className="flex items-center justify-center gap-2 px-4 py-2 bg-indigo-600 text-white hover:bg-indigo-700 rounded-xl font-semibold text-xs transition-colors"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
          </svg>
          Registrar Entrada o Salida
        </button>
      </div>

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
                <tr key={mov.id} className="text-sm hover:bg-slate-50/40">
                  <td className="py-4 px-6 text-xs text-slate-500 font-medium">{mov.date}</td>
                  <td className="py-4 px-6 font-bold text-slate-900">{mov.productName}</td>
                  <td className="py-4 px-6">
                    <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold ${
                      mov.type === "entrada" ? "bg-emerald-50 text-emerald-700" : "bg-rose-50 text-rose-700"
                    }`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${mov.type === "entrada" ? "bg-emerald-500" : "bg-rose-500"}`}></span>
                      {mov.type === "entrada" ? "Entrada" : "Salida"}
                    </span>
                  </td>
                  <td className="py-4 px-6 text-center font-bold text-slate-950">
                    {mov.type === "entrada" ? "+" : "-"}{mov.quantity}
                  </td>
                  <td className="py-4 px-6 text-slate-600 text-xs">{mov.reason}</td>
                  <td className="py-4 px-6">
                    <span className="px-2 py-0.5 bg-slate-100 text-slate-600 rounded text-xs font-semibold">
                      {mov.user}
                    </span>
                  </td>
                </tr>
              ))}
              {movements.length === 0 && (
                <tr>
                  <td colSpan="6" className="text-center py-12 text-slate-400 text-sm">
                    Ninguna transacción ha sido registrada aún.
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