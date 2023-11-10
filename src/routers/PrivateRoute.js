import React from "react";
import { connect } from "react-redux";
import { Route, useNavigate } from "react-router-dom";

export const PrivateRoute = ({
  isAuthenticated,
  component: Component,
  ...rest
}) => {
  const navigate = useNavigate();
  return (
    <div>
      <Route
        key={1}
        {...rest}
        component={(props) =>
          isAuthenticated ? <Component key={1} {...props} /> : navigate("/")
        }
      />
    </div>
  );
};

const mapStateToProps = (state) => ({
  isAuthenticated: !!state.auth.id,
});

export default connect(mapStateToProps)(PrivateRoute);
