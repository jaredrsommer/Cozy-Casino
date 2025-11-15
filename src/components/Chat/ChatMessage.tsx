"use client";

import React from 'react';
import styled from 'styled-components';
import { ChatMessage as ChatMessageType } from '@/context/chatcontext';
import { motion } from 'framer-motion';

const MessageContainer = styled(motion.div)`
  display: flex;
  flex-direction: column;
  gap: 4px;
  padding: 8px 12px;
  background: rgba(37, 214, 149, 0.05);
  border-left: 2px solid #25D695;
  border-radius: 8px;
  transition: all 0.2s;

  &:hover {
    background: rgba(37, 214, 149, 0.1);
  }
`;

const MessageHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 8px;
`;

const UserInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

const Avatar = styled.div<{ $address: string }>`
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background: linear-gradient(
    135deg,
    ${props => `#${props.$address.slice(2, 8)}`},
    ${props => `#${props.$address.slice(-6)}`}
  );
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 10px;
  font-weight: bold;
  color: white;
  text-transform: uppercase;
`;

const Username = styled.span`
  font-weight: 600;
  color: #25D695;
  font-size: 14px;
`;

const Address = styled.span`
  font-size: 11px;
  color: rgba(255, 255, 255, 0.5);
  font-family: monospace;
`;

const Timestamp = styled.span`
  font-size: 11px;
  color: rgba(255, 255, 255, 0.4);
`;

const MessageText = styled.p`
  margin: 0;
  color: rgba(255, 255, 255, 0.9);
  font-size: 14px;
  line-height: 1.4;
  word-wrap: break-word;
  white-space: pre-wrap;
`;

const EditedBadge = styled.span`
  font-size: 10px;
  color: rgba(255, 255, 255, 0.3);
  font-style: italic;
  margin-left: 4px;
`;

interface ChatMessageProps {
  message: ChatMessageType;
}

const formatTimestamp = (timestamp: number): string => {
  const date = new Date(timestamp);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);

  if (diffMins < 1) return 'just now';
  if (diffMins < 60) return `${diffMins}m ago`;

  const diffHours = Math.floor(diffMins / 60);
  if (diffHours < 24) return `${diffHours}h ago`;

  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
};

const getInitials = (address: string): string => {
  return address.slice(0, 2).toUpperCase();
};

const ChatMessage: React.FC<ChatMessageProps> = ({ message }) => {
  const { address, displayName, message: text, timestamp, edited } = message;

  return (
    <MessageContainer
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
    >
      <MessageHeader>
        <UserInfo>
          <Avatar $address={address}>
            {getInitials(address)}
          </Avatar>
          <div>
            <Username>{displayName || `User ${address.slice(0, 6)}`}</Username>
            <Address>{address.slice(0, 8)}...{address.slice(-6)}</Address>
          </div>
        </UserInfo>
        <Timestamp>{formatTimestamp(timestamp)}</Timestamp>
      </MessageHeader>

      <MessageText>
        {text}
        {edited && <EditedBadge>(edited)</EditedBadge>}
      </MessageText>
    </MessageContainer>
  );
};

export default ChatMessage;
