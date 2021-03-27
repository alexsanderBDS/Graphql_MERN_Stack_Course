import { gql } from "@apollo/client";

export const USER_INFO = gql`
  fragment userInfo on User {
    _id
    name
    username
    email
    images {
      url
      public_id
      __typename @skip(if: true)
    }
    about
    createdAt
    updatedAt
  }
`;

export const POST_DATA = gql`
  fragment postData on Post {
    _id
    content
    image {
      url
      public_id
      __typename @skip(if: true)
    }
    postedBy {
      _id
      username
    }
  }
`;
