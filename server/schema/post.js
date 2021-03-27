const { gql } = require("apollo-server-express");

module.exports = gql`
  type Post {
    _id: ID!
    content: String
    image: Image
    postedBy: User
  }

  type Query {
    totalPosts: Int!
    allPosts(page: Int): [Post!]!
    postsByUser: [Post!]!
    singlePost(postId: String!): Post!
    search(query: String): [Post]
  }

  #input type

  input PostCreateInput {
    content: String!
    image: imageInput
  }

  input PostUpdateInput {
    _id: String!
    content: String!
    image: imageInput
  }

  type Mutation {
    postCreate(input: PostCreateInput!): Post!
    postUpdate(input: PostUpdateInput!): Post!
    postDelete(postId: String!): Post!
  }

  type Subscription {
    postAdded: Post
    postUpdated: Post
    postDeleted: Post
  }
`;
