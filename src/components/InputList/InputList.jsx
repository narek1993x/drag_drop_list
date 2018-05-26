import React, { Component } from 'react'
import Input from '../Input'
import update from 'immutability-helper'
import { DragDropContext } from 'react-dnd'
import HTML5Backend from 'react-dnd-html5-backend'

@DragDropContext(HTML5Backend)
export default class InputList extends Component {
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

  moveCard = (dragIndex, hoverIndex) => {
		const { list } = this.state
    const dragCard = list[dragIndex]

		this.setState(
			update(this.state, {
				list: {
					$splice: [[dragIndex, 1], [hoverIndex, 0, dragCard]],
				},
			}),
		)
	}
  
  render() {
    const { headerText } = this.props
    const { list } = this.state
    return (
      <div className='InputList'>
        <div className='InputList-header'>{this.props.headerText}</div>
        <div className='InputList-content'>
          {list.map((item, i) => {
            return <Input orderNum={i+1}
                    id={item.id}
                    text={item.text}
                    key={item.id}
                    index={i}
                    keyList={item.keyList}
                    moveCard={this.moveCard} />
          })}
          <Input
            id={list.length + 1}
            text=''
            key='initial'
            orderNum={list.length + 1}
            index={list.length + 1}
            keyList={headerText.toLowerCase()}
            moveCard={this.moveCard} />
        </div>  
      </div>
    )
  }
}
