const { MessageEmbed } = require("discord.js");

module.exports = (structure, props) => {

    let color = "#d73b3e";
    let prefix = props.prefix;
    let parameters = [];
    let parametersUsageString = "";

    // put into array to make it easier
    for (let param in structure.parameters) {
        parameters.push(structure.parameters[param])
    }

    // format into string
    parameters.forEach(param => {
        if(!param.type) return;
        if(param.required) {
            parametersUsageString = parametersUsageString.concat(`[${param.type}] `)
        } else {
            parametersUsageString = parametersUsageString.concat(`(${param.type}) `)
        }
    })

    let usageDescription = `Invalid command usage. Proper usage is below; \n\`${prefix}${structure.name} ${parametersUsageString.trim()}\``
    let InvalidUsageEmbed = new MessageEmbed()
        .setColor(color)
        .setDescription(usageDescription)

    return InvalidUsageEmbed

}