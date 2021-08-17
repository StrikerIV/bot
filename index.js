const { Client, Collection } = require("discord.js");
const { token } = require("./utils/config.json");
const { parse } = require("path");

const EventsManager = require("./events/EventsManager.js");
const glob = require("glob");

async function Initialize() {

    console.log("Initializing.")

    const Events = await EventsManager.load();
    const client = new Client({
        partials: ['MESSAGE', 'CHANNEL', 'REACTION'],
        intents: ['GUILDS', 'GUILD_MEMBERS', 'GUILD_BANS', 'GUILD_MESSAGES', 'GUILD_MESSAGE_REACTIONS'],
    });

    client.commands = new Collection();
    client.on("messageCreate", Events.CommandEvent.bind(null, client));

    glob(__dirname + "/commands/**/*{.js}", (_, files) => {
        files.forEach(file => {
            console.log("here")
            console.log(parse(file))
            const { name } = parse(file)
            const props = require(file)
            client.commands.set(name, props);
        })
    });

    client.once("ready", Events.ready(client));

    client.login(token);

}

Initialize();