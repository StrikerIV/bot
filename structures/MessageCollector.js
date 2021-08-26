module.exports = async (channel, options) => {

    let max = options.max || 1;
    let author = options.author;
    let time = options.time || 30000;

    const filter = msg => msg.author.id === author.id;


    return new Promise(async (result) => {
        channel.awaitMessages({ filter, max: max, time: time, errors: ['time'] })
            .then(collected => result(collected));
    });

}