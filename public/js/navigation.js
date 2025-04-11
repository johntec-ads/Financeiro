/**
 * Script para gerenciar navegação entre seções do aplicativo
 */

document.addEventListener('DOMContentLoaded', function() {
  initNavigation();
});

function initNavigation() {
  // Adicionar evento para botões "Voltar ao Dashboard"
  const backButtons = document.querySelectorAll('.back-button');
  backButtons.forEach(button => {
    button.addEventListener('click', function() {
      navigateToSection('dashboard');
    });
  });
  
  // Eventos para os botões de ação nas tabelas
  setupTableButtons();
}

// Script para lidar com a navegação entre seções

document.addEventListener('DOMContentLoaded', function() {
  console.log('Script de navegação carregado');

  // Função para observar alterações na hash da URL
  function handleHashChange() {
    const hash = window.location.hash || '#dashboard';
    const section = hash.substring(1); // Remove o "#" do início
    
    console.log(`Hash alterada para: ${hash}`);
    
    // Navega para a seção correspondente
    if (typeof navigateToSection === 'function') {
      navigateToSection(section);
    } else {
      console.error('Função navigateToSection não encontrada!');
    }
  }

  // Adiciona listener para mudanças na hash
  window.addEventListener('hashchange', handleHashChange);
  
  // Verifica a hash atual ao carregar a página
  handleHashChange();
  
  // Configura os links da navegação para alterar a hash da URL
  const navLinks = document.querySelectorAll('a[href^="#"]');
  
  navLinks.forEach(link => {
    // Ignora o botão de logout
    if (link.id === 'logout-button') return;
    
    link.addEventListener('click', function(e) {
      const href = this.getAttribute('href');
      
      // Não faz nada se o href for apenas "#"
      if (href === '#') return;
      
      console.log(`Link clicado: ${href}`);
      
      // Atualiza a URL sem recarregar a página
      if (history.pushState) {
        history.pushState(null, null, href);
        handleHashChange();
        e.preventDefault();
      }
    });
  });
});

function navigateToSection(sectionName) {
  console.log(`Navegando para: ${sectionName}`);
  
  // Esconder todas as seções
  document.querySelectorAll('.content-section').forEach(section => {
    section.style.display = 'none';
  });
  
  // Mostrar a seção requisitada
  const targetSection = document.getElementById(`${sectionName}-section`);
  if (targetSection) {
    targetSection.style.display = 'block';
    
    // Atualizar título da página
    const pageTitle = document.getElementById('page-title');
    if (pageTitle) {
      if (sectionName === 'dashboard') {
        pageTitle.textContent = 'Dashboard';
      } else {
        pageTitle.textContent = sectionName.charAt(0).toUpperCase() + sectionName.slice(1);
      }
    }
    
    // Rolar para o topo da página
    window.scrollTo(0, 0);
  } else {
    console.error(`Seção ${sectionName} não encontrada`);
    // Voltar para o dashboard como fallback
    const dashboardSection = document.getElementById('dashboard-section');
    if (dashboardSection) {
      dashboardSection.style.display = 'block';
    }
  }
}

function setupTableButtons() {
  // Configuração para botões de editar
  document.querySelectorAll('.edit-button').forEach(button => {
    button.addEventListener('click', function() {
      const row = this.closest('tr');
      const description = row.cells[0].textContent; // Ou obter ID/dados relevantes
      console.log(`Editar item: ${description}`);
      // TODO: Implementar lógica de edição (ex: abrir modal com dados da linha)
      // Exemplo: openEditModal(row.dataset.id);
    });
  });

  // Configuração para botões de excluir
  document.querySelectorAll('.delete-button').forEach(button => {
    button.addEventListener('click', function() {
      const row = this.closest('tr');
      const description = row.cells[0].textContent; // Ou obter ID/dados relevantes
      console.log(`Excluir item: ${description}`);
      // TODO: Implementar confirmação e lógica de exclusão (ex: abrir modal de confirmação)
      // Exemplo: openDeleteConfirmationModal(row.dataset.id, description);
    });
  });

  // Configuração para botões de detalhes
  document.querySelectorAll('.details-button').forEach(button => {
    button.addEventListener('click', function() {
      const row = this.closest('tr');
      const description = row.cells[0].textContent; // Ou obter ID/dados relevantes
      console.log(`Detalhes do item: ${description}`);
      // TODO: Implementar lógica de detalhes (ex: mostrar mais informações, navegar para outra view)
      // Exemplo: showItemDetails(row.dataset.id);
    });
  });
}
