export default (state = [], action) => {
    
    switch(action.type) {

        case "ADD_FOLDER": 

            return [
                action.folder,
                ...state
            ]

        case "EDIT_FOLDER":

            return state.map((folder) => {
                if (folder.pk === action.id) {
                    return {...folder, fields: {...folder.fields, name: action.folder.name} }

                } else {

                    return folder
                }
            })

        case "SET_FOLDERS":

            return action.folders;

        case "REMOVE_FOLDER":

            return state.filter((folder) => {
                return action.id !== folder.pk;
            })

        default:
            return state;
    }
}