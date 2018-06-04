import * as types from './constants'

export const updateList = props => {
  return { type: types.UPDATE_LIST, payload: props}
}

export const addInput = props => {  
  return { type: types.ADD_INPUT, payload: props}
}

export const editInput = props => {
  return { type: types.EDIT_INPUT, payload: props}
}

export const removeInput = props => {
  return { type: types.REMOVE_INPUT, payload: props}
}