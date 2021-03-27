import React, { useContext } from "react";
import { Switch, Route } from "react-router-dom";

// graphql
import { ApolloClient, InMemoryCache, split, HttpLink } from "@apollo/client";
import { WebSocketLink } from "@apollo/client/link/ws";
import { setContext } from "@apollo/client/link/context";
import { getMainDefinition } from "@apollo/client/utilities";
import { ApolloProvider } from "@apollo/client";

import { ToastContainer } from "react-toastify";
import Nav from "./components/Nav";
import Home from "./pages/Home";
import Users from "./pages/Users";
import Register from "./pages/auth/Register";
import Login from "./pages/auth/Login";
import CompleteRegistration from "./pages/auth/CompleteRegistration";
import PrivateRoute from "./components/PrivateRoute";
import PublicRoute from "./components/PublicRoute";
import { AuthContext } from "./context/authContext";
import PasswordUpdate from "./pages/auth/PasswordUpdate";
import PasswordForgot from "./pages/auth/PasswordForgot";
import Post from "./pages/post/Post";
import PostUpdate from "./pages/post/PostUpdate";
import SinglePost from "./pages/post/SinglePost";
import Profile from "./pages/auth/Profile";
import SingleUser from "./pages/SingleUser";
import SearchResults from "./components/SearchResults";

const App = () => {
  const { state } = useContext(AuthContext);
  const { user } = state;

  // 1. create a websocket link
  const wsLink = new WebSocketLink({
    uri: process.env.REACT_APP_GRAPQHL_WS_ENDPOINT,
    options: {
      reconnect: true,
    },
  });

  // 2. create http link
  const htttLink = new HttpLink({
    uri: process.env.REACT_APP_GRAPQHL_ENDPOINT,
  });

  // 3. setContext for authtoken
  const authLink = setContext(() => {
    return {
      headers: {
        authtoken: user ? user.token : "",
      },
    };
  });

  // 4. concat http and authtoken link
  const httpAuthLink = authLink.concat(htttLink);

  // 5. use split to split http link or websocket link
  const link = split(
    ({ query }) => {
      const definition = getMainDefinition(query);
      return (
        definition.kind === "OperationDefinition" &&
        definition.operation === "subscription"
      );
    },
    wsLink,
    httpAuthLink
  );

  const client = new ApolloClient({
    link,
    cache: new InMemoryCache(),
  });

  // const client = new ApolloClient({
  //   uri: process.env.REACT_APP_GRAPQHL_ENDPOINT,
  //   cache: new InMemoryCache({
  //     addTypename: true,
  //   }),
  //   headers: {
  //     authtoken: user ? user.token : "",
  //   },
  // });

  return (
    <ApolloProvider client={client}>
      <Nav />
      <ToastContainer />
      <Switch>
        <Route exact path="/" component={Home} />
        <Route exact path="/users" component={Users} />
        <PublicRoute exact path="/register" component={Register} />
        <PublicRoute exact path="/login" component={Login} />
        <Route
          exact
          path="/complete-registration"
          component={CompleteRegistration}
        />
        <Route exact path="/password/forgot" component={PasswordForgot} />
        <PrivateRoute
          exact
          path="/password/update"
          component={PasswordUpdate}
        />
        <PrivateRoute exact path="/profile" component={Profile} />
        <PrivateRoute exact path="/post/create" component={Post} />
        <PrivateRoute
          exact
          path="/post/update/:postid"
          component={PostUpdate}
        />
        <Route exact path="/user/:username" component={SingleUser} />
        <Route exact path="/post/:postid" component={SinglePost} />
        <Route exact path="/search/:query" component={SearchResults} />
      </Switch>
    </ApolloProvider>
  );
};

export default App;
