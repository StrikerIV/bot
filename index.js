const { Client } = require("discord.js");
const { token } = require("./utils/config.json");

const EventsManager = require("./events/EventsManager.js");

console.log(EventsManager)
async function Initialize() {

    const client = new Client({
        partials: ['MESSAGE', 'CHANNEL', 'REACTION'],
        intents: ['GUILDS', 'GUILD_MEMBERS', 'GUILD_BANS', 'GUILD_MESSAGES', 'GUILD_MESSAGE_REACTIONS'],
    });

    const Events = EventsManager.load();

    client.once("ready", () => { Events.Ready(client) });

    client.login(token);

}

Initialize();