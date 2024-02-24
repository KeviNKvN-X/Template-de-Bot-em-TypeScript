import { GatewayIntentBits, Partials } from "discord.js";

const intentsWithComments: { [key in keyof typeof GatewayIntentBits]?: string } = {
    Guilds: "Acesso a eventos de guildas",
    GuildMembers: "Acesso a eventos de membros da guilda",
    GuildBans: "Acesso a eventos de banimentos",
    GuildEmojisAndStickers: "Acesso a emojis e stickers",
    GuildIntegrations: "Acesso a integrações",
    GuildWebhooks: "Acesso a webhooks",
    GuildInvites: "Acesso a convites",
    GuildVoiceStates: "Acesso a estados de voz",
    GuildPresences: "Acesso a presenças",
    GuildMessages: "Acesso a mensagens em guildas",
    GuildMessageReactions: "Acesso a reações em mensagens",
    GuildMessageTyping: "Acesso a digitação em guildas",
    DirectMessages: "Acesso a mensagens diretas",
    DirectMessageReactions: "Acesso a reações em mensagens diretas",
    DirectMessageTyping: "Acesso a digitação em mensagens diretas",
    MessageContent: "Acesso ao conteúdo das mensagens",
    GuildScheduledEvents: "Acesso a eventos agendados",
    AutoModerationConfiguration: "Configuração de auto moderação",
    AutoModerationExecution: "Execução de auto moderação",
};

const partialIntentsWithComments: { [key in keyof typeof Partials]?: string } = {
    Channel: "Canais",
    GuildMember: "Membros da guilda",
    GuildScheduledEvent: "Eventos agendados",
    Message: "Mensagens",
    Reaction: "Reacões",
    User: "Usuários",
    ThreadMember: "Membros da thread", 
  
}


const intentsMap = Object.keys(intentsWithComments).map((key) => GatewayIntentBits[key as keyof typeof GatewayIntentBits]);
const partialIntentsMap = Object.keys(partialIntentsWithComments).map((key) => Partials[key as keyof typeof Partials]);


export { intentsMap, partialIntentsMap, intentsWithComments, partialIntentsWithComments };