import React, { useState } from 'react';
import { Helmet, HelmetProvider } from 'react-helmet-async';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Register from './pages/Register';
import ForgotPassword from './pages/ForgotPassword';
import Analytics from './pages/Analytics';
import { AuthProvider } from './context/AuthContext';
import { GlobalStyle } from './styles/globalStyles';
import { AuthMiddleware, PublicOnlyMiddleware } from './middleware/AuthMiddleware';
import Joyride from 'react-joyride';
import styled from 'styled-components';

// Importar utilitários de debug em desenvolvimento
if (process.env.NODE_ENV === 'development') {
  import('./utils/migrationDebug');
  import('./utils/firestoreDiagnostic');
  import('./utils/legacyDiagnostic');
}

// Estilo customizado para o tooltip do Joyride
const CustomJoyrideStyles = {
  options: {
    zIndex: 9999,
    primaryColor: '#2E7D32',
    textColor: '#333',
    backgroundColor: '#fff',
    borderRadius: 24,
    padding: '1.2rem',
    fontSize: 16,
    width: 350,
    boxShadow: '0 4px 24px rgba(0,0,0,0.18)',
  },
  tooltip: {
    borderRadius: 24,
    padding: '1.2rem',
    fontSize: 16,
    maxWidth: 350,
    boxShadow: '0 4px 24px rgba(0,0,0,0.18)',
  },
  buttonNext: {
    backgroundColor: '#2E7D32',
    borderRadius: 8,
    fontWeight: 600,
    fontSize: 15,
    padding: '0.5rem 0.8rem',
  },
  buttonBack: {
    color: '#2E7D32',
    fontWeight: 600,
    fontSize: 15,
    padding: '0.5rem 0.8rem',
  },
  buttonSkip: {
    color: '#C62828',
    fontWeight: 600,
    fontSize: 15,
    padding: '0.5rem 0.8rem',
  },
};

// Media query para mobile
const isMobile = window.innerWidth <= 600;

function App() {
  const [runTutorial, setRunTutorial] = useState(true);
  const steps = [
    {
      target: '.joyride-tipo',
      content: isMobile ? 'Escolha Receita ou Despesa.' : 'Escolha se a transação é uma Receita (entrada) ou Despesa (saída).',
      disableBeacon: true,
    },
    {
      target: '.joyride-grupo',
      content: isMobile ? 'Selecione o grupo.' : 'Selecione o grupo ao qual essa transação pertence (ex: Pessoal, Trabalho, etc).',
    },
    {
      target: '.joyride-categoria',
      content: isMobile ? 'Escolha a categoria.' : 'Escolha a categoria para organizar melhor suas finanças.',
    },
    {
      target: '.joyride-valor',
      content: isMobile ? 'Informe o valor.' : 'Informe o valor da transação.',
    },
    {
      target: '.joyride-data',
      content: isMobile ? 'Escolha a data.' : 'Selecione o dia do vencimento ou recebimento.',
    },
    {
      target: '.joyride-descricao',
      content: isMobile ? 'Descrição (opcional).' : 'Adicione uma descrição para identificar melhor a transação (opcional).',
    },
    {
      target: '.add-transaction-btn',
      content: isMobile ? 'Salvar.' : 'Clique aqui para salvar a transação preenchida.',
    },
  ];

  const locale = {
    back: 'Voltar',
    close: 'Fechar',
    last: 'Finalizar',
    next: 'Próximo',
    skip: 'Pular',
  };

  return (
    <HelmetProvider>
      <AuthProvider>
        <Helmet>
          <link rel="icon" type="image/png" sizes="32x32" href="/icon-financeiro.png" />
          <link rel="icon" type="image/png" sizes="16x16" href="/icon-financeiro.png" />
          <link rel="apple-touch-icon" sizes="180x180" href="/icon-financeiro.png" />
          <meta name="theme-color" content="#2E7D32" />
          <title>Sistema Financeiro</title>
        </Helmet>
        <GlobalStyle />
        <Joyride
          steps={steps}
          run={runTutorial}
          continuous
          showSkipButton
          showProgress
          locale={locale}
          styles={CustomJoyrideStyles}
        />
        <Router>
          <Routes>
            <Route path="/" element={
              <PublicOnlyMiddleware>
                <Login />
              </PublicOnlyMiddleware>
            } />
            <Route path="/register" element={
              <PublicOnlyMiddleware>
                <Register />
              </PublicOnlyMiddleware>
            } />
            <Route path="/dashboard" element={
              <AuthMiddleware>
                <Dashboard />
              </AuthMiddleware>
            } />
            <Route path="/analytics" element={
              <AuthMiddleware>
                <Analytics />
              </AuthMiddleware>
            } />
            <Route path="/forgot-password" element={
              <PublicOnlyMiddleware>
                <ForgotPassword />
              </PublicOnlyMiddleware>
            } />
          </Routes>
        </Router>
      </AuthProvider>
    </HelmetProvider>
  );
}

export default App;
