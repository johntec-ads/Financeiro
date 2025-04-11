// Script específico para lidar com a navegação inicial e botões de entrada

document.addEventListener('DOMContentLoaded', function() {
  console.log('Script de inicialização carregado');
  
  // Referências aos elementos principais
  const enterAppBtn = document.getElementById('enter-app');
  const welcomeScreen = document.getElementById('welcome-screen');
  const appContainer = document.getElementById('app-container');
  
  // Verificar se os elementos existem
  if (!enterAppBtn) console.error('Botão entrar não encontrado!');
  if (!welcomeScreen) console.error('Tela de boas-vindas não encontrada!');
  if (!appContainer) console.error('Container do app não encontrado!');
  
  // Função específica para entrar na aplicação
  function enterApplication() {
    console.log("Entrando na aplicação...");
    if (welcomeScreen && appContainer) {
      // Garante que a tela de boas-vindas seja completamente ocultada
      welcomeScreen.style.display = 'none';
      welcomeScreen.classList.add('hidden-section');
      
      // Garante que o app container seja exibido corretamente
      appContainer.style.display = 'flex';
      appContainer.classList.remove('hidden-section');
      
      // Inicializa na seção dashboard
      const dashboardSection = document.getElementById('dashboard-section');
      if (dashboardSection) {
        document.querySelectorAll('.content-section').forEach(section => {
          section.style.display = 'none';
          section.classList.add('hidden-section');
        });
        
        dashboardSection.style.display = 'block';
        dashboardSection.classList.remove('hidden-section');
      }
      
      // Salva preferência do usuário
      localStorage.setItem('skipWelcome', 'true');
      console.log("Preferência salva no localStorage");
    } else {
      console.error("Não foi possível entrar na aplicação: elementos não encontrados");
    }
  }
  
  // Adicionar evento ao botão de forma direta
  if (enterAppBtn) {
    enterAppBtn.addEventListener('click', function(e) {
      console.log('Evento de clique detectado no botão entrar');
      e.preventDefault();
      enterApplication();
    });
    console.log("Evento de clique registrado no botão entrar");
  }
  
  // Estado inicial - garantir que apenas uma seção esteja visível
  if (welcomeScreen && appContainer) {
    if (localStorage.getItem('skipWelcome') === 'true') {
      // Exibe a aplicação diretamente
      welcomeScreen.style.display = 'none';
      welcomeScreen.classList.add('hidden-section');
      appContainer.style.display = 'flex';
      appContainer.classList.remove('hidden-section');
    } else {
      // Exibe a tela de boas-vindas
      welcomeScreen.style.display = 'flex';
      welcomeScreen.classList.remove('hidden-section');
      appContainer.style.display = 'none';
      appContainer.classList.add('hidden-section');
    }
  }
});
