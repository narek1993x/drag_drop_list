import React, { Component } from 'react';
import { DragLayer } from 'react-dnd';
import { INPUT } from '../../../actions/constants';
import snapToGrid from '../../../helpers/snapToGrid';

import './CustomDragLayer.styl';

const layerStyles = {
  position: 'fixed',
  pointerEvents: 'none',
  zIndex: 100,
  left: 0,
  top: 0
};

function getItemStyles(props) {
  const { initialOffset, currentOffset } = props;
  if (!initialOffset || !currentOffset) {
    return {
      display: 'none'
    };
  }
  let { x, y } = currentOffset;
  if (props.snapToGrid) {
    x -= initialOffset.x;
    y -= initialOffset.y;
    [x, y] = snapToGrid(x, y);
    x += initialOffset.x;
    y += initialOffset.y;
  }
  const transform = `translate(${x}px, ${y}px)`;
  return {
    transform,
    WebkitTransform: transform
  };
}

class CustomDragLayer extends Component {
  renderItem = () => {
    const { item, itemType } = this.props;

    switch (itemType) {
      case INPUT:
        return (
          <div className="CustomDragLayer">
            <h3 className="CustomDragLayer-editable-text">
              <b>{item.orderNum}.</b>
              <span>{item.card.text}</span>
            </h3>
          </div>
        );
      default:
        return null;
    }
  };
  render() {
    if (!this.props.isDragging) {
      return null;
    }

    // The component will work only when dragging
    return (
      <div style={{ ...layerStyles, ...getItemStyles(this.props) }}>
        {this.renderItem()}
      </div>
    );
  }
}

function collect(monitor) {
  return {
    item: monitor.getItem(),
    itemType: monitor.getItemType(),
    initialOffset: monitor.getInitialSourceClientOffset(),
    currentOffset: monitor.getSourceClientOffset(),
    isDragging: monitor.isDragging()
  };
}

export default DragLayer(collect)(CustomDragLayer); // eslint-disable-line new-cap
