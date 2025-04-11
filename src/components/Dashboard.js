// Função executada quando o DOM está totalmente carregado
document.addEventListener('DOMContentLoaded', function() {
  // Inicializa os elementos da interface
  console.log("DOM carregado, inicializando UI...");
  initUI();
});

function initUI() {
  console.log("Iniciando UI...");
  
  // Elementos principais da interface
  const welcomeScreen = document.getElementById('welcome-screen');
  const appContainer = document.getElementById('app-container');
  const enterAppBtn = document.getElementById('enter-app');
  const welcomeInstallBtn = document.getElementById('welcome-install-button');
  const menuButton = document.getElementById('menu-button');
  const closeMenuBtn = document.getElementById('close-menu-button'); // Corrigido ID
  const sideMenu = document.getElementById('side-menu');
  const overlay = document.getElementById('overlay');
  const logoutButton = document.getElementById('logout-button');

  // Verificar se elementos existem e registrar para debug
  const elementos = [
    { nome: 'welcomeScreen', elemento: welcomeScreen },
    { nome: 'appContainer', elemento: appContainer },
    { nome: 'enterAppBtn', elemento: enterAppBtn },
    { nome: 'welcomeInstallBtn', elemento: welcomeInstallBtn },
    { nome: 'menuButton', elemento: menuButton },
    { nome: 'closeMenuBtn', elemento: closeMenuBtn },
    { nome: 'sideMenu', elemento: sideMenu },
    { nome: 'overlay', elemento: overlay },
    { nome: 'logoutButton', elemento: logoutButton }
  ];

  elementos.forEach(({ nome, elemento }) => {
    if (!elemento) {
      console.warn(`Elemento ${nome} não encontrado!`);
    }
  });

  // Configura evento para entrar na aplicação
  if (enterAppBtn) {
    enterAppBtn.addEventListener('click', () => {
      console.log("Botão ENTRAR clicado!");
      if (welcomeScreen) welcomeScreen.style.display = 'none';
      if (appContainer) appContainer.style.display = 'flex';
      // Salva preferência do usuário
      localStorage.setItem('skipWelcome', 'true');
    });
  }

  // Configura evento para o botão de instalação na tela de boas-vindas
  if (welcomeInstallBtn) {
    welcomeInstallBtn.addEventListener('click', () => {
      const installContainer = document.getElementById('install-container');
      if (installContainer) {
        installContainer.style.display = 'flex';
      } else {
        console.warn('Modal de instalação não encontrado!');
      }
    });
  }

  // Configura evento para abrir o menu lateral
  if (menuButton && sideMenu && overlay) {
    menuButton.addEventListener('click', () => {
      sideMenu.classList.add('active');
      overlay.style.display = 'block';
    });
  }

  // Configura evento para fechar o menu lateral
  if (closeMenuBtn && sideMenu && overlay) {
    closeMenuBtn.addEventListener('click', () => {
      sideMenu.classList.remove('active');
      overlay.style.display = 'none';
    });
  }

  // Fecha o menu se clicar no overlay
  if (overlay && sideMenu) {
    overlay.addEventListener('click', () => {
      sideMenu.classList.remove('active');
      overlay.style.display = 'none';
      
      // Também fecha o modal de instalação se estiver aberto
      const installContainer = document.getElementById('install-container');
      if (installContainer) {
        installContainer.style.display = 'none';
      }
    });
  }

  // Configura evento para logout
  if (logoutButton && welcomeScreen && appContainer) {
    logoutButton.addEventListener('click', (e) => {
      e.preventDefault();
      // Limpa dados do localStorage se necessário
      localStorage.removeItem('skipWelcome');
      // Redireciona para a tela de boas-vindas
      welcomeScreen.style.display = 'flex';
      appContainer.style.display = 'none';
      // Fecha o menu lateral
      if (sideMenu) sideMenu.classList.remove('active');
      if (overlay) overlay.style.display = 'none';
    });
  }

  // Configura eventos para o modal de instalação
  const installContainer = document.getElementById('install-container');
  const closeInstallBtn = document.getElementById('close-install-button'); // Corrigido ID
  const cancelInstallBtn = document.getElementById('cancel-install');
  
  // Fecha o modal ao clicar no botão fechar
  if (closeInstallBtn && installContainer) {
    closeInstallBtn.addEventListener('click', () => {
      installContainer.style.display = 'none';
    });
  }
  
  // Fecha o modal ao clicar no botão "Continuar no navegador"
  if (cancelInstallBtn && installContainer) {
    cancelInstallBtn.addEventListener('click', () => {
      installContainer.style.display = 'none';
      // Se estiver na tela de boas-vindas, entra na aplicação
      if (welcomeScreen && appContainer && welcomeScreen.style.display !== 'none') {
        welcomeScreen.style.display = 'none';
        appContainer.style.display = 'flex';
      }
    });
  }
  
  // Verifica se deve pular a tela de boas-vindas
  if (welcomeScreen && appContainer && localStorage.getItem('skipWelcome') === 'true') {
    console.log("Pulando tela de boas-vindas conforme localStorage");
    welcomeScreen.style.display = 'none';
    appContainer.style.display = 'flex';
  }

  // Adiciona navegação para os cards da dashboard
  const cardButtons = document.querySelectorAll('.card-button');
  
  if (cardButtons && cardButtons.length > 0) {
    cardButtons.forEach(button => {
      button.addEventListener('click', function() {
        const section = this.getAttribute('data-section');
        console.log(`Navegando para seção: ${section}`);
        
        navigateToSection(section);
      });
    });
  }
  
  // Configurar navegação para os links do menu lateral
  const menuLinks = document.querySelectorAll('.menu-nav a');
  
  if (menuLinks && menuLinks.length > 0) {
    menuLinks.forEach(link => {
      link.addEventListener('click', function(e) {
        // Não navega para o logout
        if (this.id === 'logout-button') return;
        
        e.preventDefault();
        
        const href = this.getAttribute('href');
        const section = href.replace('#', '');
        
        console.log(`Menu: Navegando para seção: ${section}`);
        
        navigateToSection(section);
        
        // Fecha o menu lateral após navegar
        if (sideMenu && overlay) {
          sideMenu.classList.remove('active');
          overlay.style.display = 'none';
        }
      });
    });
  }

  // Configurar navegação para os botões de voltar
  const backButtons = document.querySelectorAll('.back-button');
  
  if (backButtons && backButtons.length > 0) {
    backButtons.forEach(button => {
      button.addEventListener('click', function() {
        const section = this.getAttribute('data-section');
        console.log(`Voltando para seção: ${section}`);
        
        navigateToSection(section);
      });
    });
  }
}

// Função centralizada para navegação entre seções
function navigateToSection(section) {
  // Garante que a tela de boas-vindas não seja exibida quando estiver navegando nas seções
  const welcomeScreen = document.getElementById('welcome-screen');
  if (welcomeScreen) {
    welcomeScreen.style.display = 'none';
  }
  
  // Garante que o app container esteja visível
  const appContainer = document.getElementById('app-container');
  if (appContainer) {
    appContainer.style.display = 'flex';
    appContainer.classList.remove('hidden-section');
  }
  
  // Oculta todas as seções primeiro
  const allSections = document.querySelectorAll('.content-section');
  if (allSections && allSections.length > 0) {
    allSections.forEach(sec => {
      sec.style.display = 'none';
      sec.classList.add('hidden-section');
    });
  }
  
  // Mostra apenas a seção desejada
  const targetSection = document.getElementById(`${section}-section`);
  if (targetSection) {
    targetSection.style.display = 'block';
    targetSection.classList.remove('hidden-section');
    
    // Atualiza título da página
    const pageTitle = document.getElementById('page-title');
    if (pageTitle) {
      pageTitle.textContent = section.charAt(0).toUpperCase() + section.slice(1);
    }
    
    // Garante que a página role para o topo quando mudar de seção
    window.scrollTo(0, 0);
  } else {
    console.error(`Seção ${section} não encontrada!`);
    // Se a seção não existir, volta para o dashboard
    const dashboardSection = document.getElementById('dashboard-section');
    if (dashboardSection) {
      dashboardSection.style.display = 'block';
      dashboardSection.classList.remove('hidden-section');
      
      const pageTitle = document.getElementById('page-title');
      if (pageTitle) pageTitle.textContent = 'Dashboard';
    }
  }
}

// Função que pode ser chamada para mostrar conteúdo condicional
function updateUIBasedOnInstallState(isInstalled) {
  console.log("Atualizando UI com base no estado de instalação:", isInstalled);
  const installButtonHeader = document.getElementById('install-button');
  const installButtonWelcome = document.getElementById('welcome-install-button');

  // Verifica se a variável isInstalled é verdadeira
  if (isInstalled === true) {
    // Esconde os botões de instalação se o app estiver instalado
    if (installButtonHeader) {
      installButtonHeader.style.display = 'none';
      installButtonHeader.classList.add('hidden-section');
    }
    if (installButtonWelcome) {
      installButtonWelcome.style.display = 'none';
      installButtonWelcome.classList.add('hidden-section');
    }
    console.log("Botões de instalação ocultos.");
  } else {
    // Garante que os botões sejam exibidos se o app não estiver instalado
    if (installButtonHeader) {
      installButtonHeader.style.display = 'inline-block';
      installButtonHeader.classList.remove('hidden-section');
    }
    if (installButtonWelcome) {
      installButtonWelcome.style.display = 'inline-block';
      installButtonWelcome.classList.remove('hidden-section');
    }
    console.log("Botões de instalação exibidos.");
  }
}