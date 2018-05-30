import React, { Component } from 'react'
import { findDOMNode } from 'react-dom'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { DragSource, DropTarget } from 'react-dnd'
import * as actions from '../actions'
import { INPUT } from '../actions/constants'

const style = {
	border: '1px dashed gray',
	padding: '0.5rem 1rem',
	marginBottom: '.5rem',
	backgroundColor: 'white',
	cursor: 'move',
}

const cardSource = {
	beginDrag(props) {
		return {
      index: props.index,
      listId: props.listId,
      card: props.card
		}
  },
  canDrag(props, monitor) {
    return props.listId !== 'initial'
  },
  endDrag(props, monitor) {
		const item = monitor.getItem()
    const dropResult = monitor.getDropResult()
    
		if ( dropResult && dropResult.listId !== item.listId ) {
			props.removeCard(item.index)
		}
	}
}

const cardTarget = {
	hover(props, monitor, component) {
		const dragIndex = monitor.getItem().index
    const hoverIndex = props.index
    const sourceListId = monitor.getItem().listId	

		if (dragIndex === hoverIndex) {
			return
		}

		const hoverBoundingRect = findDOMNode(component).getBoundingClientRect()
		const hoverMiddleY = (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2
		const clientOffset = monitor.getClientOffset()
		const hoverClientY = clientOffset.y - hoverBoundingRect.top

		if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) {
			return
		}

		if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) {
			return
    }

    if ( props.listId === sourceListId ) {
			props.moveCard(dragIndex, hoverIndex)
			monitor.getItem().index = hoverIndex
    }
	},
}

@DropTarget(INPUT, cardTarget, connect => ({
	connectDropTarget: connect.dropTarget(),
}))
@DragSource(INPUT, cardSource, (connect, monitor) => ({
	connectDragSource: connect.dragSource(),
	isDragging: monitor.isDragging(),
}))
class Input extends Component {
  state = {
    isInputClick: false,
    text: ''
  }

  handleInputClick = () => {
    this.setState({ isInputClick: true })
  }

  handleBlur = e => {
    const { value } = e.currentTarget
    const { keyList, card } = this.props
    const id = card && card.id

    const props = {
      text: value,
      keyList
    }

    if (!value && id) {
      this.props.removeInput({id, keyList})
    } else if (value && id && id !== 'initial') {
      this.props.editInput({id, keyList, text: value})
    } else {
      value && this.props.addInput(props)
    }   
    
    this.setState({isInputClick: false})
  }

  render() {
    const { isInputClick } = this.state
    const { orderNum, text, listId, isDragging, connectDragSource, connectDropTarget } = this.props
    const opacity = isDragging ? 0 : 1

    return connectDragSource(
      connectDropTarget(<div className='Input' style={listId !== 'initial' ? {...style, opacity} : null}>       
        <h3 className='Input-editable-text' onClick={this.handleInputClick}>
          <b>{orderNum}.</b>
          {isInputClick ? (
            <input autoFocus
              onFocus={ev => {
                const currentTarget = ev.currentTarget
                setTimeout(() => currentTarget.select(), 100)
              }}
              onBlur={this.handleBlur}
              defaultValue={text}
              onChange={this.handleInputClick}/>
          ) : <span>{text}</span>}
        </h3>
      </div>)
    )
  }
}

Input.propTypes = {
  connectDragSource: PropTypes.func,
  connectDropTarget: PropTypes.func,
  index: PropTypes.number,
  isDragging: PropTypes.bool,
  listId: PropTypes.any,
  keyList: PropTypes.string,
  orderNum: PropTypes.number,
  text: PropTypes.string,
  moveCard: PropTypes.func,
  removeCard: PropTypes.func,
}

export default connect(null, actions)(Input)
