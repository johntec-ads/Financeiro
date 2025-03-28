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
      where('userId', '==', currentUser.uid),
      orderBy('createdAt', 'desc') // Ordenar por data de criação
    );

    const unsubscribe = onSnapshot(
      q,
      {
        next: (snapshot) => {
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

          setTransactions(fetchedTransactions);
          setLoading(false);
        },
        error: (error) => {
          console.error('Erro ao buscar transações:', error);
          setError(error);
          setLoading(false);
        }
      }
    );

    return () => unsubscribe();
  }, [currentUser?.uid, selectedMonth, selectedYear]); // Adicionado currentUser.uid como dependência

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
      // Corrigindo o nome da coleção para 'transacoes'
      const transactionRef = doc(db, 'transacoes', id);
      
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
      // Corrigindo o nome da coleção para 'transacoes' e usando deleteDoc
      const transactionRef = doc(db, 'transacoes', id);
      await deleteDoc(transactionRef);
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
