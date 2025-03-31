import React from 'react';
import { Helmet, HelmetProvider } from 'react-helmet-async';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Register from './pages/Register';
import ForgotPassword from './pages/ForgotPassword';
import Analytics from './pages/Analytics';
import { AuthProvider } from './context/AuthContext';
import { GlobalStyle } from './styles/globalStyles';

function App() {
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
        <Router>
          <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/analytics" element={<Analytics />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
          </Routes>
        </Router>
      </AuthProvider>
    </HelmetProvider>
  );
}

export default App;
