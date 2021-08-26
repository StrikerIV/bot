const { MessageEmbed } = require("discord.js")
const { EmbedColors } = require("./../../utils/config.json")

module.exports = (props) => {

    let description = props.description || "The bot has completed the task assigned."

    let SuccessEmbed = new MessageEmbed()
        .setColor(EmbedColors.green)
        .setDescription(description)
    
    return SuccessEmbed;

}