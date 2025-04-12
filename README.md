# Financeiro - Sistema de Gestão Financeira

![Badge em Desenvolvimento](https://img.shields.io/badge/status-em%20desenvolvimento-brightgreen)

## 📋 Descrição do Projeto

O App Financeiro é uma aplicação web para gerenciamento de finanças pessoais ou empresariais, permitindo o controle de receitas, despesas, investimentos e relatórios financeiros.

## 🚀 Funcionalidades

- Cadastro de receitas e despesas
- Categorização de transações
- Visualização de gráficos e relatórios
- Controle de orçamento
- Dashboard personalizado

## 🛠️ Tecnologias Utilizadas

- [React](https://reactjs.org/) - Biblioteca JavaScript para construção de interfaces
- [JavaScript](https://developer.mozilla.org/pt-BR/docs/Web/JavaScript) - Linguagem de programação
- [CSS3](https://developer.mozilla.org/pt-BR/docs/Web/CSS) - Estilização
- [Node.js](https://nodejs.org/en/) - Ambiente de execução JavaScript

## 📦 Pré-requisitos

- Node.js (versão 14.x ou superior)
- npm (versão 6.x ou superior)
- Git

## 🔧 Instalação

```bash
# Clone este repositório
$ git clone https://github.com/seu-usuario/Financeiro.git

# Acesse a pasta do projeto
$ cd Financeiro

# Instale as dependências
$ npm install

# Configure as variáveis de ambiente
$ cp .env.example .env
# (Edite o arquivo .env com suas credenciais do Firebase)
```

## 🔐 Configuração do Firebase

Para garantir a segurança das chaves do Firebase:

1. Crie um arquivo `.env` baseado no exemplo fornecido (não incluído no repositório)
2. Adicione suas credenciais do Firebase neste arquivo
3. O arquivo `.env` já está incluído no `.gitignore` para evitar que credenciais sejam expostas

Exemplo de arquivo `.env`:
```
REACT_APP_FIREBASE_API_KEY=sua_chave_api
REACT_APP_FIREBASE_AUTH_DOMAIN=seu_dominio.firebaseapp.com
REACT_APP_FIREBASE_PROJECT_ID=seu_projeto_id
REACT_APP_FIREBASE_STORAGE_BUCKET=seu_bucket.appspot.com
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=seu_sender_id
REACT_APP_FIREBASE_APP_ID=seu_app_id
```

Nunca compartilhe ou cometa suas chaves do Firebase diretamente no código.

## 🚀 Scripts Disponíveis

No diretório do projeto, você pode executar:

### `npm start`

Executa o aplicativo no modo de desenvolvimento.\
Abra [http://localhost:3000](http://localhost:3000) para visualizá-lo no navegador.

A página será recarregada quando você fizer alterações.\
Você também pode ver erros de lint no console.

### `npm test`

Inicia o executor de teste no modo de observação interativo.\
Consulte a seção sobre [execução de testes](https://facebook.github.io/create-react-app/docs/running-tests) para mais informações.

### `npm run build`

Compila o aplicativo para produção na pasta `build`.\
O React é agrupado corretamente no modo de produção e a compilação é otimizada para obter o melhor desempenho.

A compilação é minificada e os nomes dos arquivos incluem os hashes.\
Seu aplicativo está pronto para ser implantado!

## 📁 Estrutura do Projeto

```
Financeiro/
├── public/
├── src/
│   ├── assets/
│   ├── components/
│   ├── pages/
│   ├── services/
│   ├── styles/
│   ├── utils/
│   ├── App.tsx
│   └── index.tsx
├── package.json
└── README.md
```

## 🤝 Como Contribuir

1. Faça um fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/nova-feature`)
3. Commit suas mudanças (`git commit -m 'Adiciona nova feature'`)
4. Push para a branch (`git push origin feature/nova-feature`)
5. Abra um Pull Request

## 📝 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

## 👨‍💻 Desenvolvedor

* **John Marcelo de Almeida** - [johntec-ads](https://github.com/johntec-ads)

---
⌨️ com ❤️ por [John Marcelo de Almeida](https://github.com/johntec-ads)
