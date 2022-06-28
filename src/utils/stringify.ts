import { EnumType } from '../GraphQLClient';

/**
 * Stringify an objet for GraphQL
 * Difference between JSON.stringify :
 * - If passing EnumType element, return wihout quote
 * - The key of object doesn't have quotes
 * @param obj
 * @returns string
 */
export function stringify(obj: unknown): string {
    if (obj === null || obj === undefined) return null;
    if (obj instanceof EnumType) {
        return `${obj.value}`;
    }
    if (obj instanceof Date) {
        return `"${obj.toISOString()}"`;
    } else if (typeof obj !== 'object' || obj === null) {
        return JSON.stringify(obj);
    } else if (Array.isArray(obj)) {
        return `[${obj.map((item) => stringify(item)).join(', ')}]`;
    }
    const props: string = Object.keys(obj)
        .map((key) => `${key}: ${stringify(obj[key])}`)
        .join(', ');
    return `{${props}}`;
}
