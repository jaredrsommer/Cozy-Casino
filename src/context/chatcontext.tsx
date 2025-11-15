"use client";

import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { io, Socket } from 'socket.io-client';

const API_URL = 'https://casino.truebliss.dev';

export interface ChatMessage {
  id: string;
  address: string;
  displayName: string;
  message: string;
  timestamp: number;
  edited?: boolean;
}

export interface OnlineUser {
  address: string;
  displayName: string;
  joinedAt: number;
}

interface ChatContextType {
  messages: ChatMessage[];
  onlineUsers: OnlineUser[];
  isConnected: boolean;
  sendMessage: (message: string) => void;
  isTyping: boolean;
  setIsTyping: (typing: boolean) => void;
  typingUsers: string[];
}

const ChatContext = createContext<ChatContextType | null>(null);

export const useChatContext = () => {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error('useChatContext must be used within ChatProvider');
  }
  return context;
};

interface ChatProviderProps {
  children: React.ReactNode;
  userAddress?: string | null;
}

export const ChatProvider: React.FC<ChatProviderProps> = ({ children, userAddress }) => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [onlineUsers, setOnlineUsers] = useState<OnlineUser[]>([]);
  const [isConnected, setIsConnected] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [typingUsers, setTypingUsers] = useState<string[]>([]);

  // Initialize socket connection
  useEffect(() => {
    if (!userAddress) return;

    const newSocket = io(`${API_URL}/chat`, {
      transports: ['websocket', 'polling'],
      query: {
        address: userAddress
      }
    });

    setSocket(newSocket);

    return () => {
      newSocket.close();
    };
  }, [userAddress]);

  // Socket event listeners
  useEffect(() => {
    if (!socket) return;

    // Connection events
    socket.on('connect', () => {
      console.log('Chat connected');
      setIsConnected(true);

      // Join the chat room
      socket.emit('chat:join', { address: userAddress });
    });

    socket.on('disconnect', () => {
      console.log('Chat disconnected');
      setIsConnected(false);
    });

    // Chat events
    socket.on('chat:message', (message: ChatMessage) => {
      setMessages(prev => {
        const exists = prev.some(m => m.id === message.id);
        if (exists) return prev;
        return [...prev, message].slice(-100); // Keep last 100 messages
      });
    });

    socket.on('chat:history', (history: ChatMessage[]) => {
      setMessages(history);
    });

    socket.on('chat:user-joined', (user: OnlineUser) => {
      setOnlineUsers(prev => {
        const exists = prev.some(u => u.address === user.address);
        if (exists) return prev;
        return [...prev, user];
      });
    });

    socket.on('chat:user-left', (address: string) => {
      setOnlineUsers(prev => prev.filter(u => u.address !== address));
    });

    socket.on('chat:online-users', (users: OnlineUser[]) => {
      setOnlineUsers(users);
    });

    socket.on('chat:typing', (data: { address: string; isTyping: boolean }) => {
      if (data.address === userAddress) return; // Ignore own typing

      setTypingUsers(prev => {
        if (data.isTyping) {
          return prev.includes(data.address) ? prev : [...prev, data.address];
        } else {
          return prev.filter(addr => addr !== data.address);
        }
      });
    });

    return () => {
      socket.off('connect');
      socket.off('disconnect');
      socket.off('chat:message');
      socket.off('chat:history');
      socket.off('chat:user-joined');
      socket.off('chat:user-left');
      socket.off('chat:online-users');
      socket.off('chat:typing');
    };
  }, [socket, userAddress]);

  // Send message function
  const sendMessage = useCallback((message: string) => {
    if (!socket || !isConnected || !message.trim()) return;

    const chatMessage = {
      message: message.trim(),
      address: userAddress,
      timestamp: Date.now()
    };

    socket.emit('chat:message', chatMessage);
    setIsTyping(false);
    socket.emit('chat:typing', { isTyping: false });
  }, [socket, isConnected, userAddress]);

  // Handle typing indicator
  useEffect(() => {
    if (!socket || !isConnected) return;

    socket.emit('chat:typing', { isTyping });
  }, [isTyping, socket, isConnected]);

  const value: ChatContextType = {
    messages,
    onlineUsers,
    isConnected,
    sendMessage,
    isTyping,
    setIsTyping,
    typingUsers
  };

  return <ChatContext.Provider value={value}>{children}</ChatContext.Provider>;
};
