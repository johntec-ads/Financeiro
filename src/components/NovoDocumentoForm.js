import React, { useState } from 'react';
import { db } from '../services/firebase';
import { collection, addDoc } from 'firebase/firestore';

function NovoDocumentoForm() {
  const [tipo, setTipo] = useState('receita'); // Valor padrão
  const [valor, setValor] = useState('');
  const [data, setData] = useState('');
  const [categoria, setCategoria] = useState('');
  const [descricao, setDescricao] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await addDoc(collection(db, "transacoes"), { // Mudando para "transacoes"
        tipo: tipo,
        valor: parseFloat(valor), // Converte para número
        data: data,
        categoria: categoria,
        descricao: descricao
      });

      // Limpa o formulário
      setTipo('receita');
      setValor('');
      setData('');
      setCategoria('');
      setDescricao('');
    } catch (error) {
      console.error("Erro ao adicionar transação: ", error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <label>
        Tipo:
        <select value={tipo} onChange={(e) => setTipo(e.target.value)}>
          <option value="receita">Receita</option>
          <option value="despesa">Despesa</option>
        </select>
      </label>
      <br />
      <label>
        Valor:
        <input
          type="number"
          value={valor}
          onChange={(e) => setValor(e.target.value)}
        />
      </label>
      <br />
      <label>
        Data:
        <input
          type="date"
          value={data}
          onChange={(e) => setData(e.target.value)}
        />
      </label>
      <br />
      <label>
        Categoria:
        <input
          type="text"
          value={categoria}
          onChange={(e) => setCategoria(e.target.value)}
        />
      </label>
      <br />
      <label>
        Descrição:
        <input
          type="text"
          value={descricao}
          onChange={(e) => setDescricao(e.target.value)}
        />
      </label>
      <br />
      <button type="submit">Adicionar Transação</button>
    </form>
  );
}

export default NovoDocumentoForm;
