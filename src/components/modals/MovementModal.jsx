// src/components/modals/MovementModal.jsx
export default function MovementModal({
  products,
  movementForm,
  setMovementForm,
  onSave,
  onClose,
}) {
  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl border border-slate-100 max-w-md w-full animate-scaleUp">

        {/* Header */}
        <div className="p-5 border-b border-slate-100 flex items-center justify-between sticky top-0 bg-white">
          <h3 className="font-bold text-slate-950 text-base">
            Registrar Movimiento de Stock
          </h3>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 font-bold text-lg"
          >
            &times;
          </button>
        </div>

        <form onSubmit={onSave} className="p-5 space-y-4">

          {/* Selector de producto */}
          <div>
            <label className="text-xs font-bold text-slate-500 block mb-1">
              Producto Objetivo *
            </label>
            <select
              value={movementForm.productId}
              onChange={(e) =>
                setMovementForm({ ...movementForm, productId: e.target.value })
              }
              className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-indigo-500 bg-white"
            >
              {products.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name} (Disponibles: {p.quantity})
                </option>
              ))}
            </select>
          </div>

          {/* Tipo de operación */}
          <div>
            <label className="text-xs font-bold text-slate-500 block mb-1">
              Tipo de Operación *
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setMovementForm({ ...movementForm, type: "entrada" })}
                className={`py-2 px-4 rounded-xl text-xs font-bold border transition-all ${
                  movementForm.type === "entrada"
                    ? "bg-emerald-50 border-emerald-300 text-emerald-700 ring-2 ring-emerald-100"
                    : "bg-white border-slate-200 text-slate-500 hover:bg-slate-50"
                }`}
              >
                Entrada (+)
              </button>
              <button
                type="button"
                onClick={() => setMovementForm({ ...movementForm, type: "salida" })}
                className={`py-2 px-4 rounded-xl text-xs font-bold border transition-all ${
                  movementForm.type === "salida"
                    ? "bg-rose-50 border-rose-300 text-rose-700 ring-2 ring-rose-100"
                    : "bg-white border-slate-200 text-slate-500 hover:bg-slate-50"
                }`}
              >
                Salida (-)
              </button>
            </div>
          </div>

          {/* Cantidad */}
          <div>
            <label className="text-xs font-bold text-slate-500 block mb-1">
              Cantidad de Unidades *
            </label>
            <input
              type="number"
              required
              min="1"
              placeholder="Cantidad"
              value={movementForm.quantity}
              onChange={(e) =>
                setMovementForm({ ...movementForm, quantity: e.target.value })
              }
              className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-indigo-500"
            />
          </div>

          {/* Motivo */}
          <div>
            <label className="text-xs font-bold text-slate-500 block mb-1">
              Motivo o Justificación *
            </label>
            <input
              type="text"
              required
              placeholder="Ej: Compra a distribuidor, Ajuste, Despacho cliente"
              value={movementForm.reason}
              onChange={(e) =>
                setMovementForm({ ...movementForm, reason: e.target.value })
              }
              className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-indigo-500"
            />
          </div>

          {/* Acciones */}
          <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-50">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-xl font-semibold text-xs transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-semibold text-xs transition-colors"
            >
              Confirmar Movimiento
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}