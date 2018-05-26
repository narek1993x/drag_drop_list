import React, { Component } from 'react'
import { findDOMNode } from 'react-dom'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { addInput, editInput, removeInput } from '../../store/prosCons/actions'
import { DragSource, DropTarget } from 'react-dnd'
import Aux from '../Aux'
import ItemTypes from '../../ItemTypes'
import './Input.css'

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
    return props.listId.length > 12
  },
  endDrag(props, monitor) {
		const item = monitor.getItem();
		const dropResult = monitor.getDropResult();	

		if ( dropResult && dropResult.listId !== item.listId ) {
			props.removeCard(item.index);
		}
	}
}

const cardTarget = {
	hover(props, monitor, component) {
		const dragIndex = monitor.getItem().index
    const hoverIndex = props.index
    const sourceListId = monitor.getItem().listId;	

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

@DropTarget(ItemTypes.INPUT, cardTarget, connect => ({
	connectDropTarget: connect.dropTarget(),
}))
@DragSource(ItemTypes.INPUT, cardSource, (connect, monitor) => ({
	connectDragSource: connect.dragSource(),
	isDragging: monitor.isDragging(),
}))
class Input extends Component {
  state = {
    isInputClick: false,
    text: ''
  }

  static propTypes = {
		connectDragSource: PropTypes.func.isRequired,
		connectDropTarget: PropTypes.func.isRequired,
		index: PropTypes.number.isRequired,
		isDragging: PropTypes.bool.isRequired,
		listId: PropTypes.any.isRequired,
		text: PropTypes.string.isRequired,
		moveCard: PropTypes.func.isRequired,
	}

  handleInputClick = () => {
    this.setState({ isInputClick: true })
  }

  handleBlur = e => {
    const { value } = e.currentTarget
    const { keyList } = this.props
    const { listId = '' } = this.props

    const props = {
      text: value,
      keyList
    }

    if (!value && listId) {
      this.props.dispatch(removeInput({id: listId, keyList}))
    } else if (value && listId && listId.length > 12) {
      this.props.dispatch(editInput({id: listId, keyList, text: value}))
    } else {
      value && this.props.dispatch(addInput(props))
    }   
    
    this.setState({isInputClick: false})
  }

  render() {
    const { isInputClick } = this.state
    const { orderNum, text, listId, isDragging, connectDragSource, connectDropTarget } = this.props
    const opacity = isDragging ? 0 : 1

    return connectDragSource(
      connectDropTarget(<div className='Input' style={listId.length > 12 ? {...style, opacity} : {}}>       
        <h3 className='Input-editable-text' onClick={this.handleInputClick}>
          <b>{orderNum}.</b>
          {isInputClick
            ? <input autoFocus
                onFocus={ev => {
                  const currentTarget = ev.currentTarget
                  setTimeout(() => currentTarget.select(), 100)
                }}
                onBlur={this.handleBlur}
                defaultValue={text}
                onChange={this.handleInputClick}/>
            : <span>{text}</span>}
        </h3>
      </div>)
    )
  }
}

export default connect()(Input)
