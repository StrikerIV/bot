const emojiUnicode = require("emoji-unicode");

const { EmbedColors } = require("./../../../utils/config.json");
const { MessageCollector, ReactionCollector, DatabaseQuery, BotError, BotSuccess } = require("./../../../structures/StructuresManager");
const { MessageActionRow, MessageButton, MessageEmbed } = require("discord.js")

const { ReactionRoleCreating } = require('../rroles');

class ReactionRole {
    constructor(props) {
        this.role = props.role
        this.emoji = props.emoji
        this.guildEmoji = props.guildEmoji || false
    }
}

module.exports = async (client, interaction) => {

    async function ShowCurrentRoles(client, message) {

        let CurrentRoles = ReactionRoleCreating.get(interaction.user.id).ReactionRoles
        let CurrentRolesString = ""

        if (CurrentRoles[0]) {
            CurrentRoles.forEach(rrole => {
                CurrentRolesString = CurrentRolesString.concat(`${rrole.emoji} --> ${rrole.role}\n`)
            })
        } else {
            CurrentRolesString = "There are no reaction roles currently."
        }

        let ShowCurrentRolesEmbed = new MessageEmbed()
            .setColor(EmbedColors.static)
            .setDescription(`This is what your reaction roles currently look like: \n\n${CurrentRolesString}\n\nYou can add / remove more roles,\nor you can be done.`)

        const Buttons = new MessageActionRow()
            .addComponents(
                new MessageButton()
                    .setCustomId('add_role_rroles')
                    .setLabel("Add a role")
                    .setStyle("PRIMARY"),
                new MessageButton()
                    .setCustomId("remove_role_rroles")
                    .setLabel("Remove a role")
                    .setStyle("PRIMARY")
                    .setDisabled(!CurrentRoles[0] ? true : false),
                new MessageButton()
                    .setCustomId("post_rroles")
                    .setLabel("Finished!")
                    .setStyle("PRIMARY")
                    .setDisabled(!CurrentRoles[0] ? true : false)

            )

        await message.reply({ embeds: [ShowCurrentRolesEmbed], components: [Buttons] });

    }

    // create a new reaction roles handler
    let option = interaction.customId || interaction.values[0]

    if (option === "add_role_rroles") {

        let AskForRole = new MessageEmbed()
            .setColor(EmbedColors.static)
            .setDescription("Supply the role to add.")

        await interaction.reply({ embeds: [AskForRole] })

        let SuppliedRole = await MessageCollector(interaction.channel, { author: interaction.user });
        let FetchedRole = await interaction.message.guild.roles.resolve(SuppliedRole.first().content.replace(/\D/gm, ""))
        if (!FetchedRole) {
            return SuppliedRole.first().reply({ embeds: [BotError({ description: "This role is invalid." })] })
        }

        // role is valid, ask for emoji that we react to
        let AskForEmoji = new MessageEmbed()
            .setColor(EmbedColors.static)
            .setDescription("React to this message for the emoji.")

        let AskMessage = await interaction.message.channel.send({ embeds: [AskForEmoji] })
        let SuppliedEmoji = await ReactionCollector(AskMessage, { author: interaction.user })
        if (!SuppliedEmoji) {
            return SuppliedRole.first().reply({ embeds: [BotError({ description: "This emoji is invalid." })] })
        }

        let ReactionRoleData = ReactionRoleCreating.get(interaction.user.id)
        let SavedRoles = ReactionRoleData.ReactionRoles
        // push made role into the collection
        let ReactionRoleObject = new ReactionRole({ role: FetchedRole, emoji: SuppliedEmoji.first().emoji, guildEmoji: SuppliedEmoji.first().emoji.constructor.name === "GuildEmoji" ? true : false })
        SavedRoles.push(ReactionRoleObject)
        ReactionRoleData.ReactionRoles = SavedRoles

        ReactionRoleCreating.set(interaction.user.id, ReactionRoleData)
        return ShowCurrentRoles(client, AskMessage)

    } else if (option === "remove_role_rroles") {
        let AskForRole = new MessageEmbed()
            .setColor(EmbedColors.static)
            .setDescription("Supply the role to remove.")

        let AskMessage = await interaction.channel.send({ embeds: [AskForRole] })

        let SuppliedRole = await MessageCollector(interaction.channel, { author: interaction.user });
        let FetchedRole = await interaction.message.guild.roles.resolve(SuppliedRole.first().content.replace(/\D/gm, ""))
        if (!FetchedRole) {
            return SuppliedRole.first().reply({ embeds: [BotError({ description: "This role is invalid." })] });
        }

        let ReactionRoleData = ReactionRoleCreating.get(interaction.user.id)
        let CurrentRoles = ReactionRoleData.ReactionRoles;
        let NewRoles = CurrentRoles.filter(rroles => rroles.role != FetchedRole);
        ReactionRoleData.ReactionRoles = NewRoles

        ReactionRoleCreating.set(interaction.user.id, ReactionRoleData);
        return ShowCurrentRoles(client, AskMessage);

    } else if (option === "new_message_rroles") {
        // reaction role on new message
        let CurrentRoles = ReactionRoleCreating.get(interaction.user.id)
        CurrentRoles.Config.type = "new"
        ReactionRoleCreating.set(interaction.user.id, CurrentRoles)

        let ReactionRoleEmbed = new MessageEmbed()
            .setColor(EmbedColors.static)
            .setDescription("This is the reaction role creation menu. \n\nClick the buttons below to get started.")

        const Buttons = new MessageActionRow()
            .addComponents(
                new MessageButton()
                    .setCustomId('add_role_rroles')
                    .setLabel("Add a role")
                    .setStyle("PRIMARY"),
                new MessageButton()
                    .setCustomId("remove_role_rroles")
                    .setLabel("Remove a role")
                    .setStyle("PRIMARY")
                    .setDisabled(!CurrentRoles[0] ? true : false)
            )

        await interaction.reply({ embeds: [ReactionRoleEmbed], components: [Buttons] });

    } else if (option === "existing_message_rroles") {
        // reaction role on existing message
    } else if (option === "post_rroles") {
        // post the reaction roles on a new message
        // ask for description of message & where to post
        let ReactionRolesData = ReactionRoleCreating.get(interaction.user.id)
        if (ReactionRolesData.Config.type === "new") {
            // creating reaction role w/ new message
            let AskForDescription = new MessageEmbed()
                .setColor(EmbedColors.static)
                .setDescription("What description would you like the reaction role embed to have?\n\nWe do not show which reactions link to certain roles;\nso implement this into your description if needed.")

            let DescriptionMessage = await interaction.channel.send({ embeds: [AskForDescription] })
            let SuppliedDescription = await MessageCollector(interaction.channel, { author: interaction.user, time: 600000 })
            
            let AskForChannel = new MessageEmbed()
                .setColor(EmbedColors.static)
                .setDescription("Supply a channel for the reaction roles to be sent to.")

            let AskChannelMessage = await DescriptionMessage.channel.send({ embeds: [AskForChannel] })
            let SuppliedChannel = await MessageCollector(interaction.channel, { author: interaction.user })
            let FetchedChannel = await interaction.guild.channels.fetch(SuppliedChannel.first().content.replace(/\D/gm, ""))
            if(!FetchedChannel) {
                return SuppliedChannel.first().reply({ embeds: [BotError({ description: "This channel is invalid." })] });
            }

            let ReactionRolesEmbed = new MessageEmbed()
                .setColor(EmbedColors.static)
                .setDescription(`${SuppliedDescription.first().content}`)

            let ReactionRolesMessage = await FetchedChannel.send({ embeds: [ReactionRolesEmbed] })

            // react with the emojis
            // and post to database 
            let ReactionRoles = ReactionRolesData.ReactionRoles

            for await (let ReactionRole of ReactionRoles) {
                await ReactionRolesMessage.react(ReactionRole.emoji)

                let query = `INSERT INTO guilds_reaction_roles(message_id, reaction_id, role_id, guildEmoji) VALUES(?, ?, ?, ?)`
                let params = [ReactionRolesMessage.id, ReactionRole.emoji.id || emojiUnicode(ReactionRole.emoji.name), ReactionRole.role.id, ReactionRole.guildEmoji === true ? 1 : 0]
                let PostQuery = await DatabaseQuery(query, params)
                if(PostQuery.error) {
                    AskChannelMessage.channel.send({ embeds: [BotError({ description: "We were unable to post the reaction roles to our database. Try again, or contact support." })]})
                }
            }

            return interaction.channel.send({ embeds:[BotSuccess({ description: "The reaction role message has been successfully created." })]});

        } else {
            // creating with existing

        }
    } else {
        // base of new, ask for new / existing message
        const AskForMessageEmbed = new MessageEmbed()
            .setColor(EmbedColors.static)
            .setDescription("Would you like to create reaction roles on an existing message or a custom embed?")

        const Buttons = new MessageActionRow()
            .addComponents(
                new MessageButton()
                    .setCustomId('new_message_rroles')
                    .setLabel("New Message")
                    .setStyle("PRIMARY"),
                new MessageButton()
                    .setCustomId("existing_message_rroles")
                    .setLabel("Existing Message")
                    .setStyle("PRIMARY")
            )

        await interaction.reply({ embeds: [AskForMessageEmbed], components: [Buttons] });
    }

}