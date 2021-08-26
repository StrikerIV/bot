const { MessageActionRow, MessageSelectMenu, MessageEmbed, Collection } = require("discord.js");
const { CommandStructure } = require("./../../structures/StructuresManager");
const { EmbedColors } = require('./../../utils/config.json');

const ReactionRoleCreating = new Collection();

async function run(client, message, parameters) {

    if (!parameters) {
        // just the base command
        // ask what they want to do 

        // set variable to track roles
        ReactionRoleCreating.set(message.author.id, { Config: { type: null }, ReactionRoles: [] })

        const AskEmbed = new MessageEmbed()
            .setColor(EmbedColors.static)
            .setDescription('Select an option below:');

        const SelectMenu = new MessageActionRow()
            .addComponents(
                new MessageSelectMenu()
                    .setCustomId('selectionOnRROLES')
                    .setPlaceholder('Nothing Selected')
                    .addOptions([
                        {
                            label: 'New reaction role',
                            description: 'Create a new reaction role',
                            value: 'new_rroles',
                            emoji: '➕'
                        },
                        {
                            label: 'Edit reaction role',
                            description: 'Edit an existing reaction role',
                            value: 'edit_rroles',
                            emoji: '🛠️'
                        },
                        {
                            label: 'Delete reaction role',
                            description: 'Delete an existing reaction role',
                            value: 'delete_rroles',
                            emoji: '❌'
                        }
                    ])
            );

        await message.reply({ embeds: [AskEmbed], components: [SelectMenu] });

    }

}

module.exports = new CommandStructure({
    name: "rroles", category: "reaction-roles", parameters: [
        {
            type: "Argument",
            required: false,
        },
        {
            type: "Argument",
            required: false,
        },
        {
            type: "Argument",
            required: false
        },
    ],
    permissions: {
        author: ["KICK_MEMBERS"],
        client: ["KICK_MEMBERS"],
    },
    execute: run
})

module.exports.ReactionRoleCreating = ReactionRoleCreating;