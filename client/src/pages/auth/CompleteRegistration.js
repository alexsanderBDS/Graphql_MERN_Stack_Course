import React, { useState, useEffect, useContext } from "react";
import { authorization } from "../../firebase";
import { toast } from "react-toastify";
import { useHistory } from "react-router-dom";
import { AuthContext } from "../../context/authContext";
import { useMutation } from "@apollo/client";
import { gql } from "@apollo/client";
import AuthForm from "../../components/forms/AuthForm";

const USER_CREATE = gql`
  mutation userCreate {
    userCreate {
      username
      email
    }
  }
`;

const CompleteResgistration = () => {
  const { dispatch } = useContext(AuthContext);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  let history = useHistory();

  useEffect(() => {
    setEmail(localStorage.getItem("emailForRegistration"));
  }, [history]);

  const [userCreate] = useMutation(USER_CREATE);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    if (!email || !password) {
      toast.error("Email and password is required");
      return;
    }
    try {
      const result = await authorization.signInWithEmailLink(
        email,
        window.location.href
      );

      if (result.user.emailVerified) {
        localStorage.removeItem("emailForRegistration");
        let user = authorization.currentUser;
        await user.updatePassword(password);

        const idTokenResult = await user.getIdTokenResult();
        dispatch({
          type: "LOGGED_IN_USER",
          payload: { email: user.email, token: idTokenResult.token },
        });

        userCreate();
        history.push("/profile");
      }
    } catch (error) {
      console.log("register complete error", error.message);
      setLoading(false);
      toast.error(error.message);
    }
  };

  return (
    <div className="container p-5">
      {loading ? (
        <h4 className="text-danger">Loading...</h4>
      ) : (
        <h4>Complete your Registration</h4>
      )}
      <AuthForm
        email={email}
        setEmail={setEmail}
        password={password}
        setPassword={setPassword}
        loading={loading}
        handleSubmit={handleSubmit}
        showPasswordInput={true}
      />
    </div>
  );
};

export default CompleteResgistration;
