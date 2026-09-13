import React, { useLayoutEffect } from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

function AppRoot() {
  useLayoutEffect(() => {
    document.body.classList.remove('app-loading');
  }, []);

  return <App />;
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <AppRoot />
  </React.StrictMode>
);
