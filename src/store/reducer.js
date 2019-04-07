import * as types from '../actions/constants';

function guid() {
  function s4() {
    return Math.floor((1 + Math.random()) * 0x10000)
      .toString(16)
      .substring(1);
  }
  return (
    s4() +
    s4() +
    '-' +
    s4() +
    '-' +
    s4() +
    '-' +
    s4() +
    '-' +
    s4() +
    s4() +
    s4()
  );
}

const initialState = {
  pros: [],
  cons: []
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case types.UPDATE_LIST:
      const updateListKey = action.payload.type;
      return { ...state, [updateListKey]: action.payload.list };

    case types.ADD_INPUT:
      const addListKey = action.payload.type;
      const newProps = { ...action.payload, id: guid() };
      const list = [...state[addListKey], newProps];
      return { ...state, [addListKey]: list };

    case types.EDIT_INPUT:
      const editListKey = action.payload.type;
      const currentInputToEdit = [...state[editListKey]];
      const indexToEdit = currentInputToEdit.findIndex(
        i => i.id === action.payload.id
      );
      const newInputToUpdate = {
        ...currentInputToEdit[indexToEdit],
        text: action.payload.text
      };
      const newEditedList = [
        ...currentInputToEdit.slice(0, indexToEdit),
        newInputToUpdate,
        ...currentInputToEdit.slice(indexToEdit + 1)
      ];
      return { ...state, [editListKey]: newEditedList };

    case types.REMOVE_INPUT:
      const removeListKey = action.payload.type;
      const currentInputToDelete = [...state[removeListKey]];
      const indexToDelete = currentInputToDelete.findIndex(
        i => i.id === action.payload.id
      );
      const newList = [
        ...currentInputToDelete.slice(0, indexToDelete),
        ...currentInputToDelete.slice(indexToDelete + 1)
      ];

      return { ...state, [removeListKey]: newList };
    default:
      return state;
  }
};

export default reducer;
