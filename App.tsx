
import React, { useState, useEffect } from 'react';
import PmeGenerator from './components/PmeGenerator';
import Chatbot from './components/Chatbot';
import Tutorial from './components/Tutorial';
import Login from './components/Login';
import FirebaseSettings from './components/FirebaseSettings';
import { loginAnonymously } from './firebase';

export default function App() {
    const [isChatOpen, setIsChatOpen] = useState<boolean>(false);
    const [isFirebaseSettingsOpen, setIsFirebaseSettingsOpen] = useState<boolean>(false);
    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
    const [userEstablishment, setUserEstablishment] = useState<string>('');
    const [authError, setAuthError] = useState<string | null>(null);

    useEffect(() => {
        const savedAuth = localStorage.getItem('pme_establishment');
        if (savedAuth) {
            setIsAuthenticated(true);
            setUserEstablishment(savedAuth);
        }
        
        // Ensure user is signed in to Firebase anonymously for Firestore access
        loginAnonymously().then(user => {
            if (!user) {
                setAuthError("El guardado en la nube está desactivado. Habilita 'Anónimo' en Firebase para activar esta función.");
            }
        }).catch(err => {
            console.error("Firebase login failed:", err);
            setAuthError(err.message || "Error al conectar con Firebase.");
        });
    }, []);

    const handleLogin = (establishment: string) => {
        setIsAuthenticated(true);
        setUserEstablishment(establishment);
        localStorage.setItem('pme_establishment', establishment);
    };

    const handleLogout = () => {
        setIsAuthenticated(false);
        setUserEstablishment('');
        localStorage.removeItem('pme_establishment');
    };

    if (!isAuthenticated) {
        return <Login onLogin={handleLogin} />;
    }

    return (
        <div className="container max-w-6xl mx-auto my-5 sm:my-10 px-4">
            {authError && (
                <div className="mb-4 p-3 bg-amber-50 border border-amber-200 rounded-lg flex items-center justify-between text-amber-800 text-xs shadow-sm">
                    <div className="flex items-center gap-2">
                        <span className="material-symbols-outlined text-amber-600 text-sm">warning</span>
                        <span>
                            <strong>Modo limitado:</strong> {authError} 
                            <a href="https://console.firebase.google.com/project/gen-lang-client-0493179322/authentication/providers" target="_blank" rel="noopener noreferrer" className="ml-2 underline font-bold">Habilitar aquí</a>
                        </span>
                    </div>
                    <button onClick={() => setAuthError(null)} className="text-amber-400 hover:text-amber-600">
                        <span className="material-symbols-outlined text-sm">close</span>
                    </button>
                </div>
            )}
            <div className="flex items-center justify-between mb-0 bg-pme-primary p-4 rounded-t-xl shadow-lg">
                <div className="flex items-center gap-3">
                    <div className="bg-white/20 p-2 rounded-lg">
                        <span className="material-symbols-outlined text-white">school</span>
                    </div>
                    <div>
                        <p className="text-[10px] text-pme-secondary uppercase font-bold tracking-wider">Establecimiento</p>
                        <h2 className="text-white font-bold text-sm truncate max-w-[150px] sm:max-w-md">{userEstablishment}</h2>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <button 
                        onClick={() => setIsFirebaseSettingsOpen(true)}
                        className="flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white px-3 py-1.5 rounded-lg text-xs font-bold transition-all border border-white/20"
                        title="Configuración de Firebase"
                    >
                        <span className="material-symbols-outlined text-sm">settings_suggest</span>
                        <span className="hidden sm:inline">Configurar</span>
                    </button>
                    <button 
                        onClick={handleLogout}
                        className="flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white px-3 py-1.5 rounded-lg text-xs font-bold transition-all border border-white/20"
                    >
                        <span className="material-symbols-outlined text-sm">logout</span>
                        Salir
                    </button>
                </div>
            </div>

            <div className="bg-white rounded-b-xl shadow-2xl overflow-hidden min-h-[600px] border-t border-pme-secondary">
                <PmeGenerator />
            </div>

            {/* Chatbot and FAB */}
            <div className="fixed bottom-6 right-6 z-50">
                <button
                    onClick={() => setIsChatOpen(!isChatOpen)}
                    className="bg-pme-secondary text-white rounded-full p-4 shadow-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-pme-secondary focus:ring-offset-2"
                    aria-label="Abrir chat de ayuda"
                >
                    <span className="material-symbols-outlined">smart_toy</span>
                </button>
            </div>

            {isChatOpen && <Chatbot onClose={() => setIsChatOpen(false)} />}
            {isFirebaseSettingsOpen && <FirebaseSettings onClose={() => setIsFirebaseSettingsOpen(false)} />}
            <Tutorial />

            {/* Footer informativo */}
            <div className="mt-8 text-center text-gray-600 text-xs pb-4 bg-white p-4 rounded-xl shadow-sm border border-gray-100">
                <p className="mb-1">Este proyecto es una herramienta desarrollada para apoyar la gestión escolar.</p>
                <div className="border-t border-gray-200 pt-2 mt-2">
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
        </div>
    );
}
