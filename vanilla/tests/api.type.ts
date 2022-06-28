export type Maybe<T> = T | null;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
  /** The `Upload` scalar type represents a file upload. */
  Upload: any;
};

export type Address = {
  __typename?: 'Address';
  city: Scalars['String'];
  geo: Geo;
  street: Scalars['String'];
  suite: Scalars['String'];
  zipcode: Scalars['String'];
};

export enum CacheControlScope {
  Private = 'PRIVATE',
  Public = 'PUBLIC'
}

export type Comment = {
  __typename?: 'Comment';
  author: User;
  body: Scalars['String'];
  id: Scalars['ID'];
  post: Post;
};

export type CommentInput = {
  body: Scalars['String'];
  postId: Scalars['Int'];
  userId: Scalars['Int'];
};

export type CommentUpdateInput = {
  body?: Maybe<Scalars['String']>;
};

export type CommentWithPagination = {
  __typename?: 'CommentWithPagination';
  count: Scalars['Int'];
  currentPage: Scalars['Int'];
  data?: Maybe<Array<Comment>>;
  totalPages: Scalars['Int'];
};

export type Company = {
  __typename?: 'Company';
  bs: Scalars['String'];
  catchPhrase: Scalars['String'];
  name: Scalars['String'];
};

export type Geo = {
  __typename?: 'Geo';
  lat: Scalars['Float'];
  lng: Scalars['Float'];
};

export type Mutation = {
  __typename?: 'Mutation';
  addComment: Comment;
  addPost: Post;
  deleteComment: Comment;
  deletePost: Post;
  updateComment: Comment;
  updatePost: Post;
};


export type MutationAddCommentArgs = {
  data: CommentInput;
};


export type MutationAddPostArgs = {
  data: PostInput;
};


export type MutationDeleteCommentArgs = {
  commentId: Scalars['ID'];
};


export type MutationDeletePostArgs = {
  postId: Scalars['ID'];
};


export type MutationUpdateCommentArgs = {
  commentId: Scalars['ID'];
  data: CommentUpdateInput;
};


export type MutationUpdatePostArgs = {
  data: PostUpdateInput;
  postId: Scalars['ID'];
};

export type PaginationInput = {
  limit?: Maybe<Scalars['Int']>;
  page?: Maybe<Scalars['Int']>;
};

export type Post = {
  __typename?: 'Post';
  author: User;
  body: Scalars['String'];
  comments: Array<Comment>;
  id: Scalars['ID'];
  title: Scalars['String'];
};

export type PostInput = {
  body: Scalars['String'];
  title: Scalars['String'];
  userId: Scalars['Int'];
};

export type PostUpdateInput = {
  body?: Maybe<Scalars['String']>;
  title?: Maybe<Scalars['String']>;
  userId?: Maybe<Scalars['Int']>;
};

export type PostWithPagination = {
  __typename?: 'PostWithPagination';
  count: Scalars['Int'];
  currentPage: Scalars['Int'];
  data?: Maybe<Array<Post>>;
  totalPages: Scalars['Int'];
};

export type Query = {
  __typename?: 'Query';
  comment: Comment;
  comments: CommentWithPagination;
  post: Post;
  posts: PostWithPagination;
  user: User;
  users: UserWithPagination;
};


export type QueryCommentArgs = {
  commentId: Scalars['ID'];
};


export type QueryCommentsArgs = {
  pagination?: Maybe<PaginationInput>;
};


export type QueryPostArgs = {
  postId: Scalars['ID'];
};


export type QueryPostsArgs = {
  pagination?: Maybe<PaginationInput>;
};


export type QueryUserArgs = {
  userId: Scalars['Int'];
};


export type QueryUsersArgs = {
  pagination?: Maybe<PaginationInput>;
};

export type User = {
  __typename?: 'User';
  address?: Maybe<Address>;
  company: Company;
  email: Scalars['String'];
  id: Scalars['ID'];
  name: Scalars['String'];
  phone: Scalars['String'];
  posts: Array<Post>;
  username: Scalars['String'];
  website: Scalars['String'];
};

export type UserWithPagination = {
  __typename?: 'UserWithPagination';
  count: Scalars['Int'];
  currentPage: Scalars['Int'];
  data?: Maybe<Array<User>>;
  totalPages: Scalars['Int'];
};
