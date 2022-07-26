import { ApolloError, ApolloQueryResult, PresetConfig } from 'apollo-boost';

/**
 * Representation of GraphQL Enum
 * Used to know the difference between a simple string and an enum due to javascript can't differenciate
 * it and GraphQL doesn't accept quote for enums.
 */
// eslint-disable-next-line
export interface EnumType<T> {}

/**
 * Representation of a result
 * Adding toJSON function to get exacly data returned without name of query attribute
 * More information about ApolloQueryResult on apollo-boost documentation
 */
export interface ClientResult<T> extends ApolloQueryResult<T> {
    toJSON(): T;
}

/**
 * Just renaming ApolloError, more information on apollo-boost documentation
 */
export type ClientError = ApolloError;

/**
 * Just renaming PresetConfig, more information on apollo-boost documentation
 */
export type ClientOptions = PresetConfig;

/**
 * Representation of attribute by removing array and replace leaf of object by true
 */
export type ClientAttribute<T> = {
    [P in keyof T]?: T[P] extends Array<infer U> | ReadonlyArray<infer U>
        ? ClientAttribute<U>
        : T[P] extends Array<infer U> | ReadonlyArray<infer U> | null | undefined
        ? ClientAttribute<U> | true
        : T[P] extends Record<string, any>
        ? ClientAttribute<T[P]>
        : T[P] extends Record<string, any> | null | undefined
        ? ClientAttribute<T[P]> | true
        : true;
};

/**
 * Adding EnumType as possibility as leaf of object, use to have multiple parameters entries
 */
export type ClientParameters<T> = DeepPartial<T>;
/**
 * Adding EnumType as possibility as leaf of object
 */
export type DeepPartial<T> = {
    [P in keyof T]?: T[P] extends Array<infer U>
        ? Array<DeepPartial<U>> | Array<T[P]> | Array<EnumType<U>>
        : T[P] extends ReadonlyArray<infer U>
        ? ReadonlyArray<DeepPartial<U>> | ReadonlyArray<T[P]>
        : T[P] extends number | string
        ? EnumType<T[P]> | T[P]
        : DeepPartial<T[P]> | T[P];
};
/**
 * Represente a type without Array
 * Return type if is not array or type of one element else
 */
export type UnArray<T> = T extends Array<infer U> ? U : T;
