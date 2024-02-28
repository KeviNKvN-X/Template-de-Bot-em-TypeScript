import { ApplicationCommandOptionType, ColorResolvable, CommandInteraction, EmbedBuilder, Message, PermissionFlagsBits, TextChannel } from "discord.js";
import { categories } from "../../config/categories/category";
import createCommand from "../../config/commands/createCommand";
import { typeCommand } from "../../types";

const DeleteMessages = createCommand({
    name: "clear",
    description: "Limpar mensagens",
    category: categories.Moderacao,
    type: typeCommand.all,
    usage: {
        prefix: "!clear [quantidade]",
        slash: "/clear [quantidade]",
    },
    permissions: [
        PermissionFlagsBits.ManageMessages
    ],
    cooldown: 3,
    isActive: true,
    slashCommandOptions: [
        {
            name: "quantidade",
            description: "Quantidade de mensagens para limpar",
            type: ApplicationCommandOptionType.Integer,
            required: true
        }
    ],

    execute: async (args: Message | CommandInteraction) => {
        let quantity = 0;

        if (args instanceof Message) {
            const message = args.content.split(/\s+/).slice(1).join(' ');

            if (!message) {
                await args.reply("Por favor, insira uma quantidade de mensagens para limpar");
                return;
            }

            quantity = parseInt(message);

            if (isNaN(quantity)) {
                await args.reply("Por favor, insira um número de mensagens válido");
                return;
            }
        } else if (args instanceof CommandInteraction) {
            const message = args.options.get("quantidade")?.value as number;
            quantity = Math.floor(message);
        }

        if (quantity <= 0) {
            await args.reply("Por favor, insira uma quantidade de mensagens maior que 0");
            return;
        }

        const channel = args.channel;

        if (!channel || !(channel instanceof TextChannel)) {
            await args.reply("Por favor, envie este comando em um canal de texto");
            return;
        }   

        const embed = new EmbedBuilder()
            .setTitle("🧹 Limpeza de Mensagens")
            .setColor("#34eb46" as ColorResolvable)
            .setDescription(`Iniciando a limpeza de ${quantity} mensagens...`)
            .setFooter({ text: "Por favor, aguarde..." })

        await args.reply({ embeds: [embed] });

        const progressEmbed = new EmbedBuilder()
            .setColor("#3498db" as ColorResolvable)
            .setDescription("Iniciando a limpeza...");

        let progressMessage = await channel.send({ embeds: [progressEmbed] });
        let progressMessageId = progressMessage.id;

        const deleteMessages = async (amount: number): Promise<{ totalDeleted: number, oldMessagesFound: number }> => {
            let deleted = 0;
            let oldMessagesFound = 0;
            let batchCount = 0;
        
            while (amount > 0) {
                const toDelete = Math.min(amount, 100);
        
                const messages = await channel.messages.fetch({ limit: toDelete });
                messages.delete(progressMessageId); 
        
            
                const now = Date.now();
                const twoWeeks = 1000 * 60 * 60 * 24 * 14;
                const messagesToDelete = messages.filter(message => (now - message.createdTimestamp) < twoWeeks);
        
                oldMessagesFound += messages.size - messagesToDelete.size;
        
                if (messagesToDelete.size === 0) break;
        
                const deletedMessages = await channel.bulkDelete(messagesToDelete, true).catch(console.error);
                if (!deletedMessages) break;
                deleted += deletedMessages.size;
                amount -= toDelete;
                batchCount++;
        
                if (batchCount % 10 === 0) {
                    progressEmbed.setDescription(`Progresso da limpeza: ${deleted} mensagens limpas. ${oldMessagesFound > 0 ? `${oldMessagesFound} mensagem(ns) antiga(s) encontrada(s) e não pode(m) ser deletada(s).` : ''}`);
                    try {
                        progressMessage = await progressMessage.edit({ embeds: [progressEmbed] });
                    } catch (error) {
                        console.error("Erro ao atualizar a mensagem de progresso:", error);
                    }
                }
        
                if (deletedMessages.size < toDelete) break;
            }
            return { totalDeleted: deleted, oldMessagesFound: oldMessagesFound };
        };
        

        try {
            const { totalDeleted, oldMessagesFound } = await deleteMessages(quantity);
            embed.setTitle("✅ Limpeza Concluída")
                .setColor("#34eb46" as ColorResolvable)
                .setDescription(`Um total de **${totalDeleted}** mensagens foram limpas neste canal.` + (oldMessagesFound > 0 ? ` ${oldMessagesFound} mensagem(ns) antiga(s) não puderam ser deletadas por serem mais antigas que 14 dias.` : ''))
                .setFooter({ text: "Operação concluída com sucesso!" });
        } catch (error) {
            console.error(error);
        
            embed.setTitle("❌ Erro ao Limpar")
                .setColor("#eb3434" as ColorResolvable)
                .setDescription("Ocorreu um erro ao limpar as mensagens. Por favor, tente novamente mais tarde.")
                .setFooter({ text: "Ocorreu um erro." });
        }
        

        await progressMessage.edit({ embeds: [embed] });
    } 
});

export default DeleteMessages;
