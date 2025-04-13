import React, { useState } from 'react';
import { auth } from '../services/firebase';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { useNavigate, Link } from 'react-router-dom';
import styled from 'styled-components';

const Background = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background: linear-gradient(135deg, #2E7D32, #1B5E20); /* Tons de verde */
  color: white;
  padding: 20px; /* Para dispositivos móveis */
`;

const LoginBox = styled.div`
  background: white;
  padding: 40px;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  text-align: center;
  color: black;
  width: 100%;
  max-width: 400px; /* Limita a largura em telas maiores */
`;

const Logo = styled.img`
  width: 80px;
  margin-bottom: 20px;
`;

const LogoText = styled.h1`
  font-size: 2rem;
  font-weight: bold;
  color: #2E7D32; /* Verde escuro */
  margin-bottom: 20px;
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

const ForgotPasswordLink = styled(Link)`
  margin-top: 5px;
  color: #2E7D32; /* Verde escuro */
  text-decoration: none;
  font-size: 0.9rem;

  &:hover {
    text-decoration: underline;
  }
`;

const Footer = styled.footer`
  margin-top: 20px;
  font-size: 0.9rem;
  color: #2E7D32; /* Verde escuro */
  text-align: center;
`;

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      await signInWithEmailAndPassword(auth, email, password)
        .then(() => {
          navigate('/dashboard');
        })
        .catch((error) => {
          const errorCode = error.code;
          let errorMessage;

          switch (errorCode) {
            case 'auth/user-not-found':
              errorMessage = 'Usuário não encontrado. Verifique o email e tente novamente.';
              break;
            case 'auth/wrong-password':
              errorMessage = 'Senha incorreta. Tente novamente.';
              break;
            case 'auth/too-many-requests':
              errorMessage = 'Muitas tentativas de login. Tente novamente mais tarde.';
              break;
            default:
              errorMessage = 'Erro ao fazer login. Por favor, tente novamente.';
          }

          alert(errorMessage);
        });
    } catch (error) {
      alert('Erro ao fazer login: ' + error.message);
    }
  };

  return (
    <Background>
      <LoginBox>
        <LogoText>JOHNTEC</LogoText>
        <Title>Bem-vindo ao Sistema Financeiro</Title>
        <Form onSubmit={handleLogin}>
          <Input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <Input
            type="password"
            placeholder="Senha"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <Button type="submit">Entrar</Button>
          <ForgotPasswordLink to="/forgot-password">Esqueci minha senha</ForgotPasswordLink>
        </Form>
        <StyledLink to="/register">Criar conta</StyledLink>
        <Footer>© 2025 JOHNTEC - Contato: <a href="mailto:johntec.ads@gmail.com">johntec.ads@gmail.com</a></Footer>
      </LoginBox>
    </Background>
  );
}

export default Login;
