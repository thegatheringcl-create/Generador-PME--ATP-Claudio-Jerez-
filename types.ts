
export interface Message {
  type: 'error' | 'success' | 'info';
  text: string;
}

export interface ChatMessage {
    role: 'user' | 'model';
    parts: { text: string }[];
}