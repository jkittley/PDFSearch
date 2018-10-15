const tagsReducer = (state = {}, action) => {
    switch (action.type) {

      case "TAGS/UPSERT":
        state = { ...state }
        state[action.tag] = {
          ...state[action.tag],
          ...action.payload
        }
        break;

      case "TAGS/CHECK":
        state = { ...state }
        state[action.tag] = {
          ...state[action.tag],
          "checked": action.payload
        }
        break;

      case "TAGS/REMOVE":
        state = { ...state }
        delete state[action.payload];
        break;

      case "TAGS/DESTROY":
        state = {}
        break;

      }
    return state;
  };

export default tagsReducer
