const config = require('../utils/config.json');
const axios = require('axios');

class DatabaseError {
    constructor(error) {
        this.error = error.response.data.message || error.response.data.error.error;
        this.code = error.response.data.code || error.response.data.error?.code || 0;
        this.sql = error.response.data.error?.sql || null;
    }
}

class DatabaseResult {
    constructor(data, fields, error) {
        this.data = data;
        this.fields = fields;
        this.error = error;
    }
}

/**
 * @typedef {object} DatabaseResult
 * @property {array} data - The data received from the query
 * @property {array} fields - The fields linked to the data 
 * @property {object} error - The error field. `null` if no error, an object if an error
*/

/**
 * Queries and returns a DatabaseObject from the database.
 * @param {string} query The string to query
 * @param {Array} parameters An array of variables for the query
 * @returns {DatabaseResult} DatabaseResult object
 */
module.exports = (query, parameters) => {

    if (!query) {
        throw Error("Supply a query to query.")
    }

    return new Promise(async (result) => {
        // eval GET, POST, or DELETE request
        let HTTPMethod = null;
        let QueryMethod = query.split(" ")[0];

        switch (QueryMethod) {
            case "SELECT":
                HTTPMethod = "GET";
                break;
            case "INSERT": case "UPDATE":
                HTTPMethod = "POST";
                break;
            case "DELETE":
                HTTPMethod = "DELETE";
                break;
            default:
                return result(new DatabaseResult(null, null, true))
        }

        const params = new URLSearchParams({
            'query': query,
        })

        if (!parameters[0]) {
            // no parameters supplied
            params.append('params[]', [])
        } else {
            for ([index, param] of parameters.entries()) {
                params.append('params[]', param)
            }
        }

        const RequestConfig = {
            method: HTTPMethod,
            url: `${config.baseUrl}/api/v1/database`,
            headers: {
                'Authorization': `Bearer ${config.apiToken}`,
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            data: params
        };

        axios(RequestConfig)
            .then(function (response) {
                let data = response.data
                return result(new DatabaseResult(data.data, data.fields, data.error))
            })
            .catch(function (error) {
                return result(new DatabaseResult(null, null, new DatabaseError(error)))
            });

    })

}