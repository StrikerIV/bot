const config = require('../utils/config.json');
const axios = require('axios');

class DatabaseError {
    constructor(error) {
        this.error = error.response.data.error.error;
        this.code = error.response.data.error.code;
        this.sql = error.response.data.error.sql;
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
 * @typedef {{
 *              Object{error, data, fields}
 *          }}
 */
var DatabaseObject;

/**
 * Queries and returns a DatabaseObject from the database.
 * @typedef {Object{error, data, fields}} DatabaseObject
 * @param {string} query String to query
 * @param {Array} parameters Array of variables
 * @returns {DatabaseObject}
 */
module.exports = (query, parameters) => {

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

        for ([index, param] of parameters.entries()) {
            params.append('params[]', param)
        }

        const RequestConfig = {
            method: HTTPMethod,
            url: `${config.baseURL}/api/v1/database`,
            headers: {
                'Authorization': `Bearer ${config.APIToken}`,
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