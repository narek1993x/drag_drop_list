import * as types from './actionTypes'

const initialState = {
  pros: [],
  cons: []
}

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case types.UPDATE_LIST:
      const updateListKey = action.payload.keyList
      return {...state, [updateListKey]: action.payload.list}
      break;
    case types.ADD_INPUT:
      const addListKey = action.payload.keyList
      const list = [...state[addListKey], action.payload]
      return {...state, [addListKey]: list}
      break;
    case types.EDIT_INPUT:
      const editListKey = action.payload.keyList
      const currentInputToEdit = [...state[editListKey]]
      const indexToEdit = currentInputToEdit.findIndex(i => i.id === action.payload.id)
      const newInputToUpdate = {
        ...currentInputToEdit[indexToEdit],
        text: action.payload.text
      }
      const newEditedList = [...currentInputToEdit.slice(0, indexToEdit),
                             newInputToUpdate,
                             ...currentInputToEdit.slice(indexToEdit+1)]
      return {...state, [editListKey]: newEditedList}
      break;
    case types.REMOVE_INPUT:
      const removeListKey = action.payload.keyList
      const currentInputToDelete = [...state[removeListKey]]
      const indexToDelete = currentInputToDelete.findIndex(i => i.id === action.payload.id)
      const newList = [...currentInputToDelete.slice(0, indexToDelete),
                       ...currentInputToDelete.slice(indexToDelete+1)]
      return {...state, [removeListKey]: newList}
      break;
    default: return state
  }
}

export default reducer