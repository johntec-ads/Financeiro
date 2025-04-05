Okay, adicionei uma nova seção detalhando os comandos essenciais de commit (`git status`, `git add`, `git commit`) e quando usá-los, logo após a criação da branch.

Aqui está o tutorial atualizado em Markdown, pronto para ser copiado e convertido para PDF:

```markdown
# Tutorial Git/GitHub/VS Code: Gerenciamento de Branches via Terminal

Este tutorial foca no uso do terminal (integrado no VS Code ou externo) para gerenciar branches no Git e GitHub, cobrindo criação, commits essenciais, correção de erros e merge.

**Contexto:** Usuário do VS Code com projeto Git/GitHub buscando aprofundar o uso do terminal.

---

## Pré-requisitos

1.  **Git Instalado:** Verifique com `git --version`.
2.  **VS Code Instalado:** Com acesso ao terminal integrado (`Ctrl+` ou `Cmd+`).
3.  **Projeto Existente:** Pasta com `git init` já executado e, idealmente, conectado a um repositório remoto (`git remote add origin <URL>`).
4.  **Branch Principal:** Assumimos `master` ou `main`. Adapte os comandos se necessário.

---

## Parte 1: Criando uma Nova Branch (Boas Práticas)

**Objetivo:** Isolar novas funcionalidades ou correções sem afetar a version estável (`master`/`main`).

### Boas Práticas de Nomenclatura:

*   **Descritiva:** Indique o propósito (ex: `feature/login-screen`, `fix/bug-123`).
*   **Consistente:** Use prefixos (`feature/`, `fix/`, `hotfix/`, `release/`).
*   **Curta e Clara:** Evite ambiguidades.
*   **Use Hífens:** Separe palavras com `-`.

### Passos no Terminal do VS Code:

1.  **Abra o Terminal:** `Ctrl+` ou `Cmd+`.
2.  **Verifique e Vá para a Branch Principal:**
    ```bash
    git status # Verifica a branch atual
    # Se não estiver na principal, mude:
    git checkout master # ou git checkout main
    ```
3.  **(Recomendado) Atualize a Branch Principal:**
    ```bash
    git pull origin master # ou git pull origin main
    ```
4.  **Crie e Mude para a Nova Branch:** (Ex: `feature/login-screen`)
    ```bash
    # Opção 1: Tradicional
    git checkout -b feature/login-screen

    # Opção 2: Moderna
    git switch -c feature/login-screen
    ```
    *Confirmação: O terminal indicará a mudança.*
5.  **(Opcional) Publique a Nova Branch no GitHub:** (Necessário para colaborar/backup)
    ```bash
    git push -u origin feature/login-screen
    ```
    *O `-u` vincula a branch local à remota para futuros `git push`.*

**Agora você está na nova branch (`feature/login-screen`). É hora de começar a trabalhar e salvar seu progresso.**

---

## Parte 1.5: Trabalhando na Nova Branch: Salvando Alterações (Commit)

**Objetivo:** Registrar seu progresso em "snapshots" lógicos e recuperáveis (commits) dentro da sua branch (`feature/login-screen`).

O fluxo básico para salvar alterações é: **Modificar Arquivos -> Verificar Status -> Adicionar ao Stage -> Commitar**.

### Comandos Essenciais e Quando Usá-los:

1.  **`git status`**
    *   **Comando:** `git status`
    *   **O que faz:** Mostra o estado atual do seu diretório de trabalho e da área de staging. Lista arquivos modificados, arquivos novos (untracked) e arquivos que estão prontos para serem commitados (staged).
    *   **Quando usar:** **Frequentemente!**
        *   Antes de adicionar arquivos (`git add`), para ver *o que* será adicionado.
        *   Depois de adicionar arquivos, para confirmar o que está no staging area.
        *   Antes de commitar (`git commit`), para ter certeza do que será incluído no commit.
        *   Se você se sentir perdido ou quiser saber o que o Git está "pensando". É o seu comando de orientação.

2.  **`git add <arquivo | .>`**
    *   **Comando:**
        *   `git add nome_do_arquivo.js` (para adicionar um arquivo específico)
        *   `git add pasta/` (para adicionar todo o conteúdo de uma pasta)
        *   `git add .` (para adicionar **todas** as alterações [novos arquivos e modificações] no diretório atual e subdiretórios)
    *   **O que faz:** Adiciona as alterações do seu diretório de trabalho para a "Staging Area" (também chamada de "Index"). Pense na staging area como uma área de preparação onde você monta o próximo commit. Somente o que está na staging area será salvo no commit.
    *   **Quando usar:** Depois de fazer um conjunto lógico de alterações em um ou mais arquivos que você quer agrupar em um único commit. Use `git status` antes para ter certeza do que o `.` incluirá se usar `git add .`.

3.  **`git commit -m "Sua mensagem descritiva"`**
    *   **Comando:** `git commit -m "Mensagem descrevendo a alteração"`
    *   **O que faz:** Pega tudo que está na Staging Area (`git add`ed) e cria um novo "snapshot" permanente no histórico da sua branch atual. A `-m` permite que você escreva a mensagem do commit diretamente na linha de comando.
    *   **Quando usar:** Depois de ter adicionado (`git add`) todas as alterações que compõem uma unidade lógica de trabalho (ex: implementação de uma pequena feature, correção de um bug específico, refatoração de uma função).
    *   **Boas Práticas para Mensagens:**
        *   Seja claro e conciso.
        *   Comece com um verbo no imperativo (ex: "Adiciona", "Corrige", "Remove", "Refatora", "Atualiza").
        *   Descreva *o quê* a mudança faz, e opcionalmente *por quê*. Ex: `"Adiciona validação de email no formulário de contato"`, `"Corrige bug #123 que impedia login"`.

**Ciclo de Trabalho Típico na Branch:**

1.  Faça alterações no código (adicione/modifique/delete arquivos).
2.  Use `git status` para ver o que mudou.
3.  Use `git add .` (ou `git add <arquivo>`) para preparar as alterações desejadas para o commit.
4.  Use `git status` novamente (opcional, mas bom) para confirmar o que está staged.
5.  Use `git commit -m "Mensagem descritiva"` para salvar o snapshot.
6.  Repita o ciclo para a próxima unidade lógica de trabalho.

Lembre-se de fazer commits pequenos e focados. É mais fácil entender o histórico e reverter mudanças, se necessário.

---

## Parte 2: Lidando com Erros ("Perdi o Controle")

**Cenário:** Você fez commits na branch alternativa (`feature/login-screen`), mas o resultado não foi bom e precisa reverter ou descartar.

### Opção A: Descartar a Branch Inteira (Local e Remota)

*Use se a branch inteira está comprometida.*

1.  **Salve Código Útil (se houver):** Copie manualmente trechos importantes para fora do projeto.
2.  **Mude para a Branch Principal:**
    ```bash
    git checkout master # ou git checkout main
    ```
3.  **Delete a Branch Localmente (Forçado):**
    ```bash
    git branch -D feature/login-screen
    ```
    * `-D` (maiúsculo) força a deleção mesmo sem merge.*
4.  **Delete a Branch Remotamente (no GitHub):** (Se já publicou)
    ```bash
    git push origin --delete feature/login-screen
    ```
**Resultado:** A branch `feature/login-screen` é removida local e remotamente.

### Opção B: Desfazer Commits na Branch Atual (Reverter para um Estado Anterior)

*Use se quer manter a branch, mas voltar a um commit específico.*

**⚠️ CUIDADO:** Isso reescreve o histórico. **Perigoso** se a branch for compartilhada. Prefira `git revert` em branches colaborativas.

1.  **Identifique o Commit para Onde Voltar:**
    ```bash
    git log --oneline --graph
    # Anote o hash do commit desejado (ex: a1b2c3d)
    ```
2.  **Resete a Branch para Aquele Commit (Descartando Posteriores):**
    ```bash
    # Substitua 'a1b2c3d' pelo hash real
    git reset --hard a1b2c3d
    ```
    * `reset --hard` **descarta permanentemente** alterações e commits após o hash especificado.*
    * Use `git reflog` para encontrar hashes anteriores se precisar desfazer o reset.
3.  **Atualize a Branch Remota (Com Cuidado):** (Se já publicou os commits ruins)
    ```bash
    # Use --force-with-lease (mais seguro que --force)
    git push --force-with-lease origin feature/login-screen
    ```
    *Isso força o histórico remoto a espelhar o seu local reescrito.*

---

## Parte 3: Mesclando uma Branch com Sucesso na Master/Main

**Cenário:** O trabalho na `feature/login-screen` está concluído, testado e pronto para ser incorporado à `master`/`main`.

### Passos no Terminal (Merge Direto):

1.  **Finalize a Feature Branch:**
    *   Verifique `git status` (deve estar "working tree clean").
    *   Certifique-se que todos os commits necessários foram feitos (Parte 1.5).
    *   Envie os últimos commits (se remota): `git push origin feature/login-screen`.
2.  **Mude para a Branch Destino:**
    ```bash
    git checkout master # ou git checkout main
    ```
3.  **Atualize a Branch Destino:** **CRUCIAL** para evitar conflitos desnecessários.
    ```bash
    git pull origin master # ou git pull origin main
    ```
4.  **Mescle (Merge) a Feature Branch:**
    ```bash
    git merge feature/login-screen
    ```
    *   **Sem Conflitos:** O Git fará o merge (fast-forward ou criando um commit de merge).
    *   **Com Conflitos:**
        *   Git avisará: `Automatic merge failed; fix conflicts...`.
        *   Abra os arquivos conflitantes no VS Code (ele ajuda a visualizar com `<<<<<<<`, `=======`, `>>>>>>>`).
        *   Edite os arquivos, remova os marcadores e salve a versão correta.
        *   Adicione os arquivos resolvidos: `git add <arquivo_resolvido1> ...` ou `git add .`.
        *   Complete o merge: `git commit` (o Git sugere uma mensagem padrão).
5.  **Envie a Master/Main Atualizada para o GitHub:**
    ```bash
    git push origin master # ou git push origin main
    ```
6.  **(Boa Prática) Delete a Feature Branch (Já Mesclada):**
    *   **Localmente:**
        ```bash
        # -d minúsculo só deleta se já mesclada
        git branch -d feature/login-screen
        ```
    *   **Remotamente:**
        ```bash
        git push origin --delete feature/login-screen
        ```

### Alternativa: Fluxo com Pull Request (GitHub) - Recomendado

*Adiciona revisão e é padrão em equipes.*

1.  Após garantir que a branch `feature/login-screen` está completa e no GitHub (`git push -u origin feature/login-screen`), vá para a página do seu repositório no GitHub.
2.  Clique em "Compare & pull request" para a branch recém-enviada.
3.  Preencha a descrição do Pull Request (PR) e crie-o.
4.  **Revisão:** Você ou um colega revisa as alterações na interface do GitHub.
5.  **Merge:** Se aprovado, clique em "Merge pull request" no GitHub. O merge acontece no servidor remoto.
6.  **(Opcional)** Delete a branch remota pelo botão do GitHub após o merge.
7.  **Atualize Localmente:**
    ```bash
    # Volte para a branch principal
    git checkout master # ou git checkout main
    # Traga as alterações (incluindo o merge) do remoto
    git pull origin master # ou git pull origin main
    ```
8.  **Delete a Branch Local:**
    ```bash
    git branch -d feature/login-screen
    ```

---

## Conclusão

Dominar o fluxo de `status -> add -> commit` é fundamental para usar o Git eficientemente. Combinado com o gerenciamento de branches, permite um desenvolvimento mais organizado e seguro. Pratique esses comandos no terminal para ganhar fluência.
```

Agora o tutorial inclui a seção essencial sobre como salvar suas alterações durante o desenvolvimento na branch. Pode copiar e converter para PDF!