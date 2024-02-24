import { EventType } from "../../types";
import PackageJson from "../../../package.json"
import colorConsole from "../../config/theme/consoleColors";
import { Events } from "discord.js";

const ReadyBot: EventType = {
    name: Events.ClientReady,
    once: true,
    execute: () => {
    
             console.log(`${colorConsole.greenBold}🟢 Versão: ${PackageJson.version}${colorConsole.reset}`);
             console.log(`${colorConsole.greenBold}🟢 Fui desenvolvido por ${colorConsole.whiteBoldOnGreen}${PackageJson.author}${colorConsole.reset}`);
    },
}

export default ReadyBot