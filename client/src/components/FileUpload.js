import React, { useContext } from "react";
import Resizer from "react-image-file-resizer";
import axios from "axios";
import { AuthContext } from "../context/authContext";
import Image from "./Image";

const FileUpload = ({
  setValues,
  setLoading,
  values,
  loading,
  singleUpload = false,
}) => {
  const { state } = useContext(AuthContext);

  const fileResizeAndUpload = (e) => {
    setLoading(true);
    e.preventDefault();

    let fileInput = false;
    if (e.target.files[0]) {
      fileInput = true;
    }
    if (fileInput) {
      Resizer.imageFileResizer(
        e.target.files[0],
        300,
        300,
        "JPEG",
        100,
        0,
        (uri) => {
          axios
            .post(
              `${process.env.REACT_APP_REST_ENDPOINT}/uploadimages`,
              {
                image: uri,
              },
              {
                headers: {
                  authtoken: state.user.token,
                },
              }
            )
            .then((response) => {
              setLoading(false);
              console.log("CLOUDINAY UPLOAD", response);

              if (singleUpload) {
                setValues({ ...values, image: response.data });
              } else {
                const { images } = values;
                setValues({ ...values, images: [...images, response.data] });
              }
            })
            .catch((error) => {
              setLoading(false);
              console.log("CLOUDINARY UPLOAD FAILED", error);
            });
        },
        "base64"
      );
    }
  };

  const handleImageRemove = (id) => {
    setLoading(true);
    axios
      .post(
        `${process.env.REACT_APP_REST_ENDPOINT}/removeimage`,
        {
          public_id: id,
        },
        {
          headers: {
            authtoken: state.user.token,
          },
        }
      )
      .then((response) => {
        setLoading(false);

        if (singleUpload) {
          setValues({
            ...values,
            image: {
              url: "",
              public_id: "",
            },
          });
        } else {
          const { images } = values;
          let filteredImages = images.filter((item) => {
            return item.public_id !== id;
          });
          setValues({ ...values, images: filteredImages });
        }

        console.log("Success", response);
      })
      .catch((error) => {
        setLoading(false);
        console.log(error);
      });
  };

  return (
    <div className="row">
      <div className="col-md-3">
        <div className="form-group">
          <label className="btn btn-primary">
            Upload Image
            <input
              hidden
              type="file"
              accept="image/*"
              onChange={fileResizeAndUpload}
              className="form-control"
              placeholder="Image"
            />
          </label>
        </div>
      </div>
      <div className="col-md-9">
        {/* single image */}
        {values.image && (
          <Image
            image={values.image}
            key={values.image.public_id}
            handleImageRemove={handleImageRemove}
          />
        )}
        {/* multiple images */}
        {values.images &&
          values.images.map((image) => (
            <Image
              image={image}
              key={image.public_id}
              handleImageRemove={handleImageRemove}
            />
          ))}
      </div>
    </div>
  );
};

export default FileUpload;
