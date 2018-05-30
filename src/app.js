import React, { Component } from 'react';
import { connect } from 'react-redux'
import { DragDropContext } from 'react-dnd'
import HTML5Backend from 'react-dnd-html5-backend'
import SubHeader from './components/SubHeader'
import InputList from './components/InputList'

@DragDropContext(HTML5Backend)
class App extends Component {
  render() {
    const { prosList, consList } = this.props
    const inputList = [
      {key: 'pros', list: prosList },
      {key: 'cons', list: consList }
    ]
    return (
      <div className='App'>
        <SubHeader />
        <div className='Boards'>
          {inputList.map((item, i) => (
            <InputList keyList={item.key} id={i} key={i} list={item.list} />
          ))}
        </div>
      </div>  
    );
  }
}

const mapStateToProps = state => ({
  prosList: state.prosCons.pros,
  consList: state.prosCons.cons
})

export default connect(mapStateToProps)(App)
