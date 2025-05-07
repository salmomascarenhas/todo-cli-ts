# 📝 todo-cli-ts

[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)  
> CLI de gerenciamento de tarefas em Node.js + TypeScript • Clean Architecture • DDD • ANSI Colors

---

## 📦 Visão Geral

**todo-cli-ts** é uma ferramenta de linha de comando para criar, listar, remover, concluir, desfazer conclusão e editar tarefas.  
Ela roda em um prompt interativo, suporta persistência em memória ou em **arquivo JSON**, e destaca informações com cores ANSI.

---

## 🚀 Funcionalidades

- **Adicionar** `add "Título da tarefa"`
- **Listar** `list`
- **Remover** `remove <id>`
- **Concluir** `complete <id>`
- **Desfazer conclusão** `undo <id>`
- **Editar título** `edit <id> "Novo título"`
- **Filtrar** `filter <palavra-chave>`
- **Help** `help`
- **Sair** `exit` / `quit`
- **Data/hora** de criação registrada automaticamente
- **Persistência** opcional em `tasks.json`
- **Saída colorida** para melhor legibilidade

---

## 🔧 Instalação

1. Clone o repositório:
   ```bash
   git clone git@github.com:salmomascarenhas/todo-cli-ts.git
   cd todo-cli-ts
    ```

2. Instale as dependências de desenvolvimento:

   ```bash
   npm install
   ```
3. Se quiser rodar sem compilar:

   ```bash
   npm run start
   ```
4. Para compilar para JavaScript e executar:

   ```bash
   npm run build
   node dist/index.js
   ```

---

## ⚙️ Uso

1. Ao iniciar, será perguntado:

   ```
   Deseja persistir dados em arquivo JSON? (s/N)
   ```

   * **s** ou **y**: grava em `tasks.json`
   * Qualquer outra tecla: mantém em memória

2. Você verá o prompt:

   ```
   > 
   ```

3. Digite um comando e pressione **Enter**.

---

## 📖 Exemplos

```bash
> add "Comprar pão"
➕ Tarefa criada: [a1b2c3d4] Comprar pão

> list
[ a1b2c3d4 ] ✖ Comprar pão (criada em 2025-05-07T14:30:00.000Z)

> complete a1b2c3d4
✅ Tarefa concluída: [ a1b2c3d4 ]

> undo a1b2c3d4
↩️ Tarefa pendente novamente: [ a1b2c3d4 ]

> edit a1b2c3d4 "Comprar pão e leite"
✏️ Tarefa renomeada: [ a1b2c3d4 ] Comprar pão e leite

> filter leite
[ a1b2c3d4 ] ✖ Comprar pão e leite (criada em 2025-05-07T14:30:00.000Z)

> remove a1b2c3d4
❌ Tarefa removida: [ a1b2c3d4 ]

> exit
Até a próxima! 👋
```

---

## 🏗 Arquitetura

Esta aplicação segue **Clean Architecture** e **Domain-Driven Design**:

```
┌──────────────────────┐
│ Interface / Adapters │ ← CLI REPL (readline + TaskController)
├──────────────────────┤
│   Use Cases          │ ← Create / List / Remove / Complete / Undo / Edit
├──────────────────────┤
│   Domain             │ ← Entidade rica Task + interfaces ITaskRepository, IIdGenerator
├──────────────────────┤
│ Infrastructure       │ ← InMemoryRepo, JsonFileRepo, UUIDGenerator, ANSI utils
└──────────────────────┘
```

* **Dependency Rule**: camadas externas dependem das internas.
* **Injeção de Dependência** no ponto de composição (`src/index.ts`).
* **Entidade rica** encapsula validações e comportamentos (complete, undo, changeTitle, matchesKeyword).

---

## 📁 Organização de Código

```
src/
├── cli/
│   └── task.controller.ts
├── domain/
│   ├── task.ts
│   ├── task.repository.ts
│   └── id-generator.ts
├── infra/
│   ├── in-memory-task.repository.ts
│   ├── json-file-task.repository.ts
│   └── uuid-generator.ts
├── use-cases/
│   ├── create-task.use-case.ts
│   ├── list-tasks.use-case.ts
│   ├── remove-task.use-case.ts
│   ├── complete-task.use-case.ts
│   ├── undo-complete-task.use-case.ts
│   └── change-task-title.use-case.ts
├── utils/
│   └── ansi-colors.ts
└── index.ts
```

---

## 🛠️ Tecnologias

* **Node.js** ≥14.17 (crypto.randomUUID)
* **TypeScript**
* APIs nativas: `readline`, `fs/promises`, `crypto`, `path`
* **Sem dependências externas** em runtime

---

## 🛣️ Roadmap

* Prioridades e ordenação de tarefas
* Campos de **due date** e listar **overdue**
* Etiquetas (**tags**) com filtro avançado
* Export/Import de JSON/CSV
* Testes unitários e de integração
* Empacotamento como binário (`pkg`, `oclif`)

---

## 🤝 Contribuição

1. Fork do projeto
2. Crie uma branch feature: `git checkout -b feature/nome-da-feature`
3. Faça commits claros e descritivos
4. Abra um Pull Request explicando sua proposta

---

## 📄 Licença

Este projeto está licenciado sob a **MIT License**. Veja o arquivo [LICENSE](LICENSE) para detalhes.

