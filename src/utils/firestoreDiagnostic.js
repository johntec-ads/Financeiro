/**
 * Utilitários para diagnosticar dados no Firestore
 * Use no console do navegador para investigar estruturas de dados
 */

import { collection, getDocs, query, where, doc, getDoc } from 'firebase/firestore';
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
    // ...continuação do código, se houver...
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
      'transactions', 'users', 'financeiro', 'transações',
      'movimentações', 'movimentações',
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
  }

};
console.log(`\n🔧 FERRAMENTAS DE DIAGNÓSTICO CARREGADAS\n\nUse no console:\n  • firestoreDiagnostic.checkAllTransactionCollections('userId') - Verificar todas as coleções\n  • firestoreDiagnostic.analyzeTransaction('collectionPath', 'docId') - Analisar estrutura de uma transação\n  • firestoreDiagnostic.listAllRootCollections() - Listar todas as coleções raiz\n`);