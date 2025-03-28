// components/chat-sidebar/ChatSidebar.tsx
"use client";

import { useState, useRef, useEffect } from 'react';
import { useGuestStore } from '@/store/useGuestStore';
import Sidebar from '@/components/ui/Sidebar';
import { format } from 'date-fns';

interface Message {
  id: string;
  senderId: string | null; 
  content: string;
  timestamp: Date;
  isHost: boolean;
}

export default function ChatSidebar() {
  const { activeChatGuestId, guests, setActiveChatGuest } = useGuestStore();
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  const activeGuest = guests.find(guest => guest.id === activeChatGuestId);
  
  // Initialize with sample messages when activeGuest changes
  useEffect(() => {
    if (activeGuest) {
      // Demo messages
      setMessages([
        {
          id: '1',
          senderId: null,
          content: 'Conversation started',
          timestamp: new Date(Date.now() - 86400000), // 1 day ago
          isHost: false,
        },
        {
          id: '2',
          senderId: activeGuest.id,
          content: `Hi, I received an invitation to your event!`,
          timestamp: new Date(Date.now() - 3600000), // 1 hour ago
          isHost: false,
        },
        {
          id: '3',
          senderId: 'host',
          content: `Hello ${activeGuest.fullName}! We're excited to have you. Let me know if you have any questions.`,
          timestamp: new Date(Date.now() - 1800000), // 30 mins ago
          isHost: true,
        },
      ]);
    }
  }, [activeGuest]);
  
  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);
  
  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newMessage.trim() || !activeGuest) return;
    
    // Add new message
    const newMsg: Message = {
      id: `msg-${Date.now()}`,
      senderId: 'host',
      content: newMessage.trim(),
      timestamp: new Date(),
      isHost: true,
    };
    
    setMessages(prev => [...prev, newMsg]);
    setNewMessage('');
    
    // Simulate reply after delay
    setTimeout(() => {
      if (activeGuest) {
        const replyMsg: Message = {
          id: `msg-${Date.now() + 1}`,
          senderId: activeGuest.id,
          content: 'Thanks for the information! I appreciate it.',
          timestamp: new Date(),
          isHost: false,
        };
        setMessages(prev => [...prev, replyMsg]);
      }
    }, 2000);
  };
  
  if (!activeGuest) {
    return null;
  }

  // Create the header content with guest info
  const headerContent = (
    <div className="flex items-center mt-2">
      <div className="w-10 h-10 rounded-full bg-indigo-100 dark:bg-indigo-900 flex items-center justify-center text-indigo-600 dark:text-indigo-300 font-semibold">
        {activeGuest.fullName.split(' ').map(n => n[0]).join('')}
      </div>
      <div className="ml-3">
        <h3 className="text-sm font-medium text-gray-900 dark:text-white">{activeGuest.fullName}</h3>
        <p className="text-xs text-gray-500 dark:text-gray-400">{activeGuest.email}</p>
      </div>
    </div>
  );
  
  // Create the footer content with message input
  const footerContent = (
    <form onSubmit={handleSendMessage} className="flex items-center">
      <input
        type="text"
        placeholder="Type a message..."
        className="flex-1 border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white"
        value={newMessage}
        onChange={(e) => setNewMessage(e.target.value)}
      />
      <button
        type="submit"
        className="ml-3 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        disabled={!newMessage.trim()}
      >
        Send
      </button>
    </form>
  );
  
  return (
    <Sidebar
      isOpen={true}
      onClose={() => setActiveChatGuest(null)}
      position="right"
      width="md"
      headerContent={headerContent}
      footerContent={footerContent}
    >
      <div className="py-6 space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.isHost ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                message.isHost 
                  ? 'bg-indigo-600 text-white' 
                  : message.senderId 
                    ? 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white' 
                    : 'bg-gray-200 dark:bg-gray-600 text-gray-500 dark:text-gray-300 text-xs'
              }`}
            >
              <p>{message.content}</p>
              <p className={`text-xs ${message.isHost ? 'text-indigo-100' : 'text-gray-500 dark:text-gray-400'} mt-1`}>
                {format(message.timestamp, 'h:mm a')}
              </p>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
    </Sidebar>
  );
}