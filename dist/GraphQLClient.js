"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GraphQLClient = exports.EnumType = void 0;
const apollo_boost_1 = require("apollo-boost");
const node_fetch_1 = require("node-fetch");
class EnumType {
    constructor(value) {
        this.value = value;
    }
}
exports.EnumType = EnumType;
function stringify(obj_from_json) {
    if (obj_from_json === null || obj_from_json === undefined)
        return null;
    if (obj_from_json instanceof EnumType) {
        return `${obj_from_json.value}`;
    }
    if (obj_from_json instanceof Date) {
        return `"${obj_from_json.toISOString()}"`;
    }
    else if (typeof obj_from_json !== 'object' || obj_from_json === null) {
        return JSON.stringify(obj_from_json);
    }
    else if (Array.isArray(obj_from_json)) {
        return `[${obj_from_json.map((item) => stringify(item)).join(', ')}]`;
    }
    const props = Object.keys(obj_from_json)
        .map((key) => `${key}: ${stringify(obj_from_json[key])}`)
        .join(', ');
    return `{${props}}`;
}
function queryBuilder(name, parameters, attribute) {
    if (!name) {
        throw new Error('Name of query cannot be null');
    }
    const str = stringify(parameters);
    const params = str.slice(1, -1) ? `(${str.slice(1, -1)})` : '';
    const attr = attribute
        ? stringify(attribute)
            .split('true')
            .join('')
            .split(':')
            .join('')
            .split(' ,')
            .join(',')
        : '';
    return `${name}${params}${attr}`;
}
class GraphQLClient {
    constructor(options, verbose = false) {
        if (typeof options === 'string') {
            options = {
                uri: options,
                fetch: node_fetch_1.default,
                onError: (e) => {
                    console.log(e);
                    throw new Error('Error from GraphQL');
                },
            };
        }
        this.client = new apollo_boost_1.default(options);
        this.verbose = verbose;
    }
    log(...str) {
        if (this.verbose === true) {
            console.log(...str);
        }
    }
    queryCallback(name, parameters, attribute, callback) {
        const query = queryBuilder(name, parameters, attribute);
        this.log(`query {${query}}`);
        this.client
            .query({
            query: (0, apollo_boost_1.gql) `query {${query}}`,
        })
            .then((res) => {
            this.log(res.data);
            res.toJSON = function () {
                return this.data[name];
            };
            callback(res, null);
        })
            .catch((err) => {
            callback(null, err);
        });
    }
    queryPromise(name, parameters, attribute) {
        return new Promise((resolve, reject) => {
            this.queryCallback(name, parameters, attribute, (res, err) => {
                if (err)
                    reject(err);
                resolve(res);
            });
        });
    }
    mutateCallback(name, parameters, attribute, callback) {
        const query = queryBuilder(name, parameters, attribute);
        this.log(query);
        this.client
            .mutate({
            mutation: (0, apollo_boost_1.gql) `mutation {${query}}`,
        })
            .then((res) => {
            this.log(res.data);
            res.toJSON = function () {
                return this.data[name];
            };
            callback(res, null);
        })
            .catch((err) => {
            callback(null, err);
        });
    }
    mutatePromise(name, parameters, attribute) {
        return new Promise((resolve, reject) => {
            this.mutateCallback(name, parameters, attribute, (res, err) => {
                if (err)
                    reject(err);
                resolve(res);
            });
        });
    }
    query(name, parameters, attribute, callback) {
        if (callback) {
            this.queryCallback(name, parameters, attribute, callback);
        }
        else {
            return this.queryPromise(name, parameters, attribute);
        }
    }
    mutate(name, parameters, attribute, callback) {
        if (callback) {
            this.mutateCallback(name, parameters, attribute, callback);
        }
        else {
            return this.mutatePromise(name, parameters, attribute);
        }
    }
}
exports.GraphQLClient = GraphQLClient;
//# sourceMappingURL=GraphQLClient.js.map