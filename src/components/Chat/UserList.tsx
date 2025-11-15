"use client";

import React from 'react';
import styled from 'styled-components';
import { OnlineUser } from '@/context/chatcontext';
import { motion } from 'framer-motion';

const UserListContainer = styled(motion.div)`
  width: 200px;
  background: rgba(14, 20, 29, 0.95);
  border-left: 1px solid rgba(37, 214, 149, 0.2);
  display: flex;
  flex-direction: column;
  overflow: hidden;
`;

const UserListHeader = styled.div`
  padding: 12px 16px;
  background: rgba(37, 214, 149, 0.1);
  border-bottom: 1px solid rgba(37, 214, 149, 0.2);
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const HeaderTitle = styled.h4`
  margin: 0;
  font-size: 14px;
  font-weight: 600;
  color: #25D695;
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  color: rgba(255, 255, 255, 0.6);
  cursor: pointer;
  font-size: 16px;
  padding: 0;
  width: 20px;
  height: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;

  &:hover {
    color: #25D695;
    transform: scale(1.1);
  }
`;

const UserListBody = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 8px;

  &::-webkit-scrollbar {
    width: 4px;
  }

  &::-webkit-scrollbar-track {
    background: rgba(37, 214, 149, 0.05);
  }

  &::-webkit-scrollbar-thumb {
    background: #25D695;
    border-radius: 2px;
  }
`;

const UserItem = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px;
  border-radius: 6px;
  margin-bottom: 4px;
  transition: all 0.2s;
  cursor: pointer;

  &:hover {
    background: rgba(37, 214, 149, 0.1);
  }
`;

const UserAvatar = styled.div<{ $address: string }>`
  width: 28px;
  height: 28px;
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
  flex-shrink: 0;
`;

const UserInfo = styled.div`
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 2px;
`;

const UserName = styled.div`
  font-size: 12px;
  color: rgba(255, 255, 255, 0.9);
  font-weight: 500;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const UserAddress = styled.div`
  font-size: 10px;
  color: rgba(255, 255, 255, 0.5);
  font-family: monospace;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const OnlineIndicator = styled.div`
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: #00ff00;
  box-shadow: 0 0 4px #00ff00;
  flex-shrink: 0;
`;

const EmptyState = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 32px 16px;
  color: rgba(255, 255, 255, 0.4);
  text-align: center;
  font-size: 12px;
`;

interface UserListProps {
  users: OnlineUser[];
  onClose: () => void;
}

const getInitials = (address: string): string => {
  return address.slice(0, 2).toUpperCase();
};

const formatAddress = (address: string): string => {
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
};

const UserList: React.FC<UserListProps> = ({ users, onClose }) => {
  return (
    <UserListContainer
      initial={{ x: 200, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: 200, opacity: 0 }}
      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
    >
      <UserListHeader>
        <HeaderTitle>Online ({users.length})</HeaderTitle>
        <CloseButton onClick={onClose}>✕</CloseButton>
      </UserListHeader>

      <UserListBody>
        {users.length === 0 ? (
          <EmptyState>
            <div style={{ fontSize: '32px' }}>👤</div>
            <div>No users online</div>
          </EmptyState>
        ) : (
          users.map((user) => (
            <UserItem key={user.address}>
              <UserAvatar $address={user.address}>
                {getInitials(user.address)}
              </UserAvatar>
              <UserInfo>
                <UserName>
                  {user.displayName || `User ${user.address.slice(0, 6)}`}
                </UserName>
                <UserAddress>{formatAddress(user.address)}</UserAddress>
              </UserInfo>
              <OnlineIndicator />
            </UserItem>
          ))
        )}
      </UserListBody>
    </UserListContainer>
  );
};

export default UserList;
