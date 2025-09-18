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

  /* Cards e modais com sombra */
  .card, .modal, [data-card] {
    box-shadow: var(--shadow);
    border-radius: 12px;
    background: var(--card-bg);
    transition: box-shadow 0.2s, background 0.2s;
  }

  /* Joyride tooltip moderno e compacto */
  .react-joyride__tooltip {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    font-size: 1rem;
    max-width: 380px;
    padding: 1.1rem 1.2rem;
    border-radius: 16px;
    box-shadow: 0 4px 24px rgba(0,0,0,0.18);
    word-break: break-word;
    text-align: center;
  }
  .react-joyride__tooltip-content {
    width: 100%;
    margin-bottom: 0.7rem;
    text-align: center;
  }
  .react-joyride__tooltip-footer {
    display: flex;
    flex-direction: row;
    gap: 0.5rem;
    align-items: center;
    justify-content: space-between;
    width: 100%;
    margin-top: 0.2rem;
  }
  .react-joyride__tooltip-footer button {
    flex-shrink: 0;
  }
  @media (max-width: 600px) {
    .react-joyride__tooltip {
      font-size: 0.92rem;
      max-width: 95vw;
      padding: 0.7rem 0.5rem;
    }
    .react-joyride__tooltip-content {
      margin-bottom: 0.5rem;
    }
    .react-joyride__tooltip-footer button {
      font-size: 0.95em;
      padding: 0.4rem 0.7rem;
    }
  }
`;
