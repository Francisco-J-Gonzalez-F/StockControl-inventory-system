import React, { useState, useMemo } from 'react';

// Datos iniciales de ejemplo para poblar el sistema al iniciar
const INITIAL_PRODUCTS = [
  { id: '1', sku: 'LAP-001', name: 'Laptop Pro 15"', category: 'Tecnología', price: 1200, quantity: 15, minStock: 5, supplier: 'TechDistribuidores', location: 'Estante A-3', description: 'Laptop de alta gama para desarrollo' },
  { id: '2', sku: 'MOU-002', name: 'Mouse Ergonómico Inalámbrico', category: 'Accesorios', price: 45, quantity: 4, minStock: 10, supplier: 'Accesorios Express', location: 'Estante B-1', description: 'Mouse óptico con batería recargable' },
  { id: '3', sku: 'MON-003', name: 'Monitor UHD 27"', category: 'Tecnología', price: 350, quantity: 8, minStock: 3, supplier: 'TechDistribuidores', location: 'Estante A-1', description: 'Monitor 4K IPS' },
  { id: '4', sku: 'SCA-004', name: 'Escritorio Elevable Eléctrico', category: 'Mobiliario', price: 499, quantity: 12, minStock: 2, supplier: 'Muebles de Oficina S.A.', location: 'Zona de Carga', description: 'Escritorio con motor dual y memoria' },
  { id: '5', sku: 'TECl-005', name: 'Teclado Mecánico RGB', category: 'Accesorios', price: 89, quantity: 25, minStock: 8, supplier: 'Accesorios Express', location: 'Estante B-2', description: 'Teclado con switches mecánicos táctiles' },
  { id: '6', sku: 'SIL-006', name: 'Silla Ergonómica Premium', category: 'Mobiliario', price: 299, quantity: 3, minStock: 5, supplier: 'Muebles de Oficina S.A.', location: 'Zona de Carga', description: 'Silla con soporte lumbar ajustable' }
];

const INITIAL_CATEGORIES = ['Tecnología', 'Accesorios', 'Mobiliario', 'Papelería', 'Otros'];

const INITIAL_SUPPLIERS = [
  { id: 's1', name: 'TechDistribuidores', contact: 'Juan Pérez', email: 'juan@techdist.com', phone: '+34 600 111 222' },
  { id: 's2', name: 'Accesorios Express', contact: 'María López', email: 'contacto@acceexpress.com', phone: '+34 600 333 444' },
  { id: 's3', name: 'Muebles de Oficina S.A.', contact: 'Carlos Gómez', email: 'ventas@mueblesoficina.com', phone: '+34 600 555 666' }
];

const INITIAL_MOVEMENTS = [
  { id: 'm1', date: '2026-05-28 10:30', productId: '1', productName: 'Laptop Pro 15"', type: 'entrada', quantity: 5, reason: 'Compra a proveedor', user: 'Admin' },
  { id: 'm2', date: '2026-05-29 14:15', productId: '2', productName: 'Mouse Ergonómico Inalámbrico', type: 'salida', quantity: 2, reason: 'Venta - Pedido #1024', user: 'Vendedor 1' },
  { id: 'm3', date: '2026-05-30 09:00', productId: '6', productName: 'Silla Ergonómica Premium', type: 'salida', quantity: 2, reason: 'Merma por daño de fábrica', user: 'Admin' },
  { id: 'm4', date: '2026-06-01 11:00', productId: '5', productName: 'Teclado Mecánico RGB', type: 'entrada', quantity: 10, reason: 'Reabastecimiento regular', user: 'Admin' }
];

export default function App() {
  // --- Estados de la Aplicación ---
  const [products, setProducts] = useState(INITIAL_PRODUCTS);
  const [categories, setCategories] = useState(INITIAL_CATEGORIES);
  const [suppliers, setSuppliers] = useState(INITIAL_SUPPLIERS);
  const [movements, setMovements] = useState(INITIAL_MOVEMENTS);

  const [activeTab, setActiveTab] = useState('dashboard'); // 'dashboard', 'products', 'movements', 'suppliers', 'categories'
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Todos');
  const [lowStockFilter, setLowStockFilter] = useState(false);

  // Estados de modales y formularios
  const [showProductModal, setShowProductModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [productForm, setProductForm] = useState({
    sku: '', name: '', category: 'Tecnología', price: '', quantity: '', minStock: '', supplier: '', location: '', description: ''
  });

  const [showMovementModal, setShowMovementModal] = useState(false);
  const [movementForm, setMovementForm] = useState({
    productId: '', type: 'entrada', quantity: '', reason: ''
  });

  const [showSupplierModal, setShowSupplierModal] = useState(false);
  const [editingSupplier, setEditingSupplier] = useState(null);
  const [supplierForm, setSupplierForm] = useState({ name: '', contact: '', email: '', phone: '' });

  const [newCategoryName, setNewCategoryName] = useState('');

  // Notificaciones personalizadas (Sustituye a alert())
  const [toasts, setToasts] = useState([]);

  const addToast = (message, type = 'success') => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  };

  // --- Cálculos y Analíticas ---
  const dashboardStats = useMemo(() => {
    const totalItems = products.reduce((acc, p) => acc + Number(p.quantity), 0);
    const totalValue = products.reduce((acc, p) => acc + (Number(p.quantity) * Number(p.price)), 0);
    const lowStockItems = products.filter(p => Number(p.quantity) <= Number(p.minStock));
    const totalUniqueProducts = products.length;

    return {
      totalItems,
      totalValue,
      lowStockCount: lowStockItems.length,
      totalUniqueProducts,
      lowStockItems
    };
  }, [products]);

  // Filtrado de productos en tiempo real
  const filteredProducts = useMemo(() => {
    return products.filter(product => {
      const matchesSearch = 
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.sku.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (product.description && product.description.toLowerCase().includes(searchQuery.toLowerCase()));
      
      const matchesCategory = selectedCategory === 'Todos' || product.category === selectedCategory;
      const matchesLowStock = !lowStockFilter || Number(product.quantity) <= Number(product.minStock);

      return matchesSearch && matchesCategory && matchesLowStock;
    });
  }, [products, searchQuery, selectedCategory, lowStockFilter]);

  // --- Handlers de Producto ---
  const handleOpenAddProduct = () => {
    setEditingProduct(null);
    setProductForm({
      sku: `PROD-${Math.floor(1000 + Math.random() * 9000)}`,
      name: '',
      category: categories[0] || '',
      price: '',
      quantity: '',
      minStock: '',
      supplier: suppliers[0]?.name || '',
      location: '',
      description: ''
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
    if (!productForm.sku || !productForm.name || !productForm.price || productForm.quantity === '' || !productForm.minStock) {
      addToast('Por favor, rellene todos los campos obligatorios.', 'error');
      return;
    }

    if (editingProduct) {
      // Edición
      const previousQty = Number(editingProduct.quantity);
      const newQty = Number(productForm.quantity);

      setProducts(prev => prev.map(p => p.id === editingProduct.id ? { ...productForm, price: Number(productForm.price), quantity: Number(productForm.quantity), minStock: Number(productForm.minStock) } : p));
      
      // Registrar movimiento si cambió la cantidad manualmente
      if (previousQty !== newQty) {
        const difference = Math.abs(newQty - previousQty);
        const movementType = newQty > previousQty ? 'entrada' : 'salida';
        const newMovement = {
          id: `m-${Date.now()}`,
          date: new Date().toISOString().replace('T', ' ').substring(0, 16),
          productId: editingProduct.id,
          productName: productForm.name,
          type: movementType,
          quantity: difference,
          reason: 'Ajuste manual de stock por edición',
          user: 'Admin'
        };
        setMovements(prev => [newMovement, ...prev]);
      }

      addToast('Producto actualizado correctamente.', 'success');
    } else {
      // Creación
      const newProduct = {
        ...productForm,
        id: `p-${Date.now()}`,
        price: Number(productForm.price),
        quantity: Number(productForm.quantity),
        minStock: Number(productForm.minStock)
      };

      // Validar SKU único
      if (products.some(p => p.sku.toLowerCase() === newProduct.sku.toLowerCase())) {
        addToast('El SKU introducido ya existe.', 'error');
        return;
      }

      setProducts(prev => [...prev, newProduct]);

      // Registrar movimiento de stock inicial si es mayor que 0
      if (newProduct.quantity > 0) {
        const newMovement = {
          id: `m-${Date.now()}`,
          date: new Date().toISOString().replace('T', ' ').substring(0, 16),
          productId: newProduct.id,
          productName: newProduct.name,
          type: 'entrada',
          quantity: newProduct.quantity,
          reason: 'Inventario inicial de producto',
          user: 'Admin'
        };
        setMovements(prev => [newMovement, ...prev]);
      }

      addToast('Producto añadido al inventario.', 'success');
    }
    setShowProductModal(false);
  };

  const handleDeleteProduct = (id, name) => {
    if (confirm(`¿Está seguro de que desea eliminar el producto "${name}"? Se perderá el stock disponible.`)) {
      setProducts(prev => prev.filter(p => p.id !== id));
      addToast(`Producto "${name}" eliminado.`, 'info');
    }
  };

  // --- Handlers de Entrada/Salida de Stock Rápido ---
  const handleOpenMovementModal = (product = null) => {
    setMovementForm({
      productId: product ? product.id : (products[0]?.id || ''),
      type: 'entrada',
      quantity: '',
      reason: ''
    });
    setShowMovementModal(true);
  };

  const handleSaveMovement = (e) => {
    e.preventDefault();
    const { productId, type, quantity, reason } = movementForm;
    const qtyNum = Number(quantity);

    if (!productId || !qtyNum || qtyNum <= 0 || !reason.trim()) {
      addToast('Rellene la cantidad y el motivo de forma válida.', 'error');
      return;
    }

    const product = products.find(p => p.id === productId);
    if (!product) {
      addToast('Producto no encontrado.', 'error');
      return;
    }

    if (type === 'salida' && product.quantity < qtyNum) {
      addToast(`Stock insuficiente. Stock actual: ${product.quantity} unidades.`, 'error');
      return;
    }

    // Actualizar cantidad del producto
    const updatedQty = type === 'entrada' ? product.quantity + qtyNum : product.quantity - qtyNum;
    setProducts(prev => prev.map(p => p.id === productId ? { ...p, quantity: updatedQty } : p));

    // Agregar logs de movimientos
    const newMovement = {
      id: `m-${Date.now()}`,
      date: new Date().toISOString().replace('T', ' ').substring(0, 16),
      productId,
      productName: product.name,
      type,
      quantity: qtyNum,
      reason,
      user: 'Admin'
    };

    setMovements(prev => [newMovement, ...prev]);
    setShowMovementModal(false);
    addToast(`Movimiento registrado: ${type === 'entrada' ? '+' : '-'}${qtyNum} de ${product.name}`, 'success');
  };

  // --- Handlers de Proveedores ---
  const handleOpenAddSupplier = () => {
    setEditingSupplier(null);
    setSupplierForm({ name: '', contact: '', email: '', phone: '' });
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
      addToast('Nombre de proveedor y de contacto requeridos.', 'error');
      return;
    }

    if (editingSupplier) {
      setSuppliers(prev => prev.map(s => s.id === editingSupplier.id ? { ...supplierForm, id: editingSupplier.id } : s));
      addToast('Proveedor actualizado.', 'success');
    } else {
      const newSupplier = { ...supplierForm, id: `s-${Date.now()}` };
      setSuppliers(prev => [...prev, newSupplier]);
      addToast('Proveedor registrado con éxito.', 'success');
    }
    setShowSupplierModal(false);
  };

  const handleDeleteSupplier = (id, name) => {
    if (confirm(`¿Seguro que desea eliminar al proveedor "${name}"?`)) {
      setSuppliers(prev => prev.filter(s => s.id !== id));
      addToast(`Proveedor "${name}" eliminado.`, 'info');
    }
  };

  // --- Handlers de Categorías ---
  const handleAddCategory = (e) => {
    e.preventDefault();
    const cleanCat = newCategoryName.trim();
    if (!cleanCat) return;

    if (categories.some(c => c.toLowerCase() === cleanCat.toLowerCase())) {
      addToast('La categoría ya existe.', 'error');
      return;
    }

    setCategories(prev => [...prev, cleanCat]);
    setNewCategoryName('');
    addToast(`Categoría "${cleanCat}" añadida.`, 'success');
  };

  const handleDeleteCategory = (cat) => {
    const isUsed = products.some(p => p.category === cat);
    if (isUsed) {
      addToast(`No se puede eliminar "${cat}" porque está siendo utilizada por uno o más productos.`, 'error');
      return;
    }

    setCategories(prev => prev.filter(c => c !== cat));
    addToast(`Categoría "${cat}" eliminada.`, 'info');
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans text-slate-800">
      
      {/* Toast Notifications */}
      <div className="fixed top-5 right-5 z-50 space-y-2 pointer-events-none max-w-sm w-full">
        {toasts.map(toast => (
          <div
            key={toast.id}
            className={`p-4 rounded-xl shadow-lg border text-white flex items-center justify-between transition-all duration-300 transform translate-x-0 pointer-events-auto ${
              toast.type === 'success' ? 'bg-emerald-600 border-emerald-500' :
              toast.type === 'error' ? 'bg-rose-600 border-rose-500' :
              'bg-blue-600 border-blue-500'
            }`}
          >
            <div className="flex items-center gap-2">
              {toast.type === 'success' && (
                <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" /></svg>
              )}
              {toast.type === 'error' && (
                <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
              )}
              {toast.type === 'info' && (
                <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
              )}
              <span className="text-sm font-medium">{toast.message}</span>
            </div>
            <button 
              onClick={() => setToasts(prev => prev.filter(t => t.id !== toast.id))}
              className="text-white hover:text-slate-200 ml-4 focus:outline-none"
            >
              &times;
            </button>
          </div>
        ))}
      </div>

      {/* Header Superior */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-30 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-indigo-600 text-white p-2.5 rounded-xl shadow-md shadow-indigo-100">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
              </svg>
            </div>
            <div>
              <h1 className="text-xl font-bold text-slate-900 tracking-tight">StockControl</h1>
              <p className="text-xs text-slate-500 font-medium">Sistema de Control de Inventario</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <button
              onClick={() => handleOpenMovementModal()}
              className="hidden md:flex items-center gap-2 px-4 h-10 bg-indigo-50 text-indigo-700 hover:bg-indigo-100 rounded-xl font-semibold text-sm transition-colors duration-150"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
              </svg>
              Registrar Movimiento
            </button>
            <button
              onClick={handleOpenAddProduct}
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

      {/* Contenido Principal con Layout de Sidebar Responsivo */}
      <div className="max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 flex-1 py-8 flex flex-col lg:flex-row gap-8">
        
        {/* Barra Lateral / Navegación */}
        <aside className="lg:w-64 flex-shrink-0">
          <nav className="flex lg:flex-col gap-1 p-1 bg-slate-100 lg:bg-transparent rounded-2xl overflow-x-auto lg:overflow-visible">
            <button
              onClick={() => setActiveTab('dashboard')}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold whitespace-nowrap transition-all duration-150 w-full ${
                activeTab === 'dashboard' 
                  ? 'bg-white lg:bg-indigo-600 text-indigo-600 lg:text-white shadow-sm lg:shadow-md lg:shadow-indigo-100' 
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/50'
              }`}
            >
              <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2H6a2 2 0 01-2-2v-4zM14 16a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2h-2a2 2 0 01-2-2v-4z" />
              </svg>
              Resumen Cuadro de Mando
            </button>
            
            <button
              onClick={() => setActiveTab('products')}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold whitespace-nowrap transition-all duration-150 w-full ${
                activeTab === 'products' 
                  ? 'bg-white lg:bg-indigo-600 text-indigo-600 lg:text-white shadow-sm lg:shadow-md lg:shadow-indigo-100' 
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/50'
              }`}
            >
              <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
              </svg>
              Productos e Inventario
            </button>

            <button
              onClick={() => setActiveTab('movements')}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold whitespace-nowrap transition-all duration-150 w-full ${
                activeTab === 'movements' 
                  ? 'bg-white lg:bg-indigo-600 text-indigo-600 lg:text-white shadow-sm lg:shadow-md lg:shadow-indigo-100' 
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/50'
              }`}
            >
              <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Historial de Movimientos
            </button>

            <button
              onClick={() => setActiveTab('suppliers')}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold whitespace-nowrap transition-all duration-150 w-full ${
                activeTab === 'suppliers' 
                  ? 'bg-white lg:bg-indigo-600 text-indigo-600 lg:text-white shadow-sm lg:shadow-md lg:shadow-indigo-100' 
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/50'
              }`}
            >
              <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              Proveedores
            </button>

            <button
              onClick={() => setActiveTab('categories')}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold whitespace-nowrap transition-all duration-150 w-full ${
                activeTab === 'categories' 
                  ? 'bg-white lg:bg-indigo-600 text-indigo-600 lg:text-white shadow-sm lg:shadow-md lg:shadow-indigo-100' 
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/50'
              }`}
            >
              <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 7h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              Categorías
            </button>
          </nav>

          <div className="hidden lg:block mt-8 p-4 bg-gradient-to-br from-indigo-900 to-slate-900 text-white rounded-2xl relative overflow-hidden shadow-md">
            <div className="absolute right-0 bottom-0 opacity-10 pointer-events-none transform translate-y-4 translate-x-4">
              <svg className="w-32 h-32" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" /></svg>
            </div>
            <h4 className="text-sm font-bold mb-1">¿Necesitas ayuda?</h4>
            <p className="text-xs text-indigo-200 leading-relaxed mb-3">Recuerda mantener el stock por encima del nivel mínimo para evitar alertas de quiebre.</p>
            <div className="inline-flex items-center gap-1.5 text-xs text-indigo-300 font-semibold cursor-default">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              Sistema Operativo
            </div>
          </div>
        </aside>

        {/* Sección de Contenido Activo */}
        <main className="flex-1 min-w-0">

          {/* TAB 1: DASHBOARD */}
          {activeTab === 'dashboard' && (
            <div className="space-y-8 animate-fadeIn">
              
              {/* Tarjetas de Métricas Generales */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
                <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-4">
                  <div className="p-3.5 bg-indigo-50 text-indigo-600 rounded-xl">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" /></svg>
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 font-semibold uppercase tracking-wider">Productos Únicos</p>
                    <p className="text-2xl font-bold text-slate-950 mt-1">{dashboardStats.totalUniqueProducts}</p>
                  </div>
                </div>

                <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-4">
                  <div className="p-3.5 bg-emerald-50 text-emerald-600 rounded-xl">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" /></svg>
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 font-semibold uppercase tracking-wider">Unidades Totales</p>
                    <p className="text-2xl font-bold text-slate-950 mt-1">{dashboardStats.totalItems}</p>
                  </div>
                </div>

                <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-4">
                  <div className="p-3.5 bg-amber-50 text-amber-600 rounded-xl">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 font-semibold uppercase tracking-wider">Valor del Inventario</p>
                    <p className="text-2xl font-bold text-slate-950 mt-1">
                      {new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR' }).format(dashboardStats.totalValue)}
                    </p>
                  </div>
                </div>

                <div className={`bg-white p-5 rounded-2xl border shadow-sm flex items-center gap-4 transition-all duration-300 ${dashboardStats.lowStockCount > 0 ? 'border-rose-100 bg-rose-50/20' : 'border-slate-100'}`}>
                  <div className={`p-3.5 rounded-xl ${dashboardStats.lowStockCount > 0 ? 'bg-rose-100 text-rose-600 animate-pulse' : 'bg-slate-100 text-slate-500'}`}>
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 font-semibold uppercase tracking-wider">Alertas de Stock</p>
                    <p className={`text-2xl font-bold mt-1 ${dashboardStats.lowStockCount > 0 ? 'text-rose-600' : 'text-slate-950'}`}>{dashboardStats.lowStockCount}</p>
                  </div>
                </div>
              </div>

              {/* Contenido Visual Interactivo del Dashboard */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                
                {/* Tabla/Lista de Alertas Críticas de Stock */}
                <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm lg:col-span-2">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="font-bold text-slate-900">Alertas Críticas de Stock Mínimo</h3>
                      <p className="text-xs text-slate-500">Productos que necesitan reabastecimiento urgente</p>
                    </div>
                    {dashboardStats.lowStockCount > 0 && (
                      <span className="px-2.5 py-1 bg-rose-100 text-rose-700 rounded-full text-xs font-bold">Reabastecer</span>
                    )}
                  </div>

                  {dashboardStats.lowStockItems.length === 0 ? (
                    <div className="text-center py-10">
                      <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-3">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" /></svg>
                      </div>
                      <p className="text-slate-600 font-semibold text-sm">¡Inventario Excelente!</p>
                      <p className="text-slate-400 text-xs mt-1">Todos los productos tienen niveles de stock correctos.</p>
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
                          {dashboardStats.lowStockItems.map(p => (
                            <tr key={p.id} className="text-sm hover:bg-slate-50/50">
                              <td className="py-3 font-semibold text-xs text-indigo-600">{p.sku}</td>
                              <td className="py-3 font-medium text-slate-900">{p.name}</td>
                              <td className="py-3 text-center text-slate-500 font-medium">{p.minStock}</td>
                              <td className="py-3 text-center font-bold text-rose-600 bg-rose-50/30 rounded-lg">{p.quantity}</td>
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
                    <h3 className="font-bold text-slate-900 mb-1">Distribución de Productos</h3>
                    <p className="text-xs text-slate-500 mb-5">Categorías con más valor en stock</p>

                    <div className="space-y-4">
                      {categories.map((cat, idx) => {
                        const catProducts = products.filter(p => p.category === cat);
                        const catVal = catProducts.reduce((acc, p) => acc + (p.price * p.quantity), 0);
                        const percentage = dashboardStats.totalValue > 0 ? (catVal / dashboardStats.totalValue) * 100 : 0;
                        const colors = ['bg-indigo-600', 'bg-emerald-500', 'bg-amber-500', 'bg-sky-500', 'bg-purple-500'];
                        const activeColor = colors[idx % colors.length];

                        return (
                          <div key={cat} className="space-y-1">
                            <div className="flex justify-between text-xs font-semibold">
                              <span className="text-slate-600">{cat}</span>
                              <span className="text-slate-950">{percentage.toFixed(1)}%</span>
                            </div>
                            <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                              <div className={`${activeColor} h-full rounded-full transition-all duration-500`} style={{ width: `${percentage}%` }}></div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  <div className="mt-6 pt-5 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                    <span>Valores calculados en tiempo real</span>
                    <button onClick={() => setActiveTab('products')} className="text-indigo-600 font-bold hover:underline">
                      Ver catálogo &rarr;
                    </button>
                  </div>
                </div>

              </div>

              {/* Registro de Movimientos Recientes */}
              <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="font-bold text-slate-900">Actividad de Stock Reciente</h3>
                    <p className="text-xs text-slate-500">Últimos flujos de entrada y salida registrados</p>
                  </div>
                  <button
                    onClick={() => setActiveTab('movements')}
                    className="text-xs font-bold text-indigo-600 hover:underline"
                  >
                    Ver historial completo
                  </button>
                </div>

                <div className="space-y-3">
                  {movements.slice(0, 4).map(mov => (
                    <div key={mov.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-3.5 bg-slate-50/50 hover:bg-slate-50 rounded-xl border border-slate-100 gap-3">
                      <div className="flex items-start gap-3">
                        <div className={`p-2 rounded-lg flex-shrink-0 ${mov.type === 'entrada' ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'}`}>
                          {mov.type === 'entrada' ? (
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 17l-4 4m0 0l-4-4m4 4V3" /></svg>
                          ) : (
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7l4-4m0 0l4 4m-4-4v18" /></svg>
                          )}
                        </div>
                        <div>
                          <p className="font-semibold text-sm text-slate-900">{mov.productName}</p>
                          <div className="flex flex-wrap items-center gap-x-2 text-xs text-slate-400 mt-0.5">
                            <span className="font-medium text-slate-500">{mov.reason}</span>
                            <span>&bull;</span>
                            <span>{mov.date}</span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between sm:justify-end gap-3 border-t sm:border-t-0 pt-2 sm:pt-0 border-slate-100">
                        <span className={`text-sm font-bold ${mov.type === 'entrada' ? 'text-emerald-600' : 'text-rose-600'}`}>
                          {mov.type === 'entrada' ? '+' : '-'}{mov.quantity} uds.
                        </span>
                        <span className="px-2 py-0.5 bg-slate-200 text-slate-600 rounded text-[10px] font-semibold">{mov.user}</span>
                      </div>
                    </div>
                  ))}
                  {movements.length === 0 && (
                    <p className="text-center py-6 text-slate-400 text-sm">No hay registro de movimientos.</p>
                  )}
                </div>
              </div>

            </div>
          )}

          {/* TAB 2: PRODUCTOS */}
          {activeTab === 'products' && (
            <div className="space-y-6 animate-fadeIn">
              
              {/* Filtros e interactividad */}
              <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-100 shadow-sm flex flex-col md:flex-row gap-4 items-center justify-between">
                
                {/* Input de Búsqueda */}
                <div className="relative w-full md:w-80">
                  <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
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
                    {categories.map(c => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>

                  <button
                    onClick={() => setLowStockFilter(!lowStockFilter)}
                    className={`flex items-center gap-2 py-2 px-4 rounded-xl text-sm font-semibold border transition-all ${
                      lowStockFilter 
                        ? 'bg-rose-50 border-rose-200 text-rose-700 font-bold ring-2 ring-rose-100' 
                        : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    <span className={`w-2.5 h-2.5 rounded-full ${lowStockFilter ? 'bg-rose-500' : 'bg-slate-300'}`}></span>
                    Stock Bajo
                  </button>
                </div>

              </div>

              {/* Tabla de Productos Principal */}
              <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
                <div className="p-5 border-b border-slate-100 flex items-center justify-between">
                  <div>
                    <h2 className="font-bold text-slate-900">Catálogo de Productos ({filteredProducts.length})</h2>
                    <p className="text-xs text-slate-500">Gestión de existencias, precios y ubicaciones</p>
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
                        <th className="py-4 px-6 text-right">Precio unitario</th>
                        <th className="py-4 px-6 text-center">Disponible</th>
                        <th className="py-4 px-6 text-center">Estado</th>
                        <th className="py-4 px-6 text-right">Acción</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {filteredProducts.map(product => {
                        const isLowStock = Number(product.quantity) <= Number(product.minStock);
                        const isOut = Number(product.quantity) === 0;

                        return (
                          <tr key={product.id} className="hover:bg-slate-50/50 transition-colors group">
                            <td className="py-4 px-6">
                              <span className="font-bold text-xs text-indigo-600 block">{product.sku}</span>
                              <span className="text-xs text-slate-400 mt-0.5 block">{product.location || 'Sin ubicar'}</span>
                            </td>
                            <td className="py-4 px-6">
                              <span className="font-bold text-sm text-slate-900 block">{product.name}</span>
                              <span className="text-xs text-slate-400 block max-w-xs truncate">{product.description || 'Sin descripción'}</span>
                            </td>
                            <td className="py-4 px-6">
                              <span className="inline-flex px-2.5 py-0.5 bg-slate-100 text-slate-600 rounded-full text-xs font-medium">
                                {product.category}
                              </span>
                            </td>
                            <td className="py-4 px-6 text-right font-semibold text-slate-900 text-sm">
                              {new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR' }).format(product.price)}
                            </td>
                            <td className="py-4 px-6 text-center">
                              <span className={`inline-block px-3 py-1 rounded-lg text-sm font-bold ${
                                isOut ? 'bg-rose-100 text-rose-700' : 
                                isLowStock ? 'bg-amber-100 text-amber-700' : 'bg-slate-100 text-slate-800'
                              }`}>
                                {product.quantity}
                              </span>
                              <span className="text-[10px] text-slate-400 block mt-1">Mín: {product.minStock}</span>
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
                                  onClick={() => handleOpenMovementModal(product)}
                                  title="Ajustar Stock"
                                  className="p-1.5 text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                                >
                                  <svg className="w-4.5 h-4.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" /></svg>
                                </button>
                                <button
                                  onClick={() => handleOpenEditProduct(product)}
                                  title="Editar Producto"
                                  className="p-1.5 text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
                                >
                                  <svg className="w-4.5 h-4.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
                                </button>
                                <button
                                  onClick={() => handleDeleteProduct(product.id, product.name)}
                                  title="Eliminar"
                                  className="p-1.5 text-rose-600 hover:bg-rose-50 rounded-lg transition-colors opacity-0 group-hover:opacity-100"
                                >
                                  <svg className="w-4.5 h-4.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
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
          )}

          {/* TAB 3: REGISTRO DE MOVIMIENTOS */}
          {activeTab === 'movements' && (
            <div className="space-y-6 animate-fadeIn">
              
              <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h2 className="font-bold text-slate-900">Historial Completo de Flujos</h2>
                  <p className="text-xs text-slate-500">Transacciones de stock y auditoría de inventario</p>
                </div>
                <button
                  onClick={() => handleOpenMovementModal()}
                  className="flex items-center justify-center gap-2 px-4 py-2 bg-indigo-600 text-white hover:bg-indigo-700 rounded-xl font-semibold text-xs transition-colors"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" /></svg>
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
                      {movements.map(mov => (
                        <tr key={mov.id} className="text-sm hover:bg-slate-50/40">
                          <td className="py-4 px-6 text-xs text-slate-500 font-medium">{mov.date}</td>
                          <td className="py-4 px-6 font-bold text-slate-900">{mov.productName}</td>
                          <td className="py-4 px-6">
                            <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold ${
                              mov.type === 'entrada' ? 'bg-emerald-50 text-emerald-700' : 'bg-rose-50 text-rose-700'
                            }`}>
                              <span className={`w-1.5 h-1.5 rounded-full ${mov.type === 'entrada' ? 'bg-emerald-500' : 'bg-rose-500'}`}></span>
                              {mov.type === 'entrada' ? 'Entrada' : 'Salida'}
                            </span>
                          </td>
                          <td className="py-4 px-6 text-center font-bold text-slate-950">
                            {mov.type === 'entrada' ? '+' : '-'}{mov.quantity}
                          </td>
                          <td className="py-4 px-6 text-slate-600 text-xs">{mov.reason}</td>
                          <td className="py-4 px-6">
                            <span className="px-2 py-0.5 bg-slate-100 text-slate-600 rounded text-xs font-semibold">{mov.user}</span>
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
          )}

          {/* TAB 4: PROVEEDORES */}
          {activeTab === 'suppliers' && (
            <div className="space-y-6 animate-fadeIn">
              
              <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h2 className="font-bold text-slate-900">Directorio de Proveedores</h2>
                  <p className="text-xs text-slate-500">Administración de canales de abastecimiento y contactos</p>
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
                {suppliers.map(sup => {
                  const associatedCount = products.filter(p => p.supplier === sup.name).length;

                  return (
                    <div key={sup.id} className="bg-white border border-slate-100 shadow-sm rounded-2xl p-5 hover:shadow-md transition-shadow flex flex-col justify-between">
                      <div>
                        <div className="flex items-start justify-between">
                          <div className="bg-indigo-50 text-indigo-700 p-2.5 rounded-xl">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>
                          </div>
                          <div className="flex gap-1.5">
                            <button
                              onClick={() => handleOpenEditSupplier(sup)}
                              className="p-1 hover:bg-slate-100 rounded text-slate-500 hover:text-slate-900"
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
                            </button>
                            <button
                              onClick={() => handleDeleteSupplier(sup.id, sup.name)}
                              className="p-1 hover:bg-rose-50 rounded text-slate-400 hover:text-rose-600"
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                            </button>
                          </div>
                        </div>

                        <h3 className="font-bold text-slate-900 text-base mt-4">{sup.name}</h3>
                        <p className="text-xs text-slate-400 mt-0.5">Contacto: {sup.contact}</p>

                        <div className="mt-4 space-y-2 text-xs text-slate-600 border-t border-slate-50 pt-3">
                          <div className="flex items-center gap-2">
                            <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                            <span>{sup.email || 'Sin correo electrónico'}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.94.725l.548 2.2a1 1 0 01-.321.988l-1.305.98a10.582 10.582 0 004.872 4.872l.98-1.305a1 1 0 01.988-.321l2.2.548a1 1 0 01.725.94V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>
                            <span>{sup.phone || 'Sin teléfono'}</span>
                          </div>
                        </div>
                      </div>

                      <div className="mt-5 pt-3 border-t border-slate-50 flex items-center justify-between text-xs font-semibold text-slate-500">
                        <span>Productos Suministrados</span>
                        <span className="px-2.5 py-0.5 bg-indigo-50 text-indigo-700 rounded-full">{associatedCount}</span>
                      </div>
                    </div>
                  );
                })}
              </div>

            </div>
          )}

          {/* TAB 5: CATEGORIAS */}
          {activeTab === 'categories' && (
            <div className="space-y-6 animate-fadeIn">
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                
                {/* Formulario Nueva Categoría */}
                <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm h-fit">
                  <h3 className="font-bold text-slate-900 mb-1">Nueva Categoría</h3>
                  <p className="text-xs text-slate-500 mb-4">Añada etiquetas de clasificación para catalogar stock</p>

                  <form onSubmit={handleAddCategory} className="space-y-4">
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
                  <h3 className="font-bold text-slate-900 mb-1 font-sans">Categorías Registradas</h3>
                  <p className="text-xs text-slate-500 mb-4">Etiquetas activas dentro del catálogo general</p>

                  <div className="divide-y divide-slate-50">
                    {categories.map(cat => {
                      const count = products.filter(p => p.category === cat).length;
                      
                      return (
                        <div key={cat} className="py-3 flex items-center justify-between group">
                          <div>
                            <span className="font-bold text-slate-800 text-sm">{cat}</span>
                            <span className="text-xs text-slate-400 block mt-0.5">{count} productos en stock con esta etiqueta</span>
                          </div>
                          
                          <button
                            onClick={() => handleDeleteCategory(cat)}
                            className="p-1.5 text-rose-600 hover:bg-rose-50 rounded-lg transition-colors opacity-0 group-hover:opacity-100"
                            title="Eliminar categoría"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
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
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl border border-slate-100 max-w-lg w-full max-h-[90vh] overflow-y-auto animate-scaleUp">
            <div className="p-5 border-b border-slate-100 flex items-center justify-between sticky top-0 bg-white z-10">
              <h3 className="font-bold text-slate-950 text-base">
                {editingProduct ? 'Editar Producto' : 'Añadir Nuevo Producto al Inventario'}
              </h3>
              <button
                onClick={() => setShowProductModal(false)}
                className="text-slate-400 hover:text-slate-600 font-bold text-lg"
              >
                &times;
              </button>
            </div>

            <form onSubmit={handleSaveProduct} className="p-5 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-slate-500 block mb-1">Código / SKU *</label>
                  <input
                    type="text"
                    required
                    value={productForm.sku}
                    onChange={(e) => setProductForm({ ...productForm, sku: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-indigo-500"
                    placeholder="Ej. LAP-102"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-500 block mb-1">Categoría *</label>
                  <select
                    value={productForm.category}
                    onChange={(e) => setProductForm({ ...productForm, category: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-indigo-500 bg-white"
                  >
                    {categories.map(c => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-500 block mb-1">Nombre del Producto *</label>
                <input
                  type="text"
                  required
                  value={productForm.name}
                  onChange={(e) => setProductForm({ ...productForm, name: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-indigo-500"
                  placeholder="Ej. Teclado Inalámbrico"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="text-xs font-bold text-slate-500 block mb-1">Precio Unitario (€) *</label>
                  <input
                    type="number"
                    required
                    min="0"
                    step="0.01"
                    value={productForm.price}
                    onChange={(e) => setProductForm({ ...productForm, price: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-indigo-500"
                    placeholder="0.00"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-500 block mb-1">Cantidad Inicial *</label>
                  <input
                    type="number"
                    required
                    min="0"
                    value={productForm.quantity}
                    onChange={(e) => setProductForm({ ...productForm, quantity: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-indigo-500"
                    placeholder="0"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-500 block mb-1">Mínimo Alerta *</label>
                  <input
                    type="number"
                    required
                    min="1"
                    value={productForm.minStock}
                    onChange={(e) => setProductForm({ ...productForm, minStock: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-indigo-500"
                    placeholder="Alerta stock bajo"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-slate-500 block mb-1">Proveedor</label>
                  <select
                    value={productForm.supplier}
                    onChange={(e) => setProductForm({ ...productForm, supplier: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-indigo-500 bg-white"
                  >
                    <option value="">Ninguno</option>
                    {suppliers.map(s => (
                      <option key={s.id} value={s.name}>{s.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-500 block mb-1">Ubicación física</label>
                  <input
                    type="text"
                    value={productForm.location}
                    onChange={(e) => setProductForm({ ...productForm, location: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-indigo-500"
                    placeholder="Ej. Pasillo 3, Caja 5"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-500 block mb-1">Descripción corta</label>
                <textarea
                  rows="2"
                  value={productForm.description}
                  onChange={(e) => setProductForm({ ...productForm, description: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-indigo-500"
                  placeholder="Detalles sobre características del producto..."
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-50">
                <button
                  type="button"
                  onClick={() => setShowProductModal(false)}
                  className="px-4 py-2 border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-xl font-semibold text-xs transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-semibold text-xs transition-colors"
                >
                  {editingProduct ? 'Guardar Cambios' : 'Añadir Producto'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* --- MODAL REGISTRO DE MOVIMIENTOS RÁPIDO (ENTRADA / SALIDA) --- */}
      {showMovementModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl border border-slate-100 max-w-md w-full animate-scaleUp">
            <div className="p-5 border-b border-slate-100 flex items-center justify-between sticky top-0 bg-white">
              <h3 className="font-bold text-slate-950 text-base">Registrar Movimiento de Stock</h3>
              <button
                onClick={() => setShowMovementModal(false)}
                className="text-slate-400 hover:text-slate-600 font-bold text-lg"
              >
                &times;
              </button>
            </div>

            <form onSubmit={handleSaveMovement} className="p-5 space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-500 block mb-1">Producto Objetivo *</label>
                <select
                  value={movementForm.productId}
                  onChange={(e) => setMovementForm({ ...movementForm, productId: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-indigo-500 bg-white"
                >
                  {products.map(p => (
                    <option key={p.id} value={p.id}>
                      {p.name} (Disponibles: {p.quantity})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-500 block mb-1">Tipo de Operación *</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setMovementForm({ ...movementForm, type: 'entrada' })}
                    className={`py-2 px-4 rounded-xl text-xs font-bold border transition-all ${
                      movementForm.type === 'entrada'
                        ? 'bg-emerald-50 border-emerald-300 text-emerald-700 ring-2 ring-emerald-100'
                        : 'bg-white border-slate-200 text-slate-500 hover:bg-slate-50'
                    }`}
                  >
                    Entrada (+)
                  </button>
                  <button
                    type="button"
                    onClick={() => setMovementForm({ ...movementForm, type: 'salida' })}
                    className={`py-2 px-4 rounded-xl text-xs font-bold border transition-all ${
                      movementForm.type === 'salida'
                        ? 'bg-rose-50 border-rose-300 text-rose-700 ring-2 ring-rose-100'
                        : 'bg-white border-slate-200 text-slate-500 hover:bg-slate-50'
                    }`}
                  >
                    Salida (-)
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4">
                <div>
                  <label className="text-xs font-bold text-slate-500 block mb-1">Cantidad de Unidades *</label>
                  <input
                    type="number"
                    required
                    min="1"
                    placeholder="Cantidad"
                    value={movementForm.quantity}
                    onChange={(e) => setMovementForm({ ...movementForm, quantity: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-500 block mb-1">Motivo o Justificación *</label>
                <input
                  type="text"
                  required
                  placeholder="Ej: Compra a distribuidor, Ajuste, Despacho cliente"
                  value={movementForm.reason}
                  onChange={(e) => setMovementForm({ ...movementForm, reason: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-50">
                <button
                  type="button"
                  onClick={() => setShowMovementModal(false)}
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
      )}

      {/* --- MODAL PROVEEDORES (AGREGAR / EDITAR) --- */}
      {showSupplierModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl border border-slate-100 max-w-md w-full animate-scaleUp">
            <div className="p-5 border-b border-slate-100 flex items-center justify-between">
              <h3 className="font-bold text-slate-950 text-base">
                {editingSupplier ? 'Editar Proveedor' : 'Registrar Nuevo Proveedor'}
              </h3>
              <button
                onClick={() => setShowSupplierModal(false)}
                className="text-slate-400 hover:text-slate-600 font-bold text-lg"
              >
                &times;
              </button>
            </div>

            <form onSubmit={handleSaveSupplier} className="p-5 space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-500 block mb-1">Nombre Comercial del Proveedor *</label>
                <input
                  type="text"
                  required
                  placeholder="Ej. Distribuidora Global S.L."
                  value={supplierForm.name}
                  onChange={(e) => setSupplierForm({ ...supplierForm, name: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-500 block mb-1">Nombre de Contacto Directo *</label>
                <input
                  type="text"
                  required
                  placeholder="Ej. Juan Gómez"
                  value={supplierForm.contact}
                  onChange={(e) => setSupplierForm({ ...supplierForm, contact: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="grid grid-cols-1 gap-4">
                <div>
                  <label className="text-xs font-bold text-slate-500 block mb-1">Correo Electrónico</label>
                  <input
                    type="email"
                    placeholder="contacto@proveedor.com"
                    value={supplierForm.email}
                    onChange={(e) => setSupplierForm({ ...supplierForm, email: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-500 block mb-1">Teléfono de Contacto</label>
                  <input
                    type="text"
                    placeholder="+34..."
                    value={supplierForm.phone}
                    onChange={(e) => setSupplierForm({ ...supplierForm, phone: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-50">
                <button
                  type="button"
                  onClick={() => setShowSupplierModal(false)}
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
      )}

      {/* Footer General */}
      <footer className="bg-slate-900 text-slate-400 py-6 border-t border-slate-800 text-center mt-12">
        <div className="max-w-7xl mx-auto px-4 text-xs">
          <p className="font-semibold text-slate-300">StockControl - Suite Empresarial de Control de Inventario v1.2</p>
          <p className="mt-1 text-slate-500">Diseñado para la gestión ágil de almacenes, auditorías de stock, entradas y salidas de mercancía.</p>
        </div>
      </footer>

    </div>
  );
}