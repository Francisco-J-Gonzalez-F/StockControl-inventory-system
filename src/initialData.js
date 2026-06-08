export const INITIAL_PRODUCTS = [
  { id: '1', sku: 'LAP-001', name: 'Laptop Pro 15"', category: 'Tecnología', price: 1200, quantity: 15, minStock: 5, supplier: 'TechDistribuidores', location: 'Estante A-3', description: 'Laptop de alta gama para desarrollo' },
  { id: '2', sku: 'MOU-002', name: 'Mouse Ergonómico Inalámbrico', category: 'Accesorios', price: 45, quantity: 4, minStock: 10, supplier: 'Accesorios Express', location: 'Estante B-1', description: 'Mouse óptico con batería recargable' },
  { id: '3', sku: 'MON-003', name: 'Monitor UHD 27"', category: 'Tecnología', price: 350, quantity: 8, minStock: 3, supplier: 'TechDistribuidores', location: 'Estante A-1', description: 'Monitor 4K IPS' },
  { id: '4', sku: 'SCA-004', name: 'Escritorio Elevable Eléctrico', category: 'Mobiliario', price: 499, quantity: 12, minStock: 2, supplier: 'Muebles de Oficina S.A.', location: 'Zona de Carga', description: 'Escritorio con motor dual y memoria' },
  { id: '5', sku: 'TECl-005', name: 'Teclado Mecánico RGB', category: 'Accesorios', price: 89, quantity: 25, minStock: 8, supplier: 'Accesorios Express', location: 'Estante B-2', description: 'Teclado con switches mecánicos táctiles' },
  { id: '6', sku: 'SIL-006', name: 'Silla Ergonómica Premium', category: 'Mobiliario', price: 299, quantity: 3, minStock: 5, supplier: 'Muebles de Oficina S.A.', location: 'Zona de Carga', description: 'Silla con soporte lumbar ajustable' }
];

export const INITIAL_CATEGORIES = ['Tecnología', 'Accesorios', 'Mobiliario', 'Papelería', 'Otros'];

export const INITIAL_SUPPLIERS = [
  { id: 's1', name: 'TechDistribuidores', contact: 'Juan Pérez', email: 'juan@techdist.com', phone: '+34 600 111 222' },
  { id: 's2', name: 'Accesorios Express', contact: 'María López', email: 'contacto@acceexpress.com', phone: '+34 600 333 444' },
  { id: 's3', name: 'Muebles de Oficina S.A.', contact: 'Carlos Gómez', email: 'ventas@mueblesoficina.com', phone: '+34 600 555 666' }
];

export const INITIAL_MOVEMENTS = [
  { id: 'm1', date: '2026-05-28 10:30', productId: '1', productName: 'Laptop Pro 15"', type: 'entrada', quantity: 5, reason: 'Compra a proveedor', user: 'Admin' },
  { id: 'm2', date: '2026-05-29 14:15', productId: '2', productName: 'Mouse Ergonómico Inalámbrico', type: 'salida', quantity: 2, reason: 'Venta - Pedido #1024', user: 'Vendedor 1' },
  { id: 'm3', date: '2026-05-30 09:00', productId: '6', productName: 'Silla Ergonómica Premium', type: 'salida', quantity: 2, reason: 'Merma por daño de fábrica', user: 'Admin' },
  { id: 'm4', date: '2026-06-01 11:00', productId: '5', productName: 'Teclado Mecánico RGB', type: 'entrada', quantity: 10, reason: 'Reabastecimiento regular', user: 'Admin' }
];