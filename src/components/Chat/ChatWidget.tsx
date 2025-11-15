"use client";

import React, { useState, useRef, useEffect } from 'react';
import { useChatContext } from '@/context/chatcontext';
import ChatMessage from './ChatMessage';
import ChatInput from './ChatInput';
import UserList from './UserList';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';

const ChatContainer = styled(motion.div)`
  position: fixed;
  bottom: 20px;
  right: 20px;
  width: 380px;
  max-width: calc(100vw - 40px);
  height: 500px;
  background: linear-gradient(135deg, #0e141d 0%, #101216 100%);
  border: 1px solid #25D695;
  border-radius: 16px;
  box-shadow: 0 8px 32px rgba(37, 214, 149, 0.2);
  display: flex;
  flex-direction: column;
  z-index: 1000;
  overflow: hidden;

  @media (max-width: 768px) {
    width: calc(100vw - 40px);
    height: 400px;
    bottom: 10px;
    right: 10px;
  }
`;

const ChatHeader = styled.div`
  padding: 16px;
  background: linear-gradient(90deg, #25D695 0%, #1fb67a 100%);
  display: flex;
  justify-content: space-between;
  align-items: center;
  cursor: pointer;
  user-select: none;
`;

const ChatTitle = styled.h3`
  margin: 0;
  font-size: 18px;
  font-weight: bold;
  color: #101216;
  display: flex;
  align-items: center;
  gap: 8px;
`;

const OnlineIndicator = styled.div<{ $isConnected: boolean }>`
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: ${props => props.$isConnected ? '#00ff00' : '#ff0000'};
  box-shadow: 0 0 8px ${props => props.$isConnected ? '#00ff00' : '#ff0000'};
`;

const OnlineCount = styled.span`
  font-size: 14px;
  color: #101216;
  opacity: 0.8;
`;

const ToggleButton = styled.button`
  background: rgba(16, 18, 22, 0.2);
  border: none;
  color: #101216;
  width: 32px;
  height: 32px;
  border-radius: 8px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;

  &:hover {
    background: rgba(16, 18, 22, 0.4);
    transform: scale(1.05);
  }
`;

const ChatBody = styled.div`
  flex: 1;
  display: flex;
  overflow: hidden;
`;

const MessagesContainer = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 12px;

  &::-webkit-scrollbar {
    width: 6px;
  }

  &::-webkit-scrollbar-track {
    background: rgba(37, 214, 149, 0.05);
    border-radius: 3px;
  }

  &::-webkit-scrollbar-thumb {
    background: #25D695;
    border-radius: 3px;
  }
`;

const TypingIndicator = styled.div`
  padding: 8px 16px;
  font-size: 12px;
  color: #25D695;
  font-style: italic;
  min-height: 32px;
`;

const EmptyState = styled.div`
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  gap: 12px;
  color: rgba(255, 255, 255, 0.5);
  padding: 32px;
  text-align: center;
`;

const MinimizedWidget = styled(motion.div)`
  position: fixed;
  bottom: 20px;
  right: 20px;
  width: 60px;
  height: 60px;
  background: linear-gradient(135deg, #25D695 0%, #1fb67a 100%);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  box-shadow: 0 4px 16px rgba(37, 214, 149, 0.4);
  z-index: 1000;
  position: relative;

  &:hover {
    transform: scale(1.1);
    box-shadow: 0 6px 24px rgba(37, 214, 149, 0.6);
  }

  @media (max-width: 768px) {
    width: 50px;
    height: 50px;
    bottom: 10px;
    right: 10px;
  }
`;

const NotificationBadge = styled.div`
  position: absolute;
  top: -4px;
  right: -4px;
  background: #ff0000;
  color: white;
  border-radius: 50%;
  width: 20px;
  height: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 10px;
  font-weight: bold;
  box-shadow: 0 2px 8px rgba(255, 0, 0, 0.4);
`;

const ChatIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M20 2H4C2.9 2 2 2.9 2 4V22L6 18H20C21.1 18 22 17.1 22 16V4C22 2.9 21.1 2 20 2Z" fill="#101216"/>
  </svg>
);

const ChatWidget: React.FC = () => {
  const { messages, onlineUsers, isConnected, typingUsers } = useChatContext();
  const [isExpanded, setIsExpanded] = useState(true);
  const [showUserList, setShowUserList] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const lastMessageCountRef = useRef(messages.length);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    if (isExpanded) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
      setUnreadCount(0);
      lastMessageCountRef.current = messages.length;
    } else {
      // Count unread messages when minimized
      const newMessages = messages.length - lastMessageCountRef.current;
      if (newMessages > 0) {
        setUnreadCount(prev => prev + newMessages);
        lastMessageCountRef.current = messages.length;
      }
    }
  }, [messages, isExpanded]);

  const toggleExpanded = () => {
    setIsExpanded(!isExpanded);
    if (!isExpanded) {
      setUnreadCount(0);
    }
  };

  const typingText = typingUsers.length > 0
    ? typingUsers.length === 1
      ? `${typingUsers[0].slice(0, 8)}... is typing...`
      : `${typingUsers.length} users are typing...`
    : '';

  if (!isExpanded) {
    return (
      <MinimizedWidget
        onClick={toggleExpanded}
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: 'spring', stiffness: 260, damping: 20 }}
      >
        <ChatIcon />
        {unreadCount > 0 && (
          <NotificationBadge>{unreadCount > 9 ? '9+' : unreadCount}</NotificationBadge>
        )}
      </MinimizedWidget>
    );
  }

  return (
    <ChatContainer
      initial={{ y: 100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      exit={{ y: 100, opacity: 0 }}
      transition={{ type: 'spring', stiffness: 260, damping: 20 }}
    >
      <ChatHeader onClick={toggleExpanded}>
        <ChatTitle>
          <OnlineIndicator $isConnected={isConnected} />
          Casino Chat
          <OnlineCount>({onlineUsers.length} online)</OnlineCount>
        </ChatTitle>
        <div style={{ display: 'flex', gap: '8px' }}>
          <ToggleButton
            onClick={(e) => {
              e.stopPropagation();
              setShowUserList(!showUserList);
            }}
          >
            👥
          </ToggleButton>
          <ToggleButton>
            {isExpanded ? '−' : '+'}
          </ToggleButton>
        </div>
      </ChatHeader>

      <ChatBody>
        <MessagesContainer>
          {messages.length === 0 ? (
            <EmptyState>
              <div style={{ fontSize: '48px' }}>💬</div>
              <div>No messages yet</div>
              <div style={{ fontSize: '12px' }}>Be the first to say hi!</div>
            </EmptyState>
          ) : (
            <>
              {messages.map((msg) => (
                <ChatMessage key={msg.id} message={msg} />
              ))}
              <div ref={messagesEndRef} />
            </>
          )}
        </MessagesContainer>

        <AnimatePresence>
          {showUserList && (
            <UserList users={onlineUsers} onClose={() => setShowUserList(false)} />
          )}
        </AnimatePresence>
      </ChatBody>

      <TypingIndicator>{typingText}</TypingIndicator>

      <ChatInput />
    </ChatContainer>
  );
};

export default ChatWidget;
