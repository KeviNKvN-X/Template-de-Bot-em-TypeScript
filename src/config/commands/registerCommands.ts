import { config } from "dotenv";
import { REST, Routes } from "discord.js";
import { BotClient, CommandType } from "../../types";
import colorConsole from "../theme/consoleColors";

config();


const { DISCORD_TOKEN: token, CLIENT_ID: clientId } = process.env;




const fetchCommands = async (): Promise<CommandType[]> => {
    if (!token || !clientId) {
        console.error("Token ou ID do cliente inválidos");
        return [];
    }

    try {
        const rest = new REST({ version: "10" }).setToken(token);
        const data = await rest.get(Routes.applicationCommands(clientId));
        return data as CommandType[];
    } catch (error) {
        console.error("Failed to fetch commands:", error);
        return [];
    }
};



const toAPIFormat = (command: CommandType) => {
    return {

        name: command.name,
        description: command.description,
        options: command.slashCommandOptions,
    };
}


export const registerCommands = async (client: BotClient): Promise<void> => {
    if (!token || !clientId) {
        console.error(`${colorConsole.red}Token ou ID do cliente inválidos${colorConsole.reset}`);
        throw new Error("Token ou ID do cliente inválidos");
    }


    const existingCommands = await fetchCommands();


    const commandsToUpdate = client.slashCommands.map(toAPIFormat);

    const rest = new REST({ version: "10" }).setToken(token);

    try {
        for (const command of commandsToUpdate) {
            const existingCommand = existingCommands.find(c => c.name === command.name);


            if (existingCommand) {

                if (JSON.stringify(command) !== JSON.stringify(existingCommand)) {

                    if (existingCommand && existingCommand.id) {
                        await rest.patch(Routes.applicationCommand(clientId, existingCommand.id), { body: command });
                    } else {
                        console.log(`Comando ${command.name} não encontrado ou ID indefinido.`);
                    }

                    console.log(`${colorConsole.green}✅ Comando "${command.name}" atualizado${colorConsole.reset}`);
                }
            } else {

                await rest.post(Routes.applicationCommands(clientId), { body: command });
                console.log(`${colorConsole.green}✅ Comando "${command.name}" registrado${colorConsole.reset}`);
            }

        }

        console.log(`${colorConsole.green}✅ Todos os comandos foram registrados/atualizados${colorConsole.reset}`);
    } catch (error) {
        console.error(`${colorConsole.red}Falha ao registrar/atualizar comandos: ${error}${colorConsole.reset}`);
        throw error;

    }

};
