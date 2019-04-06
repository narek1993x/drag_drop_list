import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { DropTarget } from 'react-dnd';
import update from 'immutability-helper';
import Input from '../Input';
import * as actions from '../../actions';
import { INPUT } from '../../actions/constants';
import './InputList.styl';

const cardTarget = {
  drop(props, monitor, component) {
    const { listId } = props;
    const sourceObj = monitor.getItem();

    if (listId !== sourceObj.listId) component.pushCard(sourceObj.card);
    return {
      listId
    };
  }
};

@DropTarget(INPUT, cardTarget, (connect, monitor) => ({
  connectDropTarget: connect.dropTarget(),
  isOver: monitor.isOver(),
  canDrop: monitor.canDrop()
}))
class InputList extends Component {
  state = {
    list: []
  };

  componentWillReceiveProps = (nextProps) => {
    if (this.state.list !== nextProps.list) {
      this.setState({ list: nextProps.list });
    }
  };

  pushCard = (card) => {
    const newCard = { ...card, type: card.type === 'pros' ? 'cons' : 'pros' };
    this.setState(
      update(this.state, {
        list: {
          $push: [newCard]
        }
      }),
      () => this.props.updateList(this.state.list, this.props.type)
    );
  };

  removeCard = (index) => {
    this.setState(
      update(this.state, {
        list: {
          $splice: [[index, 1]]
        }
      }),
      () => this.props.updateList(this.state.list, this.props.type)
    );
  };

  moveCard = (dragIndex, hoverIndex) => {
    const { list } = this.state;
    const dragCard = list[dragIndex];

    this.setState(
      update(this.state, {
        list: {
          $splice: [[dragIndex, 1], [hoverIndex, 0, dragCard]]
        }
      }),
      () => this.props.updateList(this.state.list, this.props.type)
    );
  };

  renderInput = (item, i) => {
    const { listId } = this.props;
    const isInitial = item.listId === 'initial';

    const inputProps = isInitial
      ? {
          index: i,
          orderNum: i,
          listId: item.listId,
          key: item.listId
        }
      : {
          ...item,
          listId,
          index: i,
          orderNum: i + 1,
          key: item.id
        };

    return (
      <Input
        {...inputProps}
        card={item}
        type={item.type}
        removeCard={this.removeCard}
        moveCard={this.moveCard}
      />
    );
  };

  render() {
    const { list } = this.state;
    const { type, canDrop, isOver, connectDropTarget } = this.props;

    const initialNum = list.length + 1;
    const isActive = canDrop && isOver;
    const backgroundColor = isActive ? 'lightgreen' : '#FFF';

    return (
      <div className="InputList">
        <div className="InputList-header">{type}</div>
        {connectDropTarget(
          <div className="InputList-content" style={{ backgroundColor }}>
            {list.map(this.renderInput)}
            {this.renderInput({ listId: 'initial', type }, initialNum)}
          </div>
        )}
      </div>
    );
  }
}

InputList.propTypes = {
  connectDropTarget: PropTypes.func,
  type: PropTypes.string,
  id: PropTypes.number,
  list: PropTypes.array
};

export default connect(
  null,
  actions
)(InputList);
