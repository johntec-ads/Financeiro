import { db } from '../services/firebase';
import { collection, getDocs, query, writeBatch, doc } from 'firebase/firestore';

export const migrateFromClassesToTypes = async (userId) => {
  try {
    // 1. Buscar todas as classes do usuário
    const classesRef = collection(db, 'users', userId, 'classes');
    const classesSnapshot = await getDocs(query(classesRef));
    
    // 2. Criar um mapeamento de classes para tipos
    const classToTypeMap = new Map();
    classesSnapshot.docs.forEach(doc => {
      const classData = doc.data();
      // Mapear a classe para um tipo baseado no nome ou propósito
      // Por padrão, usar 'Outros' se não houver correspondência
      const type = determineType(classData.name);
      classToTypeMap.set(doc.id, type);
    });

    // 3. Atualizar todas as transações
    const batch = writeBatch(db);
    const transactionsRef = collection(db, 'users', userId, 'transactions');
    const transactionsSnapshot = await getDocs(query(transactionsRef));

    transactionsSnapshot.docs.forEach(doc => {
      const transaction = doc.data();
      if (transaction.classId) {
        const type = classToTypeMap.get(transaction.classId) || 'Outros';
        const transactionRef = doc.ref;
        
        batch.update(transactionRef, {
          type: type,          // Adiciona o novo campo type
          classId: null        // Remove a referência à classe
        });
      }
    });

    // 4. Executar as atualizações em batch
    await batch.commit();

    return { success: true, message: 'Migração concluída com sucesso' };
  } catch (error) {
    console.error('Erro na migração:', error);
    return { success: false, message: error.message };
  }
};

// Função auxiliar para determinar o tipo baseado no nome da classe
const determineType = (className) => {
  const lowerClassName = className.toLowerCase();
  
  if (lowerClassName.includes('pessoal')) return 'Pessoal';
  if (lowerClassName.includes('trabalho') || lowerClassName.includes('negocio')) return 'Trabalho';
  if (lowerClassName.includes('familia')) return 'Família';
  if (lowerClassName.includes('investimento')) return 'Investimentos';
  
  return 'Outros';
};