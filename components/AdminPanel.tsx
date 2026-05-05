
import React, { useState } from 'react';
import { db } from '../firebase';
import { collection, getDocs, deleteDoc, doc, writeBatch } from 'firebase/firestore';
import MessageBox from './MessageBox';
import Spinner from './Spinner';

interface AdminPanelProps {
  adminUid: string;
}

export default function AdminPanel({ adminUid }: AdminPanelProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error' | 'info'; text: string } | null>(null);

  const handleDeleteAllUsersData = async () => {
    if (!window.confirm('¿ESTÁS SEGURO? Esta acción eliminará TODOS los datos de otros usuarios (propuestas y planificaciones). Esta acción no se puede deshacer.')) {
      return;
    }

    setIsLoading(true);
    setMessage({ type: 'info', text: 'Iniciando limpieza de datos...' });

    try {
      const collectionsToClean = ['proposals', 'docente_planning'];
      let deletedCount = 0;

      for (const collectionName of collectionsToClean) {
        const querySnapshot = await getDocs(collection(db, collectionName));
        
        // For proposals, we check field 'userId'
        // For docente_planning, the ID of the document IS the userId
        
        const batch = writeBatch(db);
        let batchCount = 0;

        querySnapshot.forEach((document) => {
          let shouldDelete = false;
          
          if (collectionName === 'proposals') {
             const data = document.data();
             if (data.userId !== adminUid) {
               shouldDelete = true;
             }
          } else if (collectionName === 'docente_planning') {
             if (document.id !== adminUid) {
               shouldDelete = true;
             }
          }

          if (shouldDelete) {
            batch.delete(doc(db, collectionName, document.id));
            batchCount++;
            deletedCount++;
          }
        });

        if (batchCount > 0) {
          await batch.commit();
        }
      }

      setMessage({ type: 'success', text: `Limpieza completada. Se eliminaron ${deletedCount} registros de otros usuarios.` });
    } catch (error: any) {
      console.error('Error during cleanup:', error);
      setMessage({ type: 'error', text: 'Error al eliminar datos: ' + (error.message || error) });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="mb-8 p-6 bg-red-50 border-2 border-red-200 rounded-2xl shadow-sm no-print">
      <div className="flex items-center gap-3 mb-4">
        <span className="material-symbols-outlined text-red-600 text-3xl">admin_panel_settings</span>
        <div>
          <h2 className="text-xl font-black text-red-800 uppercase tracking-tight">Panel de Administración</h2>
          <p className="text-xs text-red-600 font-medium">Herramientas de mantenimiento global</p>
        </div>
      </div>

      <div className="flex flex-wrap gap-4">
        <button
          onClick={handleDeleteAllUsersData}
          disabled={isLoading}
          className="flex items-center gap-2 bg-red-600 text-white px-6 py-3 rounded-xl hover:bg-red-700 transition-all font-black text-sm shadow-lg disabled:bg-gray-400 group"
        >
          {isLoading ? <Spinner size="sm" /> : <span className="material-symbols-outlined group-hover:rotate-12 transition-transform">delete_sweep</span>}
          ELIMINAR TODOS LOS DATOS (EXCEPTO ADMIN)
        </button>
      </div>

      {message && (
        <div className="mt-4">
          <MessageBox message={message} />
        </div>
      )}
    </div>
  );
}
