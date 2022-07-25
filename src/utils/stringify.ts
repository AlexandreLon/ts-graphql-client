import { EnumType } from '../GraphQLClient';

/**
 * Stringify an objet for GraphQL
 * Difference between JSON.stringify :
 * - If passing EnumType element, return wihout quote
 * - The key of object doesn't have quotes
 * @param obj_from_json Object to stringify
 * @param isRoot Boolean to know if it's the root object or a recursive call
 * @param type Type of stringify (if it's an attribute or a parameters)
 * ? Needed to have a different behavior for null and false
 * @returns string
 */
export function stringify(obj_from_json: Record<string, any>, type: 'attr' | 'params'): string {
    if (obj_from_json === undefined) return undefined;
    if (obj_from_json === null && type === 'params') return 'null';
    if (obj_from_json === null && type === 'attr') return '';
    if (obj_from_json instanceof EnumType) {
        return `${obj_from_json.value}`;
    }
    if (obj_from_json instanceof Date) {
        return `"${obj_from_json.toISOString()}"`;
    } else if (typeof obj_from_json !== 'object' || obj_from_json === null) {
        return JSON.stringify(obj_from_json);
    } else if (Array.isArray(obj_from_json)) {
        return `[${obj_from_json.map((item) => stringify(item, type)).join(', ')}]`;
    }
    const keys = Object.keys(obj_from_json).filter((key) => {
        return (
            (type === 'attr' && obj_from_json[key] !== false && obj_from_json[key] !== null && obj_from_json[key] !== undefined) ||
            (type === 'params' && obj_from_json[key] !== undefined)
        );
    });

    const props: string = keys
        .map((key) => {
            const value = stringify(obj_from_json[key], type);
            if (value) {
                return `${key}: ${value}`;
            } else {
                return '';
            }
        })
        .join(', ');

    if (props.length === 0) return '';
    return `{${props}}`;
}
