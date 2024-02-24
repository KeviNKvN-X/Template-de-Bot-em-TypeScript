import { Client, Collection } from "discord.js";
import { intentsMap, partialIntentsMap } from "./config/intents";
import { config } from "dotenv";
import loadCommands from "./loaders/loadCommands";
import { BotClient, CommandType, EventType } from "./types";
import loadEvents from "./loaders/loadEvents";
import { registerCommands } from "./config/commands/registerCommands";
config();


const client: BotClient = new Client({
    intents: intentsMap,
    partials: partialIntentsMap,
    allowedMentions: {
        parse: ["users", "roles"],
        repliedUser: true,
    }
}) as BotClient

client.commands = new Collection<string, CommandType>();
client.slashCommands = new Collection<string, CommandType>();

const startBot = async () => {
    await loadCommands(client)
    await loadEvents(client)
    await registerCommands(client)

    await client.login(process.env.DISCORD_TOKEN)

}




startBot()

