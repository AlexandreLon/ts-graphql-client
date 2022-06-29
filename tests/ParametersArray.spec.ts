import { queryBuilder } from '../src/utils/queryBuilder';
import { EnumType } from '../src/GraphQLClient';

describe('Test parameters query builder', () => {
    test('Parse simple query', async () => {
        const str = queryBuilder(
            'users',
            {
                filter: {
                    id: [],
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

        expect(str.replace(/[ \n]/g, '')).toBe('users(filter: {id: []}) {data {id, name, username, email }}'.replace(/[ \n]/g, ''));
    });

    test('Parse query with number arguments', async () => {
        const str = queryBuilder(
            'users',
            {
                filter: {
                    id: [1, 2, 3, 4],
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

        expect(str.replace(/[ \n]/g, '')).toBe('users(filter: {id: [1, 2, 3, 4]}) {data {id, name, username, email }}'.replace(/[ \n]/g, ''));
    });

    test('Parse query with string argument', async () => {
        const str = queryBuilder(
            'users',
            {
                filter: {
                    name: ['John', 'Jack', 'Joe'],
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

        expect(str.replace(/[ \n]/g, '')).toBe(
            'users(filter: {name: ["John", "Jack", "Joe"]}) {data {id, name, username, email }}'.replace(/[ \n]/g, ''),
        );
    });

    test('Parse query with null argument', async () => {
        const str = queryBuilder(
            'users',
            {
                filter: {
                    subscribed: [null],
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

        expect(str.replace(/[ \n]/g, '')).toBe('users(filter: {subscribed: [null]}) {data {id, name, username, email }}'.replace(/[ \n]/g, ''));
    });

    test('Parse query with boolean argument', async () => {
        const str = queryBuilder(
            'users',
            {
                filter: {
                    subscribed: [true, false],
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

        expect(str.replace(/[ \n]/g, '')).toBe(
            'users(filter: {subscribed: [true, false]}) {data {id, name, username, email }}'.replace(/[ \n]/g, ''),
        );
    });

    test('Parse query with undefined argument', async () => {
        const str = queryBuilder(
            'users',
            {
                filter: {
                    email: [undefined],
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

        expect(str.replace(/[ \n]/g, '')).toBe('users(filter: {email: [], name: "John"}) {data {id, name, username, email }}'.replace(/[ \n]/g, ''));
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
                    role: [new EnumType(Role.ADMIN), new EnumType(Role.GUEST)],
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

        expect(str.replace(/[ \n]/g, '')).toBe('users(filter: {role: [ADMIN, GUEST]}) {data {id, name, username, email }}'.replace(/[ \n]/g, ''));
    });

    test('Parse query with object argument', async () => {
        enum Role {
            ADMIN = 'ADMIN',
            GUEST = 'GUEST',
        }
        const str = queryBuilder(
            'users',
            {
                filter: [
                    {
                        role: [new EnumType(Role.ADMIN), new EnumType(Role.GUEST)],
                    },
                    {
                        id: [1, 2, 3, 4],
                    },
                ],
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

        expect(str.replace(/[ \n]/g, '')).toBe(
            'users(filter: [{role: [ADMIN, GUEST]}, {id: [1, 2, 3, 4]}]) {data {id, name, username, email }}'.replace(/[ \n]/g, ''),
        );
    });
});
