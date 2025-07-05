import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useAuth } from '../context/AuthContext';
import { useClasses } from '../context/ClassContext';
import { collection, getDocs, addDoc, query, where } from 'firebase/firestore';
import { db } from '../services/firebase';

const MigrationContainer = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.8);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
`;

const MigrationCard = styled.div`
  background: var(--card-bg);
  padding: 2rem;
  border-radius: 12px;
  max-width: 500px;
  text-align: center;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
`;

const Title = styled.h2`
  color: var(--primary);
  margin-bottom: 1rem;
`;

const Description = styled.p`
  color: var(--text);
  margin-bottom: 2rem;
  line-height: 1.6;
`;

const Button = styled.button`
  background: var(--primary);
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 6px;
  font-size: 1rem;
  cursor: pointer;
  margin: 0 0.5rem;
  
  &:hover {
    opacity: 0.9;
  }
  
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

const SecondaryButton = styled(Button)`
  background: var(--text-secondary);
`;

const ProgressBar = styled.div`
  width: 100%;
  height: 6px;
  background: var(--border);
  border-radius: 3px;
  margin: 1rem 0;
  overflow: hidden;
`;

const Progress = styled.div`
  height: 100%;
  background: var(--primary);
  width: ${props => props.percent}%;
  transition: width 0.3s ease;
`;

const Status = styled.p`
  color: var(--text-secondary);
  font-size: 0.9rem;
  margin: 0.5rem 0;
`;

const DataMigrationModal = () => {
  const { currentUser } = useAuth();
  const { activeClass } = useClasses();
  const [showMigration, setShowMigration] = useState(false);
  const [migrating, setMigrating] = useState(false);
  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState('');
  const [legacyData, setLegacyData] = useState(null);

  // Verificar se há dados legados para migrar
  useEffect(() => {
    if (!currentUser || !activeClass) return;

    // Verificar se já foi migrado
    const alreadyMigrated = localStorage.getItem(`migrated_${currentUser.uid}`);
    if (alreadyMigrated === 'true') {
      console.log('🔄 Usuário já migrou dados anteriormente');
      return;
    }

    const checkLegacyData = async () => {
      try {
        console.log('🔍 Verificando dados legados...');
        
        // Verificar transações legadas
        const legacyTransactionsRef = collection(db, 'transactions');
        const q = query(legacyTransactionsRef, where('userId', '==', currentUser.uid));
        const snapshot = await getDocs(q);
        
        const legacyTransactions = [];
        snapshot.forEach(doc => {
          legacyTransactions.push({ id: doc.id, ...doc.data() });
        });

        console.log(`📦 Encontradas ${legacyTransactions.length} transações legadas`);

        if (legacyTransactions.length > 0) {
          setLegacyData({
            transactions: legacyTransactions
          });
          setShowMigration(true);
          console.log('✅ Modal de migração será exibido');
        } else {
          console.log('ℹ️ Nenhuma transação legada encontrada');
        }
      } catch (error) {
        console.error('❌ Erro ao verificar dados legados:', error);
      }
    };

    checkLegacyData();
  }, [currentUser, activeClass]);

  const migrateData = async () => {
    if (!legacyData || !activeClass) {
      console.log('❌ Dados insuficientes para migração:', { 
        legacyData: !!legacyData, 
        activeClass: !!activeClass 
      });
      return;
    }

    console.log(`🚀 Iniciando migração através do modal...`);
    setMigrating(true);
    setProgress(0);
    setStatus('Iniciando migração...');

    try {
      const newTransactionsRef = collection(db, 'users', currentUser.uid, 'transactions');
      
      const totalTransactions = legacyData.transactions.length;
      let processedCount = 0;

      console.log(`📊 Total de transações para migrar: ${totalTransactions}`);

      // Migrar transações individualmente para melhor controle
      for (const transaction of legacyData.transactions) {
        const { id, ...transactionData } = transaction;
        
        console.log(`📝 Processando transação ${processedCount + 1}/${totalTransactions}:`, {
          id,
          description: transactionData.description,
          value: transactionData.value
        });
        
        // Adicionar classId se não existir
        if (!transactionData.classId) {
          transactionData.classId = activeClass.id;
          transactionData.className = activeClass.name;
          console.log(`➕ Adicionando classe: ${activeClass.name}`);
        }
        
        // Adicionar metadados de migração
        transactionData.migratedAt = new Date();
        transactionData.originalId = id;
        transactionData.migratedFrom = 'modal';
        
        try {
          const docRef = await addDoc(newTransactionsRef, transactionData);
          console.log(`✅ Transação migrada com sucesso: ${docRef.id}`);
        } catch (docError) {
          console.error(`❌ Erro ao migrar transação ${id}:`, docError);
        }

        processedCount++;
        const percent = Math.round((processedCount / totalTransactions) * 100);
        setProgress(percent);
        setStatus(`Migrando transação ${processedCount} de ${totalTransactions}...`);
        
        // Pequena pausa para não sobrecarregar o Firestore
        await new Promise(resolve => setTimeout(resolve, 100));
      }

      setStatus('Migração concluída com sucesso!');
      setProgress(100);
      
      console.log(`🎉 Migração via modal concluída: ${processedCount}/${totalTransactions} transações`);
      
      // Marcar como migrado no localStorage para não aparecer novamente
      localStorage.setItem(`migrated_${currentUser.uid}`, 'true');
      
      setTimeout(() => {
        setShowMigration(false);
        window.location.reload(); // Recarregar para mostrar dados migrados
      }, 2000);

    } catch (error) {
      console.error('❌ Erro geral na migração via modal:', error);
      setStatus(`Erro na migração: ${error.message}`);
      setMigrating(false);
    }
  };

  const skipMigration = () => {
    console.log('⏭️ Usuário optou por pular a migração');
    
    // Marcar como processado para não aparecer novamente
    localStorage.setItem(`migrated_${currentUser.uid}`, 'skipped');
    setShowMigration(false);
  };

  if (!showMigration) return null;

  return (
    <MigrationContainer>
      <MigrationCard>
        <Title>📦 Migração de Dados</Title>
        
        {!migrating ? (
          <>
            <Description>
              Detectamos {legacyData?.transactions.length || 0} transações antigas em sua conta.
              <br/><br/>
              Deseja migrar esses dados para o novo sistema de classes? 
              Isso permitirá que você veja e gerencie todas as suas transações antigas.
            </Description>
            
            <Button onClick={migrateData}>
              ✅ Migrar Dados
            </Button>
            
            <SecondaryButton onClick={skipMigration}>
              ❌ Pular Migração
            </SecondaryButton>
          </>
        ) : (
          <>
            <Description>
              Migrando seus dados para o novo sistema...
            </Description>
            
            <ProgressBar>
              <Progress percent={progress} />
            </ProgressBar>
            
            <Status>{status}</Status>
          </>
        )}
      </MigrationCard>
    </MigrationContainer>
  );
};

export default DataMigrationModal;
