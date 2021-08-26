const { DatabaseCache } = require("../index");
const { EvalauteDatabaseCache } = require("../structures/StructuresManager");

const emojiUnicode = require("emoji-unicode")
    , toEmoji = require("emoji-name-map")
    ;

exports.MessageReactionRemove = async (client, reaction, user) => {

    // emitted on reaction remove
    // check if it's for reaction role
    let ClientData = DatabaseCache.get("ClientCache")
    if (!ClientData) {
        // update cache 
        await EvalauteDatabaseCache({ id: reaction.message.guildId, client: true })
        ClientData = DatabaseCache.get("ClientCache")
    }

    let ReactionRoles = ClientData.data.ReactionRoles.filter(rrole => rrole.message_id != reaction.message.id)
    if (!ReactionRoles[0]) {
        // no reaction roles on that message
        return;
    }

    for await (const rrole of ReactionRoles) {
        if (rrole.guildEmoji === 0) {
            // default reaction
            // convert to unicode & test
            if (rrole.reaction_id === emojiUnicode(reaction.emoji.name)) {
                // reacted with valid reaction role
                // apply specified role to reacted user
                let FetchedGuild = await client.guilds.resolve(reaction.message.guildId);
                if(!FetchedGuild) {
                    return;
                }

                let FetchedRole = await FetchedGuild.roles.resolve(rrole.role_id);
                if(!FetchedRole) {
                    return;
                }

                let FetchedMember = await FetchedGuild.members.resolve(user.id)
                if(!FetchedMember) {
                    return;
                }

                // finally remove role from user
                FetchedMember.roles.remove(FetchedRole, "Reaction role on a message.")
            }
        }
    }
}