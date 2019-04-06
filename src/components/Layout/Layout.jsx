import React, { Fragment } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { DragDropContextProvider } from 'react-dnd';
import HTML5Backend from 'react-dnd-html5-backend';
import TouchBackend from 'react-dnd-touch-backend';
import InputList from '../InputList';
import CustomDragLayer from '../shared/CustomDragLayer';
import './Layout.styl';

const isMobile = Boolean(navigator.userAgent.match(/iPad|iPhone|Android/));
let backend = isMobile ? TouchBackend : HTML5Backend;

const Layout = ({ prosList, consList }) => {
  const inputList = [
    { listId: 1, type: 'pros', list: prosList },
    { listId: 2, type: 'cons', list: consList }
  ];
  return (
    <div className="Layout">
      <DragDropContextProvider backend={backend}>
        <Fragment>
          {inputList.map(({ listId, type, list }) => (
            <InputList listId={listId} key={listId} list={list} type={type} />
          ))}
          <CustomDragLayer />
        </Fragment>
      </DragDropContextProvider>
    </div>
  );
};

const mapStateToProps = (state) => ({
  prosList: state.prosCons.pros,
  consList: state.prosCons.cons
});

Layout.propTypes = {
  prosList: PropTypes.array,
  consList: PropTypes.array
};

export default connect(mapStateToProps)(Layout);
