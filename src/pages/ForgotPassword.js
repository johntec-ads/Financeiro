import React, { useState } from 'react';
import { auth } from '../services/firebase';
import { sendPasswordResetEmail } from 'firebase/auth';
import styled from 'styled-components';
import { Link } from 'react-router-dom';

const PageBackground = styled.div`
  min-height: 100vh;
  padding: 2rem;
  display: flex;
  align-items: center;
  justify-content: center;
  background: radial-gradient(circle at top, rgba(99, 102, 241, 0.18), transparent 55%),
    linear-gradient(135deg, #0f172a, #111827 45%, #0b1121);
`;

const GlassCard = styled.div`
  width: min(900px, 100%);
  background: rgba(15, 23, 42, 0.85);
  border: 1px solid rgba(148, 163, 184, 0.12);
  border-radius: var(--radius-xl, 1.25rem);
  box-shadow: 0 25px 50px -12px rgba(15, 23, 42, 0.25);
  padding: clamp(1.5rem, 3vw, 2.5rem);
  display: grid;
  grid-template-columns: 1fr;
  gap: 1.5rem;
  color: #e2e8f0;
`;

const Panel = styled.div`
  background: #ffffff;
  border-radius: var(--radius-lg, 1rem);
  padding: clamp(1rem, 2.5vw, 2rem);
  color: var(--text, #0f172a);
  display: flex;
  flex-direction: column;
  gap: 1rem;
  box-shadow: var(--shadow-lg, 0 10px 15px -3px rgba(0, 0, 0, 0.1));
  max-width: 520px;
  margin: 0 auto;
`;

const Title = styled.h3`
  font-size: 1.5rem;
  color: var(--text, #0f172a);
`;

const Subtitle = styled.p`
  color: var(--text-secondary, #64748b);
  font-size: 0.95rem;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const Input = styled.input`
  padding: 0.85rem 1rem;
  border-radius: var(--radius-md, 0.75rem);
  border: 1px solid var(--border, #e2e8f0);
  font-size: 1rem;
  transition: border 0.2s ease, box-shadow 0.2s ease;

  &:focus {
    outline: none;
    border-color: var(--primary, #6366f1);
    box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.12);
  }
`;

const Button = styled.button`
  padding: 0.9rem 1rem;
  background: linear-gradient(120deg, var(--primary, #6366f1), var(--secondary, #10b981));
  color: white;
  border: none;
  border-radius: var(--radius-md, 0.75rem);
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: transform 0.2s ease, box-shadow 0.2s ease;

  &:hover {
    transform: translateY(-1px);
    box-shadow: 0 10px 20px rgba(99, 102, 241, 0.16);
  }

  &:active {
    transform: translateY(0);
  }
`;

const StyledLink = styled(Link)`
  text-align: center;
  color: var(--primary, #6366f1);
  text-decoration: none;
  font-weight: 500;

  &:hover {
    text-decoration: underline;
  }
`;

function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [isSending, setIsSending] = useState(false);

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setIsSending(true);
    try {
      await sendPasswordResetEmail(auth, email);
      setMessage('Um email de redefinição de senha foi enviado para o seu email.');
    } catch (error) {
      setMessage('Erro ao enviar email de redefinição: ' + (error.message || error));
    } finally {
      setIsSending(false);
    }
  };

  return (
    <PageBackground>
      <GlassCard>
        <Panel>
          <Title>Redefinir senha</Title>
          <Subtitle>Informe o email cadastrado e enviaremos instruções para criar uma nova senha.</Subtitle>

          <Form onSubmit={handleResetPassword}>
            <Input
              type="email"
              placeholder="Seu email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <Button type="submit" disabled={isSending}>{isSending ? 'Enviando...' : 'Enviar instruções'}</Button>
          </Form>

          {message && <p>{message}</p>}
          <StyledLink to="/">Voltar para o Login</StyledLink>
        </Panel>
      </GlassCard>
    </PageBackground>
  );
}

export default ForgotPassword;
