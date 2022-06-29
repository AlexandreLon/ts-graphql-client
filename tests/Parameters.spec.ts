import { queryBuilder } from '../src/utils/queryBuilder';
import { EnumType } from '../src/GraphQLClient';

describe('Test parameters query builder', () => {
    test('Parse simple query', async () => {
        const str = queryBuilder(
            'users',
            {},
            {
                data: {
                    id: true,
                    name: true,
                    username: true,
                    email: true,
                },
            },
        );

        expect(str.replace(/[ \n]/g, '')).toBe('users{data {id, name, username, email }}'.replace(/[ \n]/g, ''));
    });

    test('Parse query with number arguments', async () => {
        const str = queryBuilder(
            'users',
            {
                pagination: {
                    page: 1,
                    limit: 5,
                },
            },
            {
                data: {
                    id: true,
                    name: true,
                    username: true,
                    email: true,
                },
            },
        );

        expect(str.replace(/[ \n]/g, '')).toBe('users(pagination: {page: 1, limit: 5}) {data {id, name, username, email }}'.replace(/[ \n]/g, ''));
    });

    test('Parse query with string argument', async () => {
        const str = queryBuilder(
            'users',
            {
                filter: {
                    name: 'John',
                },
            },
            {
                data: {
                    id: true,
                    name: true,
                    username: true,
                    email: true,
                },
            },
        );

        expect(str.replace(/[ \n]/g, '')).toBe('users(filter: {name: "John"}) {data {id, name, username, email }}'.replace(/[ \n]/g, ''));
    });

    test('Parse query with true argument', async () => {
        const str = queryBuilder(
            'users',
            {
                filter: {
                    subscribed: true,
                },
            },
            {
                data: {
                    id: true,
                    name: true,
                    username: true,
                    email: true,
                },
            },
        );

        expect(str.replace(/[ \n]/g, '')).toBe('users(filter: {subscribed: true}) {data {id, name, username, email }}'.replace(/[ \n]/g, ''));
    });

    test('Parse query with false argument', async () => {
        const str = queryBuilder(
            'users',
            {
                filter: {
                    subscribed: false,
                },
            },
            {
                data: {
                    id: true,
                    name: true,
                    username: true,
                    email: true,
                },
            },
        );

        expect(str.replace(/[ \n]/g, '')).toBe('users(filter: {subscribed: false}) {data {id, name, username, email }}'.replace(/[ \n]/g, ''));
    });

    test('Parse query with null argument', async () => {
        const str = queryBuilder(
            'users',
            {
                filter: {
                    email: null,
                },
            },
            {
                data: {
                    id: true,
                    name: true,
                    username: true,
                    email: true,
                },
            },
        );

        expect(str.replace(/[ \n]/g, '')).toBe('users(filter: {email: null}) {data {id, name, username, email }}'.replace(/[ \n]/g, ''));
    });

    test('Parse query with undefined argument', async () => {
        const str = queryBuilder(
            'users',
            {
                filter: {
                    email: undefined,
                    name: 'John',
                },
            },
            {
                data: {
                    id: true,
                    name: true,
                    username: true,
                    email: true,
                },
            },
        );

        expect(str.replace(/[ \n]/g, '')).toBe('users(filter: {name: "John"}) {data {id, name, username, email }}'.replace(/[ \n]/g, ''));
    });

    test('Parse query with only undefined argument', async () => {
        const str = queryBuilder(
            'users',
            {
                filter: {
                    email: undefined,
                },
            },
            {
                data: {
                    id: true,
                    name: true,
                    username: true,
                    email: true,
                },
            },
        );

        expect(str.replace(/[ \n]/g, '')).toBe('users {data {id, name, username, email }}'.replace(/[ \n]/g, ''));
    });

    test('Parse query with enum argument', async () => {
        enum Role {
            ADMIN = 'ADMIN',
            GUEST = 'GUEST',
        }
        const str = queryBuilder(
            'users',
            {
                filter: {
                    role: new EnumType(Role.ADMIN),
                },
            },
            {
                data: {
                    id: true,
                    name: true,
                    username: true,
                    email: true,
                },
            },
        );

        expect(str.replace(/[ \n]/g, '')).toBe('users(filter: {role: ADMIN}) {data {id, name, username, email }}'.replace(/[ \n]/g, ''));
    });
});
