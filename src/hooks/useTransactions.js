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
    const transactionsRef = collection(db, 'transactions');

    // Simplificando a query para debug
    const q = query(
      transactionsRef,
      where('userId', '==', currentUser.uid),
      where('month', '==', parseInt(selectedMonth)),
      where('year', '==', parseInt(selectedYear)),
      orderBy('createdAt', 'desc')
    );

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        console.log('Dados recebidos:', snapshot.docs.map(doc => doc.data())); // Debug
        const fetchedTransactions = snapshot.docs.map(doc => {
          const data = doc.data();
          return {
            id: doc.id,
            ...data,
            // Garantindo que o valor seja um número antes de formatar
            value: typeof data.value === 'number' 
              ? new Intl.NumberFormat('pt-BR', {
                  style: 'currency',
                  currency: 'BRL'
                }).format(data.value)
              : 'R$ 0,00',
            // Garantindo que a data seja uma string válida
            date: data.date ? new Date(data.date).toLocaleDateString('pt-BR') : ''
          };
        });
        console.log('Transações formatadas:', fetchedTransactions); // Debug
        setTransactions(fetchedTransactions);
        setLoading(false);
      },
      (error) => {
        console.error('Erro ao carregar transações:', error);
        setError(error);
        setLoading(false);
      }
    );

    return () => unsubscribe(); // Limpar o listener ao desmontar
  }, [currentUser, selectedMonth, selectedYear]);

  const addTransaction = async (transaction) => {
    try {
      // Garantindo que os dados estejam no formato correto
      const transactionData = {
        userId: currentUser.uid,
        type: transaction.type,
        category: transaction.category,
        value: parseFloat(transaction.value),
        date: transaction.date,
        description: transaction.description || '',
        month: parseInt(selectedMonth),
        year: parseInt(selectedYear),
        createdAt: serverTimestamp()
      };

      console.log('Adicionando transação:', transactionData); // Debug

      await addDoc(collection(db, 'transactions'), transactionData);
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
