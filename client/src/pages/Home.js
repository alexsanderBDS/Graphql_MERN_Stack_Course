import React, { useContext, useState } from "react";
import { useQuery, useLazyQuery, useSubscription } from "@apollo/client";
import { AuthContext } from "../context/authContext";
import { useHistory } from "react-router-dom";
import { GET_ALL_POSTS, TOTAL_POSTS } from "../graphql/queries";
import {
  POST_ADDED,
  POST_UPDATED,
  POST_DELETED,
} from "../graphql/subscriptions";
import PostCard from "../components/PostCard";
import PostPagination from "../components/PostPagination";
import { toast } from "react-toastify";

function Home() {
  const [page, setPage] = useState(1);
  const { data, loading } = useQuery(GET_ALL_POSTS, {
    variables: { page },
  });
  const { data: postCount } = useQuery(TOTAL_POSTS);

  // POST ADDED ****
  const { data: newPost } = useSubscription(POST_ADDED, {
    onSubscriptionData: async ({
      client: { cache },
      subscriptionData: { data },
    }) => {
      // console.log(data);
      const { allPosts } = cache.readQuery({
        query: GET_ALL_POSTS,
        variables: { page },
      });

      // console.log(allPosts);

      cache.writeQuery({
        query: GET_ALL_POSTS,
        variables: { page },
        data: {
          allPosts: [data.postAdded, ...allPosts],
        },
      });

      fetchPosts({
        variables: { page },
        refetchQueries: [{ query: GET_ALL_POSTS, variables: { page } }],
      });

      toast.success("New post!");
    },
  });
  // POST ADDED ****

  // POST UPDATED ****
  //const { data: updatedPost } =
  useSubscription(POST_UPDATED, {
    onSubscriptionData: () => {
      toast.success("Post Updated!");
    },
  });
  // POST UPDATED ****

  // POST DELETED ****
  // const { data: deletedPost } =
  useSubscription(POST_DELETED, {
    onSubscriptionData: async ({
      client: { cache },
      subscriptionData: { data },
    }) => {
      // console.log(data);
      const { allPosts } = cache.readQuery({
        query: GET_ALL_POSTS,
        variables: { page },
      });

      let filteredPost = allPosts.filter(
        (post) => post._id !== data.postDeleted._id
      );

      cache.writeQuery({
        query: GET_ALL_POSTS,
        variables: { page },
        data: {
          allPosts: filteredPost,
        },
      });

      fetchPosts({
        variables: { page },
        refetchQueries: [{ query: GET_ALL_POSTS, variables: { page } }],
      });

      toast.error("Post deleted!");
    },
  });
  // POST DELETED ****

  const [fetchPosts] = useLazyQuery(GET_ALL_POSTS);

  const { state, dispatch } = useContext(AuthContext);

  // react router

  let history = useHistory();

  const updateUserName = () => {
    dispatch({
      type: "LOGGED_IN_USER",
      payload: "Alexsander Batista",
    });
  };

  if (loading) return <p className="p-5">Loading...</p>;

  return (
    <div className="container">
      <div className="row p-5">
        {data &&
          data.allPosts.map((post) => (
            <div className="col-md-4 pt-5" key={post._id}>
              <PostCard post={post} />
            </div>
          ))}
      </div>
      <PostPagination page={page} setPage={setPage} postCount={postCount} />
      <hr />
      {JSON.stringify(newPost)}
      <hr />
      {JSON.stringify(state.user)}
      <hr />
      <button className="btn btn-primary" onClick={updateUserName}>
        Change user name
      </button>
      <hr />
      {JSON.stringify(history)}
    </div>
  );
}

export default Home;
