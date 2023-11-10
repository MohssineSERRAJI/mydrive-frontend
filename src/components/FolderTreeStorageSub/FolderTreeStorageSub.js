import React from "react";
import Arrow from "../../assets/arrowstructure.svg";
import Folder from "../../images/folder-svg.svg";
import FolderPurpel from "../../images/folder-svg-purple.svg";
import { withRouter } from "../../routers/utils";

const FolderTreeStorageSub = (props) => (
  <div className="folder-tree-sub__storage">
    <div className="folder-tree-sub__storage__box">
      <div className="folder-tree-sub__storage__image-div">
        <img
          onClick={(e) => {
            props.clickEvent(e);
          }}
          className="folder-tree-sub__storage__image"
          src={Arrow}
          style={props.state.open ? { transform: "rotate(90deg)" } : {}}
        />
      </div>
      <div className="folder-tree-sub__icon-wrapper">
        <img
          className="folder-tree-sub__icon"
          src={props.selectedID === props.folder.pk ? FolderPurpel : Folder}
        />
      </div>
      <div className="folder-tree-sub__storage__text-div">
        <p
          style={
            props.selectedID === props.folder.pk ? { color: "#3c85ee" } : {}
          }
          onClick={() => props.folderClick(props.folder.pk)}
          className="folder-tree-sub__storage__text"
        >
          {props.folder.fields.name}
        </p>
      </div>
    </div>

    <div className="folder-tree-sub__storage-subview">
      <div className="folder-tree-sub__storage-subview-box">
        {props.state.open ? props.renderFolders() : undefined}
      </div>
    </div>
  </div>

  // return

  // <div class="child__structure">
  //     <div class="elem__structure">
  //         <div class={!props.state.open ? "parent__structure" : "parent__structure active__parent"}>
  //             <span onClick={(e) => {props.skipUpdate=false; props.clickEvent(e)}}><img src="/assets/arrowstructure.svg" alt="arrowstructure"/></span>
  //             <div class="info__name" onClick={props.folderClick}>
  //                 <p style={props.selectedID === props.folder._id ? {color:"#3c85ee"} : {}}><span><i style={props.selectedID === props.folder._id ? {color:"#3c85ee"} : {}} class="fas fa-folder"></i></span>{props.folder.name}</p>
  //             </div>
  //         </div>

  //         {/* CHILDREN GO HERE */}
  //         {props.state.open ? props.renderFolders() : undefined}

  //     </div>
  // </div>
);

export default withRouter(FolderTreeStorageSub);
