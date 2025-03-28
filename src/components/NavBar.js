import React from 'react';
import { NavLink } from 'react-router-dom';
import styled from 'styled-components';

const Nav = styled.nav`
  background-color: var(--card-bg);
  padding: 1rem;
  margin-bottom: 2rem;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
`;

const NavList = styled.ul`
  display: flex;
  gap: 2rem;
  list-style: none;
  justify-content: center;

  @media (max-width: 768px) {
    gap: 1rem;
  }
`;

const StyledNavLink = styled(NavLink)`
  color: var(--text);
  text-decoration: none;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  transition: all 0.2s;

  &.active {
    background-color: var(--primary);
    color: white;
  }

  &:hover {
    background-color: var(--primary-hover);
    color: white;
  }
`;

const NavBar = () => {
  return (
    <Nav>
      <NavList>
        <li><StyledNavLink to="/dashboard">Dashboard</StyledNavLink></li>
        <li><StyledNavLink to="/analytics">Análise</StyledNavLink></li>
      </NavList>
    </Nav>
  );
};

export default NavBar;
