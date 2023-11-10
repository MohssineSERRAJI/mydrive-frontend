import { startSetQuickFiles } from "./quickFiles";
import env from "../enviroment/envFrontEnd";
import Swal from "sweetalert2";
import {
  addNewFolderTreeID,
  addDeleteFolderTreeID,
  removeDeleteFolderTreeID,
  addRenameFolderTreeID,
  setFirstLoadDetailsFolderTree,
} from "./folderTree";
import { startResetCache } from "./files";
import { v4 } from "uuid";
import axios from "../axiosInterceptor";

export const addFolder = (folder) => ({
  type: "ADD_FOLDER",
  folder,
});

export const startAddFolder = (name, parent) => {
  return (dispatch) => {
    if (env.uploadMode === "") {
      console.log("No Storage Accounts!");
      Swal.fire({
        icon: "error",
        title: "No Storage Accounts Active",
        text: "Go to settings to add a storage account",
      });
      return;
    }

    if (name.length === 0) {
      return;
    }

    let body = { name: name, parent: parent };

    // TEMP FIX THIS
    const url = "/folder-service/upload";

    axios
      .post(url, body)
      .then((response) => {
        const folder = response.data.data[0];

        dispatch(addFolder(folder));
        dispatch(addNewFolderTreeID(folder.pk, folder));
        dispatch(startResetCache());

        if (parent === "/")
          dispatch(
            setFirstLoadDetailsFolderTree({ status: "RESET", resetToken: v4() })
          );
      })
      .catch((err) => {
        console.log(err);
      });
  };
};

export const setFolders = (folders) => ({
  type: "SET_FOLDERS",
  folders,
});

export const startSetFolders = (
  parent = "/",
  sortby = "DEFAULT",
  search = "",
  storageType = "DEFAULT"
) => {
  return (dispatch) => {
    dispatch(setFolders([]));

    axios
      .get(
        `/folder-service/list?parent=${parent}&sortby=${sortby}&search=${search}&storageType=${storageType}`
      )
      .then((response) => {
        const folders = response.data;
        dispatch(setFolders(folders)); //DISABLED TEMP
      })
      .catch((err) => {
        console.log("errpr", err);
      });
  };
};

export const removeFolder = (id) => ({
  type: "REMOVE_FOLDER",
  id,
});

export const startRemoveFolder = (id, parent_list, parent) => {
  return (dispatch) => {
    const data = { id: id, parent_list: parent_list };

    const url = `/folder-service/remove`;

    axios
      .post(url, {
        ...data,
      })
      .then((response) => {
        dispatch(removeFolder(id));
        dispatch(startSetQuickFiles());
        dispatch(addDeleteFolderTreeID(id, { id: id }));
        dispatch(startResetCache());

        if (parent === "/")
          dispatch(
            setFirstLoadDetailsFolderTree({
              status: "RESET",
              resetToken: v4(),
            })
          );
      })
      .catch((err) => {
        console.log(err);
      });
  };
};

export const editFolder = (id, folder) => ({
  type: "EDIT_FOLDER",
  id,
  folder,
});

export const startRenameFolder = (id, title, parent) => {
  return (dispatch) => {
    const url = "/folder-service/rename";

    axios
      .post(url, { id, title })
      .then((response) => {
        dispatch(editFolder(id, { name: title }));
        dispatch(addRenameFolderTreeID(id, { _id: id, name: title }));
        dispatch(startResetCache());

        if (parent === "/")
          dispatch(
            setFirstLoadDetailsFolderTree({
              status: "RESET",
              resetToken: v4(),
            })
          );
      })
      .catch((err) => {
        console.log(err);
      });
  };
};
