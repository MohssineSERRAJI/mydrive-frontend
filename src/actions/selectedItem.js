import axios from "../axiosInterceptor";

export const setSelectedItem = (selectedItem) => ({
  type: "SET_SELECTED_ITEM",
  selectedItem,
});

export const startSetSelectedItem = (id, file, fromQuickItems) => {
  return (dispatch) => {
    const currentDate = Date.now();

    dispatch(setLastSelected(currentDate));

    if (!fromQuickItems) {
      dispatch(setSelected(id));
    } else {
      dispatch(setSelected("quick-" + id));
    }

    if (file) {
      axios
        .get(`/file-service/info/${id}`)
        .then((results) => {
          console.log(results.data.currentFile[0]);
          const data = results.data.currentFile[0];
          const name = data.fields.filename;
          const size = data.fields.size;
          const date = data.fields.upload_date;
          const location = "Amazon S3";
          const link = data.fields.link;
          const linkType = data.fields.link_type;
          const isVideo = data.fields.is_video;
          const personalFile = data.fields.personal_file;
          dispatch(
            setSelectedItem({
              name,
              size,
              date,
              file,
              location,
              isVideo: isVideo,
              id: data.pk,
              linkType: linkType,
              link: link,
              personalFile: personalFile,
              data: data,
            })
          );
        })
        .catch((err) => {
          console.log(err);
        });
    } else {
      axios
        .get(`/folder-service/info/${id}`)
        .then((results) => {
          const data = results.data[0];
          const name = data.fields.name;
          const size = 0;
          const date = data.fields.created_at;
          const file = false;
          const location = "Amazon S3";
          const id = data.pk;
          const drive = "s3";
          const personalFile = false;
          dispatch(
            setSelectedItem({
              name,
              size,
              date,
              file,
              location,
              data: results.data,
              id,
              drive,
              personalFile,
            })
          );
        })
        .catch((err) => {
          console.log(err);
        });
    }
  };
};

export const editSelectedItem = (item) => ({
  type: "EDIT_SELECTED_ITEM",
  item,
});

export const resetSelectedItem = () => ({
  type: "RESET_SELECTED_ITEM",
});

export const resetSelected = () => ({
  type: "RESET_SELECTED",
});

export const setLastSelected = (lastSelected) => ({
  type: "SET_LAST_SELECTED",
  lastSelected,
});

export const setRightSelected = (selected) => ({
  type: "SET_RIGHT_SELECTED",
  selected,
});

export const setShareSelected = (selected) => ({
  type: "SET_SHARE_SELECTED",
  selected,
});

export const editShareSelected = (selected) => ({
  type: "EDIT_SHARE_SELECTED",
  selected,
});

export const setSelected = (selected) => ({
  type: "SET_SELECTED",
  selected,
});
