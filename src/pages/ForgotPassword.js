import React, { useState } from 'react';
import { auth } from '../services/firebase';
import { sendPasswordResetEmail } from 'firebase/auth';
import styled from 'styled-components';
import { Link } from 'react-router-dom';

const Background = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background: linear-gradient(135deg, #2E7D32, #1B5E20); /* Tons de verde */
  color: white;
  padding: 20px; /* Para dispositivos móveis */
`;

const ResetBox = styled.div`
  background: white;
  padding: 40px;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  text-align: center;
  color: black;
  width: 100%;
  max-width: 400px; /* Limita a largura em telas maiores */
`;

const Title = styled.h1`
  font-size: 1.8rem;
  margin-bottom: 20px;
  color: #2E7D32; /* Verde escuro */
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 15px;
`;

const Input = styled.input`
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-size: 1rem;
  width: 100%;
`;

const Button = styled.button`
  padding: 10px 15px;
  background-color: #2E7D32; /* Verde escuro */
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 1rem;
  cursor: pointer;
  transition: background-color 0.3s;

  &:hover {
    background-color: #1B5E20; /* Tom mais escuro no hover */
  }
`;

const StyledLink = styled(Link)`
  margin-top: 15px;
  color: #2E7D32; /* Verde escuro */
  text-decoration: none;
  font-size: 0.9rem;

  &:hover {
    text-decoration: underline;
  }
`;

function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  const handleResetPassword = async (e) => {
    e.preventDefault();
    try {
      await sendPasswordResetEmail(auth, email);
      setMessage('Um email de redefinição de senha foi enviado para o seu email.');
    } catch (error) {
      setMessage('Erro ao enviar email de redefinição: ' + error.message);
    }
  };

  return (
    <Background>
      <ResetBox>
        <Title>Redefinir Senha</Title>
        <Form onSubmit={handleResetPassword}>
          <Input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <Button type="submit">Redefinir Senha</Button>
        </Form>
        {message && <p>{message}</p>}
        <StyledLink to="/">Voltar para o Login</StyledLink>
      </ResetBox>
    </Background>
  );
}

export default ForgotPassword;
