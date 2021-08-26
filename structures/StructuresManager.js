Array.prototype.toClassObject = function () {
    const obj = {};

    for (let i of this) {
        if(this.filter(param => param.constructor.name === "Argument").length >= 2) {
            // two or more arguments, put them into an array
            obj["ArgumentParameters"] = this.filter(param => param.constructor.name === "Argument")
        } else {
            obj[`${i.constructor.name}Parameter`] = i;
        }
    }

    return obj;

};

module.exports = {
    EvaluatePermissions: require('./commands/EvaluatePermissions'),
    EvaluateParameters: require('./commands/EvaluateParameters'),
    EvalauteDatabaseCache: require('./EvaluateDatabaseCache'),
    CommandStructure: require('./CommandStructure.js'),
    ReactionCollector: require('./ReactionCollector'),
    MessageCollector: require('./MessageCollector'),
    InvalidUsage: require('./embeds/InvalidUsage'),
    DatabaseQuery: require('./DatabaseQuery.js'),
    BotSuccess: require('./embeds/BotSuccess'),
    BotError: require('./embeds/BotError')
}
