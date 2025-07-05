import React from 'react';
import styled from 'styled-components';
import { useAuth } from '../context/AuthContext';
import { FiUser, FiMail } from 'react-icons/fi';

const UserContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  background-color: var(--card-bg);
  border-radius: 6px;
  border: 1px solid var(--border);
  color: var(--text);
  font-size: 0.875rem;

  @media (max-width: 768px) {
    font-size: 0.8rem;
    padding: 0.4rem 0.8rem;
  }
`;

const UserIcon = styled(FiUser)`
  color: var(--primary);
  font-size: 1rem;
`;

const EmailIcon = styled(FiMail)`
  color: var(--primary);
  font-size: 0.875rem;
  margin-left: 0.25rem;
`;

const UserEmail = styled.span`
  color: var(--text-secondary);
  font-weight: 500;
  max-width: 200px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;

  @media (max-width: 768px) {
    max-width: 150px;
  }
`;

const UserInfo = () => {
  const { currentUser } = useAuth();

  if (!currentUser) {
    return null;
  }

  return (
    <UserContainer>
      <UserIcon />
      <EmailIcon />
      <UserEmail title={currentUser.email}>
        {currentUser.email}
      </UserEmail>
    </UserContainer>
  );
};

export default UserInfo;
