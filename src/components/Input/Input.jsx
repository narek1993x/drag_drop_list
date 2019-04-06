import React, { Component } from 'react';
import { findDOMNode } from 'react-dom';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { DragSource, DropTarget } from 'react-dnd';
import { getEmptyImage } from 'react-dnd-html5-backend';
import * as actions from '../../actions';
import { INPUT } from '../../actions/constants';
import './Input.styl';

function getStyles(props) {
  const { isDragging } = props;

  return {
    border: '1px dashed gray',
    padding: '0.5rem 1rem',
    marginBottom: '.5rem',
    backgroundColor: 'white',
    cursor: 'move',
    // IE fallback: hide the real node using CSS when dragging
    // because IE will ignore our custom "empty image" drag preview.
    opacity: isDragging ? 0 : 1,
    height: isDragging ? 0 : ''
  };
}

const cardSource = {
  beginDrag(props) {
    const { listId, card, index, orderNum } = props;

    return {
      index,
      listId,
      card,
      orderNum
    };
  },
  canDrag(props, monitor) {
    return props.listId !== 'initial';
  },
  endDrag(props, monitor) {
    const item = monitor.getItem();
    const dropResult = monitor.getDropResult();

    if (dropResult && dropResult.listId !== item.listId) {
      props.removeCard(item.index);
    }
  }
};

const cardTarget = {
  hover(props, monitor, component) {
    const dragIndex = monitor.getItem().index;
    const hoverIndex = props.index;
    const sourceListId = monitor.getItem().listId;

    if (dragIndex === hoverIndex) {
      return;
    }

    const hoverBoundingRect = findDOMNode(component).getBoundingClientRect();
    const hoverMiddleY = (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;
    const clientOffset = monitor.getClientOffset();
    const hoverClientY = clientOffset.y - hoverBoundingRect.top;

    if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) {
      return;
    }

    if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) {
      return;
    }

    if (props.listId === sourceListId) {
      props.moveCard(dragIndex, hoverIndex);
      monitor.getItem().index = hoverIndex;
    }
  }
};

@DropTarget(INPUT, cardTarget, (connect) => ({
  connectDropTarget: connect.dropTarget()
}))
@DragSource(INPUT, cardSource, (connect, monitor) => ({
  connectDragSource: connect.dragSource(),
  isDragging: monitor.isDragging(),
  connectDragPreview: connect.dragPreview()
}))
class Input extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isInputClick: false,
      text: props.text || ''
    };
  }

  componentDidMount = () => {
    const { connectDragPreview } = this.props;
    if (connectDragPreview) {
      // Use empty image as a drag preview so browsers don't draw it
      // and we can draw whatever we want on the custom drag layer instead.
      connectDragPreview(getEmptyImage(), {
        // IE fallback: specify that we'd rather screenshot the node
        // when it already knows it's being dragged so we can hide it with CSS.
        captureDraggingState: true
      });
    }
  };

  handleInputClick = () => {
    this.setState({ isInputClick: true });
  };

  handleInputChange = (e) => {
    this.setState({ text: e.target.value });
  };

  keyPress = (e) => {
    if (e.keyCode == 13 || (e.keyCode == 8 && !this.state.text)) {
      this.inputToggle();
    }
  };

  inputToggle = () => {
    const { text } = this.state;
    const { type, listId, card } = this.props;
    const id = (card && card.id) || listId;
    const isEdit = id.length > 20;

    const method =
      text && id === 'initial'
        ? 'addInput'
        : text && isEdit
        ? 'editInput'
        : !text && isEdit
        ? 'removeInput'
        : '';

    if (method) {
      this.props[method]({ text, type, id });
    }
    this.setState({ isInputClick: false, text: '' });
  };

  render() {
    const { isInputClick } = this.state;
    const { orderNum, text, listId, connectDragSource, connectDropTarget } = this.props;

    return connectDragSource(
      connectDropTarget(
        <div
          className="Input"
          style={listId !== 'initial' ? { ...getStyles(this.props) } : null}
        >
          <h3 className="Input-editable-text" onClick={this.handleInputClick}>
            <b>{orderNum}.</b>
            {isInputClick ? (
              <input
                autoFocus
                onFocus={(ev) => {
                  const currentTarget = ev.currentTarget;
                  setTimeout(() => currentTarget.select(), 100);
                }}
                onKeyDown={this.keyPress}
                onBlur={this.inputToggle}
                onChange={this.handleInputChange}
                defaultValue={text}
              />
            ) : (
              <span>{text}</span>
            )}
          </h3>
        </div>
      )
    );
  }
}

Input.propTypes = {
  connectDragSource: PropTypes.func,
  connectDropTarget: PropTypes.func,
  index: PropTypes.number,
  isDragging: PropTypes.bool,
  listId: PropTypes.any,
  type: PropTypes.string,
  orderNum: PropTypes.number,
  text: PropTypes.string,
  moveCard: PropTypes.func,
  removeCard: PropTypes.func
};

export default connect(
  null,
  actions
)(Input);
