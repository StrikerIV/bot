const { MessageEmbed } = require("discord.js")
const { EmbedColors } = require("./../../utils/config.json")

module.exports = (props) => {

    let description = props.description || "An error has occured with no error stated. Try again later."

    let ErrorEmbed = new MessageEmbed()
        .setColor(EmbedColors.red)
        .setDescription(description)
    
    return ErrorEmbed;

}