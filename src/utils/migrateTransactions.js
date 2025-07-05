import { collection, getDocs, doc, writeBatch } from 'firebase/firestore';
import { db } from '../services/firebase';

/**
 * Migra transações do formato legado para o formato aninhado por usuário
 * ATENÇÃO: Execute este script apenas uma vez e com cuidado!
 */
export const migrateUserTransactions = async (userId) => {
  try {
    console.log(`Iniciando migração de transações para o usuário: ${userId}`);
    
    // Buscar todas as transações legadas do usuário
    const legacyTransactionsRef = collection(db, 'transactions');
    const querySnapshot = await getDocs(legacyTransactionsRef);
    
    const userTransactions = [];
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      if (data.userId === userId) {
        userTransactions.push({
          id: doc.id,
          ...data
        });
      }
    });

    if (userTransactions.length === 0) {
      console.log('Nenhuma transação encontrada para migrar.');
      return;
    }

    console.log(`Encontradas ${userTransactions.length} transações para migrar.`);

    // Criar transações no novo formato
    const newTransactionsRef = collection(db, 'users', userId, 'transactions');
    const batch = writeBatch(db);
    
    for (const transaction of userTransactions) {
      const { id, ...transactionData } = transaction;
      
      // Adicionar classId se não existir (usar uma classe padrão)
      if (!transactionData.classId) {
        transactionData.classId = 'default';
        transactionData.className = 'Contabilidade Geral';
      }
      
      // Criar documento no novo local
      const newDocRef = doc(newTransactionsRef);
      batch.set(newDocRef, {
        ...transactionData,
        migratedAt: new Date(),
        originalId: id
      });
    }

    // Executar a migração
    await batch.commit();
    console.log('Migração concluída com sucesso!');
    
    // ATENÇÃO: Descomente as linhas abaixo apenas se tiver certeza de que quer deletar as transações legadas
    /*
    console.log('Deletando transações legadas...');
    const deleteBatch = writeBatch(db);
    
    for (const transaction of userTransactions) {
      const legacyDocRef = doc(db, 'transactions', transaction.id);
      deleteBatch.delete(legacyDocRef);
    }
    
    await deleteBatch.commit();
    console.log('Transações legadas deletadas.');
    */
    
    return {
      success: true,
      migratedCount: userTransactions.length
    };
    
  } catch (error) {
    console.error('Erro durante a migração:', error);
    return {
      success: false,
      error: error.message
    };
  }
};

/**
 * Verifica se há transações no formato legado para um usuário
 */
export const checkLegacyTransactions = async (userId) => {
  try {
    const legacyTransactionsRef = collection(db, 'transactions');
    const querySnapshot = await getDocs(legacyTransactionsRef);
    
    let count = 0;
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      if (data.userId === userId) {
        count++;
      }
    });

    return {
      hasLegacyTransactions: count > 0,
      count
    };
  } catch (error) {
    console.error('Erro ao verificar transações legadas:', error);
    return {
      hasLegacyTransactions: false,
      count: 0,
      error: error.message
    };
  }
};
