import ApolloClient, { gql } from 'apollo-boost';
import { queryBuilder } from './utils/queryBuilder';

import { ClientResult, ClientError, ClientOptions, ClientAttribute, ClientParameters, UnArray } from './GraphQLTypes';

/**
 * Representation of GraphQL Enum
 * Used to know the difference between a simple string and an enum due to javascript can't differenciate
 * it and GraphQL doesn't accept quote for enums.
 */
export class EnumType<T> {
    constructor(public value: T) {}
}

/**
 * GraphQLClient is the entry point of the client. It's an override of apollo-boost client to add typed based system in queries.
 * This goal is avoid bad syntax of queries and have a typed result.
 * It works with callback or promise system.
 */
export class GraphQLClient {
    /**
     * ApolloClient used for queries
     */
    private client: ApolloClient<unknown>;

    /**
     * Verbose system to log every queries and results in stdout
     */
    private verbose: boolean;

    /**
     * Override console.log function checking if verbose is enabled
     * @param str
     */
    private log(...str: any[]) {
        if (this.verbose === true) {
            console.log(...str);
        }
    }

    /**
     * Initialize a new GraphQL Client
     * @param options ClientOptions for client, to see more information, check apollo-boost documentation
     * @param verbose Boolean to enabled or not verbose, default to false
     */
    constructor(options?: ClientOptions, verbose?: boolean);

    /**
     * Initialize a new GraphQL Client.
     * It's a shortcut to initialize client direcly with url
     * @param uri Link of graphql playground
     * @param verbose Boolean to enabled or not verbose, default to false
     */
    constructor(uri?: string, verbose?: boolean);
    constructor(options?: ClientOptions | string, verbose = false) {
        if (typeof options === 'string') {
            options = {
                uri: options,
                onError: (e) => {
                    throw new Error(e.toString());
                },
            };
        }
        this.client = new ApolloClient(options);
        this.verbose = verbose;
    }

    /**
     * Make a GraphQL query with a callback
     * @param name Name of query
     * @param parameters Paramaters of query
     * @param attribute Attribute of query
     * @param callback Callback called after recept the answer
     */
    private queryCallback<ResultType, SearchType>(
        name: string,
        parameters: ClientParameters<SearchType>,
        attribute: ClientAttribute<UnArray<ResultType>>,
        callback: (data: ClientResult<ResultType>, err: ClientError) => void,
    ): void {
        const query = queryBuilder<SearchType, ResultType>(name, parameters, attribute);
        this.log(`query {${query}}`);
        this.client
            .query({
                query: gql`query {${query}}`,
            })
            .then((res: ClientResult<ResultType>) => {
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

    /**
     * Make a GraphQL query with a promise
     * @param name Name of query
     * @param parameters Paramaters of query
     * @param attribute Attribute of query
     * @returns a Promise with the answer of query
     */
    private queryPromise<ResultType, SearchType>(
        name: string,
        parameters: ClientParameters<SearchType>,
        attribute: ClientAttribute<UnArray<ResultType>>,
    ): Promise<ClientResult<ResultType>> {
        return new Promise((resolve, reject) => {
            this.queryCallback(name, parameters, attribute, (res, err) => {
                if (err) reject(err);
                resolve(res as ClientResult<ResultType>);
            });
        });
    }

    /**
     * Make a GraphQL mutation with a callback
     * @param name Name of query
     * @param parameters Paramaters of query
     * @param attribute Attribute of query
     * @param callback Callback called after recept the answer
     */
    private mutateCallback<ResultType, SearchType>(
        name: string,
        parameters: ClientParameters<SearchType>,
        attribute: ClientAttribute<UnArray<ResultType>>,
        callback: (data: ClientResult<ResultType>, err: ClientError) => void,
    ): void {
        const query = queryBuilder(name, parameters, attribute);
        this.log(query);
        this.client
            .mutate({
                mutation: gql`mutation {${query}}`,
            })
            .then((res: ClientResult<ResultType>) => {
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

    /**
     * Make a GraphQL mutation with a promise
     * @param name Name of query
     * @param parameters Paramaters of query
     * @param attribute Attribute of query
     * @returns a Promise with the answer of mutation
     */
    private mutatePromise<ResultType, SearchType>(
        name: string,
        parameters: ClientParameters<SearchType>,
        attribute: ClientAttribute<UnArray<ResultType>>,
    ): Promise<ClientResult<ResultType>> {
        return new Promise((resolve, reject) => {
            this.mutateCallback(name, parameters, attribute, (res, err) => {
                if (err) reject(err);
                resolve(res as ClientResult<ResultType>);
            });
        });
    }

    /**
     * Make a GraphQL query with a callback
     * @param name Name of query
     * @param parameters Paramaters of query
     * @param attribute Attribute of query
     * @param callback Callback called after recept the answer
     */
    query<ResultType, SearchType>(
        name: string,
        parameters: ClientParameters<SearchType>,
        attribute: ClientAttribute<UnArray<ResultType>>,
        callback: (data: ClientResult<ResultType>, err: ClientError) => void,
    ): void;
    /**
     * Make a GraphQL query with a promise
     * @param name Name of query
     * @param parameters Paramaters of query
     * @param attribute Attribute of query
     * @returns a Promise with the answer of query
     */
    query<ResultType, SearchType>(
        name: string,
        parameters: ClientParameters<SearchType>,
        attribute: ClientAttribute<UnArray<ResultType>>,
    ): Promise<ClientResult<ResultType>>;
    query<ResultType, SearchType>(
        name: string,
        parameters: ClientParameters<SearchType>,
        attribute: ClientAttribute<UnArray<ResultType>>,
        callback?: (data: ClientResult<ResultType>, err: ClientError) => void,
    ): Promise<ClientResult<ResultType>> {
        if (callback) {
            this.queryCallback(name, parameters, attribute, callback);
        } else {
            return this.queryPromise(name, parameters, attribute);
        }
    }

    /**
     * Make a GraphQL mutation with a callback
     * @param name Name of query
     * @param parameters Paramaters of query
     * @param attribute Attribute of query
     * @param callback Callback called after recept the answer
     */
    mutate<ResultType, SearchType>(
        name: string,
        parameters: ClientParameters<SearchType>,
        attribute: ClientAttribute<UnArray<ResultType>>,
        callback: (data: ClientResult<ResultType>, err: ClientError) => void,
    ): void;
    /**
     * Make a GraphQL mutation with a promise
     * @param name Name of query
     * @param parameters Paramaters of query
     * @param attribute Attribute of query
     * @returns a Promise with the answer of mutation
     */
    mutate<ResultType, SearchType>(
        name: string,
        parameters: ClientParameters<SearchType>,
        attribute: ClientAttribute<UnArray<ResultType>>,
    ): Promise<ClientResult<ResultType>>;
    mutate<ResultType, SearchType>(
        name: string,
        parameters: ClientParameters<SearchType>,
        attribute: ClientAttribute<UnArray<ResultType>>,
        callback?: (data: ClientResult<ResultType>, err: ClientError) => void,
    ): Promise<ClientResult<ResultType>> {
        if (callback) {
            this.mutateCallback(name, parameters, attribute, callback);
        } else {
            return this.mutatePromise(name, parameters, attribute);
        }
    }
}
