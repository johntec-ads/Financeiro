import React, { useState } from 'react';
import { auth } from '../services/firebase';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { useNavigate, Link } from 'react-router-dom';
import styled from 'styled-components';
import { db } from '../services/firebase';
import { doc, setDoc } from 'firebase/firestore';

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

function Register() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
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
        .then(async (userCredential) => {
          // Adiciona os dados do usuário ao Firestore
          await setDoc(doc(db, "users", userCredential.user.uid), {
            uid: userCredential.user.uid,
            email: email,
            firstName: firstName,
            lastName: lastName,
          });
          navigate('/dashboard');
        })
        .catch((error) => {
          const errorCode = error.code;
          let errorMessage;

          switch (errorCode) {
            case 'auth/email-already-in-use':
              errorMessage = 'Este email já está em uso. Tente outro.';
              break;
            case 'auth/invalid-email':
              errorMessage = 'Email inválido. Verifique e tente novamente.';
              break;
            case 'auth/weak-password':
              errorMessage = 'Senha fraca. Escolha uma senha mais forte.';
              break;
            default:
              errorMessage = 'Erro ao criar conta. Por favor, tente novamente.';
          }

          alert(errorMessage);
        });
    } catch (error) {
      alert('Erro ao criar conta: ' + error.message);
    }
  };

  const validatePassword = (pass) => {
    setPassword(pass);
    if (!pass) {
      setPasswordError('Por favor, insira uma senha.');
      return;
    }
    // Limpa o erro se houver validações em andamento
    setPasswordError('');
  };

  return (
    <Container>
      <Title>Criar Conta</Title>
      <Form onSubmit={handleRegister}>
        <Input
          type="text"
          placeholder="Nome"
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
        />
        <Input
          type="text"
          placeholder="Sobrenome"
          value={lastName}
          onChange={(e) => setLastName(e.target.value)}
        />
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
          onChange={(e) => validatePassword(e.target.value)}
        />
        <PasswordRules>
          <p>Sua senha deve conter:</p>
          <Rule valid={password.length >= 6}>Mínimo de 6 caracteres</Rule>
          <Rule valid={/[A-Z]/.test(password)}>Uma letra maiúscula</Rule>
          <Rule valid={/[a-z]/.test(password)}>Uma letra minúscula</Rule>
          <Rule valid={/[0-9]/.test(password)}>Um número</Rule>
        </PasswordRules>
        {passwordError && <p style={{ color: 'red' }}>{passwordError}</p>}
        <Button type="submit">Cadastrar</Button>
      </Form>
      <StyledLink to="/">Já tenho uma conta</StyledLink>
    </Container>
  );
}

export default Register;
