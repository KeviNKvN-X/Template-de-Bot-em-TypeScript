import { Events, Interaction, InteractionType } from "discord.js";
import { BotClient, CommandType, EventType, typeCommand } from "../../types";
import colorConsole from "../../config/theme/consoleColors";

const cooldowns = new Map();

const interactionCreateEvent: EventType = {
    name: "interactionCreate",
    once: false,

    execute: async (interaction) => {
        if (!interaction.isCommand()) return;

        const command: CommandType = interaction.client.commands.get(interaction.commandName);


        if (!command) return;

        if ((command.type === typeCommand.slash && !interaction.isCommand()) ||
            (command.type === typeCommand.message && !interaction.isMessageComponent())) {
            return;
        }


        if (command.permissions) {
            const permissionMissing = command.permissions.filter(p => !interaction.member.permissions.has(p));
            if (permissionMissing.length) {
                return interaction.reply({
                    content: "Você não tem permissão para usar este comando.",
                    ephemeral: true,
                });
            }
        }

        if (command.cooldown) {
            const now = Date.now();
            const timestamps = cooldowns.get(command.name) || new Map();
            const cooldownAmount = (command.cooldown || 0) * 1000;

            if (timestamps.has(interaction.user.id)) {
                const expirationTime = timestamps.get(interaction.user.id) + cooldownAmount;

                if (now < expirationTime) {
                    const timeLeft = (expirationTime - now) / 1000;
                    return interaction.reply({
                        content: `Por favor, espere ${timeLeft.toFixed(1)} segundo(s) antes de reusar o comando \`${command.name}\`.`,
                        ephemeral: true,
                    });
                }
            }

            timestamps.set(interaction.user.id, now);
            setTimeout(() => timestamps.delete(interaction.user.id), cooldownAmount);
            cooldowns.set(command.name, timestamps);
        }

        if (!command.isActive) {
            return interaction.reply({
                content: "Este comando está temporariamente indisponível.",
                ephemeral: true,
            });
        }

        try {
            if (command.executeInteraction && interaction.isCommand()) {
                await command.executeInteraction(interaction);
            } else if (command.executeMessage && interaction.isMessageComponent()) {
                await command.executeMessage(interaction);
            }
        } catch (error) {
            console.error(error);
            await interaction.reply({
                content: "Ocorreu um erro ao executar este comando.",
                ephemeral: true,
            });
        }

    }
};

export default interactionCreateEvent;
