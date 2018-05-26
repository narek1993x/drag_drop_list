import React, { Component } from 'react';
import { connect } from 'react-redux'
import Layout from './Layout'
import InputList from './InputList'

class App extends Component {
  render() {
    const { prosList, consList } = this.props
    const inputLists = ['PROS', 'CONS']
    return (
      <div className='App'>
        <Layout>
          {inputLists.map((item, i) => {
            const list = item === 'PROS' ? prosList : consList
            return <InputList headerText={item} key={i} list={list} />
          })}
        </Layout>
      </div>  
    );
  }
}

const mapStateToProps = state => ({
  prosList: state.prosCons.prosList,
  consList: state.prosCons.consList
})

export default connect(mapStateToProps)(App)
