import { useState, useEffect } from 'react';
import { db } from '../services/firebase';
import { collection, query, where, orderBy, onSnapshot, addDoc, doc, updateDoc, deleteDoc, serverTimestamp } from 'firebase/firestore';
import { useAuth } from '../context/AuthContext';

const COLLECTION_NAME = 'transactions'; // Constante para padronizar o nome da coleção

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

    try {
      // Alterando a ordem para match com o índice
      const q = query(
        collection(db, COLLECTION_NAME),
        where('userId', '==', currentUser.uid),
        orderBy('createdAt', 'asc') // Mudando para 'asc' para corresponder ao índice
      );

      console.log('Query configurada com índice composto...'); // Debug

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
      console.error('Erro detalhado:', error); // Debug expandido
      setError(error);
      setLoading(false);
    }
  }, [currentUser?.uid, selectedMonth, selectedYear]);

  const addTransaction = async (transaction) => {
    if (!currentUser?.uid) {
      console.error('Usuário não autenticado');
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
        createdAt: serverTimestamp(),
        status: 'completed'
      };

      console.log('Tentando adicionar transação:', transactionData);
      console.log('Usuario atual:', currentUser.uid);

      const docRef = await addDoc(collection(db, COLLECTION_NAME), transactionData);
      console.log('Transação adicionada com sucesso na coleção:', COLLECTION_NAME, 'ID:', docRef.id);
      return docRef.id;

    } catch (err) {
      console.error('Erro ao adicionar transação:', err);
      throw err;
    }
  };

  const updateTransaction = async (id, updates) => {
    try {
      const transactionRef = doc(db, COLLECTION_NAME, id);
      
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
      const transactionRef = doc(db, COLLECTION_NAME, id);
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
