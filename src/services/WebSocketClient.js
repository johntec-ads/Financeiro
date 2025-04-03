class WebSocketClient {
  constructor() {
    this.connect();
  }

  connect() {
    try {
      this.ws = new WebSocket('ws://localhost:3000/ws');
      
      this.ws.onopen = () => {
        console.log('Conexão WebSocket estabelecida');
      };

      this.ws.onerror = (error) => {
        console.log('Erro na conexão WebSocket:', error);
        this.reconnect();
      };

      this.ws.onclose = () => {
        console.log('Conexão WebSocket fechada');
        this.reconnect();
      };
    } catch (error) {
      console.error('Erro ao criar conexão WebSocket:', error);
      this.reconnect();
    }
  }

  reconnect() {
    setTimeout(() => {
      this.connect();
    }, 5000); // Tenta reconectar a cada 5 segundos
  }
}

export default new WebSocketClient();
