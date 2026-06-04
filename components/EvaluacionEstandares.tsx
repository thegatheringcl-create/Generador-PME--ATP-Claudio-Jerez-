import React, { useState, useRef, useEffect } from 'react';
import * as LucideIcons from 'lucide-react';
import { GoogleGenAI, LiveServerMessage, Modality, Blob } from "@google/genai";
import { getChatbotResponse } from '../services/geminiService';

// --- AUDIO HELPER FUNCTIONS (for Live API) ---

function decode(base64: string): Uint8Array {
  const binaryString = atob(base64);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes;
}

async function decodeAudioData(
  data: Uint8Array,
  ctx: AudioContext,
  sampleRate: number,
  numChannels: number,
): Promise<AudioBuffer> {
  const dataInt16 = new Int16Array(data.buffer);
  const frameCount = dataInt16.length / numChannels;
  const buffer = ctx.createBuffer(numChannels, frameCount, sampleRate);

  for (let channel = 0; channel < numChannels; channel++) {
    const channelData = buffer.getChannelData(channel);
    for (let i = 0; i < frameCount; i++) {
      channelData[i] = dataInt16[i * numChannels + channel] / 32768.0;
    }
  }
  return buffer;
}

function encode(bytes: Uint8Array): string {
  let binary = '';
  const len = bytes.byteLength;
  for (let i = 0; i < len; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}

function createBlob(data: Float32Array): Blob {
  const l = data.length;
  const int16 = new Int16Array(l);
  for (let i = 0; i < l; i++) {
    int16[i] = data[i] * 32768;
  }
  return {
    data: encode(new Uint8Array(int16.buffer)),
    mimeType: 'audio/pcm;rate=16000',
  };
}


// --- CHAT ASSISTANT COMPONENT ---
type ChatMode = 'standard' | 'fast' | 'deep' | 'search';
type Message = { role: 'user' | 'model'; text: string; sources?: any[] };

const ChatAssistant: React.FC<{ onClose: () => void; establecimiento: string; }> = ({ onClose, establecimiento }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [mode, setMode] = useState<ChatMode>('standard');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;
    const userMessage: Message = { role: 'user', text: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
        const historyForAPI = messages.map(msg => ({
            role: msg.role,
            parts: [{ text: msg.text }]
        }));

      const { text, groundingChunks } = await getChatbotResponse(historyForAPI, input, mode, { establecimiento });
      const modelMessage: Message = { role: 'model', text, sources: groundingChunks };
      setMessages(prev => [...prev, modelMessage]);
    } catch (error) {
      console.error("Chatbot error:", error);
      const errorMessage: Message = { role: 'model', text: 'Lo siento, ocurrió un error al procesar tu solicitud.' };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const modeConfig = {
    standard: { icon: LucideIcons.Sparkles, label: 'Estándar', model: 'gemini-3.1-pro-preview' },
    fast: { icon: LucideIcons.Bolt, label: 'Rápido', model: 'gemini-3.1-flash-lite-preview' },
    deep: { icon: LucideIcons.BrainCircuit, label: 'Profundo', model: 'gemini-3.1-pro-preview' },
    search: { icon: LucideIcons.Globe, label: 'Búsqueda Web', model: 'gemini-3-flash-preview' }
  };

  return (
    <div className="w-full h-full min-h-[500px] bg-white rounded-2xl shadow-lg flex flex-col border border-slate-200">
      <header className="p-4 border-b flex justify-between items-center bg-slate-50 rounded-t-2xl">
        <div className="flex items-center gap-3">
          <LucideIcons.Bot size={24} className="text-blue-600"/>
          <h3 className="font-bold text-slate-800">Asistente Experto (Chat)</h3>
        </div>
        <button onClick={onClose} className="text-slate-400 hover:text-slate-600"><LucideIcons.X size={20}/></button>
      </header>
      <div className="flex-grow p-4 overflow-y-auto bg-slate-100 max-h-[400px]">
        <div className="space-y-4">
          {messages.map((msg, i) => (
            <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[80%] p-3 rounded-2xl ${msg.role === 'user' ? 'bg-blue-600 text-white' : 'bg-white text-slate-800'}`}>
                <p className="text-sm whitespace-pre-wrap">{msg.text}</p>
                 {msg.sources && msg.sources.length > 0 && (
                  <div className="mt-2 pt-2 border-t border-slate-200">
                    <h4 className="text-xs font-bold text-slate-500 mb-1">Fuentes:</h4>
                    <ul className="space-y-1">
                      {msg.sources.map((source, idx) => source.web && (
                        <li key={idx}><a href={source.web.uri} target="_blank" rel="noopener noreferrer" className="text-xs text-blue-500 hover:underline">
                           {source.web.title || source.web.uri}
                        </a></li>
                      ))}
                    </ul>
                  </div>
                 )}
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-white p-3 rounded-2xl"><LucideIcons.Loader size={20} className="animate-spin text-slate-500"/></div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </div>
      <div className="p-2 border-t bg-white rounded-b-2xl">
        <div className="flex items-center gap-2 mb-2 px-2">
            {Object.entries(modeConfig).map(([key, config]) => (
                <button key={key} onClick={() => setMode(key as ChatMode)} 
                  className={`flex items-center gap-1.5 px-2 py-1 rounded-md text-xs font-semibold transition ${mode === key ? 'bg-blue-100 text-blue-700' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}>
                    <config.icon size={12}/>
                    <span>{config.label}</span>
                </button>
            ))}
        </div>
        <div className="flex items-center gap-2 p-2 rounded-lg bg-slate-100">
            <textarea value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && !e.shiftKey && (e.preventDefault(), handleSend())}
            placeholder="Escribe tu consulta..." rows={1}
            className="w-full bg-transparent border-none focus:ring-0 resize-none text-sm p-0"/>
            <button onClick={handleSend} disabled={isLoading || !input.trim()}
            className="p-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-slate-300 transition">
            <LucideIcons.Send size={16}/>
            </button>
        </div>
      </div>
    </div>
  );
};

// --- VOICE ASSISTANT COMPONENT ---
type TranscriptionEntry = { speaker: 'user' | 'model' | 'system', text: string };

const VoiceAssistant: React.FC<{ onClose: () => void; establecimiento: string; }> = ({ onClose, establecimiento }) => {
    const [status, setStatus] = useState<'idle' | 'listening' | 'processing' | 'speaking'>('idle');
    const [transcription, setTranscription] = useState<TranscriptionEntry[]>([]);
    const sessionPromiseRef = useRef<any>(null);
    const audioContextRef = useRef<AudioContext | null>(null);
    const mediaStreamRef = useRef<MediaStream | null>(null);
    const scriptProcessorRef = useRef<ScriptProcessorNode | null>(null);
    
    const nextStartTimeRef = useRef(0);
    const sourcesRef = useRef(new Set<AudioBufferSourceNode>());

    const startConversation = async () => {
        try {
            setStatus('listening');
            setTranscription([{ speaker: 'system', text: 'Conectando con el asistente de voz...' }]);
            
            const ai = new GoogleGenAI({ apiKey: import.meta.env.VITE_GEMINI_API_KEY || '' });
            const inputAudioContext = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 16000 });
            const outputAudioContext = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
            audioContextRef.current = inputAudioContext;
            
            const outputNode = outputAudioContext.createGain();

            sessionPromiseRef.current = ai.live.connect({
                model: 'gemini-3.1-flash-live-preview',
                callbacks: {
                    onopen: async () => {
                        setTranscription(prev => [...prev, { speaker: 'system', text: 'Conexión establecida. ¡Puedes hablar!' }]);
                        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
                        mediaStreamRef.current = stream;
                        const source = inputAudioContext.createMediaStreamSource(stream);
                        const scriptProcessor = inputAudioContext.createScriptProcessor(4096, 1, 1);
                        scriptProcessorRef.current = scriptProcessor;

                        scriptProcessor.onaudioprocess = (audioProcessingEvent) => {
                            const inputData = audioProcessingEvent.inputBuffer.getChannelData(0);
                            const pcmBlob = createBlob(inputData);
                            sessionPromiseRef.current?.then((session: any) => {
                                session.sendRealtimeInput({ audio: pcmBlob });
                            });
                        };
                        source.connect(scriptProcessor);
                        scriptProcessor.connect(inputAudioContext.destination);
                    },
                    onmessage: async (message: LiveServerMessage) => {
                       if (message.serverContent?.inputTranscription) {
                            setTranscription(prev => {
                                const last = prev[prev.length - 1];
                                if (last?.speaker === 'user') {
                                    const newArr = [...prev];
                                    newArr[newArr.length - 1] = { ...last, text: message.serverContent!.inputTranscription!.text };
                                    return newArr;
                                }
                                return [...prev, { speaker: 'user', text: message.serverContent!.inputTranscription!.text }];
                            });
                        }
                        if (message.serverContent?.outputTranscription) {
                             setTranscription(prev => {
                                const last = prev[prev.length - 1];
                                if (last?.speaker === 'model') {
                                    const newArr = [...prev];
                                    newArr[newArr.length - 1] = { ...last, text: last.text + message.serverContent!.outputTranscription!.text };
                                    return newArr;
                                }
                                return [...prev, { speaker: 'model', text: message.serverContent!.outputTranscription!.text }];
                            });
                        }
                        const base64Audio = message.serverContent?.modelTurn?.parts[0]?.inlineData?.data;
                        if (base64Audio) {
                            setStatus('speaking');
                            nextStartTimeRef.current = Math.max(nextStartTimeRef.current, outputAudioContext.currentTime);
                            const audioBuffer = await decodeAudioData(decode(base64Audio), outputAudioContext, 24000, 1);
                            const source = outputAudioContext.createBufferSource();
                            source.buffer = audioBuffer;
                            source.connect(outputNode);
                            source.addEventListener('ended', () => {
                                sourcesRef.current.delete(source);
                                if (sourcesRef.current.size === 0) setStatus('listening');
                            });
                            source.start(nextStartTimeRef.current);
                            nextStartTimeRef.current = nextStartTimeRef.current + audioBuffer.duration;
                            sourcesRef.current.add(source);
                        }
                    },
                    onerror: (e: ErrorEvent) => {
                        console.error('Live API Error:', e);
                        setTranscription(prev => [...prev, { speaker: 'system', text: `Error: ${e.message}` }]);
                        stopConversation();
                    },
                    onclose: () => {
                        setTranscription(prev => [...prev, { speaker: 'system', text: 'Conversación finalizada.' }]);
                    },
                },
                config: {
                    responseModalities: [Modality.AUDIO],
                    inputAudioTranscription: {},
                    outputAudioTranscription: {},
                    systemInstruction: `Eres un asistente educativo experto para el establecimiento ${establecimiento}. Responde de forma concisa y amigable.`,
                },
            });
        } catch (error) {
            console.error("Failed to start voice conversation:", error);
            setStatus('idle');
            setTranscription([{ speaker: 'system', text: 'Error al iniciar. Revisa los permisos del micrófono.' }]);
        }
    };
    
    const stopConversation = () => {
        setStatus('idle');
        sessionPromiseRef.current?.then((session: any) => session.close());
        sessionPromiseRef.current = null;
        
        mediaStreamRef.current?.getTracks().forEach(track => track.stop());
        mediaStreamRef.current = null;
        
        scriptProcessorRef.current?.disconnect();
        scriptProcessorRef.current = null;
        
        audioContextRef.current?.close();
        audioContextRef.current = null;
    };
    
    useEffect(() => {
        return () => { // Cleanup on unmount
            if (status !== 'idle') stopConversation();
        };
    }, [status]);

    return (
     <div className="w-full h-full min-h-[500px] bg-white rounded-2xl shadow-lg flex flex-col border border-slate-200">
        <header className="p-4 border-b flex justify-between items-center bg-slate-50 rounded-t-2xl">
            <div className="flex items-center gap-3">
            <LucideIcons.Mic size={24} className="text-red-600"/>
            <h3 className="font-bold text-slate-800">Asistente de Voz Avanzado</h3>
            </div>
            <button onClick={() => { stopConversation(); onClose(); }} className="text-slate-400 hover:text-slate-600"><LucideIcons.X size={20}/></button>
        </header>
        <div className="flex-grow p-4 overflow-y-auto bg-slate-100 flex flex-col-reverse min-h-[300px]">
            <div className="space-y-3">
            {[...transcription].reverse().map((entry, i) => (
                <div key={i} className={`text-sm ${entry.speaker === 'system' ? 'text-center text-slate-500 italic' : ''}`}>
                {entry.speaker !== 'system' && <span className={`font-bold ${entry.speaker === 'user' ? 'text-blue-700' : 'text-slate-800'}`}>{entry.speaker === 'user' ? 'Tú' : 'Asistente'}: </span>}
                {entry.text}
                </div>
            ))}
            </div>
        </div>
        <footer className="p-6 border-t flex flex-col items-center justify-center bg-white rounded-b-2xl">
            {status === 'idle' ? (
                <button onClick={startConversation} className="p-6 bg-green-500 text-white rounded-full shadow-lg hover:bg-green-600 transition hover:scale-105 active:scale-95">
                    <LucideIcons.Mic size={36}/>
                </button>
            ) : (
                <button onClick={stopConversation} className="p-6 bg-red-500 text-white rounded-full shadow-lg hover:bg-red-600 transition animate-pulse">
                    <LucideIcons.Square size={36}/>
                </button>
            )}
             <p className="text-sm text-slate-500 mt-4 font-semibold uppercase tracking-wider">
                {status === 'idle' ? 'Presiona para iniciar conversación' : status === 'listening' ? 'Escuchando tu voz...' : status === 'speaking' ? 'Asistente hablando...' : 'Procesando...'}
            </p>
        </footer>
     </div>
    );
};


// --- MAIN ROUTE COMPONENT ---
export default function EvaluacionEstandares({ establecimiento = "Tu Establecimiento" }: { establecimiento?: string }) {
  const [openAssistant, setOpenAssistant] = useState<'chat' | 'voice' | null>(null);

  return (
    <div className="flex flex-col p-8 max-w-5xl mx-auto gap-8 animate-in fade-in">
        
       <div className="text-center">
            <h2 className="text-3xl font-bold mb-4 text-pme-primary">Evaluación: Estándares con IA</h2>
            <p className="text-slate-600 max-w-2xl mx-auto">
                Selecciona al asistente con el que deseas interactuar. Puedes realizar una evaluación mediante un diálogo fluido por voz, o realizar tus consultas por escrito de manera directa. 
            </p>
       </div>

       {!openAssistant && (
           <div className="flex flex-col md:flex-row gap-6 justify-center items-stretch mt-8 relative z-10">
                <button onClick={() => setOpenAssistant('voice')} title="Asistente de Voz"
                    className="flex-1 max-w-[300px] flex flex-col items-center justify-center p-8 bg-white rounded-2xl shadow-xl border-2 border-transparent hover:border-red-500 hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 group">
                    <div className="p-6 bg-red-50 text-red-600 rounded-full mb-6 group-hover:scale-110 transition-transform">
                        <LucideIcons.Mic size={48}/>
                    </div>
                    <h3 className="text-xl font-bold text-slate-800 mb-2">Evaluación por Voz</h3>
                    <p className="text-slate-500 text-center text-sm">Conversa en tiempo real con la IA para analizar tus estándares de forma oral.</p>
                </button>
                <button onClick={() => setOpenAssistant('chat')} title="Asistente de Chat"
                    className="flex-1 max-w-[300px] flex flex-col items-center justify-center p-8 bg-white rounded-2xl shadow-xl border-2 border-transparent hover:border-blue-600 hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 group">
                    <div className="p-6 bg-blue-50 text-blue-600 rounded-full mb-6 group-hover:scale-110 transition-transform">
                        <LucideIcons.MessageCircle size={48}/>
                    </div>
                    <h3 className="text-xl font-bold text-slate-800 mb-2">Evaluación por Chat</h3>
                    <p className="text-slate-500 text-center text-sm">Escribe tus consultas e interactúa con el modelo profundo para generar informes textuales y análisis.</p>
                </button>      
           </div>
       )}

       {openAssistant === 'chat' && <ChatAssistant onClose={() => setOpenAssistant(null)} establecimiento={establecimiento} />}
       {openAssistant === 'voice' && <VoiceAssistant onClose={() => setOpenAssistant(null)} establecimiento={establecimiento} />}
       
    </div>
  );
}
