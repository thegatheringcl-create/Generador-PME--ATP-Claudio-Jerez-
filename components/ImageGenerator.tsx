
import React, { useState } from 'react';
import { generateImage } from '../services/geminiService';
import Spinner from './Spinner';
import MessageBox from './MessageBox';
import type { Message } from '../types';

interface ImageResult {
    imageUrl: string | null;
    text: string | null;
}

export default function ImageGenerator() {
    const [prompt, setPrompt] = useState<string>('');
    const [aspectRatio, setAspectRatio] = useState<string>('1:1');
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [result, setResult] = useState<ImageResult | null>(null);
    const [message, setMessage] = useState<Message | null>(null);

    const aspectRatios = ["1:1", "16:9", "9:16", "4:3", "3:4"];

    const handleGenerate = async () => {
        if (!prompt) {
            setMessage({ type: 'error', text: 'Por favor, introduce un prompt para generar la imagen.' });
            return;
        }
        setIsLoading(true);
        setMessage(null);
        setResult(null);
        try {
            const imageResult = await generateImage(prompt, aspectRatio);
            setResult(imageResult);
        } catch (error) {
            const errorMessage = (error as Error).message || 'Ocurrió un error desconocido.';
            setMessage({ type: 'error', text: `Error al generar la imagen: ${errorMessage}` });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="p-6 sm:p-8">
            <h1 className="text-3xl sm:text-4xl font-bold text-center text-pme-primary mb-2">
                Generador de Imágenes con IA
            </h1>
            <p className="text-center text-gray-500 mb-8">Crea imágenes a partir de descripciones de texto.</p>

            {message && <MessageBox message={message} />}

            <div className="space-y-4">
                <div>
                    <label htmlFor="prompt" className="block mb-2 font-bold text-pme-primary">Prompt:</label>
                    <textarea
                        id="prompt"
                        value={prompt}
                        onChange={(e) => setPrompt(e.target.value)}
                        placeholder="Ej: Un astronauta montando a caballo en Marte, estilo fotorrealista."
                        className="w-full p-2 border border-gray-300 rounded-md h-24 resize-y focus:ring-pme-secondary focus:border-pme-secondary"
                    />
                </div>
                <div>
                    <label htmlFor="aspectRatio" className="block mb-2 font-bold text-pme-primary">Relación de Aspecto:</label>
                    <select
                        id="aspectRatio"
                        value={aspectRatio}
                        onChange={(e) => setAspectRatio(e.target.value)}
                        className="w-full md:w-1/2 p-2 border border-gray-300 rounded-md focus:ring-pme-secondary focus:border-pme-secondary"
                    >
                        {aspectRatios.map(ar => <option key={ar} value={ar}>{ar}</option>)}
                    </select>
                </div>
            </div>

            <button onClick={handleGenerate} disabled={isLoading} className="w-full mt-6 bg-pme-secondary text-white py-3 px-6 rounded-md text-lg font-semibold hover:bg-blue-600 transition duration-300 disabled:bg-gray-400 flex items-center justify-center gap-3">
                {isLoading ? <Spinner /> : <span className="material-symbols-outlined">auto_awesome</span>}
                {isLoading ? 'Generando...' : 'Generar Imagen'}
            </button>

            {result && result.imageUrl && (
                <div className="mt-8 border border-gray-300 rounded-lg bg-white shadow-inner overflow-hidden p-4">
                    <h2 className="text-xl font-semibold text-pme-primary mb-4">Resultado:</h2>
                    <div className="flex justify-center bg-gray-100 p-4 rounded-md">
                        <img src={result.imageUrl} alt={prompt} className="max-w-full max-h-96 rounded-md shadow-md" />
                    </div>
                    {result.text && <p className="mt-4 text-gray-700 italic">{result.text}</p>}
                </div>
            )}
        </div>
    );
}
