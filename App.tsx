
import React, { useState } from 'react';
import PmeGenerator from './components/PmeGenerator';
import ImageGenerator from './components/ImageGenerator';
import Chatbot from './components/Chatbot';

type Tab = 'pme' | 'image';

export default function App() {
    const [activeTab, setActiveTab] = useState<Tab>('pme');
    const [isChatOpen, setIsChatOpen] = useState<boolean>(false);

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
        <div className="container max-w-4xl mx-auto my-5 sm:my-10">
            <div className="flex border-b border-gray-200">
                <TabButton tabId="pme" currentTab={activeTab} setTab={setActiveTab} icon="description">Generador PME</TabButton>
                <TabButton tabId="image" currentTab={activeTab} setTab={setActiveTab} icon="image">Generador de Imágenes</TabButton>
            </div>
            
            <div className="bg-white rounded-b-xl shadow-2xl overflow-hidden">
                {activeTab === 'pme' && <PmeGenerator />}
                {activeTab === 'image' && <ImageGenerator />}
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
        </div>
    );
}