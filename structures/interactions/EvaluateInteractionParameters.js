class CommandParameters {
    constructor(props) {
        this.success = props.success,
            this.problem = props.problem || null,
            this.parameters = props.parameters ? props.parameters.toClassObject() : null
    }
}

class CommandTime {
    constructor(props) {
        this.units = props.units,
            this.suppliedTime = props.suppliedTime,
            this.milliseconds = props.milliseconds
    }
}

class Reason {
    constructor(reason) {
        this.reason = reason
    }
}

module.exports = async (message, parameters) => {

    // remove first index as it is the command
    let messageParameters = message.content.split(" ");
    messageParameters.shift();

    if (!messageParameters[0]) {
        // command was only supplied
        return new CommandParameters({ success: false, problem: "NO_PARAMETERS_SUPPLIED" });
    }

    let ParsedCommandParameters = []

    for await (let [index, suppliedParameter] of messageParameters.entries()) {
        let commandParameter = parameters[index];
        if (commandParameter.type === "GuildMember") {
            // argument is supposed to be a GuildMember
            let GuildMemberString = suppliedParameter.replace(/\D/gm, "");
            let GuildMemberFetch = await message.guild.members.fetch(GuildMemberString);
            if (!GuildMemberFetch) {
                // user supplied does not exist
                return new CommandParameters({ success: false, problem: "INVALID_GUILDMEMBER" });
            }
            ParsedCommandParameters.push(GuildMemberFetch);
        } else if (commandParameter.type === "Time" && /\d/gm.test(suppliedParameter) && /[a-z]/gm.test(suppliedParameter)) {
            // argument is time
            // we need to parse it
            // number(s) & letter(s) are supplied
            // check to see if in proper format,
            // ex. 7d, 24h, 60m, 60s

            let TimeNumbers = Number(suppliedParameter.match(/\d/gm).join(""));
            let TimeLetters = suppliedParameter.match(/[a-z]/gm).join("");

            if (suppliedParameter.indexOf(TimeNumbers) > suppliedParameter.indexOf(TimeLetters)) {
                // letters come before numbers, therefor not proper format
                return;
            }

            let timeMilliseconds, timeUnits;

            switch (TimeLetters) {
                case "s":
                case "sec":
                case "second":
                case "seconds":
                    timeMilliseconds = TimeNumbers * 1000;
                    timeUnits = TimeNumbers != 0 && TimeNumbers <= 1 ? "second" : "seconds";
                    break;
                case "m":
                case "min":
                case "minute":
                case "minutes":
                    timeMilliseconds = TimeNumbers * 60000;
                    timeUnits = TimeNumbers != 0 && TimeNumbers <= 1 ? "minute" : "minutes";
                    break;
                case "h":
                case "hour":
                case "hours":
                    timeMilliseconds = TimeNumbers * 3600000;
                    timeUnits = TimeNumbers != 0 && TimeNumbers <= 1 ? "second" : "seconds";
                    break;
                case "s":
                case "d":
                case "day":
                case "days":
                    timeMilliseconds = TimeNumbers * 86400000;
                    timeUnits = TimeNumbers != 0 && TimeNumbers <= 1 ? "second" : "seconds";
                    break;
            }

            ParsedCommandParameters.push(new CommandTime({ units: timeUnits, suppliedTime: TimeNumbers, milliseconds: timeMilliseconds }));

        } else if (commandParameter.type === "Reason" || commandParameter.type === "Time") {
            ParsedCommandParameters.push(new Reason(messageParameters.splice(index).join(" ")));
        }
    }

    return new CommandParameters({ success: true, parameters: ParsedCommandParameters });

}