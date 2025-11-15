"use client";

import React, { useState, useRef, useEffect } from 'react';
import styled from 'styled-components';
import { useChatContext } from '@/context/chatcontext';
import EmojiPicker, { EmojiClickData } from 'emoji-picker-react';

const InputContainer = styled.div`
  padding: 12px 16px;
  border-top: 1px solid rgba(37, 214, 149, 0.2);
  background: rgba(14, 20, 29, 0.5);
  position: relative;
`;

const InputWrapper = styled.div`
  display: flex;
  gap: 8px;
  align-items: center;
`;

const StyledInput = styled.input`
  flex: 1;
  padding: 10px 12px;
  background: rgba(37, 214, 149, 0.05);
  border: 1px solid rgba(37, 214, 149, 0.3);
  border-radius: 8px;
  color: white;
  font-size: 14px;
  outline: none;
  transition: all 0.2s;

  &:focus {
    border-color: #25D695;
    background: rgba(37, 214, 149, 0.1);
  }

  &::placeholder {
    color: rgba(255, 255, 255, 0.4);
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const IconButton = styled.button`
  width: 36px;
  height: 36px;
  border: none;
  background: rgba(37, 214, 149, 0.1);
  border-radius: 8px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;
  font-size: 20px;

  &:hover:not(:disabled) {
    background: rgba(37, 214, 149, 0.2);
    transform: scale(1.05);
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const SendButton = styled(IconButton)<{ $canSend: boolean }>`
  background: ${props => props.$canSend
    ? 'linear-gradient(135deg, #25D695 0%, #1fb67a 100%)'
    : 'rgba(37, 214, 149, 0.1)'
  };
  color: ${props => props.$canSend ? '#101216' : 'rgba(255, 255, 255, 0.4)'};

  &:hover:not(:disabled) {
    background: ${props => props.$canSend
      ? 'linear-gradient(135deg, #1fb67a 0%, #25D695 100%)'
      : 'rgba(37, 214, 149, 0.2)'
    };
  }
`;

const EmojiPickerContainer = styled.div`
  position: absolute;
  bottom: 60px;
  right: 16px;
  z-index: 1001;
`;

const CharCounter = styled.div<{ $isNearLimit: boolean }>`
  font-size: 11px;
  color: ${props => props.$isNearLimit ? '#ff6b6b' : 'rgba(255, 255, 255, 0.4)'};
  text-align: right;
  margin-top: 4px;
`;

const MAX_MESSAGE_LENGTH = 500;
const TYPING_TIMEOUT = 2000;

const ChatInput: React.FC = () => {
  const { sendMessage, isConnected, setIsTyping } = useChatContext();
  const [message, setMessage] = useState('');
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value.length <= MAX_MESSAGE_LENGTH) {
      setMessage(value);

      // Handle typing indicator
      setIsTyping(true);

      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }

      typingTimeoutRef.current = setTimeout(() => {
        setIsTyping(false);
      }, TYPING_TIMEOUT);
    }
  };

  const handleSend = () => {
    if (!message.trim() || !isConnected) return;

    sendMessage(message);
    setMessage('');
    setIsTyping(false);

    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    inputRef.current?.focus();
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleEmojiClick = (emojiData: EmojiClickData) => {
    const newMessage = message + emojiData.emoji;
    if (newMessage.length <= MAX_MESSAGE_LENGTH) {
      setMessage(newMessage);
      inputRef.current?.focus();
    }
  };

  useEffect(() => {
    return () => {
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
    };
  }, []);

  const canSend = message.trim().length > 0 && isConnected;
  const isNearLimit = message.length > MAX_MESSAGE_LENGTH * 0.9;

  return (
    <InputContainer>
      {showEmojiPicker && (
        <EmojiPickerContainer>
          <EmojiPicker
            onEmojiClick={handleEmojiClick}
            width={300}
            height={400}
            theme="dark"
          />
        </EmojiPickerContainer>
      )}

      <InputWrapper>
        <IconButton
          onClick={() => setShowEmojiPicker(!showEmojiPicker)}
          disabled={!isConnected}
          title="Add emoji"
        >
          😊
        </IconButton>

        <StyledInput
          ref={inputRef}
          type="text"
          value={message}
          onChange={handleInputChange}
          onKeyPress={handleKeyPress}
          placeholder={isConnected ? "Type a message..." : "Connecting..."}
          disabled={!isConnected}
          maxLength={MAX_MESSAGE_LENGTH}
        />

        <SendButton
          onClick={handleSend}
          disabled={!canSend}
          $canSend={canSend}
          title="Send message"
        >
          📤
        </SendButton>
      </InputWrapper>

      {message.length > 0 && (
        <CharCounter $isNearLimit={isNearLimit}>
          {message.length} / {MAX_MESSAGE_LENGTH}
        </CharCounter>
      )}
    </InputContainer>
  );
};

export default ChatInput;
