import React, { useState } from 'react';
import styled from 'styled-components';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { auth } from '../services/firebase';
import { FiUser, FiMail, FiLogOut, FiChevronDown, FiChevronUp } from 'react-icons/fi';

const HeaderContainer = styled.div`
  background-color: var(--card-bg);
  padding: 1rem;
  margin-bottom: 1rem;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;
  flex-wrap: wrap;

  @media (max-width: 768px) {
    flex-direction: column;
    gap: 1rem;
    align-items: stretch;
  }
`;

const UserSection = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  position: relative;
`;

const UserCard = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem 1rem;
  background-color: ${props => props.expanded ? 'var(--primary-light)' : 'var(--bg-secondary)'};
  border-radius: 8px;
  border: 1px solid var(--border);
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background-color: var(--primary-light);
    border-color: var(--primary);
  }

  @media (max-width: 768px) {
    width: 100%;
    justify-content: center;
  }
`;

const UserIcon = styled(FiUser)`
  color: var(--primary);
  font-size: 1.2rem;
`;

const UserInfo = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 0.25rem;
`;

const UserLabel = styled.span`
  font-size: 0.75rem;
  color: var(--text-secondary);
  text-transform: uppercase;
  font-weight: 600;
  letter-spacing: 0.5px;
`;

const UserEmail = styled.span`
  font-size: 0.875rem;
  color: var(--text);
  font-weight: 500;
  max-width: 200px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;

  @media (max-width: 768px) {
    max-width: 250px;
  }
`;

const ExpandIcon = styled.div`
  color: var(--text-secondary);
  transition: transform 0.2s ease;
  transform: ${props => props.expanded ? 'rotate(180deg)' : 'rotate(0deg)'};
`;

const DropdownMenu = styled.div`
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  margin-top: 0.5rem;
  background-color: var(--card-bg);
  border: 1px solid var(--border);
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  z-index: 100;
  overflow: hidden;
  display: ${props => props.show ? 'block' : 'none'};
`;

const MenuItem = styled.button`
  width: 100%;
  padding: 0.75rem 1rem;
  background: none;
  border: none;
  text-align: left;
  color: var(--text);
  cursor: pointer;
  transition: background-color 0.2s ease;
  display: flex;
  align-items: center;
  gap: 0.75rem;

  &:hover {
    background-color: var(--bg-secondary);
  }

  &:last-child {
    color: var(--danger);
    
    &:hover {
      background-color: var(--danger-light);
    }
  }
`;

const StatusBadge = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  background-color: var(--success-light);
  color: var(--success);
  border-radius: 20px;
  font-size: 0.875rem;
  font-weight: 500;

  @media (max-width: 768px) {
    font-size: 0.8rem;
    padding: 0.4rem 0.8rem;
  }
`;

const StatusDot = styled.div`
  width: 8px;
  height: 8px;
  background-color: var(--success);
  border-radius: 50%;
`;

const UserHeader = ({ onManageClasses }) => {
  const [expanded, setExpanded] = useState(false);
  const [logoutLoading, setLogoutLoading] = useState(false);
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    setLogoutLoading(true);
    try {
      await auth.signOut();
      navigate('/');
    } catch (error) {
      console.error('Erro ao fazer logout:', error);
    } finally {
      setLogoutLoading(false);
      setExpanded(false);
    }
  };

  const toggleExpanded = () => {
    setExpanded(!expanded);
  };

  if (!currentUser) {
    return null;
  }

  return (
    <HeaderContainer className="user-header">
      <UserSection>
        <UserCard expanded={expanded} onClick={toggleExpanded}>
          <UserIcon />
          <UserInfo>
            <UserLabel>Conta Ativa</UserLabel>
            <UserEmail title={currentUser.email}>
              {currentUser.email}
            </UserEmail>
          </UserInfo>
          <ExpandIcon expanded={expanded}>
            {expanded ? <FiChevronUp /> : <FiChevronDown />}
          </ExpandIcon>
        </UserCard>
        
        <DropdownMenu show={expanded}>
          <MenuItem onClick={() => setExpanded(false)}>
            <FiMail />
            <div>
              <div style={{ fontSize: '0.875rem', fontWeight: '500' }}>Email da Conta</div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                {currentUser.email}
              </div>
            </div>
          </MenuItem>
          <MenuItem onClick={handleLogout} disabled={logoutLoading}>
            <FiLogOut />
            {logoutLoading ? 'Saindo...' : 'Sair da Conta'}
          </MenuItem>
        </DropdownMenu>
      </UserSection>

      <StatusBadge>
        <StatusDot />
        Conectado
      </StatusBadge>
    </HeaderContainer>
  );
};

export default UserHeader;
