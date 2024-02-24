import { Client, Collection } from "discord.js";
import { promises as fs } from "fs";
import { BotClient, CommandType, typeCommand } from "../types";
import colorConsole from "../config/theme/consoleColors";
import path from "path";

const loadCommands = async (client: BotClient): Promise<void> => {

    let prefixCommandsCount = 0;
    let slashCommandsCount = 0;

    const loadDirectory = async (directory: string): Promise<void> => {
        try {
            const items = await fs.readdir(directory);

            for (const item of items) {
                const itemPath = path.join(directory, item); 
                const stat = await fs.stat(itemPath);

                if (stat.isDirectory()) {
                    await loadDirectory(itemPath);
                } else {
                    if (item.endsWith(".ts") || item.endsWith(".js")) { 
                        const command: CommandType = (await import(itemPath)).default;
                        const category = command.category || directory.split(path.sep).pop()?.toLowerCase() || "default";
                        const usage = command.usage || "Não especificado";

                        if (command.isActive) {
                            command.category = category;
                            command.usage = usage;

                            if (command.type === typeCommand.message || command.type === typeCommand.all) {
                                client.commands.set(command.name, command);
                                prefixCommandsCount++;
                            }

                            if (command.type === typeCommand.slash || command.type === typeCommand.all) {
                                client.slashCommands.set(command.name, command);
                                slashCommandsCount++;
                            }
                        }
                    }
                }
            }
        } catch (error) {
            console.error(`${colorConsole.red}Erro ao carregar os comandos: ${error}${colorConsole.reset}`);
        }
    };

    await loadDirectory(path.join(__dirname, "../commands"));

    console.log(`${colorConsole.green}✅ Comandos carregados:${colorConsole.reset} ${colorConsole.yellow}${prefixCommandsCount} prefixCommands${colorConsole.reset} | ${colorConsole.cyan}${slashCommandsCount} slashCommands${colorConsole.reset}`);
};

export default loadCommands;
