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
    if (!currentUser) {
      setLoading(false);
      return;
    }

    setLoading(true);
    const transactionsCollection = collection(db, 'transactions');

    // Construir a query para filtrar por userId e mês/ano
    const q = query(
      transactionsCollection,
      where('userId', '==', currentUser.uid),
      where('month', '==', selectedMonth),
      where('year', '==', selectedYear),
      orderBy('createdAt', 'desc') // Ordenar por data de criação
    );

    // Listener em tempo real
    const unsubscribe = onSnapshot(q,
      (snapshot) => {
        const fetchedTransactions = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
          date: doc.data().date, // Manter como string
        }));
        setTransactions(fetchedTransactions);
        setLoading(false);
      },
      (error) => {
        setError(error);
        setLoading(false);
      }
    );

    return () => unsubscribe(); // Limpar o listener ao desmontar
  }, [currentUser, selectedMonth, selectedYear]);

  // Funções para adicionar, atualizar e excluir transações
  const addTransaction = async (transaction) => {
    try {
      await addDoc(collection(db, 'transactions'), {
        ...transaction,
        userId: currentUser.uid,
        createdAt: serverTimestamp(),
        month: selectedMonth, // Salvar mês
        year: selectedYear,   // Salvar ano
      });
    } catch (err) {
      setError(err);
    }
  };

  const updateTransaction = async (id, updates) => {
    try {
      const transactionDoc = doc(db, 'transactions', id);
      await updateDoc(transactionDoc, updates);
    } catch (err) {
      setError(err);
    }
  };

  const deleteTransaction = async (id) => {
    try {
      const transactionDoc = doc(db, 'transactions', id);
      await deleteDoc(transactionDoc);
    } catch (err) {
      setError(err);
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
