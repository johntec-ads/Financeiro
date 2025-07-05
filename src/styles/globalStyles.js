import { createGlobalStyle } from 'styled-components';

export const GlobalStyle = createGlobalStyle`
  :root {
    --primary: #2E7D32;
    --primary-hover: #1B5E20;
    --primary-light: #E8F5E8;
    --secondary: #1565C0;
    --danger: #C62828;
    --danger-hover: #B71C1C;
    --danger-light: #FFEBEE;
    --warning: #F9A825;
    --success: #2E7D32;
    --success-light: #E8F5E8;
    --background: #F5F5F5;
    --bg-secondary: #FAFAFA;
    --text: #333333;
    --text-secondary: #666666;
    --card-bg: #FFFFFF;
    --border: #E0E0E0;
    --mobile-padding: 1rem;
    --tablet-padding: 1.5rem;
    --desktop-padding: 2rem;
  }

  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
    font-family: 'Roboto', sans-serif;
  }

  body {
    background-color: var(--background);
    color: var(--text);
    min-height: 100vh;
  }

  button {
    cursor: pointer;
    transition: filter 0.2s;

    &:hover {
      filter: brightness(0.9);
    }
  }

  @media (max-width: 768px) {
    html {
      font-size: 87.5%; // 14px
    }
  }

  @media (max-width: 480px) {
    html {
      font-size: 81.25%; // 13px
    }
  }
`;
