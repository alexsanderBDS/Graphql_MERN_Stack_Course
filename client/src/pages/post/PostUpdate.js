import React, { useState, useMemo, useEffect } from "react";
import { useLazyQuery, useMutation } from "@apollo/client";
import { SINGLE_POST } from "../../graphql/queries";
import { POST_UPDATE } from "../../graphql/mutations";
import { useParams } from "react-router-dom";
import FileUpload from "../../components/FileUpload";
import { toast } from "react-toastify";

const PostUpdate = () => {
  const [values, setValues] = useState({
    content: "",
    image: {
      url: "",
      public_id: "",
    },
  });
  const [getSinglePost, { data: singlePost }] = useLazyQuery(SINGLE_POST);
  const [PostUpdate] = useMutation(POST_UPDATE);
  const [loading, setLoading] = useState(false);

  const { postid } = useParams();

  const { content } = values;

  useMemo(() => {
    if (singlePost) {
      setValues({
        ...values,
        _id: singlePost.singlePost._id,
        content: singlePost.singlePost.content,
        image: singlePost.singlePost.image,
      });
    }
  }, [singlePost, values]);

  useEffect(() => {
    getSinglePost({ variables: { postId: postid } });

    return () => values;
  }, [getSinglePost, postid, values]);

  const handleChange = (e) => {
    setValues({ ...values, [e.target.name]: e.target.value });
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    PostUpdate({ variables: { input: values } });
    setLoading(false);
    toast.success("Post Updated");
  };

  const updateForm = () => (
    <form onSubmit={handleSubmit}>
      <div className="form-group">
        <textarea
          value={content}
          onChange={handleChange}
          name="content"
          rows="10"
          className="md-textarea form-control"
          placeholder="Write something cool"
          maxLength="150"
          disabled={loading}
        ></textarea>
      </div>
      <button
        className="btn btn-primary"
        type="submit"
        disabled={loading || !content}
      >
        Post
      </button>
    </form>
  );

  return (
    <div className="container p-5">
      {loading ? <h4 className="text-danger">Loading...</h4> : <h4>Update</h4>}
      <FileUpload
        values={values}
        loading={loading}
        setValues={setValues}
        setLoading={setLoading}
        singleUpload={true}
      />
      {updateForm()}
    </div>
  );
};

export default PostUpdate;
