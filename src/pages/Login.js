import React, { useState } from 'react';
import { auth } from '../services/firebase';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { useNavigate, Link } from 'react-router-dom';
import styled from 'styled-components';
import { FiShield, FiTrendingUp, FiClock } from 'react-icons/fi';

const PageBackground = styled.div`
  min-height: 100vh;
  padding: 2rem;
  display: flex;
  align-items: center;
  justify-content: center;
  background: radial-gradient(circle at top, rgba(99, 102, 241, 0.35), transparent 55%),
    linear-gradient(135deg, #0f172a, #111827 45%, #0b1121);
`;

const GlassCard = styled.div`
  width: min(1200px, 100%);
  background: rgba(15, 23, 42, 0.9);
  border: 1px solid rgba(148, 163, 184, 0.2);
  border-radius: var(--radius-xl, 1.5rem);
  box-shadow: 0 25px 50px -12px rgba(15, 23, 42, 0.25);
  padding: clamp(1.5rem, 3vw, 3rem);
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
  gap: 2rem;
  color: #e2e8f0;
`;

const HeroSection = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 1.5rem;
`;

const Badge = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.4rem 0.9rem;
  background: rgba(99, 102, 241, 0.15);
  border-radius: 999px;
  color: #c7d2fe;
  font-weight: 500;
  width: fit-content;
`;

const HeroTitle = styled.h1`
  font-size: clamp(2rem, 3vw, 3rem);
  color: #f8fafc;
  line-height: 1.2;
`;

const HeroSubtitle = styled.p`
  color: #94a3b8;
  font-size: 1rem;
  line-height: 1.6;
`;

const FeatureGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  gap: 1rem;
`;

const FeatureCard = styled.div`
  background: rgba(15, 23, 42, 0.4);
  border: 1px solid rgba(148, 163, 184, 0.2);
  border-radius: var(--radius-md, 0.75rem);
  padding: 1rem;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const FeatureIcon = styled.div`
  width: 36px;
  height: 36px;
  border-radius: 12px;
  display: grid;
  place-items: center;
  background: rgba(99, 102, 241, 0.15);
  color: #a5b4fc;
`;

const LoginPanel = styled.div`
  background: #ffffff;
  border-radius: var(--radius-lg, 1rem);
  padding: clamp(1.5rem, 3vw, 2.5rem);
  color: var(--text, #0f172a);
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  box-shadow: var(--shadow-lg, 0 10px 15px -3px rgba(0, 0, 0, 0.1));
`;

const Brand = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.3rem;
`;

const LogoText = styled.h2`
  font-size: 1rem;
  font-weight: 600;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: var(--primary, #6366f1);
`;

const Title = styled.h3`
  font-size: 1.75rem;
  color: var(--text, #0f172a);
`;

const Subtitle = styled.p`
  color: var(--text-secondary, #64748b);
  font-size: 0.95rem;
  line-height: 1.5;
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
    box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.2);
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
    box-shadow: 0 10px 20px rgba(99, 102, 241, 0.2);
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

const ForgotPasswordLink = styled(Link)`
  text-align: center;
  color: var(--text-secondary, #64748b);
  font-size: 0.9rem;

  &:hover {
    color: var(--primary, #6366f1);
  }
`;

const Footer = styled.footer`
  margin-top: 0.5rem;
  font-size: 0.85rem;
  color: var(--text-secondary, #64748b);
  text-align: center;

  a {
    color: var(--primary, #6366f1);
  }
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
    <PageBackground>
      <GlassCard>
        <HeroSection>
          <Badge>Plataforma inteligente de finanças</Badge>
          <HeroTitle>Clareza financeira desde o primeiro acesso.</HeroTitle>
          <HeroSubtitle>
            Acompanhe entradas, saídas e projeções em um painel moderno com visualizações
            em tempo real e alertas inteligentes.
          </HeroSubtitle>
          <FeatureGrid>
            <FeatureCard>
              <FeatureIcon>
                <FiShield />
              </FeatureIcon>
              <strong>Segurança avançada</strong>
              <span>Infra estrutura com autenticação segura e monitoramento contínuo.</span>
            </FeatureCard>
            <FeatureCard>
              <FeatureIcon>
                <FiTrendingUp />
              </FeatureIcon>
              <strong>Insights imediatos</strong>
              <span>Dashboards e relatórios com a nova identidade visual do sistema.</span>
            </FeatureCard>
            <FeatureCard>
              <FeatureIcon>
                <FiClock />
              </FeatureIcon>
              <strong>Configuração rápida</strong>
              <span>Importe dados existentes sem perder o histórico legado.</span>
            </FeatureCard>
          </FeatureGrid>
        </HeroSection>

        <LoginPanel>
          <Brand>
            <LogoText>johntec</LogoText>
            <Subtitle>Entre para acessar seu cockpit financeiro.</Subtitle>
          </Brand>
          <Title>Boas-vindas de volta</Title>
          <Form onSubmit={handleLogin}>
            <Input
              type="email"
              placeholder="Seu email corporativo"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <Input
              type="password"
              placeholder="Senha"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <Button type="submit">Entrar</Button>
          </Form>
          <ForgotPasswordLink to="/forgot-password">Esqueceu sua senha?</ForgotPasswordLink>
          <StyledLink to="/register">Criar uma nova conta</StyledLink>
          <Footer>
            © {new Date().getFullYear()} JOHNTEC • <a href="mailto:johntec.ads@gmail.com">johntec.ads@gmail.com</a>
          </Footer>
        </LoginPanel>
      </GlassCard>
    </PageBackground>
  );
}

export default Login;
