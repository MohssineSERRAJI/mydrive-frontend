import { useLocation, useNavigate, useParams } from "react-router-dom";
import LoginPage from "../components/LoginPage"

export const withRouter = (Component) => {
  const Wrapper = (props) => {
    const navigate = useNavigate();
    const location = useLocation();
    const params = useParams()
      return <Component params={params} location={location} navigate={navigate} {...props} />;
  };

  return Wrapper;
};

