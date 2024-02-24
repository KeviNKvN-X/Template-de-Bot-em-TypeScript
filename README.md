# 🤖 Template de Bot em TypeScript

Uma base para criação de bots Discord em TypeScript, totalmente livre e de fácil utilização.

## 📋 Pré-requisitos

Este projeto requer **Node.js** e **npm**. Certifique-se de ter ambos instalados antes de prosseguir.

- [Download Node.js e npm](https://nodejs.org/)

## 🛠 Instalação

Siga estes passos para configurar o bot para uso local.

### Clone o Repositório

```bash
git clone https://github.com/KeviNKvN-X/Template-de-Bot-em-TypeScript
cd Template-de-Bot-em-TypeScript
```

### Instale as Dependências

Na raiz do seu projeto, execute:

```bash
npm install
```

Isso instalará todas as dependências necessárias para rodar o bot.

## ⚙️ Configuração

### Configure o Arquivo `.env`

Copie o arquivo `.env.example` para criar um novo arquivo `.env`:

```bash
cp .env.example .env
```

Edite o arquivo `.env` com as suas configurações específicas (tokens, chaves API, etc.).

Exemplo de variáveis no `.env`:

```plaintext
DISCORD_BOT_TOKEN=seu_token_aqui
DISCORD_CLIENT_ID=seu_client_id_aqui
```

### Inicie o Bot

Para iniciar o bot em modo de desenvolvimento, use:

```bash
npm run start:dev
```

## 🖥 Uso

### Criação de Comandos

Para criar novos comandos para o bot, você pode seguir o exemplo fornecido em `src/examples/commandExample.ts`. Este arquivo contém um template básico para a estruturação de comandos.

```typescript
// Exemplo simplificado da estrutura de um comando
import { typeCommand } from "../types";
import createCommand from "../../config/commands/createCommand";
import { categories } from "../../config/categories/category";

const commandExample = createCommand({
    name: "comando",
    description: "Descricão do comando",
    category: categories.category,
    usage: {
        prefix: "!comando [message]",
        slash: "/comando [message]",
    },
    isActive: true,
    cooldown: 0,
    type: typeCommand.all,
    slashCommandOptions?: [],
    permissions: [],
    execute: async (args: Message | CommandInteraction) =>{
        // codigo do comando
     }
})
```

### Criação de Eventos

Para integrar novos eventos ao bot, siga o exemplo em `src/events/eventExample.ts`.

```typescript
// Exemplo de implementação de um evento
import { Events } from "discord.js";
import { EventType } from "../types";

const EventExample: EventType = {
    name: Events.ClientReady,
    once: true,
    execute: async (client) => {
        console.log(`O bot ${client.user.tag} foi iniciado!`);
    }
}

export default EventExample;
```

## 🤝 Contribuindo

Contribuições são sempre bem-vindas! Veja `CONTRIBUTING.md` para mais informações sobre como contribuir para este projeto.

## 📄 Licença

Este projeto está licenciado sob a Licença MIT - veja o arquivo [LICENSE](LICENSE) para mais detalhes.

## 📞 Contato

**Kevin Luan Damm**

Para dúvidas, contatos e feedbacks, me chame no meu discord: `kevinkvn_`

**URL do projeto:** [https://github.com/kevinkvn/bot-ts](https://github.com/KeviNKvN-X/Template-de-Bot-em-TypeScript.git)
