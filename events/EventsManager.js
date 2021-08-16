const path = require('path');
const fs = require('fs');

class EventsManager {
    load() {
        let exports = {}

        return new Promise((result) => {
            fs.readdir(__dirname, function (err, events) {
                events.forEach(function (event) {
                    if (event === 'EventsManager.js') return;
                    let eventFile = require(`./${event}`)
                    let eventExport = actualFile[Object.keys(actualFile)[0]];
                    exports[event.match(/.+?(?=\W)/)[0]] = eventExport
                    result(exports)
                });
            });
        });

    }
}

module.exports = new EventsManager();
