import { ApplicationCommandOptionData, CommandInteraction, Message, PermissionResolvable } from "discord.js";
import { CommandType, category, typeCommand, usageType } from "../../types";

function createCommand(options: {
    name: string,
    description: string,
    type: typeCommand,
    usage: usageType,
    cooldown?: number,
    permissions?: PermissionResolvable[],
    category: category,
    isActive: boolean,
    slashCommandOptions?: ApplicationCommandOptionData[],
    execute: (args: CommandInteraction | Message, options?: any) => Promise<void>
}): CommandType {
    const { name, description, type, usage, cooldown, permissions, category, isActive, slashCommandOptions, execute } = options;

    return {
        name,
        description,
        type,
        usage,
        cooldown,
        permissions,
        category,
        slashCommandOptions,
        isActive,

        executeInteraction: async (args: CommandInteraction) => {
            try {
                const options = args.options;
                await execute(args, options);
            } catch (error) {
                console.log(error);
                args.reply({ content: "Ocorreu um erro ao executar o comando.", ephemeral: true });
            }
        },

        executeMessage: async (args: Message) => {
            try {
                const content = args.content.split(/\s+/).slice(1);
                await execute(args, { content });
            } catch (error) {
                console.log(error);
                args.reply({ content: "Ocorreu um erro ao executar o comando." });

                setTimeout(() => args.delete(), 5000);
            }
        }
    };
}

export default createCommand;

