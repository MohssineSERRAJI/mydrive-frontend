import { addUpload, editUpload, cancelUpload } from "./uploads";
import { loadMoreItems, setLoading, setLoadingMoreItems } from "./main";
import { resetSelected } from "./selectedItem";
import { addQuickFile, startSetQuickFiles, setQuickFiles } from "./quickFiles";
import { startSetStorage } from "./storage";
import { v4 } from "uuid";
import axios from "../axiosInterceptor";
import axiosNonInterceptor from "axios";
import env from "../enviroment/envFrontEnd";
import Swal from "sweetalert2";
import mobileCheck from "../utils/mobileCheck";
import { setFolders } from "./folders";
import reduceQuickItemList from "../utils/reduceQuickItemList";

let cachedResults = {};

export const setFiles = (files) => ({
  type: "SET_FILES",
  files,
});

export const editFile = (id, file) => ({
  type: "EDIT_FILE",
  id,
  file,
});

export const editFileMetadata = (id, metadata) => ({
  type: "EDIT_FILE_METADATA",
  id,
  metadata,
});

export const startSetFileAndFolderItems = (
  historyKey,
  parent = "/",
  sortby = "DEFAULT",
  search = "",
  storageType = "DEFAULT"
) => {
  return (dispatch) => {
    dispatch(setLoading(false));

    //isGoogle = env.googleDriveEnabled;

    let limit = window.localStorage.getItem("list-size") || 50;
    limit = parseInt(limit);

    let fileURL = "";
    let folderURL = "";

    if (search && search !== "") {
      fileURL = `/file-service/list?search=${search}`;
      folderURL = `/folder-service/list?search=${search}`;
    } else {
      fileURL = `/file-service/list?parent=${parent}&sortby=${sortby}&search=${search}&limit=${limit}&storageType=${storageType}`;

      folderURL = `/folder-service/list?parent=${parent}&sortby=${sortby}&search=${search}&storageType=${storageType}`;
    }

    dispatch(setFiles([]));
    dispatch(setFolders([]));
    dispatch(setLoading(true));

    const itemList = [axios.get(fileURL), axios.get(folderURL)];

    Promise.all(itemList)
      .then((values) => {
        const fileList = values[0].data;
        const folderList = values[1].data;
        dispatch(setFiles(fileList));
        dispatch(setFolders(folderList));
        dispatch(setLoading(false));

        if (fileList.length === limit) {
          dispatch(loadMoreItems(true));
        } else {
          dispatch(loadMoreItems(false));
        }

        cachedResults[historyKey] = { fileList, folderList };
      })
      .catch((e) => {
        console.log("Get All Items Error", e);
      });
  };
};

export const startSetAllItems = (
  clearCache,
  parent = "/",
  sortby = "DEFAULT",
  search = "",
  storageType = "DEFAULT"
) => {
  return (dispatch) => {
    if (clearCache) cachedResults = {};
    //isGoogle = env.googleDriveEnabled;

    let limit = window.localStorage.getItem("list-size") || 50;
    limit = parseInt(limit);

    const fileURL = `/file-service/list?parent=${parent}&sortby=${sortby}&search=${search}&limit=${limit}&storageType=${storageType}`;

    const folderURL = `/folder-service/list?parent=${parent}&sortby=${sortby}&search=${search}&storageType=${storageType}`;

    const quickItemsURL = `/file-service/quick-list`;

    dispatch(setFiles([]));
    dispatch(setFolders([]));
    dispatch(setQuickFiles([]));
    dispatch(setLoading(true));

    const itemList = [
      axios.get(fileURL),
      axios.get(folderURL),
      axios.get(quickItemsURL),
    ];

    Promise.all(itemList)
      .then((values) => {
        const fileList = values[0].data;
        const folderList = values[1].data;
        const quickItemList = reduceQuickItemList(values[2].data);
        dispatch(setFiles(fileList));
        dispatch(setFolders(folderList));
        dispatch(setQuickFiles(quickItemList));
        dispatch(setLoading(false));

        if (fileList.length === limit) {
          dispatch(loadMoreItems(true));
        } else {
          dispatch(loadMoreItems(false));
        }

        cachedResults = {};
        cachedResults[parent] = { fileList, folderList, quickItemList };
      })
      .catch((e) => {
        console.log("Get All Items Error", e);
      });
  };
};

export const startSetFiles = (
  parent = "/",
  sortby = "DEFAULT",
  search = "",
  storageType = "DEFAULT"
) => {
  return (dispatch) => {
    let limit = window.localStorage.getItem("list-size") || 50;
    limit = parseInt(limit);

    dispatch(setFiles([]));
    dispatch(setLoading(true));
    axios
      .get(
        `/file-service/list?parent=${parent}&sortby=${sortby}&search=${search}&limit=${limit}`
      )
      .then((results) => {
        const mongoData = results.data;
        //dispatch(setLoading(true))
        dispatch(setFiles(mongoData));
        dispatch(setLoading(false));

        if (results.data.length === limit) {
          dispatch(loadMoreItems(true));
        } else {
          dispatch(loadMoreItems(false));
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };
};

export const loadMoreFiles = (files) => ({
  type: "LOAD_MORE_FILES",
  files,
});

export const startLoadMoreFiles = (
  parent = "/",
  sortby = "DEFAULT",
  search = "",
  startAtDate,
  startAtName,
  pageToken,
  isGoogle = false
) => {
  return (dispatch) => {
    dispatch(setLoadingMoreItems(true));

    let limit = window.localStorage.getItem("list-size") || 50;
    limit = parseInt(limit);

    if (isGoogle) {
      // Temp Google Drive API
      axios
        .get(
          `/file-service-google/list?limit=${limit}&parent=${parent}&sortby=${sortby}&search=${search}&startAt=${true}&startAtDate=${startAtDate}&startAtName=${startAtName}&pageToken=${pageToken}`
        )
        .then((results) => {
          dispatch(loadMoreFiles(results.data));

          if (results.data.length !== limit) {
            dispatch(loadMoreItems(false));
          } else {
            dispatch(loadMoreItems(true));
          }

          dispatch(setLoadingMoreItems(false));
          //dispatch(setLoading(false))
        })
        .catch((err) => {
          console.log(err);
        });
    } else {
      axios
        .get(
          `/file-service/list?limit=${limit}&parent=${parent}&sortby=${sortby}&search=${search}&startAt=${true}&startAtDate=${startAtDate}&startAtName=${startAtName}`
        )
        .then((results) => {
          //console.log("load more files result", results.data.length)

          dispatch(loadMoreFiles(results.data));

          if (results.data.length !== limit) {
            dispatch(loadMoreItems(false));
          } else {
            dispatch(loadMoreItems(true));
          }

          // dispatch(setLoading(false))
          dispatch(setLoadingMoreItems(false));
        })
        .catch((err) => {
          console.log(err);
        });
    }
  };
};

export const addFile = (file) => ({
  type: "ADD_FILE",
  file,
});

export const startAddFile = (
  uploadInput,
  parent,
  parentList,
  storageSwitcherType
) => {
  return (dispatch, getState) => {
    if (env.uploadMode === "") {
      console.log("No Storage Accounts!");
      Swal.fire({
        icon: "error",
        title: "No Storage Accounts Active",
        text: "Go to settings to add a storage account",
      });
      return;
    }

    // Store the parent, incase it changes.
    const prevParent = getState().parent.parent;

    for (let i = 0; i < uploadInput.files.length; i++) {
      const currentFile = uploadInput.files[i];
      const currentID = v4();

      const CancelToken = axiosNonInterceptor.CancelToken;
      const source = CancelToken.source();

      const config = {
        onUploadProgress: (progressEvent) => {
          const currentProgress = Math.round(
            (progressEvent.loaded / progressEvent.total) * 100
          );

          if (currentProgress !== 100) {
            dispatch(editUpload(currentID, currentProgress));
          }
        },
        cancelToken: source.token,
      };

      dispatch(
        addUpload({
          id: currentID,
          progress: 0,
          name: currentFile.name,
          completed: false,
          source,
          canceled: false,
          size: currentFile.size,
        })
      );

      const data = new FormData();

      data.append("filename", currentFile.name);
      data.append("parent", parent);
      data.append("parentList", parentList);
      data.append("currentID", currentID);
      data.append("size", currentFile.size);
      data.append("file", currentFile);

      const url = "/file-service/upload";

      axios
        .post(url, data)
        .then(function (response) {
          const currentParent = getState().parent.parent;
          // This can change by the time the file uploads
          if (prevParent === currentParent) {
            dispatch(addFile(response.data.data[0]));
          }

          dispatch(startSetQuickFiles());
          dispatch(editUpload(currentID, 100, true));
          dispatch(resetSelected());
          dispatch(startSetStorage());

          cachedResults = {};
        })
        .catch(function (error) {
          console.log(error);
          dispatch(cancelUpload(currentID));
        });
    }
  };
};

export const removeFile = (id) => ({
  type: "REMOVE_FILE",
  id,
});

export const startRemoveFile = (id) => {
  return (dispatch) => {
    const url = "/file-service/remove";

    axios
      .post(url, {
        id,
      })
      .then(() => {
        dispatch(removeFile(id));
        dispatch(startSetStorage());
        dispatch(startSetQuickFiles());

        cachedResults = {};
      })
      .catch((err) => {
        console.log(err);
      });
  };
};

export const startRenameFile = (id, title) => {
  return (dispatch) => {
    const data = { id, title };

    axios
      .post("/file-service/rename", data)
      .then(() => {
        dispatch(editFile(id, { filename: title }));

        cachedResults = {};
      })
      .catch((err) => {
        console.log(err);
      });
  };
};

export const startResetCache = () => {
  return (dispatch) => {
    cachedResults = {};
  };
};
