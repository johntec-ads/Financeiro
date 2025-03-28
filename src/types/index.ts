export type TransactionType = 'receita' | 'despesa';
export type CategoryType = 'Alimentação' | 'Moradia' | 'Transporte' | 'Saúde' | 
                         'Educação' | 'Lazer' | 'Vestuário' | 'Utilidades' | 
                         'Outros' | 'Salário' | 'Freelance' | 'Investimentos' | 
                         'Aluguel' | 'Vendas';

export interface Transaction {
  id: string;
  type: TransactionType;
  category: CategoryType;
  value: number;
  date: string;
  description?: string;
  userId: string;
  status: 'pending' | 'completed' | 'cancelled';
  tags?: string[];
  createdAt: Date;
  updatedAt?: Date;
}

export interface UserSettings {
  theme: 'light' | 'dark';
  currency: 'BRL' | 'USD' | 'EUR';
  language: 'pt-BR' | 'en-US';
  notifications: boolean;
}

export interface User {
  uid: string;
  email: string;
  firstName: string;
  lastName: string;
  settings?: UserSettings;
  createdAt: Date;
  lastLogin?: Date;
}
