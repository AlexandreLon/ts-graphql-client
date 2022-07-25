import { GraphQLClient } from '../src/GraphQLClient';
import fetch from 'cross-fetch';
import { MutationAddPostArgs, MutationUpdatePostArgs, Post, QueryUserArgs, QueryUsersArgs, User, UserWithPagination } from './api.type';

let client: GraphQLClient;

describe('Queries to GraphQLPlaceholder', () => {
    beforeAll(() => {
        client = new GraphQLClient({
            uri: `https://api.graphqlplaceholder.com/`,
            fetch: fetch as any,
        });
    });

    test('Get number of users', async () => {
        const count = await client
            .query<UserWithPagination, QueryUsersArgs>(
                'users',
                {},
                {
                    count: true,
                },
            )
            .then((res) => res.toJSON().count);

        expect(count).toBe(10);
    });

    test('Get list of users', async () => {
        const count = await client
            .query<UserWithPagination, QueryUsersArgs>(
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
            )
            .then((res) => res.toJSON().data?.length);

        expect(count).toBe(10);
    });

    test('Get list of users with pagination', async () => {
        const count = await client
            .query<UserWithPagination, QueryUsersArgs>(
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
            )
            .then((res) => res.toJSON().data?.length);

        expect(count).toBe(5);
    });

    test('Get user 1', async () => {
        const user = await client
            .query<User, QueryUserArgs>(
                'user',
                {
                    userId: 1,
                },
                {
                    id: true,
                    name: true,
                    username: true,
                    email: true,
                },
            )
            .then((res) => res.toJSON());

        expect(user.id).toBe('1');
    });

    test('Create post', async () => {
        const post = await client
            .mutate<Post, MutationAddPostArgs>(
                'addPost',
                {
                    data: {
                        userId: 1,
                        title: 'Hello',
                        body: 'Hello World',
                    },
                },
                {
                    id: true,
                    title: true,
                    body: true,
                },
            )
            .then((res) => res.toJSON());

        expect(post.id).toBe('101');
    });

    test('Update post', async () => {
        const post = await client
            .mutate<Post, MutationUpdatePostArgs>(
                'updatePost',
                {
                    postId: '100',
                    data: {
                        userId: 1,
                        title: 'Hello',
                        body: 'Hello World',
                    },
                },
                {
                    id: true,
                    title: true,
                    body: true,
                },
            )
            .then((res) => res.toJSON());

        expect(post.id).toBe('100');
    });
});
