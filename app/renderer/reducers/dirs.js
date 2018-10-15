const dirsReducer = (
  state = {},
  action) => {
      switch (action.type) {

        // Insert / Update a directory
        case "DIR/UPSERT":
            console.log("Adding dir")
            state = { ...state }
            if (!state.hasOwnProperty(action.payload)) {
              state[action.payload] = {
                "incSubFolders": false
              }
            }
          break;

        // Insert / Update a directory
        case "DIR/TOGGLE/SUBFOLDER":
            console.log("Include sub folders")
            state = { ...state }
            state[action.payload] = {
              "incSubFolders": action.state
            }

          break;

        // remove a directory
        case "DIR/REMOVE":
          console.log("Removing dir")
          state = { ...state }
          delete state[action.payload];
        break;

      }

      return state;
};

export default dirsReducer
