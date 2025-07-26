
/**
 * Hook para detectar e oferecer migração de dados legados
 */
const useLegacyDataMigration = () => {
  // Hook desabilitado: nunca exibe banner/modal, nunca marca status de migração
  return {
    hasLegacyData: false,
    legacyTransactions: [],
    migrateLegacyData: async () => ({ success: false, error: 'Migração desabilitada' }),
    loading: false,
    legacyCount: 0
  };
};

export default useLegacyDataMigration;
