import React, { Component } from 'react'
import { connect } from 'react-redux'
import { DropTarget } from 'react-dnd'
import Input from '../Input'
import update from 'immutability-helper'
import { updateList } from '../../store/prosCons/actions'
import ItemTypes from '../../ItemTypes'
import './InputList.css'

const cardTarget = {
	drop(props, monitor, component ) {
		const { id } = props;
    const sourceObj = monitor.getItem();
		if ( id !== sourceObj.id ) component.pushCard(sourceObj.card);
		return {
			listId: id
		};
	}
}

@DropTarget(ItemTypes.INPUT, cardTarget, (connect, monitor) => ({
	connectDropTarget: connect.dropTarget(),
	isOver: monitor.isOver(),
	canDrop: monitor.canDrop()
}))
class InputList extends Component {
  state = {
    list: []
  }

  componentWillMount () {
    this.setState({list: this.props.list})
  }

  componentWillReceiveProps = (nextProps) => {
    if (this.state.list !== nextProps.list) {
      this.setState({list: nextProps.list})
    }
  }

  pushCard = card => {
		this.setState(update(this.state, {
			list: {
				$push: [ card ]
			}
		}), () => this.props.dispatch(updateList(this.state.list, this.props.headerText)));
	}
 
	removeCard = index => {		
		this.setState(update(this.state, {
			list: {
				$splice: [
					[index, 1]
				]
			}
		}), () => this.props.dispatch(updateList(this.state.list, this.props.headerText)) )
	}

  moveCard = (dragIndex, hoverIndex) => {
		const { list } = this.state
    const dragCard = list[dragIndex]

		this.setState(
			update(this.state, {
				list: {
					$splice: [[dragIndex, 1], [hoverIndex, 0, dragCard]],
				},
      }),
      () => this.props.dispatch(updateList(this.state.list, this.props.headerText))
    )    
	}
  
  render() {
    const { list } = this.state

    const { headerText, canDrop, isOver, connectDropTarget } = this.props
    const isActive = canDrop && isOver
  
    const backgroundColor = isActive ? 'lightgreen' : '#FFF'

    return (
      <div className='InputList'>
        <div className='InputList-header'>{headerText}</div>
        {connectDropTarget(<div className='InputList-content' style={{backgroundColor}}>
          {list.map((item, i) => {
            return (
              <Input orderNum={i+1}
                listId={item.id}
                text={item.text}
                key={item.id}
                index={i}
                card={item}
                keyList={item.keyList}
                removeCard={this.removeCard}
                moveCard={this.moveCard} />
            )
          })}
          <Input
            listId={list.length + 1}
            text=''
            key='initial'
            orderNum={list.length + 1}
            index={list.length + 1}
            keyList={headerText}
            removeCard={this.removeCard}
            moveCard={this.moveCard} />
        </div>)} 
      </div>
    )
  }
}

export default connect()(InputList)
