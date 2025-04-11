// Se você estiver usando styled-components e acessando essa prop
// Altere de:
/*
const StyledSpan = styled.span`
  color: ${props => props.dueSoon ? 'red' : 'inherit'};
`;
*/

// Para:
const StyledSpan = styled.span`
  color: ${props => props['data-due-soon'] === 'true' ? 'red' : 'inherit'};
`;

// OU melhor ainda, use um prop específico do componente, não um atributo DOM:
const TransactionText = styled.span`
  color: ${props => props.isDueSoon ? 'red' : 'inherit'};
`;

// E então no componente:
// <TransactionText isDueSoon={isDueSoon(transaction.dueDate)}>
//   {transaction.description}
// </TransactionText>