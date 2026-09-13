export const expenseCategories = [
  'Cartão de crédito',
  'Alimentação',
  'Moradia',
  'Transporte',
  'Saúde',
  'Educação',
  'Lazer',
  'Vestuário',
  'Outros'
];

export const incomeCategories = [
  'Salário',
  'Freelance',
  'Investimentos',
  'Contribuições',
  'Vendas',
  'Outros'
];

export const transactionCategories = {
  receita: {
    Pessoal: ['Salário', 'Freelance', 'Vendas', 'Outros'],
    Trabalho: ['Salário', 'Freelance', 'Vendas', 'Prestação de serviços', 'Outros'],
    'Família': ['Contribuições', 'Pensões', 'Doações recebidas', 'Outros'],
    Investimentos: ['Rendimentos', 'Dividendos', 'Juros', 'Resgates', 'Outros'],
    Outros: ['Outras receitas'],
  },
  despesa: {
    Pessoal: ['Alimentação', 'Transporte', 'Saúde', 'Lazer', 'Vestuário', 'Outros'],
    Trabalho: ['Transporte', 'Educação', 'Equipamentos', 'Impostos', 'Alimentação', 'Outros'],
    'Família': ['Alimentação', 'Moradia', 'Saúde', 'Educação', 'Vestuário', 'Outros'],
    Investimentos: ['Aplicações', 'Taxas', 'Corretagem', 'Impostos', 'Outros'],
    Outros: ['Cartão de crédito', 'Moradia', 'Educação', 'Saúde', 'Outros'],
  },
};
