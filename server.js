const express = require('express');
const WebSocket = require('ws');
const app = express();

// Configuração do servidor HTTP
const server = app.listen(3000, () => {
  console.log('Servidor rodando na porta 3000');
});

// Configuração do WebSocket Server
const wss = new WebSocket.Server({ server: server, path: '/ws' });

wss.on('connection', (ws) => {
  console.log('Nova conexão WebSocket estabelecida');

  ws.on('message', (message) => {
    console.log('Mensagem recebida:', message);
  });
});
