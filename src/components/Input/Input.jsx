import React, { Component } from 'react'
import { findDOMNode } from 'react-dom'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { addInput, editInput, removeInput } from '../../store/prosCons/actions'
import { DragSource, DropTarget } from 'react-dnd'
import Aux from '../Aux'

const style = {
	border: '1px dashed gray',
	padding: '0.5rem 1rem',
	marginBottom: '.5rem',
	backgroundColor: 'white',
	cursor: 'move',
}
const INPUT = 'input'

const cardSource = {
	beginDrag(props) {
		return {
			id: props.id,
			index: props.index,
		}
  },
  canDrag(props, monitor) {
    return props.id.length > 12
  }
}

const cardTarget = {
	hover(props, monitor, component) {
		const dragIndex = monitor.getItem().index
		const hoverIndex = props.index

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

		props.moveCard(dragIndex, hoverIndex)
		monitor.getItem().index = hoverIndex
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

  static propTypes = {
		connectDragSource: PropTypes.func.isRequired,
		connectDropTarget: PropTypes.func.isRequired,
		index: PropTypes.number.isRequired,
		isDragging: PropTypes.bool.isRequired,
		id: PropTypes.any.isRequired,
		text: PropTypes.string.isRequired,
		moveCard: PropTypes.func.isRequired,
	}

  handleInputClick = () => {
    this.setState({ isInputClick: true })
  }

  handleBlur = e => {
    const { value } = e.currentTarget
    const { keyList } = this.props
    const { id = '' } = this.props

    const props = {
      text: value,
      keyList
    }

    if (!value && id) {
      this.props.dispatch(removeInput({id, keyList}))
    } else if (value && id && id.length > 12) {
      this.props.dispatch(editInput({id, keyList, text: value}))
    } else {
      value && this.props.dispatch(addInput(props))
    }   
    
    this.setState({isInputClick: false})
  }

  render() {
    const { isInputClick } = this.state
    const { orderNum, text, isDragging, connectDragSource, connectDropTarget } = this.props
    const opacity = isDragging ? 0 : 1

    return connectDragSource(
      connectDropTarget(<div className='Input' style={{...style, opacity}}>       
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
