import React, { useState } from 'react';
import styled from 'styled-components';
import { useClasses } from '../context/ClassContext';
import { FiChevronDown, FiPlus, FiSettings } from 'react-icons/fi';

const SelectorContainer = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const ClassButton = styled.button`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem 1rem;
  background-color: var(--card-bg);
  border: 1px solid var(--border);
  border-radius: 8px;
  color: var(--text);
  cursor: pointer;
  transition: all 0.2s ease;
  min-width: 200px;

  &:hover {
    border-color: var(--primary);
    box-shadow: 0 2px 8px rgba(46, 125, 50, 0.1);
  }

  &:focus {
    outline: 2px solid var(--primary);
    border-color: transparent;
  }

  @media (max-width: 768px) {
    min-width: 150px;
    padding: 0.6rem 0.8rem;
    font-size: 0.875rem;
  }
`;

const ClassInfo = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  flex: 1;
`;

const ClassColor = styled.div`
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background-color: ${props => props.color || '#2E7D32'};
  flex-shrink: 0;
`;

const ClassName = styled.span`
  font-weight: 500;
  color: var(--text);
  max-width: 120px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;

  @media (max-width: 768px) {
    max-width: 100px;
    font-size: 0.875rem;
  }
`;

const ClassLabel = styled.span`
  font-size: 0.75rem;
  color: var(--text-secondary);
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

const ChevronIcon = styled(FiChevronDown)`
  color: var(--text-secondary);
  transition: transform 0.2s ease;
  transform: ${props => props.isOpen ? 'rotate(180deg)' : 'rotate(0deg)'};
`;

const Dropdown = styled.div`
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  margin-top: 0.5rem;
  background-color: var(--card-bg);
  border: 1px solid var(--border);
  border-radius: 8px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
  z-index: 1000;
  max-height: 300px;
  overflow-y: auto;
  display: ${props => props.show ? 'block' : 'none'};

  @media (max-width: 768px) {
    position: fixed;
    top: auto;
    bottom: 1rem;
    left: 1rem;
    right: 1rem;
    margin-top: 0;
    max-height: 50vh;
  }
`;

const ClassOption = styled.button`
  width: 100%;
  padding: 1rem;
  background: none;
  border: none;
  text-align: left;
  cursor: pointer;
  transition: background-color 0.2s ease;
  display: flex;
  align-items: center;
  gap: 0.75rem;

  &:hover {
    background-color: var(--bg-secondary);
  }

  &:first-child {
    border-radius: 8px 8px 0 0;
  }

  &:last-child {
    border-radius: 0 0 8px 8px;
  }

  ${props => props.isActive && `
    background-color: var(--primary-light);
    border-left: 3px solid var(--primary);
  `}
`;

const OptionInfo = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  flex: 1;
`;

const OptionName = styled.span`
  font-weight: 500;
  color: var(--text);
  margin-bottom: 0.25rem;
`;

const OptionDescription = styled.span`
  font-size: 0.8rem;
  color: var(--text-secondary);
`;

const ActionButton = styled.button`
  padding: 0.5rem;
  background: none;
  border: 1px solid var(--border);
  border-radius: 6px;
  color: var(--text-secondary);
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    border-color: var(--primary);
    color: var(--primary);
  }

  &:focus {
    outline: 2px solid var(--primary);
    border-color: transparent;
  }
`;

const Divider = styled.div`
  height: 1px;
  background-color: var(--border);
  margin: 0.5rem 0;
`;

const ActionOption = styled(ClassOption)`
  color: var(--primary);
  font-weight: 500;
  
  &:hover {
    background-color: var(--primary-light);
  }
`;

const ClassSelector = ({ onManageClasses }) => {
  const [isOpen, setIsOpen] = useState(false);
  const { classes, activeClass, switchActiveClass } = useClasses();

  const handleClassSelect = (selectedClass) => {
    switchActiveClass(selectedClass);
    setIsOpen(false);
  };

  const handleManageClasses = () => {
    setIsOpen(false);
    if (onManageClasses) {
      onManageClasses();
    }
  };

  if (!activeClass) {
    return null;
  }

  return (
    <SelectorContainer>
      <ClassButton onClick={() => setIsOpen(!isOpen)}>
        <ClassColor color={activeClass.color} />
        <ClassInfo>
          <ClassLabel>Classe Ativa</ClassLabel>
          <ClassName title={activeClass.name}>
            {activeClass.name}
          </ClassName>
        </ClassInfo>
        <ChevronIcon isOpen={isOpen} />
      </ClassButton>

      <ActionButton 
        onClick={handleManageClasses}
        title="Gerenciar Classes"
      >
        <FiSettings />
      </ActionButton>

      <Dropdown show={isOpen}>
        {classes.map(cls => (
          <ClassOption
            key={cls.id}
            isActive={cls.id === activeClass.id}
            onClick={() => handleClassSelect(cls)}
          >
            <ClassColor color={cls.color} />
            <OptionInfo>
              <OptionName>{cls.name}</OptionName>
              {cls.description && (
                <OptionDescription>{cls.description}</OptionDescription>
              )}
            </OptionInfo>
            {cls.isDefault && (
              <span style={{ 
                fontSize: '0.75rem', 
                color: 'var(--primary)', 
                fontWeight: '500' 
              }}>
                Padrão
              </span>
            )}
          </ClassOption>
        ))}
        
        <Divider />
        
        <ActionOption onClick={handleManageClasses}>
          <FiPlus />
          <OptionInfo>
            <OptionName>Nova Classe</OptionName>
            <OptionDescription>Criar uma nova categoria</OptionDescription>
          </OptionInfo>
        </ActionOption>
      </Dropdown>

      {/* Overlay para fechar dropdown ao clicar fora */}
      {isOpen && (
        <div 
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            zIndex: 999
          }}
          onClick={() => setIsOpen(false)}
        />
      )}
    </SelectorContainer>
  );
};

export default ClassSelector;
