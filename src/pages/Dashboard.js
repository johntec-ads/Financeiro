import { useEffect, useState } from 'react';
import { auth } from '../services/firebase';
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

const Message = styled.p`
  color: red;
  margin-bottom: 10px;
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

function Dashboard() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [needsPasswordUpdate, setNeedsPasswordUpdate] = useState(false);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(user => {
      if (user) {
        setUser(user);
        // Verificar se a senha precisa ser atualizada
        if (!isStrongPassword(user.password)) {
          setNeedsPasswordUpdate(true);
        }
      } else {
        navigate('/');
      }
    });

    return () => unsubscribe();
  }, [navigate]);

  const handleLogout = () => {
    auth.signOut();
    navigate('/');
  };

  const handleChangePassword = () => {
    // Redirecionar para a página de alterar senha
    navigate('/change-password');
  };

  const isStrongPassword = (password) => {
    if (!password) return false;
    if (password.length < 6) return false;
    if (!/[A-Z]/.test(password)) return false;
    if (!/[a-z]/.test(password)) return false;
    if (!/[0-9]/.test(password)) return false;
    return true;
  };

  return (
    <Container>
      <Title>Dashboard</Title>
      <p>Bem vindo, {user?.email}</p>
      {needsPasswordUpdate && (
        <>
          <Message>Sua senha é considerada fraca. Por favor, altere-a para uma senha mais segura.</Message>
          <Button onClick={handleChangePassword}>Alterar Senha</Button>
        </>
      )}
      <Button onClick={handleLogout}>Sair</Button>
    </Container>
  );
}

export default Dashboard;
