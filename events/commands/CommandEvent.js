const { EvaluatePermissions, EvaluateParameters, EvalauteDatabaseCache, InvalidUsage } = require("../../structures/StructuresManager");
const { DeveloperModeEnabled, DeveloperModeServers } = require("../../utils/config.json");
const { Client, Collection, Message } = require("discord.js");
const { CommandCooldowns } = require("../../index");

/**
 * The event that formulates and parse commands
 * @param {Client} client The discord bot client
 * @param {Message} message A message sent by a user
 */
exports.CommandEvent = async (client, message) => {

    // check if developer mode is enabled
    if (DeveloperModeEnabled) {
        // enabled, check server
        if (!DeveloperModeServers.includes(message.guild.id)) {
            // not a developer server, return
            return;
        }
    }

    // fetch message if partial
    if (message.partial) {
        message.fetch()
            .then(fetchedMessage => {
                message = fetchedMessage;
            })
            .catch(() => { return; })
    }

    // fetch / update guild data for prefix information
    let GuildDataPacket = await EvalauteDatabaseCache({ id: message.guild.id, client: true });
    if (GuildDataPacket.error) {
        return;
    }

    // use the fetched prefix
    let messageParameters = message.content.split(" ");
    let suppliedPrefix = messageParameters[0].slice(0, GuildDataPacket.data.prefix.length);

    if (suppliedPrefix != GuildDataPacket.data.prefix) {
        // message is not a command
        return;
    }

    let CommandStructure = client.commands.get(messageParameters[0].substring(suppliedPrefix.length));
    if (!CommandStructure) {
        // invalid command, return
        return;
    }

    // evaluate cooldowns
    let CommandName = CommandStructure.name;
    if (!CommandCooldowns.has(CommandName)) {
        CommandCooldowns.set(CommandName, new Collection());
    }

    const TimeNow = Date.now();
    const CurrentCooldowns = CommandCooldowns.get(CommandName);
    const CooldownTime = CommandStructure.cooldown;

    if (CurrentCooldowns.has(message.author.id)) {
        let ExpirationTime = CurrentCooldowns.get(message.author.id) + CooldownTime
        if (TimeNow < ExpirationTime) {
            let TimeLeft = Math.floor((ExpirationTime - TimeNow) / 1000);
            // user is on cooldown, send message
        }
    }

    CurrentCooldowns.set(message.author.id, TimeNow);
    setTimeout(() => CurrentCooldowns.delete(message.author.id), CooldownTime);

    // check if command can be run in channel
    if (!CommandStructure.usageAreas.includes(message.channel.type)) {
        // return as it cannot
        return;
    }

    // evaluate parameters
    let EvaluatedParameters = await EvaluateParameters(message, CommandStructure.parameters);
    if (!EvaluatedParameters.success) {
        // error parsing the parameters
        if (CommandStructure.parameters.filter(param => param.required === "true")[0]) {
            return message.reply({ embeds: [InvalidUsage(CommandStructure, { prefix: suppliedPrefix })] });
        }
    }

    // evaluate permissions
    let EvaluatedPermissions = EvaluatePermissions(message, CommandStructure.permissions, EvaluatedParameters.parameters);
    if (EvaluatedPermissions.forbidden) {
        // no permissions
        if (EvaluatedParameters.user === "AUTHOR") {
            // author has insufficient perms
            return;
        } else if (EvaluatedParameters.user === "CLIENT") {
            // the bot has insufficient perms
            return;
        }
    }

    CommandStructure.execute(client, message, EvaluatedParameters.parameters);

}