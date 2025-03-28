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
    setError(null);

    const transactionsRef = collection(db, 'transacoes');

    try {
      const q = query(
        transactionsRef,
        where('userId', '==', currentUser.uid),
        orderBy('createdAt', 'desc')
      );

      const unsubscribe = onSnapshot(
        q,
        (snapshot) => {
          const fetchedTransactions = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data(),
          })).filter(transaction => {
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
        (error) => {
          setError(error);
          setLoading(false);
        }
      );

      return () => unsubscribe();
    } catch (error) {
      setError(error);
      setLoading(false);
    }
  }, [currentUser?.uid, selectedMonth, selectedYear]);

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

      await addDoc(collection(db, 'transacoes'), transactionData);
    } catch (err) {
      throw err;
    }
  };

  const updateTransaction = async (id, updates) => {
    try {
      const transactionRef = doc(db, 'transacoes', id);
      
      const updateData = {
        ...updates,
        updatedAt: serverTimestamp(),
        updatedBy: currentUser.email
      };

      await updateDoc(transactionRef, updateData);
    } catch (err) {
      setError(err);
      throw err;
    }
  };

  const deleteTransaction = async (id) => {
    try {
      const transactionRef = doc(db, 'transacoes', id);
      await deleteDoc(transactionRef);
    } catch (err) {
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
