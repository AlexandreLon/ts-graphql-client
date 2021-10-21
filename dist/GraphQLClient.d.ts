import { ApolloError, ApolloQueryResult, PresetConfig } from 'apollo-boost';
export interface ClientResult<T> extends ApolloQueryResult<T> {
    toJSON(): T;
}
export declare type ClientError = ApolloError;
export declare type ClientOptions = PresetConfig;
export declare type ClientAttribute<T> = {
    [P in keyof T]?: T[P] extends Array<infer U> ? U extends Record<string, any> ? ClientAttribute<U> : true : T[P] extends Record<string, any> ? ClientAttribute<T[P]> : true;
};
export declare type ClientParameters<T> = {
    [key: string]: DeepPartial<T>;
} | DeepPartial<T>;
export declare type DeepPartial<T> = {
    [P in keyof T]?: T[P] extends Array<infer U> ? Array<DeepPartial<U>> : T[P] extends ReadonlyArray<infer U> ? ReadonlyArray<DeepPartial<U>> : DeepPartial<T[P]> | T[P] | EnumType<T[P]>;
};
export declare type UnArray<T> = T extends Array<infer U> ? U : T;
export declare class EnumType<T> {
    value: T;
    constructor(value: T);
}
export declare class GraphQLClient {
    private client;
    private verbose;
    private log;
    constructor(options?: ClientOptions, verbose?: boolean);
    constructor(uri?: string, verbose?: boolean);
    private queryCallback;
    private queryPromise;
    private mutateCallback;
    private mutatePromise;
    query<ResultType, SearchType>(name: string, parameters: ClientParameters<SearchType>, attribute: ClientAttribute<UnArray<ResultType>>, callback: (data: ClientResult<ResultType>, err: ClientError) => void): void;
    query<ResultType, SearchType>(name: string, parameters: ClientParameters<SearchType>, attribute: ClientAttribute<UnArray<ResultType>>): Promise<ClientResult<ResultType>>;
    mutate<ResultType, SearchType>(name: string, parameters: ClientParameters<SearchType>, attribute: ClientAttribute<UnArray<ResultType>>, callback: (data: ClientResult<ResultType>, err: ClientError) => void): void;
    mutate<ResultType, SearchType>(name: string, parameters: ClientParameters<SearchType>, attribute: ClientAttribute<UnArray<ResultType>>): Promise<ClientResult<ResultType>>;
}
