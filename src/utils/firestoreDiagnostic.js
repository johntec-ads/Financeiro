/**
 * Utilitários para diagnosticar dados no Firestore
 * Use no console do navegador para investigar estruturas de dados
 */

import { collection, getDocs, query, where, doc, getDoc, deleteDoc } from 'firebase/firestore';
import { db } from '../services/firebase';

// Expor globalmente para uso no console
window.firestoreDiagnostic = {
  
  /**
   * Verificar todas as coleções de transações possíveis
   */
  async checkAllTransactionCollections(userId) {
    if (!userId) {
      console.error('❌ UserId é obrigatório');
      return;
    }

    console.log(`🔍 Iniciando diagnóstico completo para usuário: ${userId}`);
    
    const results = {};

    // 1. Verificar coleção legada: /transactions
    try {
      console.log('\n📂 Verificando coleção legada: /transactions');
      const legacyRef = collection(db, 'transactions');
      const legacyQuery = query(legacyRef, where('userId', '==', userId));
      const legacySnapshot = await getDocs(legacyQuery);
      
      const legacyTransactions = [];
      legacySnapshot.forEach(doc => {
        legacyTransactions.push({ id: doc.id, ...doc.data() });
      });
      
      results.legacy = legacyTransactions;
      console.log(`📦 Encontradas ${legacyTransactions.length} transações legadas`);
      
      if (legacyTransactions.length > 0) {
        console.log('📄 Amostra (primeira transação):');
        console.table(legacyTransactions[0]);
      }
    } catch (error) {
      console.error('❌ Erro ao verificar coleção legada:', error);
      results.legacyError = error.message;
    }

    // 2. Verificar coleção nova: /users/{userId}/transactions
    try {
      console.log('\n📂 Verificando coleção nova: /users/{userId}/transactions');
      const newRef = collection(db, 'users', userId, 'transactions');
      const newSnapshot = await getDocs(newRef);
      
      const newTransactions = [];
      newSnapshot.forEach(doc => {
        newTransactions.push({ id: doc.id, ...doc.data() });
      });
      
      results.new = newTransactions;
      console.log(`📦 Encontradas ${newTransactions.length} transações novas`);
      
      if (newTransactions.length > 0) {
        console.log('📄 Amostra (primeira transação):');
        console.table(newTransactions[0]);
      }
    } catch (error) {
      console.error('❌ Erro ao verificar coleção nova:', error);
      results.newError = error.message;
    }

    // 3. Verificar outras possíveis coleções
    const otherCollections = ['financeiro', 'transacoes', 'data', 'movements'];
    
    for (const collectionName of otherCollections) {
      try {
        console.log(`\n📂 Verificando coleção alternativa: /${collectionName}`);
        const altRef = collection(db, collectionName);
        const altSnapshot = await getDocs(altRef);
        
        const altTransactions = [];
        altSnapshot.forEach(doc => {
          const data = doc.data();
          // Verificar se parece ser do usuário
          if (data.userId === userId || data.uid === userId || data.user === userId) {
            altTransactions.push({ id: doc.id, ...data });
          }
        });
        
        if (altTransactions.length > 0) {
          results[collectionName] = altTransactions;
          console.log(`📦 Encontradas ${altTransactions.length} transações em /${collectionName}`);
          console.log('📄 Amostra:');
          console.table(altTransactions[0]);
        } else {
          console.log(`ℹ️ Nenhuma transação encontrada em /${collectionName}`);
        }
      } catch (error) {
        console.log(`⚠️ Erro ou permissão negada para /${collectionName}:`, error.message);
      }
    }

    // 4. Resumo final
    console.log('\n📊 RESUMO DO DIAGNÓSTICO:');
    console.table({
      'Coleção Legada (/transactions)': results.legacy?.length || 0,
      'Coleção Nova (/users/{id}/transactions)': results.new?.length || 0,
      'Outras Coleções': Object.keys(results).filter(k => !['legacy', 'new', 'legacyError', 'newError'].includes(k)).length
    });

    return results;
  },

  /**
   * Verificar estrutura específica de uma transação
   */
  async analyzeTransaction(collectionPath, docId) {
    try {
      const docRef = doc(db, collectionPath, docId);
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        const data = docSnap.data();
        console.log('📄 Estrutura da transação:');
        console.table(data);
        
        console.log('🔍 Campos presentes:');
        Object.keys(data).forEach(key => {
          console.log(`  ${key}: ${typeof data[key]} = ${data[key]}`);
        });
        
        return data;
      } else {
        console.log('❌ Documento não encontrado');
        return null;
      }
    } catch (error) {
      console.error('❌ Erro ao analisar transação:', error);
    }
  },

  /**
   * Verificar todas as coleções de nível raiz
   */
  async listAllRootCollections() {
    console.log('🔍 Listando todas as coleções de nível raiz...');
    
    const commonCollections = [
      'transactions', 'users', 'financeiro', 'transacoes', 'movimentacoes',
      'data', 'movements', 'finances', 'accounts', 'categories'
    ];
    
    for (const collectionName of commonCollections) {
      try {
        const ref = collection(db, collectionName);
        const snapshot = await getDocs(ref);
        
        if (!snapshot.empty) {
          console.log(`📂 /${collectionName}: ${snapshot.size} documentos`);
          
          // Mostrar amostra do primeiro documento
          const firstDoc = snapshot.docs[0];
          console.log(`   Exemplo:`, firstDoc.data());
        }
      } catch (error) {
        // Ignorar erros de permissão
        if (!error.message.includes('permission-denied')) {
          console.log(`⚠️ Erro em /${collectionName}:`, error.message);
        }
      }
    }
  },

  /**
   * Reset de migração para usuário específico
   */
  resetMigration(userId) {
    localStorage.removeItem(`migrated_${userId}`);
    console.log(`🔄 Status de migração resetado para usuário: ${userId}`);
    console.log('♻️ Recarregue a página para executar nova verificação');
  },

  /**
   * Tentar encontrar o userId do usuário atual de várias formas
   */
  findCurrentUserId() {
    console.log('🔍 Procurando userId do usuário atual...');
    
    // Método 1: Firebase Auth
    if (window.firebase?.auth?.currentUser) {
      const userId = window.firebase.auth.currentUser.uid;
      console.log(`✅ Encontrado via firebase.auth: ${userId}`);
      return userId;
    }
    
    // Método 2: localStorage (chaves de migração existentes)
    const migrationKeys = Object.keys(localStorage).filter(key => key.startsWith('migrated_'));
    if (migrationKeys.length > 0) {
      const userId = migrationKeys[0].replace('migrated_', '');
      console.log(`✅ Encontrado via localStorage: ${userId}`);
      return userId;
    }
    
    // Método 3: Verificar no DOM
    const userElements = document.querySelectorAll('[data-user-id], [data-uid]');
    if (userElements.length > 0) {
      const userId = userElements[0].getAttribute('data-user-id') || userElements[0].getAttribute('data-uid');
      console.log(`✅ Encontrado via DOM: ${userId}`);
      return userId;
    }
    
    console.log('❌ Não foi possível encontrar userId automaticamente');
    console.log('💡 Você pode executar manualmente: firestoreDiagnostic.checkAllTransactionCollections("SEU_USER_ID")');
    return null;
  },

  /**
   * Analisar transações da coleção nova para verificar classId
   */
  async analyzeNewTransactions(userId) {
    if (!userId) {
      userId = this.findCurrentUserId();
      if (!userId) return;
    }

    try {
      console.log(`🔍 Analisando transações da coleção nova para usuário: ${userId}`);
      
      const newRef = collection(db, 'users', userId, 'transactions');
      const snapshot = await getDocs(newRef);
      
      console.log(`📦 Total de transações na coleção nova: ${snapshot.size}`);
      
      if (snapshot.size === 0) {
        console.log('ℹ️ Nenhuma transação encontrada na coleção nova');
        return;
      }

      // Analisar primeiras 10 transações
      const transactions = [];
      snapshot.docs.slice(0, 10).forEach(doc => {
        transactions.push({
          id: doc.id,
          ...doc.data()
        });
      });

      console.log('📄 Primeiras 10 transações:');
      console.table(transactions);

      // Análise de classIds únicos
      const classIds = new Set();
      const classNames = new Set();
      let transactionsWithoutClass = 0;
      let transactionsWithDate = 0;
      let currentMonthTransactions = 0;

      const currentMonth = new Date().getMonth() + 1; // Janeiro = 1
      const currentYear = new Date().getFullYear();

      snapshot.forEach(doc => {
        const data = doc.data();
        
        if (data.classId) {
          classIds.add(data.classId);
        } else {
          transactionsWithoutClass++;
        }
        
        if (data.className) {
          classNames.add(data.className);
        }
        
        if (data.date || data.month) {
          transactionsWithDate++;
        }
        
        // Verificar se é do mês atual
        let isCurrentMonth = false;
        if (data.month && data.year) {
          isCurrentMonth = data.month === currentMonth && data.year === currentYear;
        } else if (data.date) {
          const dateObj = new Date(data.date);
          const transactionMonth = dateObj.getMonth() + 1;
          const transactionYear = dateObj.getFullYear();
          isCurrentMonth = transactionMonth === currentMonth && transactionYear === currentYear;
        } else if (data.createdAt) {
          const dateObj = data.createdAt.toDate ? data.createdAt.toDate() : new Date(data.createdAt);
          const transactionMonth = dateObj.getMonth() + 1;
          const transactionYear = dateObj.getFullYear();
          isCurrentMonth = transactionMonth === currentMonth && transactionYear === currentYear;
        }
        
        if (isCurrentMonth) {
          currentMonthTransactions++;
        }
      });

      console.log('\n📊 ANÁLISE DAS TRANSAÇÕES:');
      console.table({
        'Total de transações': snapshot.size,
        'Transações sem classId': transactionsWithoutClass,
        'Transações com data': transactionsWithDate,
        'Transações do mês atual': currentMonthTransactions,
        'ClassIds únicos': classIds.size,
        'ClassNames únicos': classNames.size
      });

      console.log('\n🏷️ ClassIds encontrados:');
      Array.from(classIds).forEach(classId => console.log(`   • ${classId}`));

      console.log('\n🏷️ ClassNames encontrados:');
      Array.from(classNames).forEach(className => console.log(`   • ${className}`));

      return {
        total: snapshot.size,
        classIds: Array.from(classIds),
        classNames: Array.from(classNames),
        withoutClass: transactionsWithoutClass,
        currentMonth: currentMonthTransactions,
        sample: transactions
      };

    } catch (error) {
      console.error('❌ Erro ao analisar transações:', error);
    }
  },

  /**
   * Verificar duplicatas nas transações
   */
  async analyzeDuplicates(userId) {
    if (!userId) {
      userId = this.findCurrentUserId();
      if (!userId) return;
    }

    try {
      console.log(`🔍 Analisando duplicatas para usuário: ${userId}`);
      
      const newRef = collection(db, 'users', userId, 'transactions');
      const snapshot = await getDocs(newRef);
      
      console.log(`📦 Total de transações: ${snapshot.size}`);
      
      if (snapshot.size === 0) {
        console.log('ℹ️ Nenhuma transação encontrada');
        return;
      }

      const transactions = [];
      snapshot.forEach(doc => {
        transactions.push({
          id: doc.id,
          ...doc.data()
        });
      });

      // Agrupar por originalId para encontrar duplicatas
      const groupedByOriginalId = {};
      const groupedByValueDate = {};

      transactions.forEach(t => {
        // Agrupar por originalId
        if (t.originalId) {
          if (!groupedByOriginalId[t.originalId]) {
            groupedByOriginalId[t.originalId] = [];
          }
          groupedByOriginalId[t.originalId].push(t);
        }

        // Agrupar por descrição + valor + data
        const key = `${t.description}_${t.value}_${t.date}`;
        if (!groupedByValueDate[key]) {
          groupedByValueDate[key] = [];
        }
        groupedByValueDate[key].push(t);
      });

      // Encontrar duplicatas por originalId
      const duplicatesByOriginalId = Object.entries(groupedByOriginalId)
        .filter(([_, transactions]) => transactions.length > 1);

      // Encontrar duplicatas por descrição+valor+data
      const duplicatesByValueDate = Object.entries(groupedByValueDate)
        .filter(([_, transactions]) => transactions.length > 1);

      console.log('\n🔍 ANÁLISE DE DUPLICATAS:');
      console.table({
        'Total de transações': transactions.length,
        'Duplicatas por originalId': duplicatesByOriginalId.length,
        'Duplicatas por desc+valor+data': duplicatesByValueDate.length,
        'Transações com originalId': transactions.filter(t => t.originalId).length,
        'Transações sem originalId': transactions.filter(t => !t.originalId).length
      });

      if (duplicatesByOriginalId.length > 0) {
        console.log('\n🚨 DUPLICATAS POR ORIGINAL ID:');
        duplicatesByOriginalId.forEach(([originalId, duplicates]) => {
          console.log(`\n📄 OriginalId: ${originalId} (${duplicates.length} duplicatas)`);
          console.table(duplicates.map(d => ({
            id: d.id,
            description: d.description,
            value: d.value,
            date: d.date,
            classId: d.classId,
            migratedAt: d.migratedAt?.toDate?.()?.toISOString?.() || d.migratedAt
          })));
        });
      }

      if (duplicatesByValueDate.length > 0) {
        console.log('\n🚨 DUPLICATAS POR DESCRIÇÃO+VALOR+DATA:');
        duplicatesByValueDate.slice(0, 5).forEach(([key, duplicates]) => {
          if (duplicates.length > 1) {
            console.log(`\n📄 ${key} (${duplicates.length} duplicatas)`);
            console.table(duplicates.map(d => ({
              id: d.id,
              originalId: d.originalId,
              classId: d.classId,
              migratedAt: d.migratedAt?.toDate?.()?.toISOString?.() || d.migratedAt
            })));
          }
        });
      }

      return {
        total: transactions.length,
        duplicatesByOriginalId: duplicatesByOriginalId.length,
        duplicatesByValueDate: duplicatesByValueDate.length,
        duplicateGroups: duplicatesByOriginalId
      };

    } catch (error) {
      console.error('❌ Erro ao analisar duplicatas:', error);
    }
  },

  /**
   * Remover duplicatas, mantendo apenas a transação mais recente de cada grupo
   */
  async removeDuplicates(userId, dryRun = true) {
    if (!userId) {
      userId = this.findCurrentUserId();
      if (!userId) return;
    }

    try {
      console.log(`🔧 ${dryRun ? 'SIMULANDO' : 'EXECUTANDO'} remoção de duplicatas para usuário: ${userId}`);
      
      const newRef = collection(db, 'users', userId, 'transactions');
      const snapshot = await getDocs(newRef);
      
      console.log(`📦 Total de transações: ${snapshot.size}`);
      
      if (snapshot.size === 0) {
        console.log('ℹ️ Nenhuma transação encontrada');
        return;
      }

      const transactions = [];
      snapshot.forEach(doc => {
        transactions.push({
          id: doc.id,
          docRef: doc.ref,
          ...doc.data()
        });
      });

      // Agrupar por originalId
      const groupedByOriginalId = {};
      
      transactions.forEach(t => {
        if (t.originalId) {
          if (!groupedByOriginalId[t.originalId]) {
            groupedByOriginalId[t.originalId] = [];
          }
          groupedByOriginalId[t.originalId].push(t);
        }
      });

      // Encontrar duplicatas e identificar quais remover
      const duplicateGroups = Object.entries(groupedByOriginalId)
        .filter(([_, transactions]) => transactions.length > 1);

      let totalToDelete = 0;
      const transactionsToDelete = [];

      duplicateGroups.forEach(([originalId, duplicates]) => {
        // Ordenar por migratedAt (mais recente primeiro)
        duplicates.sort((a, b) => {
          const dateA = a.migratedAt?.toDate?.() || new Date(a.migratedAt);
          const dateB = b.migratedAt?.toDate?.() || new Date(b.migratedAt);
          return dateB.getTime() - dateA.getTime();
        });

        // Manter o primeiro (mais recente), remover os outros
        const toKeep = duplicates[0];
        const toDelete = duplicates.slice(1);

        console.log(`\n📄 OriginalId: ${originalId}`);
        console.log(`   ✅ Manter: ${toKeep.id} (${toKeep.migratedAt?.toDate?.()?.toISOString() || toKeep.migratedAt})`);
        console.log(`   🗑️ Remover: ${toDelete.length} duplicatas`);

        toDelete.forEach(t => {
          console.log(`      - ${t.id} (${t.migratedAt?.toDate?.()?.toISOString() || t.migratedAt})`);
          transactionsToDelete.push(t);
        });

        totalToDelete += toDelete.length;
      });

      console.log(`\n📊 RESUMO DA LIMPEZA:`);
      console.table({
        'Total de transações': transactions.length,
        'Grupos duplicados': duplicateGroups.length,
        'Transações a manter': transactions.length - totalToDelete,
        'Transações a remover': totalToDelete,
        'Modo': dryRun ? 'SIMULAÇÃO' : 'EXECUÇÃO REAL'
      });

      if (dryRun) {
        console.log(`\n⚠️ MODO SIMULAÇÃO - Nenhuma transação foi removida!`);
        console.log(`Para executar a limpeza real, use:`);
        console.log(`await firestoreDiagnostic.removeDuplicates(null, false)`);
        return {
          totalTransactions: transactions.length,
          duplicateGroups: duplicateGroups.length,
          toDelete: totalToDelete,
          simulation: true
        };
      }

      // Executar remoção real
      console.log(`\n🔥 EXECUTANDO REMOÇÃO REAL...`);
      
      let deletedCount = 0;
      for (const transaction of transactionsToDelete) {
        try {
          await deleteDoc(transaction.docRef);
          deletedCount++;
          console.log(`✅ Removido: ${transaction.id}`);
        } catch (error) {
          console.error(`❌ Erro ao remover ${transaction.id}:`, error);
        }
      }

      console.log(`\n🎉 LIMPEZA CONCLUÍDA!`);
      console.table({
        'Transações removidas': deletedCount,
        'Erros': totalToDelete - deletedCount,
        'Transações restantes': transactions.length - deletedCount
      });

      return {
        totalTransactions: transactions.length,
        duplicateGroups: duplicateGroups.length,
        deleted: deletedCount,
        errors: totalToDelete - deletedCount,
        remaining: transactions.length - deletedCount,
        simulation: false
      };

    } catch (error) {
      console.error('❌ Erro ao remover duplicatas:', error);
    }
  }
};

// Função de conveniência para o usuário atual
window.diagnoseProblem = async () => {
  const userId = window.firestoreDiagnostic.findCurrentUserId();
  
  if (!userId) {
    return;
  }
  
  console.log(`🎯 Diagnosticando problema para usuário: ${userId}`);
  return await window.firestoreDiagnostic.checkAllTransactionCollections(userId);
};

console.log(`
🔧 FERRAMENTAS DE DIAGNÓSTICO CARREGADAS

Use no console:
  • diagnoseProblem() - Diagnóstico completo do usuário atual
  • firestoreDiagnostic.findCurrentUserId() - Encontrar o userId atual
  • firestoreDiagnostic.analyzeNewTransactions() - Analisar transações da coleção nova
  • firestoreDiagnostic.analyzeDuplicates() - Verificar duplicatas
  • firestoreDiagnostic.removeDuplicates() - Remover duplicatas (SIMULAÇÃO)
  • firestoreDiagnostic.removeDuplicates(null, false) - Remover duplicatas (REAL)
  • firestoreDiagnostic.checkAllTransactionCollections('userId') - Verificar todas as coleções
  • firestoreDiagnostic.listAllRootCollections() - Listar todas as coleções raiz
  • firestoreDiagnostic.resetMigration('userId') - Resetar flag de migração

Para resolver as duplicatas:
  1. await firestoreDiagnostic.removeDuplicates() - Ver simulação
  2. await firestoreDiagnostic.removeDuplicates(null, false) - Executar limpeza
  
Exemplo:
  await firestoreDiagnostic.analyzeDuplicates()
  await firestoreDiagnostic.removeDuplicates()
`);