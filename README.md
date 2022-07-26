# Typescript client GraphQL ![graphql-client](https://user-images.githubusercontent.com/43060105/138272664-c977c6f2-ed8e-45c1-927d-ef68f2fa81c0.png)

This client is an abstraction of Apollo client to be used with typed methods.

## Features

- Create a client
- Call mutation GraphQL
- Call query GraphQL
- Stringify a query or mutation without use client

## Installation
This is a Node.js module.

Before installing, download and install Node.js. Node.js 14.0 or higher is required.

```bash 
npm install ts-graphql-client
```
or
```bash 
yarn add ts-graphql-client
```

## How to use

```typescript
import { GraphQLClient } from 'ts-graphql-client'

type User = {
  id: string;
  name: string;
  username: string;
  email: string;
  phone: string;
}

const client = new GraphQLClient('https://api.graphqlplaceholder.com/')

async function main() {
    const users = await client
        .query<{ data: User[] }, {}>(
            'users',
            {},
            {
                data: {
                    id: true,
                    name: true,
                    username: true,
                    email: true,
                    phone: true,
                },
            }
        )
        .then((res) => res.toJSON().data)
    console.log(users)
}

main()
```

You can test it with stackblitz : [ts-graphql-client-example](https://stackblitz.com/fork/graphql-client-ts-example)

## Details

### Constructor 

#### Quick start 

```typescript
constructor(uri?: string, verbose?: boolean);
```

```typescript
new GraphQLClient('http://localhost:3000/graphql');
```

#### With options

```typescript
constructor(options?: ClientOptions, verbose?: boolean);
```

```typescript
new GraphQLClient({
    uri: 'http://localhost:3000/graphql',
    fetch: fetch as any,
});
```

More information about available options, read [apollo-boost](https://www.npmjs.com/package/apollo-boost)

### Queries

```typescript
query<ResultType, SearchType>(name: string, parameters: ClientParameters<SearchType>, attribute: ClientAttribute<UnArray<ResultType>>, callback: (data: ClientResult<ResultType>, err: ClientError) => void): void;
query<ResultType, SearchType>(name: string, parameters: ClientParameters<SearchType>, attribute: ClientAttribute<UnArray<ResultType>>): Promise<ClientResult<ResultType>>;
mutate<ResultType, SearchType>(name: string, parameters: ClientParameters<SearchType>, attribute: ClientAttribute<UnArray<ResultType>>, callback: (data: ClientResult<ResultType>, err: ClientError) => void): void;
mutate<ResultType, SearchType>(name: string, parameters: ClientParameters<SearchType>, attribute: ClientAttribute<UnArray<ResultType>>): Promise<ClientResult<ResultType>>;
```

### Note

You can use `queryToString` to parse your typed query without use client

### Hint

To generate types, we suggest to install [graphql-code-generator](https://www.graphql-code-generator.com/)

## License

Property of [traveljuice](https://traveljuice.fr)

[MIT](LICENSE)
