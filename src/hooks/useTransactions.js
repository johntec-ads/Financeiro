import { useState, useEffect } from 'react';
import { db } from '../services/firebase';
import { collection, query, where, orderBy, onSnapshot, addDoc, doc, updateDoc, deleteDoc, serverTimestamp } from 'firebase/firestore';
import { useAuth } from '../context/AuthContext';

const useTransactions = (selectedMonth, selectedYear) => {
  const { currentUser } = useAuth();
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!currentUser?.uid) {
      setLoading(false);
      setError(new Error('Usuário não autenticado'));
      return;
    }

    setLoading(true);
    const transactionsRef = collection(db, 'transacoes');

    const q = query(
      transactionsRef,
      where('userId', '==', currentUser.uid)
    );

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const fetchedTransactions = snapshot.docs
          .map(doc => ({
            id: doc.id,
            ...doc.data()
          }))
          .filter(transaction => {
            if (!transaction.date) return false;
            
            const transactionDate = new Date(transaction.date);
            const transactionMonth = transactionDate.getMonth() + 1;
            const transactionYear = transactionDate.getFullYear();
            
            return (
              transactionMonth === parseInt(selectedMonth) &&
              transactionYear === parseInt(selectedYear)
            );
          });

        console.log('Transações filtradas:', fetchedTransactions);
        setTransactions(fetchedTransactions);
        setLoading(false);
      },
      (error) => {
        console.error('Erro ao buscar transações:', error);
        setError(error);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [currentUser, selectedMonth, selectedYear]);

  const addTransaction = async (transaction) => {
    if (!currentUser?.uid) {
      throw new Error('Usuário não autenticado');
    }

    try {
      const transactionData = {
        userId: currentUser.uid,
        type: transaction.type,
        category: transaction.category,
        value: parseFloat(transaction.value),
        date: transaction.date,
        description: transaction.description || '',
        createdAt: serverTimestamp()
      };

      console.log('Adicionando transação:', transactionData);
      await addDoc(collection(db, 'transacoes'), transactionData);
    } catch (err) {
      console.error('Erro ao adicionar transação:', err);
      throw err;
    }
  };

  const updateTransaction = async (id, updates) => {
    try {
      const transactionRef = doc(db, 'transactions', id);
      
      // Adiciona campos de auditoria na atualização
      const updateData = {
        ...updates,
        updatedAt: serverTimestamp(),
        updatedBy: currentUser.email
      };

      await updateDoc(transactionRef, updateData);
    } catch (err) {
      console.error('Erro ao atualizar transação:', err);
      setError(err);
      throw err;
    }
  };

  const deleteTransaction = async (id) => {
    try {
      // Ao invés de deletar, podemos marcar como inativa
      const transactionRef = doc(db, 'transactions', id);
      await updateDoc(transactionRef, {
        status: 'inactive',
        updatedAt: serverTimestamp(),
        updatedBy: currentUser.email
      });
    } catch (err) {
      console.error('Erro ao deletar transação:', err);
      setError(err);
      throw err;
    }
  };

  return {
    transactions,
    loading,
    error,
    addTransaction,
    updateTransaction,
    deleteTransaction,
  };
};

export default useTransactions;
