const filesReducer = (
  state = {},
  action) => {
      switch (action.type) {

        // Add a file to a directory
        case "FILES/UPSERT":
          state = { ...state }
          state[action.absolute] = {
            tags: [],
            lastScanned: null,
            ...state[action.absolute],
            ...action.payload
          }
          break;

        case "FILES/TAG":
          state = { ...state }
          state[action.absolute].tags = [
            ...state[action.absolute].tags,
            ...action.payload
          ]
          state[action.absolute].tags = Array.from(new Set(state[action.absolute].tags));
          break;

        case "FILES/LAST/SCANNED":
          state = { ...state }
          state[action.absolute] = {
            ...state[action.absolute],
            lastScanned: action.payload,
          }
          break;

        case "FILES/REMOVE":
          state = { ...state }
          delete state[action.payload];
          break;

        case "FILES/DESTROY":
          state = {}
          break;

      }

      return state;
};

export default filesReducer
