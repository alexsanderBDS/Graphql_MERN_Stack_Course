import React, { useState, useMemo, useEffect } from "react";
import { useLazyQuery } from "@apollo/client";
import { SINGLE_POST } from "../../graphql/queries";
import { useParams } from "react-router-dom";
import PostCard from "../../components/PostCard";

const SinglePost = () => {
  const [values, setValues] = useState({
    content: "",
    image: {
      url: "",
      public_id: "",
    },
    postedBy: {},
  });
  const [getSinglePost, { data: singlePost }] = useLazyQuery(SINGLE_POST);
  const [loading] = useState(false);

  const { postid } = useParams();

  useMemo(() => {
    if (singlePost) {
      setValues({
        ...values,
        _id: singlePost.singlePost._id,
        content: singlePost.singlePost.content,
        image: singlePost.singlePost.image,
        postedBy: singlePost.singlePost.postedBy,
      });
    }
  }, [singlePost, values]);

  useEffect(() => {
    getSinglePost({ variables: { postId: postid } });

    return () => values;
  }, [getSinglePost, postid, values]);

  return (
    <div className="container p-5">
      {loading ? <h4 className="text-danger">Loading...</h4> : <h4>Update</h4>}
      <PostCard post={values} />
    </div>
  );
};

export default SinglePost;
