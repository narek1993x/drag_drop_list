import React, { Component } from 'react';
import { connect } from 'react-redux'
import { DragDropContext } from 'react-dnd'
import HTML5Backend from 'react-dnd-html5-backend'
import TouchBackend from 'react-dnd-touch-backend'
import Header from './components/Header'
import InputList from './components/InputList'

const isMobile = Boolean(navigator.userAgent.match(/iPad|iPhone|Android/))
let backend = isMobile
  ? TouchBackend
  : HTML5Backend

const App = ({prosList, consList}) => {
  const inputList = [
    {key: 'pros', list: prosList },
    {key: 'cons', list: consList }
  ]
  return (
    <div className='App'>
      <Header />
      <div className='Content'>
        {inputList.map((item, i) => (
          <InputList keyList={item.key} id={i} key={i} list={item.list} />
        ))}
      </div>
    </div>  
  )
}

const mapStateToProps = state => ({
  prosList: state.prosCons.pros,
  consList: state.prosCons.cons
})

export default DragDropContext(backend)(connect(mapStateToProps)(App))
