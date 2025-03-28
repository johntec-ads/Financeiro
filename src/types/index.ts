export interface Transaction {
  id: string;
  type: 'receita' | 'despesa';
  category: string;
  value: number;
  date: string;
  description?: string;
  userId: string;
  createdAt: Date;
  updatedAt?: Date;
}

export interface User {
  uid: string;
  email: string;
  firstName: string;
  lastName: string;
}
