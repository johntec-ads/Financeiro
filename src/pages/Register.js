import React, { useState } from 'react';
import { auth } from '../services/firebase';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { useNavigate, Link } from 'react-router-dom';
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

const StyledLink = styled(Link)`
  margin-top: 15px;
  color: #007bff;
  text-decoration: none;

  &:hover {
    text-decoration: underline;
  }
`;

function Register() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    setEmailError('');
    setPasswordError('');

    if (!email) {
      setEmailError('Por favor, insira um email.');
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setEmailError('Por favor, insira um email válido.');
      return;
    }

    if (!password) {
      setPasswordError('Por favor, insira uma senha.');
      return;
    }

    if (password.length < 6) {
      setPasswordError('A senha deve ter no mínimo 6 caracteres.');
      return;
    }

    if (!/[A-Z]/.test(password)) {
      setPasswordError('A senha deve conter pelo menos uma letra maiúscula.');
      return;
    }

    if (!/[a-z]/.test(password)) {
      setPasswordError('A senha deve conter pelo menos uma letra minúscula.');
      return;
    }

    if (!/[0-9]/.test(password)) {
      setPasswordError('A senha deve conter pelo menos um número.');
      return;
    }

    try {
      await createUserWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
          const user = userCredential.user;
          navigate('/dashboard');
        })
        .catch((error) => {
          const errorCode = error.code;
          const errorMessage = error.message;
          alert('Erro ao criar conta: ' + errorMessage);
        });
    } catch (error) {
      alert('Erro ao criar conta: ' + error.message);
    }
  };

  return (
    <Container>
      <Title>Criar Conta</Title>
      <Form onSubmit={handleRegister}>
        <Input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        {emailError && <p style={{ color: 'red' }}>{emailError}</p>}
        <Input
          type="password"
          placeholder="Senha"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        {passwordError && <p style={{ color: 'red' }}>{passwordError}</p>}
        <Button type="submit">Cadastrar</Button>
      </Form>
      <StyledLink to="/">Já tenho uma conta</StyledLink>
    </Container>
  );
}

export default Register;
