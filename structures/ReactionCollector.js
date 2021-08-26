module.exports = async (message, options) => {

    let max = options.max || 1;
    let author = options.author;
    let time = options.time || 30000;

    const filter = reactions => reactions.users.cache.first().id === author.id;


    return new Promise(async (result) => {
        message.awaitReactions({ filter, max: max, time: time })
            .then(collected => result(collected));
    });

}