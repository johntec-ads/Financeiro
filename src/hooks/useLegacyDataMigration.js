import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useClasses } from '../context/ClassContext';
import { collection, getDocs, query, where, addDoc } from 'firebase/firestore';
import { db } from '../services/firebase';

/**
 * Hook para detectar e oferecer migração de dados legados
 */
const useLegacyDataMigration = () => {
  const { currentUser } = useAuth();
  const { activeClass } = useClasses();
  const [legacyTransactions, setLegacyTransactions] = useState([]);
  const [hasLegacyData, setHasLegacyData] = useState(false);
  const [loading, setLoading] = useState(false);

  // Verificar se há dados legados
  useEffect(() => {
    if (!currentUser) return;

    // Verificar se já foi processado (migrado ou pulado)
    const migrationStatus = localStorage.getItem(`migrated_${currentUser.uid}`);
    if (migrationStatus === 'true' || migrationStatus === 'skipped') {
      console.log(`🔄 Migração já processada: ${migrationStatus}`);
      return;
    }

    const checkLegacyData = async () => {
      try {
        console.log('🔍 Hook: Verificando dados legados...');
        console.log(`   👤 UserId: ${currentUser.uid}`);
        
        const legacyTransactionsRef = collection(db, 'transactions');
        console.log(`   📂 Referência da coleção: ${legacyTransactionsRef.path}`);
        
        // Primeiro verificar se a coleção existe
        console.log('   🔍 Tentando buscar todas as transações da coleção...');
        const allSnapshot = await getDocs(legacyTransactionsRef);
        console.log(`   📦 Total de documentos na coleção: ${allSnapshot.size}`);
        
        if (allSnapshot.size === 0) {
          console.log('   ℹ️ Coleção transactions está vazia ou não existe');
          return;
        }
        
        // Agora fazer a query filtrada
        console.log(`   🎯 Buscando transações do usuário ${currentUser.uid}...`);
        const q = query(legacyTransactionsRef, where('userId', '==', currentUser.uid));
        const snapshot = await getDocs(q);
        
        const transactions = [];
        snapshot.forEach(doc => {
          transactions.push({ id: doc.id, ...doc.data() });
        });

        console.log(`📦 Hook: Encontradas ${transactions.length} transações legadas`);
        console.log(`   📊 Query filtrada retornou: ${snapshot.size} documentos`);

        if (transactions.length > 0) {
          console.log('   📄 Primeira transação encontrada:');
          console.table(transactions[0]);
          
          setLegacyTransactions(transactions);
          setHasLegacyData(true);
          console.log('✅ Hook: Banner de migração será exibido');
        } else {
          console.log('ℹ️ Hook: Nenhuma transação legada encontrada para este usuário');
          
          // Diagnóstico adicional - verificar se há transações com outros campos
          console.log('   🔍 Verificando transações com outros campos de usuário...');
          const allDocs = [];
          allSnapshot.forEach(doc => {
            allDocs.push({ id: doc.id, ...doc.data() });
          });
          
          const possibleUserTransactions = allDocs.filter(doc => 
            doc.uid === currentUser.uid || 
            doc.user === currentUser.uid ||
            doc.userEmail === currentUser.email
          );
          
          if (possibleUserTransactions.length > 0) {
            console.log(`   ⚠️ Encontradas ${possibleUserTransactions.length} transações com outros campos de usuário`);
            console.log('   📄 Primeira transação com campo alternativo:');
            console.table(possibleUserTransactions[0]);
          }
        }
      } catch (error) {
        console.error('❌ Hook: Erro ao verificar dados legados:', error);
      }
    };

    checkLegacyData();
  }, [currentUser]);

  // Migrar dados automaticamente
  const migrateLegacyData = async () => {
    if (!activeClass || legacyTransactions.length === 0) {
      console.log('❌ Migração cancelada:', { 
        activeClass: !!activeClass, 
        legacyCount: legacyTransactions.length 
      });
      return { success: false, error: 'Nenhum dado para migrar ou classe ativa não encontrada' };
    }

    console.log(`🚀 Iniciando migração de ${legacyTransactions.length} transações...`);
    setLoading(true);

    try {
      const newTransactionsRef = collection(db, 'users', currentUser.uid, 'transactions');
      
      let migratedCount = 0;
      
      // Migrar cada transação individualmente (mais seguro)
      for (const transaction of legacyTransactions) {
        const { id, ...transactionData } = transaction;
        
        console.log(`📝 Migrando transação ${migratedCount + 1}:`, {
          id,
          description: transactionData.description,
          value: transactionData.value,
          hasClassId: !!transactionData.classId
        });
        
        // Adicionar classId se não existir
        if (!transactionData.classId) {
          transactionData.classId = activeClass.id;
          transactionData.className = activeClass.name;
          console.log(`➕ Adicionando classe: ${activeClass.name} (${activeClass.id})`);
        }
        
        // Adicionar metadados de migração
        transactionData.migratedAt = new Date();
        transactionData.originalId = id;
        transactionData.migratedFrom = 'legacy';
        
        try {
          const docRef = await addDoc(newTransactionsRef, transactionData);
          console.log(`✅ Transação migrada com ID: ${docRef.id}`);
          migratedCount++;
        } catch (docError) {
          console.error(`❌ Erro ao migrar transação ${id}:`, docError);
        }
      }

      console.log(`🎉 Migração concluída! ${migratedCount}/${legacyTransactions.length} transações migradas`);
      
      // Marcar como migrado
      localStorage.setItem(`migrated_${currentUser.uid}`, 'true');
      
      // Limpar estado local
      setHasLegacyData(false);
      setLegacyTransactions([]);
      
      return { success: true, count: migratedCount };
    } catch (error) {
      console.error('❌ Erro geral na migração:', error);
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  };

  return {
    hasLegacyData,
    legacyTransactions,
    migrateLegacyData,
    loading,
    legacyCount: legacyTransactions.length
  };
};

export default useLegacyDataMigration;
