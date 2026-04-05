
import React, { useState, useEffect } from 'react';
import PmeGenerator from './components/PmeGenerator';
import ObjectiveGoalGenerator from './components/ObjectiveGoalGenerator';
import DocentePlanner from './components/DocentePlanner';
import Chatbot from './components/Chatbot';
import Tutorial from './components/Tutorial';
import Login from './components/Login';

type Tab = 'pme' | 'goals' | 'lector' | 'eid' | 'docente';

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

    const TabButton: React.FC<{ tabId: Tab, currentTab: Tab, setTab: (tab: Tab) => void, icon: string, children: React.ReactNode }> = ({ tabId, currentTab, setTab, icon, children }) => (
        <button
            onClick={() => setTab(tabId)}
            className={`flex items-center justify-center gap-2 px-3 py-2 text-xs sm:text-sm font-medium rounded-t-lg transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-pme-secondary focus:ring-offset-2 whitespace-nowrap ${
                currentTab === tabId
                    ? 'bg-white text-pme-primary border-b-2 border-pme-secondary'
                    : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
            }`}
        >
            <span className="material-symbols-outlined text-sm sm:text-base">{icon}</span>
            {children}
        </button>
    );

    const ExternalApp: React.FC<{ name: string, url: string, description: string, icon: string }> = ({ name, url, description, icon }) => (
        <div className="w-full min-h-[500px] bg-white flex flex-col items-center justify-center p-8 text-center">
            <div className="bg-pme-light p-6 rounded-full mb-6">
                <span className="material-symbols-outlined text-6xl text-pme-primary">{icon}</span>
            </div>
            <h3 className="text-2xl font-bold text-pme-primary mb-4">{name}</h3>
            <p className="text-gray-600 max-w-md mb-8">
                {description}
            </p>
            <div className="bg-blue-50 border border-blue-100 p-4 rounded-lg mb-8 max-w-lg text-sm text-blue-800">
                <p className="flex items-center gap-2 justify-center">
                    <span className="material-symbols-outlined text-base">info</span>
                    Esta herramienta se abre en una ventana segura externa para garantizar su total funcionalidad y privacidad.
                </p>
            </div>
            <a 
                href={url} 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center gap-2 bg-pme-secondary hover:bg-blue-600 text-white px-8 py-3 rounded-xl font-bold shadow-lg transition-all transform hover:scale-105"
            >
                <span className="material-symbols-outlined">open_in_new</span>
                Abrir Herramienta
            </a>
        </div>
    );

    return (
        <div className="container max-w-6xl mx-auto my-5 sm:my-10 px-4">
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

            <div className="flex border-b border-gray-200 overflow-x-auto no-scrollbar">
                <TabButton tabId="pme" currentTab={activeTab} setTab={setActiveTab} icon="description">Planificador PME</TabButton>
                <TabButton tabId="goals" currentTab={activeTab} setTab={setActiveTab} icon="target">Objetivos y Metas</TabButton>
                <TabButton tabId="lector" currentTab={activeTab} setTab={setActiveTab} icon="menu_book">Evaluador Lector</TabButton>
                <TabButton tabId="eid" currentTab={activeTab} setTab={setActiveTab} icon="analytics">Evaluador EID</TabButton>
                <TabButton tabId="docente" currentTab={activeTab} setTab={setActiveTab} icon="person_search">Planificador Docente</TabButton>
            </div>
            
            <div className="bg-white rounded-b-xl shadow-2xl overflow-hidden">
                {activeTab === 'pme' && <PmeGenerator />}
                {activeTab === 'goals' && <ObjectiveGoalGenerator />}
                {activeTab === 'lector' && (
                    <ExternalApp 
                        name="Evaluador Lector IA" 
                        icon="menu_book"
                        description="Herramienta avanzada para la evaluación y seguimiento de la comprensión lectora asistida por Inteligencia Artificial."
                        url="https://aistudio.google.com/u/0/apps/c9466e43-5c07-42ad-8581-8ec53a6c8a98?showPreview=true&showAssistant=true" 
                    />
                )}
                {activeTab === 'eid' && (
                    <ExternalApp 
                        name="Evaluador EID & Propuesta PME Pro" 
                        icon="analytics"
                        description="Análisis profundo de Estándares Indicativos de Desempeño y generación de propuestas estratégicas profesionales."
                        url="https://aistudio.google.com/u/0/apps/e9ec9f15-e089-47de-ab11-d1bd45c52f8f?showPreview=true&showAssistant=true" 
                    />
                )}
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
