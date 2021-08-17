import React from "react";
import { Route, Redirect } from "react-router-dom";

import { UIStore } from "../data/store";
import { isAuthCookie } from "../lib/util";

const ProtectedRoute = ({ component: Component, ...rest }) => {
  const user = UIStore.useState((s) => s.user);

  return (
    <Route
      {...rest}
      render={(props) => {
        if (user || isAuthCookie()) {
          return <Component {...rest} {...props} />;
        } else {
          return (
            <Redirect
              to={{
                pathname: "/",
                state: {
                  from: props.location,
                },
              }}
            />
          );
        }
      }}
    />
  );
};

export default ProtectedRoute;
