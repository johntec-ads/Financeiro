import { useEffect } from 'react';

export const useNotifications = () => {
  const checkPermission = async () => {
    if (!('Notification' in window)) {
      console.log('Navegador não suporta notificações');
      return false;
    }

    if (Notification.permission === 'granted') {
      return true;
    }

    if (Notification.permission !== 'denied') {
      const permission = await Notification.requestPermission();
      return permission === 'granted';
    }

    return false;
  };

  const sendNotification = (title, options = {}) => {
    if (Notification.permission === 'granted') {
      new Notification(title, options);
    }
  };

  const checkDueTransactions = (transactions) => {
    const today = new Date();
    const threeDaysFromNow = new Date();
    threeDaysFromNow.setDate(today.getDate() + 3);

    transactions.forEach(transaction => {
      if (transaction.type === 'despesa' && !transaction.paid) {
        const dueDate = new Date(transaction.date);
        
        if (dueDate <= threeDaysFromNow && dueDate >= today) {
          sendNotification('Vencimento Próximo', {
            body: `${transaction.description} vence em ${dueDate.toLocaleDateString()}`,
            icon: '/icon-financeiro.png',
            tag: transaction.id // Evita duplicatas
          });
        }
      }
    });
  };

  return {
    checkPermission,
    sendNotification,
    checkDueTransactions
  };
};
