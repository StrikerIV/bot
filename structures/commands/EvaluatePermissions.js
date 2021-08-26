/**
 * Function to check for valid permissions
 * @param {array} users The users to check permissions for
 * @param {array} permissions The permission flags for users to check
 */

class CommandPermissions {
    constructor(data) {
        this.forbidden = data.forbidden,
        this.reason = data.reason
    }
}

module.exports = (message, permissions, parameters) => {

    // prim af make it admin only & me
    let authorPermissions = permissions.author
    let clientPermissions = permissions.client

    let author = message.member
    let client = message.guild.me
    
    if(!author.permissions.has("ADMINISTRATOR") || author.id != "111536007903526912") {
        return new CommandPermissions({ forbidden: true, reason: "AUTHOR" });
    } else {
        return new CommandPermissions({ forbidden: false });
    }

    // // evaluate author permissions
    // authorPermissions.forEach(permission => {
    //     if(!author.permissions.has(permission, true)) {
    //         return new CommandPermissions({ forbidden: true, reason: "AUTHOR" })
    //     }
    // })
    //  // evaluate bot permissions
    // clientPermissions.forEach(permission => {
    //     if(!client.permissions.has(permission, true)) {
    //         return new CommandPermissions({ forbidden: true, reason: "CLIENT" })
    //     }
    // })  

    // //check if manageable by bot
    // if(!client.manageable)
    // return new CommandPermissions({ forbidden: false })

}