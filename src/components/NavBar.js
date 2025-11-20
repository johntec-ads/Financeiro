import React from 'react';
import { NavLink } from 'react-router-dom';
import styled from 'styled-components';
import { FiGrid, FiPieChart } from 'react-icons/fi';
import UserInfo from './UserInfo';

const Nav = styled.nav`
  background-color: var(--card-bg);
  padding: 1rem 2rem;
  margin-bottom: 2rem;
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-sm);
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 1rem;
  border: 1px solid var(--border);

  @media (max-width: 768px) {
    padding: 1rem;
    flex-direction: column;
    gap: 1.5rem;
  }
`;

const NavList = styled.ul`
  display: flex;
  gap: 1rem;
  list-style: none;
  margin: 0;
  padding: 0;

  @media (max-width: 768px) {
    width: 100%;
    justify-content: center;
  }
`;

const StyledNavLink = styled(NavLink)`
  color: var(--text-secondary);
  text-decoration: none;
  padding: 0.75rem 1.25rem;
  border-radius: var(--radius-md);
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-weight: 500;

  &.active {
    background-color: var(--primary-light);
    color: var(--primary);
    font-weight: 600;
  }

  &:hover:not(.active) {
    background-color: var(--bg-secondary);
    color: var(--text);
  }
`;

const NavBar = () => {
  return (
    <Nav className="navbar">
      <NavList>
        <li>
          <StyledNavLink to="/dashboard">
            <FiGrid />
            <span>Dashboard</span>
          </StyledNavLink>
        </li>
        <li>
          <StyledNavLink to="/analytics" className="analytics-tab">
            <FiPieChart />
            <span>Análise</span>
          </StyledNavLink>
        </li>
      </NavList>
      <UserInfo />
    </Nav>
  );
};

export default NavBar;
