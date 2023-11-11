import Spinner from ".././Spinner";
import capitalize from "../../utils/capitalize";
import React from "react";
import moment from "moment";
import bytes from "bytes";
import CloseIcon from "../../images/close_icon.png";

class PopupWindow extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    console.log(this.props.popupFile);
    return (
      <div
        className={
          this.props.popupFile.fields.is_video
            ? "popup-window popup-window-video"
            : "popup-window"
        }
        ref={this.props.wrapperRef}
      >
        <p className="popup-window__title">
          {capitalize(this.props.popupFile.fields.filename)}
        </p>

        <div
          className={
            this.props.popupFile.fields.is_video
              ? "popup-window-wrapper popup-window-wrapper-video"
              : "popup-window-wrapper"
          }
        >
          {!this.props.popupFile.fields.is_video ? (
            <div className="popup-window__image__wrapper">
              {!this.props.popupFile.fields.is_image ? (
                <h3 className="popup-window__subtitle">No Preview Available</h3>
              ) : undefined}

              {!this.props.popupFile.fields.is_image ? (
                <img
                  className={this.props.state.imageClassname}
                  src={this.props.state.image}
                />
              ) : (
                <img
                  className={this.props.state.imageClassname}
                  onClick={this.props.setPhotoViewerWindow}
                  src={this.props.state.image}
                  onError={this.props.thumbnailOnError}
                />
              )}

              <div className={this.props.state.spinnerClassname}>
                {!this.props.popupFile.fields.is_image ? undefined : <Spinner />}
              </div>
            </div>
          ) : (
            <video
              className="popup-window__video"
              src={this.props.state.video}
              ref={this.props.video}
              type="video/mp4"
              controls
            >
              Your browser does not support the video tag.
            </video>
          )}
          <div>
            <div>
              <p className="popup-file-details-title">Location: Amazon S3</p>
              <p className="popup-file-details-title">
                File Size: {bytes(+this.props.popupFile.fields.size)}
              </p>
              <p className="popup-file-details-title">
                Created:{" "}
                {moment(this.props.popupFile.fields.upload_date).format("L")}
              </p>
              <div className="popup-window-button-wrapper">
                <button
                  className={
                    this.props.popupFile.fields.is_video
                      ? "button popup-window__button popup-window__button-video"
                      : "button popup-window__button"
                  }
                  onClick={() =>
                    this.props.downloadFile(
                      this.props.popupFile.pk,
                      this.props.popupFile
                    )
                  }
                >
                  Download
                </button>
              </div>
            </div>
          </div>
        </div>

        <img
          className="popup-window__close-button"
          onClick={this.props.hidePopupWindow}
          src={CloseIcon}
        />
      </div>
    );

    return (
      <div className="popup-window" ref={this.props.wrapperRef}>
        <h3 className="popup-window__title">
          {capitalize(this.props.popupFile.filename)}
        </h3>

        {!this.props.popupFile.fields.is_video ? (
          <div className="popup-window__image__wrapper">
            {!this.props.popupFile.fields.is_image ? (
              <h3 className="popup-window__subtitle">No Preview Available</h3>
            ) : undefined}

            {!this.props.popupFile.fields.is_image ? (
              <img
                className={this.props.state.imageClassname}
                src={this.props.state.image}
              />
            ) : (
              <img
                className={this.props.state.imageClassname}
                onClick={this.props.setPhotoViewerWindow}
                src={this.props.state.image}
                onError={this.props.thumbnailOnError}
              />
            )}

            <div className={this.props.state.spinnerClassname}>
              {!this.props.popupFile.fields.is_image ? undefined : <Spinner />}
            </div>
          </div>
        ) : (
          <video
            className="popup-window__video"
            src={this.props.state.video}
            ref={this.props.video}
            type="video/mp4"
            controls
          >
            Your browser does not support the video tag.
          </video>
        )}

        <button
          className="button popup-window__button"
          onClick={() =>
            this.props.downloadFile(
              this.props.popupFile._id,
              this.props.popupFile
            )
          }
        >
          Download
        </button>
        <img
          className="popup-window__close-button"
          onClick={this.props.hidePopupWindow}
          src="/images/close_icon.png"
        />
      </div>
    );
  }
}

export default PopupWindow;
