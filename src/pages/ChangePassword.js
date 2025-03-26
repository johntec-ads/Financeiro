import React, { useState } from 'react';
import { auth } from '../services/firebase';
import { updatePassword } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
`;

const Title = styled.h1`
  font-size: 24px;
  margin-bottom: 20px;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  width: 300px;
`;

const Input = styled.input`
  padding: 10px;
  margin-bottom: 15px;
  border: 1px solid #ccc;
  border-radius: 4px;
`;

const Button = styled.button`
  padding: 10px 15px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;

  &:hover {
    background-color: #0056b3;
  }
`;

const PasswordRules = styled.div`
  margin: 10px 0;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-size: 14px;
`;

const Rule = styled.p`
  margin: 5px 0;
  color: ${props => props.valid ? 'green' : '#666'};
  &::before {
    content: '✓ ';
    color: ${props => props.valid ? 'green' : '#ccc'};
  }
`;

function ChangePassword() {
  const [newPassword, setNewPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const navigate = useNavigate();

  const handleChangePassword = async (e) => {
    e.preventDefault();
    setPasswordError('');

    if (!newPassword) {
      setPasswordError('Por favor, insira uma senha.');
      return;
    }

    if (newPassword.length < 6) {
      setPasswordError('A senha deve ter no mínimo 6 caracteres.');
      return;
    }

    if (!/[A-Z]/.test(newPassword)) {
      setPasswordError('A senha deve conter pelo menos uma letra maiúscula.');
      return;
    }

    if (!/[a-z]/.test(newPassword)) {
      setPasswordError('A senha deve conter pelo menos uma letra minúscula.');
      return;
    }

    if (!/[0-9]/.test(newPassword)) {
      setPasswordError('A senha deve conter pelo menos um número.');
      return;
    }

    try {
      await updatePassword(auth.currentUser, newPassword);
      alert('Senha alterada com sucesso!');
      navigate('/dashboard');
    } catch (error) {
      setPasswordError('Erro ao alterar senha: ' + error.message);
    }
  };

  const validatePassword = (pass) => {
    setNewPassword(pass);
    if (!pass) {
      setPasswordError('Por favor, insira uma senha.');
      return;
    }
    // Limpa o erro se houver validações em andamento
    setPasswordError('');
  };

  return (
    <Container>
      <Title>Alterar Senha</Title>
      <Form onSubmit={handleChangePassword}>
        <Input
          type="password"
          placeholder="Nova Senha"
          value={newPassword}
          onChange={(e) => validatePassword(e.target.value)}
        />
        <PasswordRules>
          <p>Sua senha deve conter:</p>
          <Rule valid={newPassword.length >= 6}>Mínimo de 6 caracteres</Rule>
          <Rule valid={/[A-Z]/.test(newPassword)}>Uma letra maiúscula</Rule>
          <Rule valid={/[a-z]/.test(newPassword)}>Uma letra minúscula</Rule>
          <Rule valid={/[0-9]/.test(newPassword)}>Um número</Rule>
        </PasswordRules>
        {passwordError && <p style={{ color: 'red' }}>{passwordError}</p>}
        <Button type="submit">Alterar Senha</Button>
      </Form>
    </Container>
  );
}

export default ChangePassword;
