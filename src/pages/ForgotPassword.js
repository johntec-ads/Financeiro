import React, { useState } from 'react';
import { auth } from '../services/firebase';
import { sendPasswordResetEmail } from 'firebase/auth';
import styled from 'styled-components';
import { Link } from 'react-router-dom';

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

const StyledLink = styled(Link)`
  margin-top: 15px;
  color: #007bff;
  text-decoration: none;

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
    <Container>
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
    </Container>
  );
}

export default ForgotPassword;
