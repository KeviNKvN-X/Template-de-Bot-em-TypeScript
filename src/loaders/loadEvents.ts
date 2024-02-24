import { Client, Collection } from "discord.js";
import { promises as fs } from "fs";
import path from "path";
import { BotClient, EventType } from "../types";
import colorConsole from "../config/theme/consoleColors";
import { eventNames } from "process";

const loadEvents = async (client: BotClient): Promise<void> => {
    let onceEventsCount = 0;
    let recurringEventsCount = 0;

 

    const loadEventFile = async (filePath: string): Promise<boolean> => {
        try {
            const modulePath = path.resolve(filePath);
            const module = await import(modulePath);

            const event: EventType = module.default;

            if (!event.name || typeof event.execute !== "function") {
                console.error(`${colorConsole.red}⚠️ Arquivo inválido: ${filePath} (faltando ${colorConsole.bold}nome${colorConsole.reset} ${colorConsole.red}ou ${colorConsole.bold}execute${colorConsole.reset} ${colorConsole.red}função.)${colorConsole.reset}`);
                return false;
            }

            if (event.once) {
               
                client.once(event.name, (...args) => event.execute(...args, client));
                onceEventsCount++;
            } else {
                
                client.on(event.name, (...args) => event.execute(...args, client));
                recurringEventsCount++;
            }

            return true;
        } catch (error) {
            console.error(`${colorConsole.red}⚠️ Falha ao carregar arquivo de evento ${filePath}: ${error}${colorConsole.reset}`);
            return false;
        }
    };

    const loadDirectory = async (directory: string): Promise<void> => {
        try {
            const items = await fs.readdir(directory);

            for (const item of items) {
                const filePath = path.join(directory, item);
                const stat = await fs.stat(filePath);

                if (stat.isDirectory()) {
                    await loadDirectory(filePath);
                } else {
                    await loadEventFile(filePath);
                }
            }
        } catch (error) {
            console.error(`${colorConsole.red}⚠️ Falha ao carregar eventos: ${error}${colorConsole.reset}`);
        }
    };

    await loadDirectory(path.join(__dirname, "../events"));

 
    console.log(`${colorConsole.green}✅ Eventos carregados: ${colorConsole.yellow}${onceEventsCount} once${colorConsole.reset} | ${colorConsole.cyan}${recurringEventsCount} recurring${colorConsole.reset}`);
}

export default loadEvents;
