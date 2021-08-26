const { Client, Collection } = require("discord.js");
const { token } = require("./utils/config.json");
const { parse } = require("path");

const EventsManager = require("./events/EventsManager.js");
const path = require('path');
const glob = require("glob");

const DatabaseCache = new Collection();
const CommandCooldowns = new Collection();

async function Initialize() {

    console.log("Initializing.")

    const Events = await EventsManager.load();
    const client = new Client({
        partials: ['MESSAGE', 'CHANNEL', 'REACTION'],
        intents: ['GUILDS', 'GUILD_MEMBERS', 'GUILD_BANS', 'GUILD_MESSAGES', 'GUILD_MESSAGE_REACTIONS'],
    });

    client.commands = new Collection();
    client.on("messageCreate", Events.CommandEvent.bind(null, client));

    glob(__dirname + "/commands/**/*.js", (_, files) => {
        files.forEach(file => {
            if(path.basename(path.dirname(file)) === "structures") return;
            const { name } = parse(file)
            const props = require(file)
            client.commands.set(name, props);
        })
    });

    client.once('ready', () => { Events.Ready(client) });

    client.on('interactionCreate', (interaction) => Events.InteractionHandler(client, interaction))

    client.on('messageReactionAdd', (reaction, user) => Events.MessageReactionAdd(client, reaction, user));
    client.on('messageReactionRemove', (reaction, user) => Events.MessageReactionRemove(client, reaction, user));
    client.login(token);

}

Initialize();

module.exports.CommandCooldowns = CommandCooldowns;
module.exports.DatabaseCache = DatabaseCache;