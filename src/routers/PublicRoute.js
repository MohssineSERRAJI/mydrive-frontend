import { connect } from "react-redux";
import React from "react";
import { Route, useNavigate } from "react-router-dom";

export const PublicRoute = (
  { isAuthenticated, component: Component },
  ...rest
) => {
  const navigate = useNavigate();
  return (
    <Route
      {...rest}
      component={(props) =>
        isAuthenticated ? navigate("/home") : <Component {...props} />
      }
    />
  );
};

const connectStateToProps = (state) => ({
  isAuthenticated: !!state.auth.id,
});

export default connect(connectStateToProps)(PublicRoute);
