import React, { Component } from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import { DragDropContext } from 'react-dnd'
import HTML5Backend from 'react-dnd-html5-backend'
import TouchBackend from 'react-dnd-touch-backend'
import InputList from '../InputList'
import './Layout.styl'

const isMobile = Boolean(navigator.userAgent.match(/iPad|iPhone|Android/))
let backend = isMobile
  ? TouchBackend
  : HTML5Backend

const Layout = ({prosList, consList}) => {
  const inputList = [
    {key: 'pros', list: prosList },
    {key: 'cons', list: consList }
  ]
  return (
    <div className='Layout'>
      {inputList.map((item, i) => (
        <InputList
          id={i}
          key={item.key}
          list={item.list}
          keyList={item.key} />
      ))}
    </div>
  )
}

const mapStateToProps = state => ({
  prosList: state.prosCons.pros,
  consList: state.prosCons.cons
})

Layout.propTypes = {
  prosList: PropTypes.array,
  consList: PropTypes.array
}

export default DragDropContext(backend)(connect(mapStateToProps)(Layout))
