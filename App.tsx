
import React, { useState, useEffect } from 'react';
import PmeGenerator from './components/PmeGenerator';
import ObjectiveGoalGenerator from './components/ObjectiveGoalGenerator';
import Chatbot from './components/Chatbot';
import Tutorial from './components/Tutorial';
import Login from './components/Login';

type Tab = 'pme' | 'goals';

export default function App() {
    const [activeTab, setActiveTab] = useState<Tab>('pme');
    const [isChatOpen, setIsChatOpen] = useState<boolean>(false);
    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
    const [userEstablishment, setUserEstablishment] = useState<string>('');

    useEffect(() => {
        const savedAuth = localStorage.getItem('pme_establishment');
        if (savedAuth) {
            setIsAuthenticated(true);
            setUserEstablishment(savedAuth);
        }
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

    // FIX: Re-typed component props using React.FC to resolve incorrect 'children' prop error.
    const TabButton: React.FC<{ tabId: Tab, currentTab: Tab, setTab: (tab: Tab) => void, icon: string, children: React.ReactNode }> = ({ tabId, currentTab, setTab, icon, children }) => (
        <button
            onClick={() => setTab(tabId)}
            className={`flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium rounded-t-lg transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-pme-secondary focus:ring-offset-2 ${
                currentTab === tabId
                    ? 'bg-white text-pme-primary border-b-2 border-pme-secondary'
                    : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
            }`}
        >
            <span className="material-symbols-outlined">{icon}</span>
            {children}
        </button>
    );

    return (
        <div className="container max-w-4xl mx-auto my-5 sm:my-10 px-4">
            <div className="flex items-center justify-between mb-4 bg-pme-primary p-4 rounded-t-xl shadow-lg">
                <div className="flex items-center gap-3">
                    <div className="bg-white/20 p-2 rounded-lg">
                        <span className="material-symbols-outlined text-white">school</span>
                    </div>
                    <div>
                        <p className="text-[10px] text-pme-secondary uppercase font-bold tracking-wider">Establecimiento</p>
                        <h2 className="text-white font-bold text-sm truncate max-w-[200px] sm:max-w-md">{userEstablishment}</h2>
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

            <div className="flex border-b border-gray-200">
                <TabButton tabId="pme" currentTab={activeTab} setTab={setActiveTab} icon="description">Generador PME</TabButton>
                <TabButton tabId="goals" currentTab={activeTab} setTab={setActiveTab} icon="target">Generador de Objetivos y metas</TabButton>
            </div>
            
            <div className="bg-white rounded-b-xl shadow-2xl overflow-hidden">
                {activeTab === 'pme' && <PmeGenerator />}
                {activeTab === 'goals' && <ObjectiveGoalGenerator />}
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
