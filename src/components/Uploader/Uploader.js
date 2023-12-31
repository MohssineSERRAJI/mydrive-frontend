import UploadItem from ".././UploadItem";
import React from "react";
import HideUpload from "../../assets/upload_hide.svg";
import CloseWhite from "../../assets/close-white.svg";

const Uploader = React.forwardRef((props, ref) => (
  <div
    class="upload__status"
    style={
      props.uploads.length !== 0 ? { display: "block" } : { display: "none" }
    }
  >
    <div class="head__upload">
      <p>
        Uploading {props.uploads.length}{" "}
        {props.uploads.length === 1 ? "file" : "files"}
      </p>
      <div class="hide__upload">
        <a onClick={() => props.minimizeUploader()}>
          <img src={HideUpload} alt="upload__hide" />
        </a>
        <a onClick={() => props.cancelAllUploadsEvent()}>
          <img src={CloseWhite} style={{ height: "24px" }} alt="upload__hide" />
        </a>
      </div>
    </div>
    <div class="content__upload">
      {props.uploaderShow
        ? props.uploads.map((upload) => {
            return <UploadItem key={upload.id} {...upload} />;
          })
        : undefined}
    </div>
  </div>
));

export default Uploader;
