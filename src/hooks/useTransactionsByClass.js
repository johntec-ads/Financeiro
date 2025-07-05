import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useClasses } from '../context/ClassContext';
import { 
  collection, 
  query, 
  where, 
  onSnapshot,
  addDoc,
  updateDoc,
  deleteDoc,
  doc 
} from 'firebase/firestore';
import { db } from '../services/firebase';

const useTransactionsByClass = (month, year) => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const { currentUser } = useAuth();
  const { activeClass } = useClasses();

  useEffect(() => {
    if (!currentUser || !activeClass) {
      setTransactions([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Primeiro, tentar carregar as transações do formato novo
      let unsubscribe = null;
      
      try {
        const transactionsRef = collection(db, 'users', currentUser.uid, 'transactions');
        
        // Query mais simples - apenas por classe
        const q = query(transactionsRef, where('classId', '==', activeClass.id));

        unsubscribe = onSnapshot(q, 
          (snapshot) => {
            const transactionsData = snapshot.docs.map(doc => ({
              id: doc.id,
              ...doc.data()
            }));

            // Filtrar por mês e ano no cliente e ordenar
            const filteredTransactions = transactionsData
              .filter(t => {
                // Primeira tentativa: usar campos month e year diretos
                if (t.month && t.year) {
                  return t.month === month && t.year === year;
                }
                
                // Segunda tentativa: extrair de campo date
                if (t.date) {
                  const dateObj = new Date(t.date);
                  const transactionMonth = dateObj.getMonth() + 1; // getMonth() retorna 0-11
                  const transactionYear = dateObj.getFullYear();
                  return transactionMonth === month && transactionYear === year;
                }
                
                // Terceira tentativa: extrair de createdAt
                if (t.createdAt) {
                  const dateObj = t.createdAt.toDate ? t.createdAt.toDate() : new Date(t.createdAt);
                  const transactionMonth = dateObj.getMonth() + 1;
                  const transactionYear = dateObj.getFullYear();
                  return transactionMonth === month && transactionYear === year;
                }
                
                // Se não tem data válida, não incluir
                return false;
              })
              .sort((a, b) => {
                // Ordenar por data decrescente
                const dateA = new Date(a.date || a.createdAt);
                const dateB = new Date(b.date || b.createdAt);
                return dateB.getTime() - dateA.getTime();
              });

            setTransactions(filteredTransactions);
            setLoading(false);
          },
          (error) => {
            console.error('Erro ao carregar transações (formato novo):', error);
            // Tentar formato legado
            loadLegacyTransactions();
          }
        );
      } catch (error) {
        console.error('Erro ao configurar query nova:', error);
        loadLegacyTransactions();
      }

      // Função para carregar transações do formato legado
      function loadLegacyTransactions() {
        console.log('🔄 Carregando transações do formato legado...');
        
        try {
          const legacyTransactionsRef = collection(db, 'transactions');
          
          // Query simples por usuário
          const legacyQuery = query(
            legacyTransactionsRef,
            where('userId', '==', currentUser.uid)
          );

          unsubscribe = onSnapshot(legacyQuery,
            (snapshot) => {
              const transactionsData = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
              }));

              console.log(`📦 Encontradas ${transactionsData.length} transações legadas`);

              // Filtrar por classe, mês e ano no cliente e ordenar
              const filteredTransactions = transactionsData
                .filter(t => {
                  // Se a transação não tem classId, mostrar em todas as classes
                  // Se tem classId, mostrar apenas na classe correspondente
                  const matchesClass = !t.classId || t.classId === activeClass.id;
                  
                  // Verificar data com fallback
                  let matchesDate = false;
                  if (t.month && t.year) {
                    matchesDate = t.month === month && t.year === year;
                  } else if (t.date) {
                    const dateObj = new Date(t.date);
                    const transactionMonth = dateObj.getMonth() + 1;
                    const transactionYear = dateObj.getFullYear();
                    matchesDate = transactionMonth === month && transactionYear === year;
                  } else if (t.createdAt) {
                    const dateObj = t.createdAt.toDate ? t.createdAt.toDate() : new Date(t.createdAt);
                    const transactionMonth = dateObj.getMonth() + 1;
                    const transactionYear = dateObj.getFullYear();
                    matchesDate = transactionMonth === month && transactionYear === year;
                  }
                  
                  return matchesClass && matchesDate;
                })
                .sort((a, b) => {
                  // Ordenar por data decrescente
                  const dateA = new Date(a.date || a.createdAt);
                  const dateB = new Date(b.date || b.createdAt);
                  return dateB.getTime() - dateA.getTime();
                });

              // Adicionar classId automaticamente às transações sem classe
              const transactionsWithClass = filteredTransactions.map(t => ({
                ...t,
                classId: t.classId || activeClass.id,
                className: t.className || activeClass.name,
                isLegacy: !t.classId // Marcar como legada
              }));

              setTransactions(transactionsWithClass);
              setLoading(false);

              // Informar ao usuário sobre dados legados encontrados
              if (transactionsWithClass.length > 0) {
                console.log(`✅ Carregadas ${transactionsWithClass.length} transações (${transactionsWithClass.filter(t => t.isLegacy).length} legadas)`);
              }
            },
            (legacyError) => {
              console.error('Erro ao carregar transações legadas:', legacyError);
              setError(legacyError);
              setLoading(false);
            }
          );
        } catch (legacyError) {
          console.error('Erro ao configurar listener legado:', legacyError);
          setError(legacyError);
          setLoading(false);
        }
      }

      return () => unsubscribe();
    } catch (error) {
      console.error('Erro ao configurar listener de transações:', error);
      setError(error);
      setLoading(false);
    }
  }, [currentUser, activeClass, month, year]);

  // Adicionar transação à classe ativa
  const addTransaction = async (transactionData) => {
    if (!currentUser || !activeClass) return;

    try {
      // Tentar primeiro o formato novo (aninhado)
      const transactionsRef = collection(db, 'users', currentUser.uid, 'transactions');
      
      const newTransaction = {
        ...transactionData,
        classId: activeClass.id,
        className: activeClass.name,
        userId: currentUser.uid,
        createdAt: new Date()
      };

      try {
        const docRef = await addDoc(transactionsRef, newTransaction);
        return { id: docRef.id, ...newTransaction };
      } catch (error) {
        // Se falhar, tentar o formato legado
        if (error.code === 'permission-denied') {
          console.log('Tentando criar transação no formato legado...');
          
          const legacyTransactionsRef = collection(db, 'transactions');
          const docRef = await addDoc(legacyTransactionsRef, newTransaction);
          return { id: docRef.id, ...newTransaction };
        } else {
          throw error;
        }
      }
    } catch (error) {
      console.error('Erro ao adicionar transação:', error);
      setError(error);
      throw error;
    }
  };

  // Atualizar transação
  const updateTransaction = async (transactionId, updates) => {
    if (!currentUser) return;

    try {
      // Tentar primeiro o formato novo (aninhado)
      const transactionRef = doc(db, 'users', currentUser.uid, 'transactions', transactionId);
      
      try {
        await updateDoc(transactionRef, {
          ...updates,
          updatedAt: new Date()
        });
      } catch (error) {
        // Se falhar, tentar o formato legado
        if (error.code === 'permission-denied') {
          console.log('Tentando atualizar transação no formato legado...');
          
          const legacyTransactionRef = doc(db, 'transactions', transactionId);
          await updateDoc(legacyTransactionRef, {
            ...updates,
            updatedAt: new Date()
          });
        } else {
          throw error;
        }
      }
    } catch (error) {
      console.error('Erro ao atualizar transação:', error);
      setError(error);
      throw error;
    }
  };

  // Deletar transação
  const deleteTransaction = async (transactionId) => {
    if (!currentUser) return;

    try {
      // Tentar primeiro o formato novo (aninhado)
      const transactionRef = doc(db, 'users', currentUser.uid, 'transactions', transactionId);
      
      try {
        await deleteDoc(transactionRef);
      } catch (error) {
        // Se falhar, tentar o formato legado
        if (error.code === 'permission-denied') {
          console.log('Tentando deletar transação no formato legado...');
          
          const legacyTransactionRef = doc(db, 'transactions', transactionId);
          await deleteDoc(legacyTransactionRef);
        } else {
          throw error;
        }
      }
    } catch (error) {
      console.error('Erro ao deletar transação:', error);
      setError(error);
      throw error;
    }
  };

  // Mover transação para outra classe
  const moveTransactionToClass = async (transactionId, targetClassId, targetClassName) => {
    if (!currentUser) return;

    try {
      const transactionRef = doc(db, 'users', currentUser.uid, 'transactions', transactionId);
      await updateDoc(transactionRef, {
        classId: targetClassId,
        className: targetClassName,
        updatedAt: new Date()
      });
    } catch (error) {
      console.error('Erro ao mover transação:', error);
      setError(error);
      throw error;
    }
  };

  // Calcular resumo da classe ativa
  const summary = {
    receitas: transactions
      .filter(t => t.type === 'receita')
      .reduce((sum, t) => sum + t.value, 0),
    despesas: transactions
      .filter(t => t.type === 'despesa')
      .reduce((sum, t) => sum + t.value, 0),
    total: transactions.reduce((sum, t) => 
      t.type === 'receita' ? sum + t.value : sum - t.value, 0
    ),
    transactionCount: transactions.length,
    className: activeClass?.name || '',
    classColor: activeClass?.color || '#2E7D32'
  };

  return {
    transactions,
    summary,
    loading,
    error,
    addTransaction,
    updateTransaction,
    deleteTransaction,
    moveTransactionToClass,
    activeClass
  };
};

export default useTransactionsByClass;
