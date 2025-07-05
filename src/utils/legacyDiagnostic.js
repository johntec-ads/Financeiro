/**
 * Versão de diagnóstico da verificação de migração
 * Para investigar problemas de detecção de dados legados
 */

import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '../services/firebase';

export const diagnoseLegacyData = async (userId) => {
  if (!userId) {
    console.error('❌ UserId é obrigatório');
    return null;
  }

  console.log(`\n🔍 DIAGNÓSTICO DETALHADO - Usuário: ${userId}`);
  console.log('===============================================');

  const results = {
    userId,
    timestamp: new Date().toISOString(),
    collections: {}
  };

  // 1. Verificar coleção transactions (legada)
  console.log('\n1️⃣ Verificando coleção LEGADA: /transactions');
  try {
    const legacyRef = collection(db, 'transactions');
    console.log('   📂 Referência criada:', legacyRef.path);
    
    // Primeiro, tentar buscar TODAS as transações (sem filtro)
    console.log('   🔍 Buscando TODAS as transações...');
    const allSnapshot = await getDocs(legacyRef);
    console.log(`   📦 Total de documentos na coleção: ${allSnapshot.size}`);
    
    if (allSnapshot.size > 0) {
      const allDocs = [];
      allSnapshot.forEach(doc => {
        allDocs.push({ id: doc.id, ...doc.data() });
      });
      
      console.log('   📄 Campos únicos encontrados:');
      const allFields = new Set();
      allDocs.forEach(doc => {
        Object.keys(doc).forEach(field => allFields.add(field));
      });
      console.log('   ', Array.from(allFields).sort());
      
      console.log('   👥 UserIds únicos encontrados:');
      const userIds = new Set();
      allDocs.forEach(doc => {
        if (doc.userId) userIds.add(doc.userId);
        if (doc.uid) userIds.add(doc.uid);
        if (doc.user) userIds.add(doc.user);
      });
      console.log('   ', Array.from(userIds));
      
      console.log(`   🎯 Procurando especificamente por userId: ${userId}`);
      const userTransactions = allDocs.filter(doc => 
        doc.userId === userId || doc.uid === userId || doc.user === userId
      );
      console.log(`   📦 Transações do usuário: ${userTransactions.length}`);
      
      if (userTransactions.length > 0) {
        console.log('   📄 Primeira transação do usuário:');
        console.table(userTransactions[0]);
      }
      
      results.collections.legacy = {
        total: allSnapshot.size,
        userTransactions: userTransactions.length,
        sample: userTransactions[0] || null,
        allUserIds: Array.from(userIds)
      };
    } else {
      console.log('   ℹ️ Coleção está vazia');
      results.collections.legacy = { total: 0, userTransactions: 0 };
    }
    
    // Agora tentar com query filtrada
    console.log('\n   🔍 Testando query filtrada...');
    const q = query(legacyRef, where('userId', '==', userId));
    const filteredSnapshot = await getDocs(q);
    console.log(`   📦 Resultado da query filtrada: ${filteredSnapshot.size} documentos`);
    
    results.collections.legacy.queryFiltered = filteredSnapshot.size;
    
  } catch (error) {
    console.error('   ❌ Erro ao verificar coleção legada:', error);
    results.collections.legacy = { error: error.message };
  }

  // 2. Verificar coleção nova
  console.log('\n2️⃣ Verificando coleção NOVA: /users/{userId}/transactions');
  try {
    const newRef = collection(db, 'users', userId, 'transactions');
    console.log('   📂 Referência criada:', newRef.path);
    
    const newSnapshot = await getDocs(newRef);
    console.log(`   📦 Total de documentos: ${newSnapshot.size}`);
    
    const newTransactions = [];
    newSnapshot.forEach(doc => {
      newTransactions.push({ id: doc.id, ...doc.data() });
    });
    
    results.collections.new = {
      total: newSnapshot.size,
      sample: newTransactions[0] || null
    };
    
    if (newTransactions.length > 0) {
      console.log('   📄 Primeira transação:');
      console.table(newTransactions[0]);
    }
    
  } catch (error) {
    console.error('   ❌ Erro ao verificar coleção nova:', error);
    results.collections.new = { error: error.message };
  }

  // 3. Verificar status de migração
  console.log('\n3️⃣ Verificando status de migração');
  const migrationFlag = localStorage.getItem(`migrated_${userId}`);
  console.log(`   🏷️ Flag de migração: ${migrationFlag}`);
  results.migrationStatus = migrationFlag;

  // 4. Resumo final
  console.log('\n📊 RESUMO:');
  console.table({
    'Transações Legadas (total)': results.collections.legacy?.total || 0,
    'Transações Legadas (usuário)': results.collections.legacy?.userTransactions || 0,
    'Transações Legadas (query)': results.collections.legacy?.queryFiltered || 0,
    'Transações Novas': results.collections.new?.total || 0,
    'Status Migração': migrationFlag || 'não definido'
  });

  return results;
};

// Expor globalmente
window.diagnoseLegacyData = diagnoseLegacyData;

console.log('🔬 Diagnóstico de dados legados carregado. Use: diagnoseLegacyData(userId)');
