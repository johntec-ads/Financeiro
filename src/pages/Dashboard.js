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

const Button = styled.button`
  padding: 10px 15px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  margin: 5px 0;  // Adicionar margem vertical

  &:hover {
    background-color: #0056b3;
  }
`;

function Dashboard() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(user => {
      if (user) {
        setUser(user);
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

  return (
    <Container>
      <Title>Dashboard</Title>
      <p>Bem vindo, {user?.email}</p>
      <Button onClick={handleLogout}>Sair</Button>
    </Container>
  );
}

export default Dashboard;
