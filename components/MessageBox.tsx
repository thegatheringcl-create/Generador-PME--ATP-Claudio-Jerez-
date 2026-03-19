
import React from 'react';
import type { Message } from '../types';

interface MessageBoxProps {
  message: Message;
}

const MessageBox: React.FC<MessageBoxProps> = ({ message }) => {
  const baseClasses = 'p-4 mb-4 border rounded-md font-semibold whitespace-pre-wrap';
  
  const typeClasses = {
    error: 'bg-red-100 border-red-400 text-red-700',
    success: 'bg-green-100 border-green-400 text-green-700',
    info: 'bg-blue-100 border-blue-400 text-blue-700',
  };

  return (
    <div className={`${baseClasses} ${typeClasses[message.type]}`}>
      {message.text}
    </div>
  );
};

export default MessageBox;
