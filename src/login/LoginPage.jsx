import React, { useState } from 'react';
import './LoginPage.css';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    // Aquí manejas la lógica de autenticación
    console.log({ email, password, rememberMe });
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center p-4 font-sans antialiased">
      <div className="bg-white rounded-2xl shadow-sm border border-[#E2E8F0] overflow-hidden max-w-4xl w-full flex flex-col md:flex-row">
        
        {/* Panel Izquierdo: Bienvenida e Identidad de Marca */}
        <div className="bg-gradient-to-br from-[#4F46E5] to-[#3730A3] text-white p-8 md:p-12 md:w-1/2 flex flex-col justify-between relative overflow-hidden">
          {/* Elemento geométrico sutil de fondo (similar al cubo de "¿Necesitas ayuda?") */}
          <div className="absolute right-[-20%] bottom-[-10%] w-64 h-64 bg-white/5 rounded-3xl transform rotate-45 pointer-events-none"></div>
          
          <div className="flex items-center gap-3">
            <div className="bg-white/10 p-2 rounded-xl backdrop-blur-sm">
              {/* Icono de Caja/Inventario similar al logo */}
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
              </svg>
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-tight">StockControl</h1>
              <p className="text-xs text-indigo-200">Sistema de Control de Inventario</p>
            </div>
          </div>

          <div className="my-12 md:my-0">
            <h2 className="text-3xl font-extrabold leading-tight mb-4">
              Gestiona tu stock de forma inteligente.
            </h2>
            <p className="text-indigo-100 text-sm max-w-sm leading-relaxed">
              Supervisa unidades, controla movimientos y recibe alertas críticas en tiempo real desde un solo panel.
            </p>
          </div>

          <div className="text-xs text-indigo-200/80">
            &copy; {new Date().getFullYear()} StockControl. Todos los derechos reservados.
          </div>
        </div>

        {/* Panel Derecho: Formulario de Login */}
        <div className="p-8 md:p-12 md:w-1/2 flex flex-col justify-center">
          <div className="mb-8">
            <h3 className="text-2xl font-bold text-[#1E293B]">Iniciar Sesión</h3>
            <p className="text-sm text-[#64748B] mt-1">Ingresa tus credenciales para acceder al sistema</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-xs font-semibold text-[#475569] uppercase tracking-wider mb-2">
                Correo Electrónico
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-[#94A3B8]">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                  </svg>
                </span>
                <input
                  type="email"
                  required
                  placeholder="ejemplo@correo.com"
                  className="login-input"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="block text-xs font-semibold text-[#475569] uppercase tracking-wider">
                  Contraseña
                </label>
                <a href="#forgot" className="text-xs font-medium text-[#4F46E5] hover:underline">
                  ¿Olvidaste tu contraseña?
                </a>
              </div>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-[#94A3B8]">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </span>
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  className="login-input"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>

            <div className="flex items-center justify-between pt-1">
              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  className="rounded border-[#CBD5E1] text-[#4F46E5] focus:ring-[#4F46E5] w-4 h-4 transition duration-150"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                />
                <span className="text-sm text-[#475569]">Recordar sesión</span>
              </label>
            </div>

            <button
              type="submit"
              className="w-full bg-[#4F46E5] hover:bg-[#4338CA] text-white font-medium py-3 px-4 rounded-xl transition-all duration-200 shadow-sm shadow-indigo-100 flex items-center justify-center gap-2 text-sm mt-2"
            >
              <span>Ingresar al Sistema</span>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </button>
          </form>
        </div>
        
      </div>
    </div>
  );
}