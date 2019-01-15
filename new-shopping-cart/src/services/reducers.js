import { UPDATE_BAG } from "./actions";

const INITIAL_DATA = {
  items: [],
  show: false
};

const bagReducer = (state = INITIAL_DATA, action) => {
  switch (action.type) {
    case UPDATE_BAG:
      return {
        items: action.items,
        show: action.show
      };

    default:
      return state;
  }
};

export default bagReducer;
