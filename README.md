# Kanban

## Requisitos

Este projeto usa o runtime Bun, e nao Node.js para executar o servidor.
Instale o Bun antes de abrir o projeto em outro computador:

```powershell
powershell -c "irm bun.sh/install.ps1 | iex"
```

Depois, na pasta do projeto, restaure as dependencias registradas no lockfile:

```powershell
bun install --frozen-lockfile
```

## Comandos

Verificar o TypeScript:

```powershell
bun run check
```

Iniciar o servidor:

```powershell
bun run start
```

## Por que aparecia erro

`node_modules` fica no `.gitignore` e nao deve ser versionado. Por isso, ao clonar ou copiar o projeto para outro PC, os pacotes `@types/bun` e `typescript` nao existem ate que `bun install` seja executado. Sem `@types/bun`, o TypeScript nao conhece `Bun`; sem o tipo `Tarefas`, o validador tambem nao pode ser compilado.