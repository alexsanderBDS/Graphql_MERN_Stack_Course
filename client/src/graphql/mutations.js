import { POST_DATA, USER_INFO } from "./fragments";
import { gql } from "@apollo/client";

export const USER_UPDATE = gql`
  mutation userUpdate($input: UserUpdateInput) {
    userUpdate(input: $input) {
      ...userInfo
    }
  }
  ${USER_INFO}
`;

export const POST_CREATE = gql`
  mutation postCreate($input: PostCreateInput!) {
    postCreate(input: $input) {
      ...postData
    }
  }
  ${POST_DATA}
`;

export const POST_DELETE = gql`
  mutation postDelete($postId: String!) {
    postDelete(postId: $postId) {
      _id
    }
  }
`;

export const POST_UPDATE = gql`
  mutation postUpdate($input: PostUpdateInput!) {
    postUpdate(input: $input) {
      ...postData
    }
  }
  ${POST_DATA}
`;
