import React from 'react';
import styled from 'styled-components';

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.7); /* Fundo mais escuro */
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;

const ModalContent = styled.div`
  background: white;
  padding: 30px; /* Aumentei o padding */
  border-radius: 12px; /* Bordas mais arredondadas */
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.3); /* Sombra mais forte */
  width: 100%;
  max-width: 500px;
  animation: fadeIn 0.3s ease-in-out; /* Animação de entrada */

  @keyframes fadeIn {
    from {
      opacity: 0;
      transform: scale(0.9);
    }
    to {
      opacity: 1;
      transform: scale(1);
    }
  }
`;

const ModalHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  border-bottom: 1px solid #ccc; /* Linha separadora */
  padding-bottom: 10px;
`;

const ModalTitle = styled.h2`
  font-size: 1.8rem; /* Tamanho maior para o título */
  color: #2E7D32; /* Verde escuro */
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  color: #2E7D32; /* Verde escuro */

  &:hover {
    color: #1B5E20; /* Tom mais escuro no hover */
  }
`;

const ModalBody = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px; /* Maior espaçamento entre os campos */
`;

// Removed unused Label component to resolve the compile error.

// Removed unused Input component to resolve the compile error.

const ModalFooter = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 15px; /* Maior espaçamento entre os botões */
  margin-top: 20px;
`;

const Button = styled.button`
  padding: 10px 15px;
  border: none;
  border-radius: 4px;
  font-size: 1rem;
  cursor: pointer;
  transition: background-color 0.3s;

  &.save {
    background-color: #2E7D32;
    color: white;

    &:hover {
      background-color: #1B5E20;
    }
  }

  &.cancel {
    background-color: #ccc;
    color: #333;

    &:hover {
      background-color: #bbb;
    }
  }
`;

const Modal = ({ isOpen, onClose, title, children, onSave }) => {
  if (!isOpen) return null;

  return (
    <ModalOverlay>
      <ModalContent>
        <ModalHeader>
          <ModalTitle>{title}</ModalTitle>
          <CloseButton onClick={onClose}>&times;</CloseButton>
        </ModalHeader>
        <ModalBody>{children}</ModalBody>
        <ModalFooter>
          <Button className="cancel" onClick={onClose}>Cancelar</Button>
          <Button className="save" onClick={onSave}>Salvar</Button>
        </ModalFooter>
      </ModalContent>
    </ModalOverlay>
  );
};

export default Modal;