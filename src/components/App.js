import React, { Component } from 'react';
import { connect } from 'react-redux'
import { DragDropContext } from 'react-dnd'
import HTML5Backend from 'react-dnd-html5-backend'
import Layout from './Layout'
import InputList from './InputList'

@DragDropContext(HTML5Backend)
class App extends Component {
  render() {
    const { prosList, consList } = this.props
    const inputLists = ['pros', 'cons']
    return (
      <div className='App'>
        <Layout>
          {inputLists.map((item, i) => {
            const list = item === 'pros' ? prosList : consList
            return <InputList headerText={item} id={i} key={i} list={list} />
          })}
        </Layout>
      </div>  
    );
  }
}

const mapStateToProps = state => ({
  prosList: state.prosCons.pros,
  consList: state.prosCons.cons
})

export default connect(mapStateToProps)(App)
