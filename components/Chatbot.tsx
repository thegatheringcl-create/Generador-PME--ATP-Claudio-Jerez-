
import React, { useState, useEffect, useRef } from 'react';
import { GoogleGenAI, Chat, GenerateContentResponse } from '@google/genai';
import type { ChatMessage } from '../types';
import Spinner from './Spinner';

interface ChatbotProps {
    onClose: () => void;
}

// Initialize the GoogleGenAI client
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export default function Chatbot({ onClose }: ChatbotProps) {
    const [chat, setChat] = useState<Chat | null>(null);
    const [history, setHistory] = useState<ChatMessage[]>([]);
    const [userInput, setUserInput] = useState<string>('');
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const chatContainerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const initChat = () => {
            const chatInstance = ai.chats.create({
                model: 'gemini-3-pro-preview',
                config: {
                    systemInstruction: 'Eres un asistente experto en educación y en el sistema PME de Chile. Responde las preguntas de los usuarios de forma concisa y útil.',
                },
            });
            setChat(chatInstance);
        };
        initChat();
    }, []);
    
    useEffect(() => {
        // Scroll to the bottom of the chat on new messages
        if (chatContainerRef.current) {
            chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
        }
    }, [history]);

    const handleSendMessage = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!userInput.trim() || !chat || isLoading) return;

        const userMessage: ChatMessage = { role: 'user', parts: [{ text: userInput }] };
        setHistory(prev => [...prev, userMessage]);
        setUserInput('');
        setIsLoading(true);

        try {
            const stream = await chat.sendMessageStream({ message: userInput });
            
            let modelResponse = '';
            setHistory(prev => [...prev, { role: 'model', parts: [{ text: '' }] }]);

            for await (const chunk of stream) {
                const c = chunk as GenerateContentResponse;
                modelResponse += c.text;
                setHistory(prev => {
                    const newHistory = [...prev];
                    newHistory[newHistory.length - 1] = { role: 'model', parts: [{ text: modelResponse }] };
                    return newHistory;
                });
            }
        } catch (error) {
            console.error(error);
            setHistory(prev => [...prev, { role: 'model', parts: [{ text: 'Lo siento, ha ocurrido un error. Inténtalo de nuevo.' }] }]);
        } finally {
            setIsLoading(false);
        }
    };
    
    // FIX: Changed component props typing to use React.FC to correctly handle the 'key' prop.
    const MessageBubble: React.FC<{ message: ChatMessage }> = ({ message }) => {
        const isUser = message.role === 'user';
        const bubbleClasses = isUser
            ? 'bg-pme-secondary text-white self-end'
            : 'bg-pme-light text-pme-primary self-start';
        return (
            <div className={`max-w-xs md:max-w-md p-3 rounded-xl ${bubbleClasses}`}>
                <p className="text-sm whitespace-pre-wrap">{message.parts[0].text}</p>
            </div>
        );
    };

    return (
        <div className="fixed bottom-24 right-6 w-80 md:w-96 h-[60vh] bg-white rounded-2xl shadow-2xl flex flex-col z-40">
            <header className="flex items-center justify-between p-4 bg-pme-primary text-white rounded-t-2xl">
                <h3 className="font-bold text-lg">Asistente IA</h3>
                <button onClick={onClose} className="hover:bg-black/20 rounded-full p-1">
                    <span className="material-symbols-outlined">close</span>
                </button>
            </header>

            <div ref={chatContainerRef} className="flex-1 p-4 space-y-4 overflow-y-auto flex flex-col">
                 {history.map((msg, index) => <MessageBubble key={index} message={msg} />)}
                 {isLoading && (
                    <div className="self-start flex items-center gap-2">
                        <Spinner size="sm" />
                        <span className="text-sm text-gray-500">Pensando...</span>
                    </div>
                 )}
            </div>

            <form onSubmit={handleSendMessage} className="p-4 border-t border-gray-200">
                <div className="relative">
                    <input
                        type="text"
                        value={userInput}
                        onChange={(e) => setUserInput(e.target.value)}
                        placeholder="Haz una pregunta..."
                        className="w-full p-2 pr-10 border border-gray-300 rounded-full focus:ring-pme-secondary focus:border-pme-secondary"
                        disabled={isLoading}
                    />
                    <button type="submit" disabled={isLoading || !userInput.trim()} className="absolute top-1/2 right-2 -translate-y-1/2 bg-pme-secondary text-white rounded-full p-1.5 disabled:bg-gray-400 hover:bg-blue-600 transition">
                         <span className="material-symbols-outlined">send</span>
                    </button>
                </div>
            </form>
        </div>
    );
}