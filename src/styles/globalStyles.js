import { createGlobalStyle } from 'styled-components';

export const GlobalStyle = createGlobalStyle`
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');

  :root {
    /* Modern Fintech Palette */
    --primary: #6366f1; /* Indigo 500 */
    --primary-hover: #4f46e5; /* Indigo 600 */
    --primary-light: #e0e7ff; /* Indigo 100 */
    
    --secondary: #10b981; /* Emerald 500 */
    --secondary-hover: #059669; /* Emerald 600 */
    
    --danger: #ef4444; /* Red 500 */
    --danger-hover: #dc2626; /* Red 600 */
    --danger-light: #fee2e2; /* Red 100 */
    
    --warning: #f59e0b; /* Amber 500 */
    --success: #10b981; /* Emerald 500 */
    --success-light: #d1fae5; /* Emerald 100 */
    
    --background: #f8fafc; /* Slate 50 */
    --bg-secondary: #f1f5f9; /* Slate 100 */
    
    --text: #1e293b; /* Slate 800 */
    --text-secondary: #64748b; /* Slate 500 */
    
    --card-bg: #ffffff;
    --border: #e2e8f0; /* Slate 200 */
    
    --shadow-sm: 0 1px 2px 0 rgb(0 0 0 / 0.05);
    --shadow-md: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1);
    --shadow-lg: 0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1);
    
    --radius-sm: 0.375rem;
    --radius-md: 0.5rem;
    --radius-lg: 1rem;
    --radius-xl: 1.5rem;

    --mobile-padding: 1rem;
    --tablet-padding: 1.5rem;
    --desktop-padding: 2rem;
  }

  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
    font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
  }

  body {
    background-color: var(--background);
    color: var(--text);
    min-height: 100vh;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }

  button {
    cursor: pointer;
    transition: all 0.2s ease-in-out;
    font-family: 'Inter', sans-serif;

    &:hover {
      transform: translateY(-1px);
    }
    
    &:active {
      transform: translateY(0);
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
