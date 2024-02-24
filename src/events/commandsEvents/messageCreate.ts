import { Message, PermissionResolvable } from "discord.js"
import { CommandType, EventType, typeCommand } from "../../types"

const cooldowns = new Map();


const messageCreateEvent: EventType = {
    name: "messageCreate",
    once: false,
    execute: async (message) => {
        if (!message.content.startsWith('!') || message.author.bot) return;

        const args = message.content.slice(1).split(/ +/);
        const commandName = args.shift()?.toLowerCase();

        const command: CommandType = message.client.commands.get(commandName);

        if (!command) return;

        if (command.type !== typeCommand.message && command.type !== typeCommand.all) return;

        if (command.permissions) {
            const permissionMissing = command.permissions.filter(p => !message.member.permissions.has(p as PermissionResolvable));
            if (permissionMissing.length) {
                return message.reply("Você não tem permissão para usar este comando.");
            }
        }

        if (command.cooldown) {
            const now = Date.now();
            const timestamps = cooldowns.get(command.name) || new Map();
            const cooldownAmount = (command.cooldown || 0) * 1000;

            if (timestamps.has(message.author.id)) {
                const expirationTime = timestamps.get(message.author.id) + cooldownAmount;

                if (now < expirationTime) {
                    const timeLeft = (expirationTime - now) / 1000;
                    return message.reply(`Por favor, espere ${timeLeft.toFixed(1)} segundo(s) antes de reusar o comando \`${command.name}\`.`);
                }
            }

            timestamps.set(message.author.id, now);
            setTimeout(() => timestamps.delete(message.author.id), cooldownAmount);
            cooldowns.set(command.name, timestamps);
        }

        try {
            if (command.executeMessage) {
                await command.executeMessage(message);
            }
        } catch (error) {
            console.error(error);
            await message.reply('Ocorreu um erro ao executar este comando.');
        }
    }
}

export default messageCreateEvent