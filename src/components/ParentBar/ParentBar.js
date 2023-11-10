import React from "react";
import Spacer from "../../assets/spacer.svg";

const ParentBar = (props) => (
  <div class="path__files">
    <a onClick={props.homeClick}>myDrive</a>
    <span class="spacer__path">
      <img src={Spacer} alt="spacer" />;
    </span>
    <p onClick={props.onFolderClick} class="current__folder">
      {props.parentNameList.length !== 0
        ? props.parentNameList[props.parentNameList.length - 1]
        : "No Name"}
    </p>
  </div>
);

export default ParentBar;
