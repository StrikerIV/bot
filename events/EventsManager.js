const { parse } = require("path");
const glob = require("glob");
const fs = require('fs');

class EventsManager {
    load() {
        let eventExports = {}

        return new Promise((result) => {
            glob(__dirname + "/**/*.js", (_, events) => {
                events.forEach(eventFilePath => {
                    const { name } = parse(eventFilePath);
                    if (name === 'EventsManager') return;
                    let requireEvent = require(eventFilePath);
                    let eventExport = requireEvent[Object.keys(requireEvent)[0]];
                    eventExports[Object.keys(requireEvent)[0]] = eventExport;
                });
                result(eventExports);
            });
        });
    }
}

module.exports = new EventsManager();