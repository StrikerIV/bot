const fs = require('fs');

class EventsManager {
    load() {
        let eventExports = {}

        return new Promise((result) => {
            fs.readdir(__dirname, function (err, events) {
                events.forEach(function (event) {
                    if (event === 'EventsManager.js') return;
                    let eventFile = require(`./${event}`);
                    let eventExport = eventFile[Object.keys(eventFile)[0]];
                    eventExports[Object.keys(eventFile)[0]] = eventExport;
                    result(eventExports);
                });
            });
        });

    }
}

module.exports = new EventsManager();