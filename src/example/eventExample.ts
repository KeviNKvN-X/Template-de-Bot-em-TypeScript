import { Events } from "discord.js";
import { EventType } from "../types";


const EventExample: EventType = {
    name: Events.ClientReady, // Nome do evento
    once: true, // Se o evento ocorrer uma vez

    // Função de execução do evento, contendo a lógica principal
    execute: async (client) => {
        // codigo do evento aqui
        // exemplo console.log(`O bot ${client.user.tag} foi iniciado!`);
    }

}