
import React from 'react';
import firebaseConfig from '../firebase-applet-config.json';

interface FirebaseSettingsProps {
    onClose: () => void;
}

const FirebaseSettings: React.FC<FirebaseSettingsProps> = ({ onClose }) => {
    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full overflow-hidden animate-in fade-in zoom-in duration-300">
                <div className="bg-pme-primary p-6 text-white flex justify-between items-center">
                    <div className="flex items-center gap-3">
                        <span className="material-symbols-outlined">settings_suggest</span>
                        <h3 className="font-bold">Configuración de Firebase</h3>
                    </div>
                    <button onClick={onClose} className="hover:bg-white/20 p-1 rounded-full transition-colors">
                        <span className="material-symbols-outlined">close</span>
                    </button>
                </div>
                
                <div className="p-8 space-y-6">
                    <p className="text-sm text-gray-600">
                        Esta aplicación utiliza Firebase para el guardado de datos en la nube. A continuación se presentan los detalles del proyecto actual:
                    </p>
                    
                    <div className="bg-gray-50 p-4 rounded-xl space-y-3 border border-gray-100">
                        <div className="flex justify-between text-xs">
                            <span className="text-gray-400 font-bold uppercase tracking-wider">Project ID</span>
                            <span className="text-pme-primary font-mono">{firebaseConfig.projectId}</span>
                        </div>
                        <div className="flex justify-between text-xs">
                            <span className="text-gray-400 font-bold uppercase tracking-wider">Storage Bucket</span>
                            <span className="text-pme-primary font-mono">{firebaseConfig.storageBucket}</span>
                        </div>
                        <div className="flex justify-between text-xs">
                            <span className="text-gray-400 font-bold uppercase tracking-wider">Database ID</span>
                            <span className="text-pme-primary font-mono">{firebaseConfig.firestoreDatabaseId || '(default)'}</span>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <h4 className="text-sm font-bold text-gray-800">Acciones Recomendadas</h4>
                        <div className="space-y-2">
                            <a 
                                href={`https://console.firebase.google.com/project/${firebaseConfig.projectId}/authentication/providers`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-3 p-3 bg-white border border-gray-200 rounded-xl hover:border-pme-secondary hover:bg-pme-secondary/5 transition-all text-xs group"
                            >
                                <span className="material-symbols-outlined text-pme-secondary">lock_open</span>
                                <div className="flex-1">
                                    <p className="font-bold text-gray-700">Habilitar Inicio Anónimo</p>
                                    <p className="text-gray-400">Necesario para guardar datos sin login visible.</p>
                                </div>
                                <span className="material-symbols-outlined text-gray-300 group-hover:translate-x-1 transition-transform">chevron_right</span>
                            </a>
                            
                            <a 
                                href={`https://console.firebase.google.com/project/${firebaseConfig.projectId}/firestore`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-3 p-3 bg-white border border-gray-200 rounded-xl hover:border-pme-secondary hover:bg-pme-secondary/5 transition-all text-xs group"
                            >
                                <span className="material-symbols-outlined text-pme-secondary">database</span>
                                <div className="flex-1">
                                    <p className="font-bold text-gray-700">Explorador de Firestore</p>
                                    <p className="text-gray-400">Ver y gestionar los datos guardados.</p>
                                </div>
                                <span className="material-symbols-outlined text-gray-300 group-hover:translate-x-1 transition-transform">chevron_right</span>
                            </a>
                        </div>
                    </div>

                    <button 
                        onClick={onClose}
                        className="w-full py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl font-bold transition-colors text-sm"
                    >
                        Entendido
                    </button>
                </div>
            </div>
        </div>
    );
};

export default FirebaseSettings;
