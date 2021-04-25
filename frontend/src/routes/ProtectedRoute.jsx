import React from "react";
import { Redirect, Route } from "react-router";
import { useSelector } from "react-redux";

const ProtectedRoute = ({ component: Component, ...rest }) => {
  const { isAuthenticated, loading } = useSelector((state) => state.auth);

  return (
    <>
      {loading === false && (
        <Route
          {...rest}
          render={(props) => {
            if (isAuthenticated === false) {
              return <Redirect to="login" />;
            }
            return <Component {...props} />;
          }}
        />
      )}
    </>
  );
};

export default ProtectedRoute;
