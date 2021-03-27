const { gql } = require("apollo-server-express");

module.exports = gql`
  # scalar type
  scalar DateTime

  type Query {
    profile: User!
    publicProfile(username: String!): User!
    allUsers: [User!]
  }

  type Image {
    url: String
    public_id: String
  }

  type User {
    _id: ID!
    username: String
    name: String
    email: String
    images: [Image]
    about: String
    createdAt: DateTime
    updatedAt: DateTime
  }

  input imageInput {
    url: String
    public_id: String
  }

  input UserUpdateInput {
    username: String
    name: String
    email: String!
    images: [imageInput]
    about: String
  }

  type UserCreateResponse {
    username: String!
    email: String!
  }

  type Mutation {
    userCreate: UserCreateResponse!
    userUpdate(input: UserUpdateInput): User!
  }
`;
