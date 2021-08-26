const { Client, Interaction } = require("discord.js");
const { NewReactionRole, EditReactionRole } = require("./../../commands/reaction roles/structures/ReactionRolesStructuresManager");

/**
 * The event that formulates and parse interaction commands
 * @param {Client} client The discord bot client
 * @param {Interaction} interaction The command interaction
 */
exports.InteractionButtonHandler = async (client, interaction) => {

    // we received an select menu interaction

    let member = interaction.member
    let message = interaction.message

    if (interaction.customId.includes("rroles")) {
        // doing something w/ reaction roles
        let option = interaction.customId
        if(option === "new_message_rroles" || option === "add_role_rroles" || option === "remove_role_rroles" || option === "post_rroles") {
            return NewReactionRole(client, interaction);
        } else if (option === "existing_message_rroles") {
            return EditReactionRole(client, interaction);
        }
    }

}
