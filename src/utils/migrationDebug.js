/**
 * Utilitários para debug e teste da migração
 * 
 * Para usar no console do navegador:
 * 
 * // Resetar status de migração
 * window.resetMigration()
 * 
 * // Verificar status atual
 * window.checkMigrationStatus()
 */

// Função para resetar o status de migração (para teste)
window.resetMigration = () => {
  const userId = localStorage.getItem('currentUserId'); // Ajuste conforme necessário
  if (userId) {
    localStorage.removeItem(`migrated_${userId}`);
    console.log('🔄 Status de migração resetado! Recarregue a página.');
  } else {
    // Tentar remover todos os possíveis
    Object.keys(localStorage).forEach(key => {
      if (key.startsWith('migrated_')) {
        localStorage.removeItem(key);
      }
    });
    console.log('🔄 Todos os status de migração foram resetados! Recarregue a página.');
  }
};

// Função para verificar status de migração
window.checkMigrationStatus = () => {
  const migrationKeys = Object.keys(localStorage).filter(key => key.startsWith('migrated_'));
  console.log('📊 Status de migração:', migrationKeys.map(key => ({
    key,
    value: localStorage.getItem(key)
  })));
};

// Função para verificar dados legados
window.checkLegacyData = async () => {
  // Esta função precisaria ser adaptada com base na estrutura do Firebase
  console.log('🔍 Para verificar dados legados, abra o console do Firebase.');
};

console.log('🛠️ Utilitários de migração carregados. Digite window.resetMigration() para resetar.');

export {}; // Para fazer este arquivo ser um módulo
