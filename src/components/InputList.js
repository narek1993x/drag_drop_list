import React, { Component } from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import { DropTarget } from 'react-dnd'
import update from 'immutability-helper'
import Input from './Input'
import * as actions from '../actions'
import { INPUT } from '../actions/constants'

const cardTarget = {
	drop(props, monitor, component ) {
		const { id } = props;
    const sourceObj = monitor.getItem()

		if ( id !== sourceObj.listId ) component.pushCard(sourceObj.card)
		return {
			listId: id
		};
	}
}

@DropTarget(INPUT, cardTarget, (connect, monitor) => ({
	connectDropTarget: connect.dropTarget(),
	isOver: monitor.isOver(),
	canDrop: monitor.canDrop()
}))
class InputList extends Component {
  state = {
    list: []
  }

  componentWillReceiveProps = (nextProps) => {
    if (this.state.list !== nextProps.list) {
      this.setState({list: nextProps.list})
    }
  }

  pushCard = card => {
    const newCard = {...card, keyList: card.keyList === 'pros' ? 'cons' : 'pros' }
		this.setState(update(this.state, {
			list: {
				$push: [ newCard ]
			}
		}), () => this.props.updateList(this.state.list, this.props.keyList))
	}
 
	removeCard = index => {		
		this.setState(update(this.state, {
			list: {
				$splice: [
					[index, 1]
				]
			}
		}), () => this.props.updateList(this.state.list, this.props.keyList))
	}

  moveCard = (dragIndex, hoverIndex) => {
    const { list } = this.state
    const dragCard = list[dragIndex]

		this.setState(
			update(this.state, {
				list: {
					$splice: [[dragIndex, 1], [hoverIndex, 0, dragCard]],
				},
      }), () => this.props.updateList(this.state.list, this.props.keyList))    
	}
  
  render() {
    const { list } = this.state
    const { keyList, canDrop, isOver, connectDropTarget } = this.props

    const initialNum = list.length + 1
    const isActive = canDrop && isOver  
    const backgroundColor = isActive ? 'lightgreen' : '#FFF'

    return (
      <div className='InputList'>
        <div className='InputList-header'>{keyList}</div>
        {connectDropTarget(<div className='InputList-content' style={{backgroundColor}}>
          {list.map((item, i) => (
              <Input orderNum={i+1}
                listId={this.props.id}
                text={item.text}
                key={item.id}
                index={i}
                card={item}
                keyList={item.keyList}
                removeCard={this.removeCard}
                moveCard={this.moveCard} />))}
          <Input listId='initial' key='initial' orderNum={initialNum} index={initialNum} keyList={keyList} />
        </div>)} 
      </div>
    )
  }
}

InputList.propTypes = {
  connectDropTarget: PropTypes.func,
  keyList: PropTypes.string,
  id: PropTypes.number,
  list: PropTypes.array,
}

export default connect(null, actions)(InputList)
