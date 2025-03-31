const financeiro = {
    transacoes: [],
    
    adicionarTransacao() {
        const descricao = document.getElementById('descricao').value;
        const valor = parseFloat(document.getElementById('valor').value);
        const tipo = document.getElementById('tipo').value;
        
        if (descricao && valor) {
            this.transacoes.push({ descricao, valor, tipo });
            this.atualizarLista();
            this.limparCampos();
        }
    },

    atualizarLista() {
        const lista = document.getElementById('lista-transacoes');
        lista.innerHTML = '';
        
        let saldo = 0;
        
        this.transacoes.forEach(transacao => {
            const valor = transacao.tipo === 'entrada' ? transacao.valor : -transacao.valor;
            saldo += valor;
            
            lista.innerHTML += `
                <div class="${transacao.tipo}">
                    ${transacao.descricao}: R$ ${Math.abs(transacao.valor).toFixed(2)}
                </div>
            `;
        });
        
        document.getElementById('saldo').textContent = `Saldo: R$ ${saldo.toFixed(2)}`;
    },

    limparCampos() {
        document.getElementById('descricao').value = '';
        document.getElementById('valor').value = '';
    }
};
