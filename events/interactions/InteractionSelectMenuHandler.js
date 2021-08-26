const { NewReactionRole, EditReactionRole, DeleteReactionRole } = require('./../../commands/reaction roles/structures/ReactionRolesStructuresManager');

exports.InteractionSelectMenuHandler = (client, interaction) => {
    
    // we received an select menu interaction
    
    let member = interaction.member
    let message = interaction.message

    if(interaction.values.some(v => /(?:rroles)/gm.test(v))) {
        // doing something w/ reaction roles
        let option = interaction.values[0]
        if(option === "new_rroles") {
            // create new reaction role
            return NewReactionRole(client, interaction);
        } else if (option === "edit_rroles") {
            // edit reaction role
            return EditReactionRole(client, interaction);
        } else {
            // delete reaction role
            return DeleteReactionRole(client, interaction);
        }
    }

}