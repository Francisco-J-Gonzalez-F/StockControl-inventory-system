// src/components/modals/SupplierModal.jsx
export default function SupplierModal({
  editingSupplier,
  supplierForm,
  setSupplierForm,
  onSave,
  onClose,
}) {
  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl border border-slate-100 max-w-md w-full animate-scaleUp">

        {/* Header */}
        <div className="p-5 border-b border-slate-100 flex items-center justify-between">
          <h3 className="font-bold text-slate-950 text-base">
            {editingSupplier ? "Editar Proveedor" : "Registrar Nuevo Proveedor"}
          </h3>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 font-bold text-lg"
          >
            &times;
          </button>
        </div>

        <form onSubmit={onSave} className="p-5 space-y-4">

          {/* Nombre comercial */}
          <div>
            <label className="text-xs font-bold text-slate-500 block mb-1">
              Nombre Comercial del Proveedor *
            </label>
            <input
              type="text"
              required
              placeholder="Ej. Distribuidora Global S.L."
              value={supplierForm.name}
              onChange={(e) =>
                setSupplierForm({ ...supplierForm, name: e.target.value })
              }
              className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-indigo-500"
            />
          </div>

          {/* Contacto */}
          <div>
            <label className="text-xs font-bold text-slate-500 block mb-1">
              Nombre de Contacto Directo *
            </label>
            <input
              type="text"
              required
              placeholder="Ej. Juan Gómez"
              value={supplierForm.contact}
              onChange={(e) =>
                setSupplierForm({ ...supplierForm, contact: e.target.value })
              }
              className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-indigo-500"
            />
          </div>

          {/* Email y teléfono */}
          <div className="grid grid-cols-1 gap-4">
            <div>
              <label className="text-xs font-bold text-slate-500 block mb-1">
                Correo Electrónico
              </label>
              <input
                type="email"
                placeholder="contacto@proveedor.com"
                value={supplierForm.email}
                onChange={(e) =>
                  setSupplierForm({ ...supplierForm, email: e.target.value })
                }
                className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-indigo-500"
              />
            </div>
            <div>
              <label className="text-xs font-bold text-slate-500 block mb-1">
                Teléfono de Contacto
              </label>
              <input
                type="text"
                placeholder="+34..."
                value={supplierForm.phone}
                onChange={(e) =>
                  setSupplierForm({ ...supplierForm, phone: e.target.value })
                }
                className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-indigo-500"
              />
            </div>
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
              Guardar Proveedor
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}