import { ClientParameters, ClientAttribute, UnArray } from '../GraphQLTypes';
import { stringify } from './stringify';

/**
 * Create a string representation of GraphQL Query
 * @param name Name of query
 * @param parameters Parameters of query
 * @param attributes Attributes of query
 * @returns a string representation of GraphQL Query
 */
export function queryBuilder<T, U>(name: string, parameters: ClientParameters<T>, attributes: ClientAttribute<UnArray<U>>) {
    if (!name) {
        throw new Error('Name of query cannot be null');
    }
    const str = stringify(parameters, 'params');
    const params = str.slice(1, -1) ? `(${str.slice(1, -1)})` : '';
    const attr = attributes ? stringify(attributes, 'attr').split('true').join('').split(':').join('').split(' ,').join(',') : '';
    return `${name}${params}${attr}`;
}
