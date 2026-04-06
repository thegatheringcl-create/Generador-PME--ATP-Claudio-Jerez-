
import React, { useState, useEffect } from 'react';
import PmeGenerator from './components/PmeGenerator';
import ObjectiveGoalGenerator from './components/ObjectiveGoalGenerator';
import EvaluadorLector from './components/EvaluadorLector';
import EvaluadorEid from './components/EvaluadorEid';
import DocentePlanner from './components/DocentePlanner';
import Chatbot from './components/Chatbot';
import Tutorial from './components/Tutorial';
import Login from './components/Login';
import { loginAnonymously } from './firebase';

type Tab = 'pme' | 'goals' | 'lector' | 'eid' | 'docente';

export default function App() {
    const [activeTab, setActiveTab] = useState<Tab>('pme');
    const [isChatOpen, setIsChatOpen] = useState<boolean>(false);
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
        loginAnonymously().catch(err => {
            console.error("Firebase anonymous login failed:", err);
            if (err.code === 'auth/admin-restricted-operation') {
                setAuthError("El inicio de sesión anónimo está deshabilitado en la Consola de Firebase.");
            } else {
                setAuthError(err.message || "Error al conectar con Firebase.");
            }
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

    const TabButton: React.FC<{ tabId: Tab, currentTab: Tab, setTab: (tab: Tab) => void, icon: string, children: React.ReactNode }> = ({ tabId, currentTab, setTab, icon, children }) => (
        <button
            onClick={() => setTab(tabId)}
            className={`flex items-center justify-center gap-2 px-3 py-2 text-xs sm:text-sm font-medium rounded-t-lg transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-pme-secondary focus:ring-offset-2 whitespace-nowrap ${
                currentTab === tabId
                    ? 'bg-white text-pme-primary border-b-2 border-pme-secondary shadow-[0_-2px_10px_-3px_rgba(0,0,0,0.1)]'
                    : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
            }`}
        >
            <span className="material-symbols-outlined text-sm sm:text-base">{icon}</span>
            {children}
        </button>
    );

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
            <div className="flex items-center justify-between mb-4 bg-pme-primary p-4 rounded-t-xl shadow-lg">
                <div className="flex items-center gap-3">
                    <div className="bg-white/20 p-2 rounded-lg">
                        <span className="material-symbols-outlined text-white">school</span>
                    </div>
                    <div>
                        <p className="text-[10px] text-pme-secondary uppercase font-bold tracking-wider">Establecimiento</p>
                        <h2 className="text-white font-bold text-sm truncate max-w-[150px] sm:max-w-md">{userEstablishment}</h2>
                    </div>
                </div>
                <button 
                    onClick={handleLogout}
                    className="flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white px-3 py-1.5 rounded-lg text-xs font-bold transition-all border border-white/20"
                >
                    <span className="material-symbols-outlined text-sm">logout</span>
                    Salir
                </button>
            </div>

            <div className="flex border-b border-gray-200 overflow-x-auto no-scrollbar bg-gray-50 rounded-t-lg">
                <TabButton tabId="pme" currentTab={activeTab} setTab={setActiveTab} icon="description">Planificador PME</TabButton>
                <TabButton tabId="goals" currentTab={activeTab} setTab={setActiveTab} icon="target">Objetivos y Metas</TabButton>
                <TabButton tabId="lector" currentTab={activeTab} setTab={setActiveTab} icon="menu_book">Evaluador Lector</TabButton>
                <TabButton tabId="eid" currentTab={activeTab} setTab={setActiveTab} icon="analytics">Evaluador EID</TabButton>
                <TabButton tabId="docente" currentTab={activeTab} setTab={setActiveTab} icon="person_search">Planificador Docente</TabButton>
            </div>
            
            <div className="bg-white rounded-b-xl shadow-2xl overflow-hidden min-h-[600px]">
                {activeTab === 'pme' && <PmeGenerator />}
                {activeTab === 'goals' && <ObjectiveGoalGenerator />}
                {activeTab === 'lector' && <EvaluadorLector />}
                {activeTab === 'eid' && <EvaluadorEid />}
                {activeTab === 'docente' && <DocentePlanner />}
            </div>

            {/* Chatbot and FAB */}
            <div className="fixed bottom-6 right-6 z-50">
                <button
                    onClick={() => setIsChatOpen(!isChatOpen)}
                    className="bg-pme-secondary text-white rounded-full p-4 shadow-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-pme-secondary focus:ring-offset-2 transition-transform duration-300 hover:scale-110"
                    aria-label="Abrir chat de ayuda"
                >
                    <span className="material-symbols-outlined">smart_toy</span>
                </button>
            </div>

            {isChatOpen && <Chatbot onClose={() => setIsChatOpen(false)} />}
            <Tutorial />

            {/* Footer de donación */}
            <div className="mt-8 text-center text-gray-600 text-xs pb-4 bg-white p-4 rounded-xl shadow-sm border border-gray-100">
                <p className="mb-1">Este proyecto es una herramienta desarrollada para apoyar la gestión escolar.</p>
                <p className="mb-2">Sin fines de lucro, pero requiere la colaboración para pagar el servidor y suscripción Google Cloud IA.</p>
                <p className="font-bold text-pme-primary mb-2">
                    Haz Click en el Link para Donar: 5.5 dólares y recibir Usuario<br/>
                    <a href="https://paypal.me/GeneradorPME" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline text-sm inline-block mt-1">
                        https://paypal.me/GeneradorPME
                    </a>
                </p>
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
