import * as types from './actionTypes'

function guid() {
  function s4() {
    return Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);
  }
  return s4() + s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' + s4() + s4() + s4();
}

export const updateList = (list, keyList) => {
  return { type: types.UPDATE_LIST, payload: {list, keyList}}
}

export const addInput = props => {
  const newProps = {...props, id: guid()}
  return { type: types.ADD_INPUT, payload: newProps}
}

export const editInput = props => {
  return { type: types.EDIT_INPUT, payload: props}
}

export const removeInput = props => {
  return { type: types.REMOVE_INPUT, payload: props}
}