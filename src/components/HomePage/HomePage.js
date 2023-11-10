import Header from "../Header";
import LeftSection from "../LeftSection";
import MainSection from "../MainSection";
import Uploader from "../Uploader";
import React from "react";
import PhotoViewer from "../PhotoViewer";
import UploadOverlay from "../UploadOverlay";
import HomepageSpinner from "../HomepageSpinner";
import MobileContextMenuContainer from "../MobileContextMenu";
import ShareModelWrapper from "../ShareModelWrapper";
import { withRouter } from "../../routers/utils";

const HomePage = (props) => (
  <div>
    <HomepageSpinner />

    <div className="main-wrapper">
      <Header goHome={props.goHome} />
      <div className="main__wrapper--container">
        <LeftSection goHome={props.goHome} />
        <MainSection {...props} />
        <Uploader />
        {props.photoID.length === 0 ? undefined : <PhotoViewer />}
      </div>
    </div>

    <UploadOverlay />
    {/* <ShareModel /> */}
    <ShareModelWrapper />
    <MobileContextMenuContainer />
  </div>
);

export default withRouter(HomePage);
