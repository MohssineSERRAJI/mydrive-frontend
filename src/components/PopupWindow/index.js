import PopupWindow from "./PopupWindow";
import { hidePopup } from "../../actions/popupFile";
import axios from "../../axiosInterceptor";
import env from "../../enviroment/envFrontEnd";
import { connect } from "react-redux";
import React from "react";
import { setPhotoID } from "../../actions/photoViewer";
import axiosNonInterceptor from "axios";
import CloudSvg from "../../images/cloud-svg.svg";

class PopupWindowContainer extends React.Component {
  constructor(props) {
    super(props);

    this.wrapperRef = React.createRef();
    this.video = React.createRef();
    this.imageData = "";
    this.tempToken = "";

    this.state = {
      image: CloudSvg,
      imageClassname: this.props.popupFile.fields.is_image
        ? "popup-window__image popup-window popup-window--gone"
        : "popup-window__image",
      video: "",
      spinnerClassname: "popup-window__spinner__wrapper",
    };
  }

  getFileExtension = (filename) => {
    const filenameSplit = filename.split(".");

    if (filenameSplit.length > 1) {
      const extension = filenameSplit[filenameSplit.length - 1];

      return extension.toUpperCase();
    } else {
      return "Unknown";
    }
  };

  getThumbnail = () => {
    if (
      this.getFileExtension(
        this.props.popupFile.fields.filename
      ).toLowerCase() === "svg"
    ) {
      this.props.popupFile.fields.is_image = false;
      return this.setState(() => {
        return {
          ...this.state,
          image: CloudSvg,
          imageClassname: "popup-window__image",
        };
      });
    }

    const thumbnailID = this.props.popupFile.pk;

    const url = `/file-service/download/${thumbnailID}`;

    axios
      .get(url)
      .then((results) => {
        this.setState(() => ({
          ...this.state,
          image: results.data.url,
          imageClassname: "popup-window__image popup-window__image--loaded",
          spinnerClassname: "popup-window__spinner__wrapper popup-window--gone",
        }));
      })
      .catch((err) => {
        console.log(err);
      });
  };

  thumbnailOnError = () => {
    this.setState(() => ({
      ...this.state,
      imageClassname: "popup-window__image",
      spinnerClassname: "popup-window__spinner__wrapper popup-window--gone",
      image: CloudSvg,
    }));
  };

  handleClickOutside = (event) => {
    if (this.wrapperRef && !this.wrapperRef.current.contains(event.target)) {
      this.props.dispatch(hidePopup());
    }
  };

  getVideo = () => {
    // const config = {
    //     headers: {
    //     uuid: window.sessionStorage.getItem("uuid")
    // }

    // };

    console.log("gettings stream video token");

    axios
      .get(`/file-service/download/${this.props.popupFile.pk}`)
      .then((res) => {
        this.setState(() => ({
          ...this.state,
          video: res.data.url,
        }));
      })
      .catch((e) => {
        console.log("Stream Video Error", e.message);
      });

    // axios.get(currentURL +'/file-service/download/get-token-video',config)
    // .then((response) => {

    //     this.tempToken =  response.data.tempToken;

    //     const uuidID = window.sessionStorage.getItem("uuid");

    //     const isDrive = this.props.popupFile.metadata.drive;
    //     const isPersonal = this.props.popupFile.metadata.personalFile;

    //     const finalUrl = isDrive ?
    //     currentURL + `/file-service-google/stream-video/${this.props.popupFile._id}/${this.tempToken}/${uuidID}`
    //     : !isPersonal ? currentURL + `/file-service/stream-video/${this.props.popupFile._id}/${this.tempToken}/${uuidID}`
    //     : currentURL + `/file-service-personal/stream-video/${this.props.popupFile._id}/${this.tempToken}/${uuidID}`

    //     this.setState(() => ({
    //         ...this.state,
    //         video: finalUrl
    //     }))

    // }).catch((err) => {
    //     console.log(err)
    // })
  };

  componentWillUnmount = () => {
    document.removeEventListener("mousedown", this.handleClickOutside);
    console.log("pop", this.props.downloadFile);

    if (this.props.popupFile.is_video) {
      axios
        .delete(`/file-service/remove-stream-video-token`)
        .then(() => {
          console.log("removed video access token");
        })
        .catch((err) => {
          console.log(err);
        });

      this.video.current.pause();

      this.setState(() => ({
        ...this.state,
        video: "",
      }));
    }
  };

  componentDidMount = () => {
    document.addEventListener("mousedown", this.handleClickOutside);

    if (
      this.props.popupFile.fields.is_image &&
      !this.props.popupFile.fields.is_video
      ) {
      this.getThumbnail();
    } else if (
      this.props.popupFile.fields.is_image &&
      !this.props.popupFile.fields.is_video
      ) {
        this.setState(() => ({
          ...this.state,
          imageClassname: "popup-window__image",
          spinnerClassname: "popup-window__spinner__wrapper popup-window--gone",
          image: CloudSvg,
        }));
      } else if (this.props.popupFile.fields.is_video) {
      this.getVideo();
    }
  };

  hidePopupWindow = () => {
    this.props.dispatch(hidePopup());
  };

  setPhotoViewerWindow = () => {
    this.props.dispatch(setPhotoID(this.props.popupFile.pk));
  };

  render() {
    return (
      <PopupWindow
        wrapperRef={this.wrapperRef}
        video={this.video}
        hidePopupWindow={this.hidePopupWindow}
        state={this.state}
        setPhotoViewerWindow={this.setPhotoViewerWindow}
        thumbnailOnError={this.thumbnailOnError}
        {...this.props}
      />
    );
  }
}

const connectPropToState = (state) => ({
  popupFile: state.popupFile,
});

export default connect(connectPropToState)(PopupWindowContainer);
