import QuickAccessItem from "./QuickAccessItem";
import {
  setRightSelected,
  setLastSelected,
  setSelected,
} from "../../actions/selectedItem";
import mobileCheck from "../../utils/mobileCheck";
import env from "../../enviroment/envFrontEnd";
import axios from "../../axiosInterceptor";
import { connect } from "react-redux";
import React from "react";
import Swal from "sweetalert2";
import { startRenameFile, startRemoveFile } from "../../actions/files";
import { setMoverID } from "../../actions/mover";
import mobilecheck from "../../utils/mobileCheck";
import { setMobileContextMenu } from "../../actions/mobileContextMenu";
import FileSvg from "../../images/file-svg.svg";

const currentURL = env.url;

class QuickAccessItemContainer extends React.Component {
  constructor(props) {
    super(props);

    this.failedToLoad = false;
    this.lastTouch = 0;

    this.state = {
      contextMenuPos: {},
      image: FileSvg,
      imageClassname: "noSelect file__item-no-thumbnail",
      contextSelected: false,
    };
  }

  componentDidMount = () => {
    const hasThumbnail = this.props.fields.is_image;

    if (hasThumbnail && !this.failedToLoad) {
      this.getThumbnail();
    }
  };

  closeContext = () => {
    this.setState(() => {
      return {
        ...this.state,
        contextSelected: false,
      };
    });
  };

  selectContext = (e) => {
    if (e) e.stopPropagation();
    if (e) e.preventDefault();

    if (mobilecheck()) {
      this.props.dispatch(setMobileContextMenu(true, this.props));
      return;
    }

    this.setState(() => {
      return {
        ...this.state,
        contextSelected: !this.state.contextSelected,
      };
    });
  };

  getThumbnail = async () => {
    const thumbnailID = this.props.pk;
    const imageClassname = "noSelect";

    await this.setState(() => ({
      ...this.state,
      image: FileSvg,
      imageClassname: "noSelect file__item-no-thumbnail",
    }));

    const url = `/file-service/download/${thumbnailID}`;

    axios
      .get(url)
      .then((results) => {
        this.setState(() => ({
          ...this.state,
          image: results.data.url,
          imageClassname: imageClassname,
        }));
      })
      .catch((err) => {
        console.log(err);
      });
  };

  thumbnailOnError = () => {
    console.log("thumbnail on error");

    this.setState(() => ({
      ...this.state,
      image: FileSvg,
      imageClassname: "noSelect file__item-no-thumbnail",
    }));
  };

  onTouchStart = () => {
    const date = new Date();
    this.lastTouch = date.getTime();
  };

  onTouchMove = () => {
    this.lastTouch = 0;
  };

  onTouchEnd = () => {
    if (this.lastTouch === 0) {
      return;
    }

    const date = new Date();
    const difference = date - this.lastTouch;

    this.lastTouch = 0;

    if (difference > 500) {
      this.selectContext();
    }
  };

  getContextMenu = (e) => {
    if (e) e.preventDefault();

    const isMobile = mobileCheck();

    const windowX = window.innerWidth;
    const windowY = window.innerHeight;

    let styleObj = { right: 0, left: 0, top: "-3px", bottom: 0 };

    if (isMobile) {
      styleObj = { bottom: 0, left: "2px" };
    } else {
      const clientY = e.nativeEvent.clientY;
      const clientX = e.nativeEvent.clientX;

      if (clientX > windowX / 2) {
        styleObj = { ...styleObj, left: "unset", right: 0 };
      } else {
        styleObj = { ...styleObj, left: 0, right: "unset" };
      }
    }

    this.setState(() => ({
      ...this.state,
      contextMenuPos: styleObj,
    }));

    this.props.dispatch(setSelected("quick-" + this.props._id));
    this.props.dispatch(setRightSelected("quick-" + this.props._id));
    this.props.dispatch(setLastSelected(0));
  };

  changeEditNameMode = async () => {
    let inputValue = this.props.filename;

    const { value: folderName } = await Swal.fire({
      title: "Enter A File Name",
      input: "text",
      inputValue: inputValue,
      showCancelButton: true,
      inputValidator: (value) => {
        if (!value) {
          return "Please Enter a Name";
        }
      },
    });

    if (folderName === undefined || folderName === null) {
      return;
    }

    this.props.dispatch(startRenameFile(this.props.pk, folderName));
  };

  closeEditNameMode = () => {
    this.setState(() => {
      return {
        ...this.state,
        editNameMode: false,
      };
    });
  };

  changeDeleteMode = async () => {
    Swal.fire({
      title: "Confirm Deletion",
      text: "You cannot undo this action",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete",
    }).then((result) => {
      if (result.value) {
        this.props.dispatch(startRemoveFile(this.props.pk));
      }
    });
  };

  startMovingFile = async () => {
    this.props.dispatch(
      setMoverID(this.props.pk, this.props.fields.parent, true)
    );
  };

  clickStopPropagation = (e) => {
    e.stopPropagation();
  };

  render() {
    return (
      <QuickAccessItem
        getContextMenu={this.getContextMenu}
        onTouchStart={this.onTouchStart}
        onTouchMove={this.onTouchMove}
        onTouchEnd={this.onTouchEnd}
        closeContext={this.closeContext}
        selectContext={this.selectContext}
        changeEditNameMode={this.changeEditNameMode}
        closeEditNameMode={this.closeEditNameMode}
        changeDeleteMode={this.changeDeleteMode}
        startMovingFile={this.startMovingFile}
        thumbnailOnError={this.thumbnailOnError}
        state={this.state}
        {...this.props}
      />
    );
  }
}

const connectStateToProp = (state) => ({
  rightSelected: state.selectedItem.rightSelected,
  selected: state.selectedItem.selected,
});

export default connect(connectStateToProp)(QuickAccessItemContainer);
