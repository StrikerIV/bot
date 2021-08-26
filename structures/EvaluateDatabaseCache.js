const DatabaseQuery = require("./DatabaseQuery");
const moment = require('moment');

const { DatabaseCache } = require("../index");

/**
 * @typedef {object} DatabaseResult
 * @property {array} data - The data received from the query
 * @property {array} fields - The fields linked to the data 
 * @property {object} error - The error field. `null` if no error, an object if an error
*/

/**
 * @typedef {object} props
 * @property {number} id The id of the guild to update
 * @property {boolean} refresh Whether to refresh the given guild
 * @property {boolean} client Whether to update the client cache 
 */

/**
 * @class
 * @param {...DatabaseResult} data The {@link DatabaseResult} from the query
 */
class GuildDataPacket {
    constructor(props) {
        this.data = props.data
        this.fields = props.fields
        this.error = props.error
    }
}

class ClientDataPacket {
    constructor(props) {
        this.data = {
            ReactionRoles: props.data.ReactionRoles || null,
            GuildCases: props.data.GuildCases || null
        }
        this.lastUpdated = props.lastUpdated
    }
}

async function UpdateClient() {
    let PacketFetch = await DatabaseQuery("SELECT * FROM guilds_reaction_roles; SELECT * FROM guilds_cases", []);
    if (PacketFetch.error) {
        return module.exports(props);
    }

    // parse the client data
    let PacketData = PacketFetch.data

    let ReactionRoles = PacketData[0]
    let GuildCases = PacketData[1]

    DatabaseCache.set("ClientCache", new ClientDataPacket({ data: { ReactionRoles: ReactionRoles, GuildCases: GuildCases }, lastUpdated: moment().valueOf() }))
}

/**
 * Manages the database cache
 * @param {...props} props Options on what to update
 * @returns {GuildDataPacket|ClientDataPacket}
 */
module.exports = async (props) => {

    let id = props.id
    let refresh = props.refresh || false;
    let client = props.client || false;

    if (!id) {
        throw Error("Supply an id to update.");
    }


    if (client) {
        // updating client cache
        // check to see if we should update
        let ClientData = DatabaseCache.get("ClientCache")
        let PacketData = null;

        if (!ClientData) {
            await UpdateClient();
        } else {
            let LastUpdatedDuration = moment.duration(moment().diff(ClientData.lastUpdated))
            if (LastUpdatedDuration.minutes() > 1) {
                // been one minute since last cache update, so update it
                await UpdateClient();
            }
        }
    }

    if (!DatabaseCache.has(id) || refresh) {
        // the cache does not have the guild cached
        // fetch for the data
        let PacketFetch = await DatabaseQuery("SELECT * FROM guilds WHERE guild_id = ?", [id]);
        if (PacketFetch.error) {
            return module.exports(props);
        }

        if (PacketFetch.data.length === 1) {
            PacketFetch.data = PacketFetch.data[0];
        }

        DatabaseCache.set(id, new GuildDataPacket(PacketFetch));
    }

    return DatabaseCache.get(id);

}