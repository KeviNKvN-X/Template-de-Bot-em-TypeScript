// Importações necessárias do discord.js e tipos
import { ApplicationCommandOptionType, CommandInteraction, Message, PermissionFlagsBits } from "discord.js";
import { categories } from "../config/categories/category";
import createCommand from "../config/commands/createCommand";
import { typeCommand } from "../types";

// Criação do comando 'example'
const commandExample = createCommand({
    name: "example", // Nome do comando
    description: "Comando de exemplo", // Descrição do comando
    category: categories.Utilitarios, // Categorização do comando
    // Define o tipo do comando, indicando se é um comando de texto, de interação ou ambos
    type: typeCommand.all, // tipo de comando, pode ser typeCommand.message que é para comando prefixo, typeCommand.slash que é para comando de interação e typeCommand.all que é para ambos
    usage: {
        prefix: "!example",
        slash: "/example",
    },
    permissions: [
        PermissionFlagsBits.Administrator // Permissões necessárias para utilizar o comando
    ],
    // Tempo de cooldown para evitar spam do comando, em segundos
    cooldown: 3, // tempo de cooldown para evitar spam do comando, se não informado, o comando não tem cooldown	
    isActive: true, // Define se o comando está ativo ou não
    slashCommandOptions: [ // Opções do comando para slashCommand, não obrigatorias
        {
            name: "message", // Nome da opção
            description: "Mensagem opcional para o comando", // Descrição da opção
            type: ApplicationCommandOptionType.String, // Tipo da opção
            required: true // Define se a opção é obrigatória
        }
    ],

    // Função de execução do comando, contendo a lógica principal
    execute: async (args: Message | CommandInteraction) => {
        // Inicializa a variável que armazenará a resposta
        let messageReply = "";

        // Verifica se o comando foi invocado como uma mensagem de texto/prefixo
        if (args instanceof Message) {
            // Extrai a mensagem após o comando, se houver
            const message = args.content.split(/\s+/).slice(1).join(' ');

            // Responde pedindo uma mensagem se nenhuma foi fornecida
            if (!message) {
                await args.reply("Por favor, insira uma mensagem.");
                return;
            }

            // Concatena a mensagem fornecida à resposta
            messageReply += `${message} `;

        // Verifica se o comando foi invocado como um comando de interação (barra)
        } else if (args instanceof CommandInteraction) {
            // Extrai a mensagem fornecida como opção do comando
            const message = args.options.get("message")?.value as string;

            // Concatena a mensagem fornecida à resposta
            if (message) {
                messageReply += `${message} `;
            }
        }

        // Envia a resposta concatenada
        await args.reply(messageReply);
    }
});

// Exporta o comando para que ele possa ser utilizado pelo bot
export default commandExample;
