import ApolloClient, {
  ApolloError,
  ApolloQueryResult,
  gql,
  PresetConfig,
} from 'apollo-boost';
import fetch from 'node-fetch';

export interface ClientResult<T> extends ApolloQueryResult<T> {
  toJSON(): T;
}
export type ClientError = ApolloError;
export type ClientOptions = PresetConfig;
export type ClientAttribute<T> = {
  [P in keyof T]?: T[P] extends Array<infer U>
    ? U extends Record<string, any>
      ? ClientAttribute<U>
      : true
    : T[P] extends Record<string, any>
    ? ClientAttribute<T[P]>
    : true;
};
export type ClientParameters<T> =
  | { [key: string]: DeepPartial<T> }
  | DeepPartial<T>;

export type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends Array<infer U>
    ? Array<DeepPartial<U>>
    : T[P] extends ReadonlyArray<infer U>
    ? ReadonlyArray<DeepPartial<U>>
    : DeepPartial<T[P]> | T[P] | EnumType<T[P]>;
};

export type UnArray<T> = T extends Array<infer U> ? U : T;
export class EnumType<T> {
  constructor(public value: T) {}
}

function stringify(obj_from_json: any): string {
  if (obj_from_json === null || obj_from_json === undefined) return null;
  if (obj_from_json instanceof EnumType) {
    return `${obj_from_json.value}`;
  }
  if (obj_from_json instanceof Date) {
    return `"${obj_from_json.toISOString()}"`;
  }
  // Cheers to Derek: https://stackoverflow.com/questions/11233498/json-stringify-without-quotes-on-properties
  else if (typeof obj_from_json !== 'object' || obj_from_json === null) {
    // not an object, stringify using native function
    return JSON.stringify(obj_from_json);
  } else if (Array.isArray(obj_from_json)) {
    return `[${obj_from_json.map((item) => stringify(item)).join(', ')}]`;
  }
  // Implements recursive object serialization according to JSON spec
  // but without quotes around the keys.
  const props: string = Object.keys(obj_from_json)
    .map((key) => `${key}: ${stringify(obj_from_json[key])}`)
    .join(', ');
  return `{${props}}`;
}

function queryBuilder<T, U>(
  name: string,
  parameters: ClientParameters<T>,
  attribute: ClientAttribute<UnArray<U>>
) {
  if (!name) {
    throw new Error('Name of query cannot be null');
  }
  const str = stringify(parameters);
  const params = str.slice(1, -1) ? `(${str.slice(1, -1)})` : '';
  const attr = attribute
    ? stringify(attribute)
        .split('true')
        .join('')
        .split(':')
        .join('')
        .split(' ,')
        .join(',')
    : '';
  return `${name}${params}${attr}`;
}

export class GraphQLClient {
  private client: ApolloClient<unknown>;
  private verbose: boolean;

  private log(...str: any[]) {
    if (this.verbose === true) {
      console.log(...str);
    }
  }

  constructor(options?: ClientOptions, verbose?: boolean);
  constructor(uri?: string, verbose?: boolean);
  constructor(options?: ClientOptions | string, verbose = false) {
    if (typeof options === 'string') {
      options = {
        uri: options,
        fetch: fetch as any,
        onError: (e) => {
          console.log(e);
          throw new Error('Error from GraphQL');
        },
      };
    }
    this.client = new ApolloClient(options);
    this.verbose = verbose;
  }

  private queryCallback<ResultType, SearchType>(
    name: string,
    parameters: ClientParameters<SearchType>,
    attribute: ClientAttribute<UnArray<ResultType>>,
    callback: (data: ClientResult<ResultType>, err: ClientError) => void
  ): void {
    const query = queryBuilder<SearchType, ResultType>(
      name,
      parameters,
      attribute
    );
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

  private queryPromise<ResultType, SearchType>(
    name: string,
    parameters: ClientParameters<SearchType>,
    attribute: ClientAttribute<UnArray<ResultType>>
  ): Promise<ClientResult<ResultType>> {
    return new Promise((resolve, reject) => {
      this.queryCallback(name, parameters, attribute, (res, err) => {
        if (err) reject(err);
        resolve(res as ClientResult<ResultType>);
      });
    });
  }

  private mutateCallback<ResultType, SearchType>(
    name: string,
    parameters: ClientParameters<SearchType>,
    attribute: ClientAttribute<UnArray<ResultType>>,
    callback: (data: ClientResult<ResultType>, err: ClientError) => void
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

  private mutatePromise<ResultType, SearchType>(
    name: string,
    parameters: ClientParameters<SearchType>,
    attribute: ClientAttribute<UnArray<ResultType>>
  ): Promise<ClientResult<ResultType>> {
    return new Promise((resolve, reject) => {
      this.mutateCallback(name, parameters, attribute, (res, err) => {
        if (err) reject(err);
        resolve(res as ClientResult<ResultType>);
      });
    });
  }

  query<ResultType, SearchType>(
    name: string,
    parameters: ClientParameters<SearchType>,
    attribute: ClientAttribute<UnArray<ResultType>>,
    callback: (data: ClientResult<ResultType>, err: ClientError) => void
  ): void;
  query<ResultType, SearchType>(
    name: string,
    parameters: ClientParameters<SearchType>,
    attribute: ClientAttribute<UnArray<ResultType>>
  ): Promise<ClientResult<ResultType>>;
  query<ResultType, SearchType>(
    name: string,
    parameters: ClientParameters<SearchType>,
    attribute: ClientAttribute<UnArray<ResultType>>,
    callback?: (data: ClientResult<ResultType>, err: ClientError) => void
  ): Promise<ClientResult<ResultType>> {
    if (callback) {
      this.queryCallback(name, parameters, attribute, callback);
    } else {
      return this.queryPromise(name, parameters, attribute);
    }
  }

  mutate<ResultType, SearchType>(
    name: string,
    parameters: ClientParameters<SearchType>,
    attribute: ClientAttribute<UnArray<ResultType>>,
    callback: (data: ClientResult<ResultType>, err: ClientError) => void
  ): void;
  mutate<ResultType, SearchType>(
    name: string,
    parameters: ClientParameters<SearchType>,
    attribute: ClientAttribute<UnArray<ResultType>>
  ): Promise<ClientResult<ResultType>>;
  mutate<ResultType, SearchType>(
    name: string,
    parameters: ClientParameters<SearchType>,
    attribute: ClientAttribute<UnArray<ResultType>>,
    callback?: (data: ClientResult<ResultType>, err: ClientError) => void
  ): Promise<ClientResult<ResultType>> {
    if (callback) {
      this.mutateCallback(name, parameters, attribute, callback);
    } else {
      return this.mutatePromise(name, parameters, attribute);
    }
  }
}
