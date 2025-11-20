import React, { useState } from 'react';
import styled from 'styled-components';
import { expenseCategories, incomeCategories } from '../constants/categories';
import { transactionTypes } from '../constants/transactionTypes';

const FormContainer = styled.div`
  background-color: var(--card-bg);
  padding: 2rem;
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-md);
  margin-bottom: 2rem;
  border: 1px solid var(--border);

  @media (max-width: 768px) {
    padding: 1.5rem;
  }
`;

const Form = styled.form`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
  width: 100%;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 1rem;
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
  font-size: 0.9rem;
`;

const Input = styled.input`
  padding: 0.75rem;
  border: 1px solid ${props => props.error ? 'var(--danger)' : 'var(--border)'};
  border-radius: var(--radius-md);
  font-size: 0.95rem;
  background-color: var(--background);
  transition: all 0.2s ease;
  
  &:focus {
    outline: none;
    border-color: ${props => props.error ? 'var(--danger)' : 'var(--primary)'};
    box-shadow: 0 0 0 3px ${props => props.error ? 'var(--danger-light)' : 'var(--primary-light)'};
  }
`;

const Select = styled.select`
  padding: 0.75rem;
  border: 1px solid ${props => props.error ? 'var(--danger)' : 'var(--border)'};
  border-radius: var(--radius-md);
  font-size: 0.95rem;
  background-color: var(--background);
  transition: all 0.2s ease;
  
  &:focus {
    outline: none;
    border-color: ${props => props.error ? 'var(--danger)' : 'var(--primary)'};
    box-shadow: 0 0 0 3px ${props => props.error ? 'var(--danger-light)' : 'var(--primary-light)'};
  }
`;

const Button = styled.button`
  background-color: var(--primary);
  color: white;
  padding: 0.875rem 1.5rem;
  border: none;
  border-radius: var(--radius-md);
  font-size: 1rem;
  font-weight: 600;
  width: 100%;
  margin-top: 1rem;
  box-shadow: var(--shadow-sm);

  &:hover {
    background-color: var(--primary-hover);
    transform: translateY(-1px);
    box-shadow: var(--shadow-md);
  }

  &:active {
    transform: translateY(0);
  }

  &:disabled {
    opacity: 0.7;
    cursor: not-allowed;
    transform: none;
  }

  @media (max-width: 768px) {
    padding: 1rem;
    margin-top: 0.5rem;
  }
`;

const ErrorMessage = styled.span`
  color: var(--danger);
  font-size: 0.875rem;
  margin-top: 0.25rem;
`;

const TransactionForm = ({ addTransaction, selectedMonth, selectedYear }) => {
  const [type, setType] = useState('receita');
  const [transactionType, setTransactionType] = useState('Pessoal');
  const [category, setCategory] = useState('');
  const [value, setValue] = useState('');
  const [date, setDate] = useState('');
  const [description, setDescription] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [feedback, setFeedback] = useState('');
  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};
    
    if (!type) newErrors.type = 'Selecione um tipo de transação';
    if (!transactionType) newErrors.transactionType = 'Selecione um grupo';
    if (!category) newErrors.category = 'Selecione uma categoria';
    if (!value || value <= 0) newErrors.value = 'Insira um valor válido';
    if (!date) newErrors.date = 'Selecione uma data';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setFeedback('');
    
    if (!validateForm()) {
      setIsSubmitting(false);
      return;
    }

    try {
      const transaction = {
        type,
        transactionType,
        category,
        value: parseFloat(value),
        date,
        description,
        isExpense: type === 'despesa'
      };

      await addTransaction(transaction);
      setFeedback('Transação adicionada com sucesso!');
      
      // Limpar formulário
      setType('receita');
      setCategory('');
      setValue('');
      setDate('');
      setDescription('');
      setErrors({});
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
          <Select 
            value={type} 
            onChange={(e) => setType(e.target.value)}
            error={errors.type}
            className="joyride-tipo"
          >
            <option value="">Selecione o tipo</option>
            <option value="receita">Receita</option>
            <option value="despesa">Despesa</option>
          </Select>
          {errors.type && <ErrorMessage>{errors.type}</ErrorMessage>}
        </FormGroup>

        <FormGroup>
          <Label>Grupo</Label>
          <Select 
            value={transactionType} 
            onChange={(e) => setTransactionType(e.target.value)}
            error={errors.transactionType}
            className="joyride-grupo"
          >
            <option value="">Selecione o grupo</option>
            {transactionTypes.map(type => (
              <option key={type} value={type}>{type}</option>
            ))}
          </Select>
          {errors.transactionType && <ErrorMessage>{errors.transactionType}</ErrorMessage>}
        </FormGroup>
        
        <FormGroup>
          <Label>Categoria</Label>
          <Select 
            value={category} 
            onChange={(e) => setCategory(e.target.value)}
            error={errors.category}
            className="joyride-categoria"
          >
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
          {errors.category && <ErrorMessage>{errors.category}</ErrorMessage>}
        </FormGroup>

        <FormGroup>
          <Label>Valor</Label>
          <Input
            type="number"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            error={errors.value}
            className="joyride-valor"
          />
          {errors.value && <ErrorMessage>{errors.value}</ErrorMessage>}
        </FormGroup>

        <FormGroup>
          <Label>Data</Label>
          <Input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            error={errors.date}
            className="joyride-data"
          />
          {errors.date && <ErrorMessage>{errors.date}</ErrorMessage>}
        </FormGroup>

        <FormGroup>
          <Label>Descrição (opcional)</Label>
          <Input
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="joyride-descricao"
          />
        </FormGroup>

        <Button type="submit" disabled={isSubmitting} className="add-transaction-btn">
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
