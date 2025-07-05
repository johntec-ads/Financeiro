import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useClasses } from '../context/ClassContext';
import { 
  collection, 
  query, 
  where, 
  orderBy, 
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
      const transactionsRef = collection(db, 'users', currentUser.uid, 'transactions');
      
      // Query para buscar transações da classe ativa no mês/ano especificado
      const q = query(
        transactionsRef,
        where('classId', '==', activeClass.id),
        where('month', '==', month),
        where('year', '==', year),
        orderBy('date', 'desc')
      );

      const unsubscribe = onSnapshot(q, 
        (snapshot) => {
          const transactionsData = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
          }));

          setTransactions(transactionsData);
          setLoading(false);
        },
        (error) => {
          console.error('Erro ao carregar transações por classe:', error);
          setError(error);
          setLoading(false);
        }
      );

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
      const transactionsRef = collection(db, 'users', currentUser.uid, 'transactions');
      
      const newTransaction = {
        ...transactionData,
        classId: activeClass.id,
        className: activeClass.name,
        userId: currentUser.uid,
        createdAt: new Date()
      };

      const docRef = await addDoc(transactionsRef, newTransaction);
      return { id: docRef.id, ...newTransaction };
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
      const transactionRef = doc(db, 'users', currentUser.uid, 'transactions', transactionId);
      await updateDoc(transactionRef, {
        ...updates,
        updatedAt: new Date()
      });
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
      const transactionRef = doc(db, 'users', currentUser.uid, 'transactions', transactionId);
      await deleteDoc(transactionRef);
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
