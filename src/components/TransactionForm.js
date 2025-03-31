import React, { useState } from 'react';
import styled from 'styled-components';
import { useAuth } from '../context/AuthContext';
import { expenseCategories, incomeCategories } from '../constants/categories';

const FormContainer = styled.div`
  background-color: var(--card-bg);
  padding: 2rem;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  margin-bottom: 2rem;

  @media (max-width: 768px) {
    padding: 1rem;
    border-radius: 8px;
  }
`;

const Form = styled.form`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1rem;
  width: 100%;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 0.75rem;
  }
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const Label = styled.label`
  font-weight: 500;
  color: var(--text);
`;

const Input = styled.input`
  padding: 0.75rem;
  border: 1px solid var(--border);
  border-radius: 8px;
  font-size: 1rem;
  
  &:focus {
    outline: 2px solid var(--primary);
    border-color: transparent;
  }
`;

const Select = styled.select`
  padding: 0.75rem;
  border: 1px solid var(--border);
  border-radius: 8px;
  font-size: 1rem;
  
  &:focus {
    outline: 2px solid var(--primary);
    border-color: transparent;
  }
`;

const Button = styled.button`
  background-color: var(--primary);
  color: white;
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 500;
  width: 100%;
  margin-top: 1rem;

  @media (max-width: 768px) {
    padding: 1rem;
    margin-top: 0.5rem;
  }
`;

const TransactionForm = ({ addTransaction, selectedMonth, selectedYear }) => {
  const { currentUser } = useAuth();
  const [type, setType] = useState('receita');
  const [category, setCategory] = useState('');
  const [value, setValue] = useState('');
  const [date, setDate] = useState('');
  const [description, setDescription] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [feedback, setFeedback] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setFeedback('');

    try {
      const transaction = {
        type,
        category,
        value: parseFloat(value),
        date,
        description
      };

      await addTransaction(transaction);
      setFeedback('Transação adicionada com sucesso!');
      
      // Limpar formulário
      setType('receita');
      setCategory('');
      setValue('');
      setDate('');
      setDescription('');
    } catch (error) {
      console.error('Erro ao adicionar transação:', error);
      setFeedback('Erro ao adicionar transação. Tente novamente.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <FormContainer>
      <Form onSubmit={handleSubmit}>
        <FormGroup>
          <Label>Tipo</Label>
          <Select value={type} onChange={(e) => setType(e.target.value)}>
            <option value="receita">Receita</option>
            <option value="despesa">Despesa</option>
          </Select>
        </FormGroup>
        
        <FormGroup>
          <Label>Categoria</Label>
          <Select value={category} onChange={(e) => setCategory(e.target.value)}>
            <option value="">Selecione uma categoria</option>
            {type === 'receita' 
              ? incomeCategories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))
              : expenseCategories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))
            }
          </Select>
        </FormGroup>

        <FormGroup>
          <Label>Valor</Label>
          <Input
            type="number"
            value={value}
            onChange={(e) => setValue(e.target.value)}
          />
        </FormGroup>

        <FormGroup>
          <Label>Data</Label>
          <Input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />
        </FormGroup>

        <FormGroup>
          <Label>Descrição (opcional)</Label>
          <Input
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </FormGroup>

        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Adicionando...' : 'Adicionar Transação'}
        </Button>
        {feedback && (
          <p style={{ color: feedback.includes('Erro') ? 'var(--danger)' : 'var(--success)' }}>
            {feedback}
          </p>
        )}
      </Form>
    </FormContainer>
  );
};

export default TransactionForm;
