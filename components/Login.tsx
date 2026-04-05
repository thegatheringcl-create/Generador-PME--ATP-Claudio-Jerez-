
import React, { useState } from 'react';
import { AUTH_USERS } from '../constants/auth';

interface LoginProps {
    onLogin: (establishment: string) => void;
}

export default function Login({ onLogin }: LoginProps) {
    const [selectedUser, setSelectedUser] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        const user = AUTH_USERS.find(u => u.establishment === selectedUser);
        
        if (!user) {
            setError('Por favor, selecciona un establecimiento.');
            return;
        }

        if (user.key === password) {
            localStorage.setItem('pme_establishment', user.establishment);
            onLogin(user.establishment);
        } else {
            setError('Clave incorrecta. Por favor, inténtalo de nuevo.');
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-pme-light p-4">
            <div className="max-w-md w-full bg-white rounded-xl shadow-2xl overflow-hidden border border-gray-100">
                <div className="bg-pme-primary p-8 text-center">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-white/10 mb-4">
                        <span className="material-symbols-outlined text-4xl text-white">lock</span>
                    </div>
                    <h1 className="text-2xl font-bold text-white">Acceso al Sistema</h1>
                    <p className="text-pme-secondary text-sm mt-2">Generador de Acciones PME con IA</p>
                </div>
                
                <form onSubmit={handleSubmit} className="p-8 space-y-6">
                    <div>
                        <label htmlFor="user" className="block text-sm font-bold text-pme-primary mb-2">
                            Establecimiento
                        </label>
                        <select
                            id="user"
                            value={selectedUser}
                            onChange={(e) => setSelectedUser(e.target.value)}
                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pme-secondary focus:border-pme-secondary outline-none transition-all text-sm"
                        >
                            <option value="">-- Seleccione su establecimiento --</option>
                            {AUTH_USERS.map((user) => (
                                <option key={user.establishment} value={user.establishment}>
                                    {user.establishment}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label htmlFor="pass" className="block text-sm font-bold text-pme-primary mb-2">
                            Clave de Acceso
                        </label>
                        <div className="relative">
                            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">key</span>
                            <input
                                type="password"
                                id="pass"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="Ingrese su clave"
                                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pme-secondary focus:border-pme-secondary outline-none transition-all text-sm"
                            />
                        </div>
                    </div>

                    {error && (
                        <div className="p-3 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2 text-red-700 text-xs animate-in fade-in slide-in-from-top-1">
                            <span className="material-symbols-outlined text-sm">error</span>
                            {error}
                        </div>
                    )}

                    <button
                        type="submit"
                        className="w-full bg-pme-primary text-white font-bold py-3 rounded-lg hover:bg-pme-primary/90 transition-all shadow-lg active:scale-[0.98]"
                    >
                        Ingresar
                    </button>
                </form>
                
                <div className="p-4 bg-gray-50 border-t border-gray-100 text-center">
                    <div className="mb-3 text-xs text-gray-600 bg-blue-50 p-3 rounded-lg border border-blue-100">
                        <p className="mb-1">Este proyecto es una herramienta desarrollada para apoyar la gestión escolar.</p>
                        <p className="mb-2">Sin fines de lucro, pero requiere la colaboración para pagar el servidor y suscripción Google Cloud IA.</p>
                        <p className="font-bold text-pme-primary mb-2">
                            Haz Click en el Link para Donar: 5.5 dólares y recibir Usuario<br/>
                            <a href="https://paypal.me/GeneradorPME" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline text-sm inline-block mt-1">
                                https://paypal.me/GeneradorPME
                            </a>
                        </p>
                        <div className="border-t border-blue-200 pt-2 mt-2">
                            <p className="font-bold text-green-700 mb-2">
                                Solicitar Usuario en este Link:<br/>
                                <a href="https://wa.link/jamqtc" target="_blank" rel="noopener noreferrer" className="text-green-600 hover:underline text-sm inline-block mt-1">
                                    https://wa.link/jamqtc
                                </a>
                            </p>
                            <img 
                                src="https://api.qrserver.com/v1/create-qr-code/?size=120x120&data=https://wa.link/jamqtc" 
                                alt="Código QR WhatsApp" 
                                className="mx-auto rounded-lg shadow-sm border border-gray-200"
                                width="120"
                                height="120"
                                referrerPolicy="no-referrer"
                            />
                        </div>
                    </div>
                    <p className="text-[10px] text-gray-400">
                        © 2026 Generador de Acciones PME - Todos los derechos reservados
                    </p>
                </div>
            </div>
        </div>
    );
}
