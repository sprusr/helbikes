import React from "react";
import ReactDOM from "react-dom";
import ApolloClient from "apollo-boost";
import { ApolloProvider } from "react-apollo";

import "./index.css";
import Home from "./Home";

const client = new ApolloClient({
  uri: "https://api.digitransit.fi/routing/v1/routers/hsl/index/graphql"
});

const App = () => (
  <ApolloProvider client={client}>
    <Home />
  </ApolloProvider>
);

ReactDOM.render(<App />, document.getElementById("root"));
