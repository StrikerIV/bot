const { CommandStructure, DatabaseQuery } = require("../structures/StructuresManager");


function run(client, message, parameters) {

    //soon

}

module.exports = new CommandStructure({
    name: "kick", category: "moderation", parameters: [
        {
            type: "GuildMember",
            required: true,
        },
        {
            type: "Time",
            required: false,
        },
        {
            type: "Reason",
            required: false
        },
    ],
    permissions: {
        author: ["KICK_MEMBERS"],
        client: ["KICK_MEMBERS"],
    },
    execute: run
})
