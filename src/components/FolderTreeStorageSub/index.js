import env from "../../enviroment/envFrontEnd";
import axios from "../../axiosInterceptor";
import React from "react";
import {
  setFolderTreeID,
  removeFolderTreeID,
  removeNewFolderTreeID,
  removeDeleteFolderTreeID,
  removeMoveFolderTreeID,
  addNewFolderTreeID,
  removeRenameFolderTreeID,
  setInsertedFolderTreeID,
} from "../../actions/folderTree";
import { history } from "../../routers/AppRouter";
import { connect } from "react-redux";
import FolderTreeStorageSub2 from ".././FolderTreeStorageSub";
import FolderTreeStorageSub from "./FolderTreeStorageSub";
import { withRouter } from "../../routers/utils";
import { startSetFileAndFolderItems } from "../../actions/files";

class FolderTreeStorageSubContainer extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      folders: [],
      open: false,
      loaded: false,
      forceUpdate: "",
    };

    this.cachedFolders = {};

    this.ignoreNewList = {};

    this.ignoreDeleteList = {};

    this.ignoreMoveList = {};

    this.ignoreRenameList = {};

    this.ignoreInsertList = {};

    this.launchedByMain = false;
    this.skipUpdate = false;
  }

  componentDidUpdate = () => {
    if (
      this.props.selectedIDs[this.props.folder.pk] &&
      !this.state.open &&
      !this.state.loaded &&
      this.props.folder.pk === this.props.selectedID
    ) {
      this.skipUpdate = true;
      this.getFolders();
    } else if (
      this.props.selectedIDs[this.props.folder.pk] &&
      !this.state.open &&
      this.props.folder.pk === this.props.selectedID
    ) {
      this.skipUpdate = true;
      this.setState(() => {
        return {
          ...this.state,
          open: true,
        };
      });
    } else if (
      this.props.selectedIDs[this.props.folder.pk] === undefined &&
      this.state.open
    ) {
      this.setState(() => {
        return {
          ...this.state,
          open: false,
        };
      });
    }

    this.addNewFolders();
    this.deleteRemovedFolders();
    this.moveMovedFolders();
    this.renameRenamedFolders();
    this.insertInsertedFolders();
  };

  addNewFolders = () => {
    for (let currentKey in this.props.newIDs) {
      const currentObj = this.props.newIDs[currentKey];
      if (
        currentObj.parent === this.props.folder.pk &&
        !this.ignoreNewList[currentObj.pk]
      ) {
        this.ignoreNewList[currentObj.pk] = true;

        this.props.dispatch(removeNewFolderTreeID(currentObj.pk));

        this.setState(() => {
          return {
            ...this.state,
            folders: [...this.state.folders, currentObj],
          };
        });
      }
    }
  };

  insertInsertedFolders = () => {
    for (let currentKey in this.props.insertedIDs) {
      const currentObj = this.props.insertedIDs[currentKey];

      if (
        currentObj.parent === this.props.folder.pk &&
        !this.ignoreInsertList[currentObj.pk]
      ) {
        this.ignoreInsertList[currentObj.pk] = true;

        let tempInsertIDsList = this.props.insertedIDs;
        tempInsertIDsList = [
          ...tempInsertIDsList.slice(0, currentKey),
          ...tempInsertIDsList.splice(currentKey + 1, tempInsertIDsList.length),
        ];

        this.props.dispatch(setFolderTreeID(this.props.folder.pk));

        this.setState(
          () => {
            return {
              ...this.state,
              folders: currentObj.subFolders,
              open: true,
              loaded: true,
            };
          },
          () => {
            if (tempInsertIDsList.length !== 0) {
              const newID = tempInsertIDsList[0];
              this.props.dispatch(
                setInsertedFolderTreeID(newID, tempInsertIDsList)
              );
            }
          }
        );
        break;
      }
    }
  };

  deleteRemovedFolders = () => {
    for (let currentKey in this.props.deleteIDs) {
      const currentObj = this.props.deleteIDs[currentKey];

      if (
        this.cachedFolders[currentObj.pk] &&
        !this.ignoreDeleteList[currentObj.pk]
      ) {
        this.ignoreDeleteList[currentObj.pk] = true;

        const tempFolderList = this.state.folders.filter((currentFolder) => {
          return currentObj.pk !== currentFolder.pk;
        });

        this.props.dispatch(removeDeleteFolderTreeID(currentObj.pk));

        this.setState(() => {
          return {
            ...this.state,
            folders: tempFolderList,
          };
        });
      }
    }
  };

  moveMovedFolders = () => {
    for (let currentKey in this.props.moveIDs) {
      const currentObj = this.props.moveIDs[currentKey];

      if (
        this.cachedFolders[currentObj.pk] &&
        !this.ignoreMoveList[currentObj.pk]
      ) {
        this.ignoreMoveList[currentObj.pk] = true;

        let movedValue = {};
        const tempFolderList = this.state.folders.filter((currentFolder) => {
          if (currentObj.pk === currentFolder.pk) movedValue = currentFolder;
          return currentObj.pk !== currentFolder.pk;
        });

        movedValue.parent = currentObj.parent;

        this.props.dispatch(removeMoveFolderTreeID(currentObj.pk));
        this.props.dispatch(addNewFolderTreeID(currentObj.pk, movedValue));

        this.setState(() => {
          return {
            ...this.state,
            folders: tempFolderList,
          };
        });
      }
    }
  };

  renameRenamedFolders = () => {
    for (let currentKey in this.props.renameIDs) {
      const currentObj = this.props.renameIDs[currentKey];

      if (
        this.cachedFolders[currentObj.pk] &&
        !this.ignoreRenameList[currentObj.pk]
      ) {
        this.ignoreRenameList[currentObj.pk] = true;

        let tempList = [];

        for (let currentValue of this.state.folders) {
          if (currentValue.pk === currentObj.pk) {
            currentValue.name = currentObj.name;
          }
          tempList.push(Object.assign({}, currentValue));
        }

        this.props.dispatch(removeRenameFolderTreeID(currentObj.pk));

        this.setState(() => {
          return {
            ...this.state,
            folders: [...tempList],
          };
        });
      }
    }
  };

  folderClick = () => {
    const id = this.props.folder.pk;
    const folderPush = `/folder/${id}`;
      this.props.dispatch(
      startSetFileAndFolderItems("", id, "DEFAULT", undefined)
    )
    this.props.navigate(folderPush);
  };

  getFolders = () => {
    const parent = this.props.folder.pk;

    const url = `/folder-service/list?parent=${parent}`;
    axios.get(url).then((response) => {
      this.setState(() => {
        return {
          folders: response.data,
          open: true,
          loaded: true,
        };
      });
    });
  };

  clickEvent = () => {
    if (!this.state.open) {
      this.props.dispatch(setFolderTreeID(this.props.folder.pk));
    } else {
      this.props.dispatch(removeFolderTreeID(this.props.folder.pk));
      this.setState(() => {
        return {
          ...this.state,
          open: false,
        };
      });
    }
  };

  renderFolders = () => {
    this.cachedFolders = {};

    return this.state.folders.map((folder) => {
      this.cachedFolders[folder.pk] = true;
      return (
        <FolderTreeStorageSub2
          key={folder.pk}
          folder={folder}
          type={this.props.type}
        />
      );
    });
  };

  render() {
    return (
      <FolderTreeStorageSub
        renderFolders={this.renderFolders}
        skipUpdate={this.skipUpdate}
        clickEvent={this.clickEvent}
        folderClick={this.folderClick}
        state={this.state}
        {...this.props}
      />
    );
  }
}

const connectStoreToProp = (state) => ({
  selectedID: state.folderTree.id,
  selectedIDs: state.folderTree.openIDs,
  newIDs: state.folderTree.newIDs,
  newID: state.folderTree.newID,
  deleteIDs: state.folderTree.deleteIDs,
  deleteID: state.folderTree.deleteID,
  moveIDs: state.folderTree.moveIDs,
  moveID: state.folderTree.moveID,
  renameIDs: state.folderTree.renameIDs,
  renameID: state.folderTree.renameID,
  insertedIDs: state.folderTree.insertedIDs,
  insertedID: state.folderTree.insertedID,
});

export default withRouter(
  connect(connectStoreToProp)(withRouter(FolderTreeStorageSubContainer))
);
