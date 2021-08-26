const { Interaction } = require("discord.js");
const { InteractionButtonHandler } = require("./interactions/InteractionButtonHandler");
const { InteractionSelectMenuHandler } = require("./interactions/InteractionSelectMenuHandler");

/**
 * Event that formulates and parse interactions
 * @param {Client} client The discord bot client
 * @param {Interaction} interaction A message sent by a user
 */
exports.InteractionHandler = async (client, interaction) => {

    if(interaction.isSelectMenu()) {
        return InteractionSelectMenuHandler(client, interaction);
    }

    if(interaction.isButton()) {
        return InteractionButtonHandler(client, interaction);
    }
}