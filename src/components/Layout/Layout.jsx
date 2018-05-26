import React, { Component } from 'react'
import Aux from '../Aux'
import SubHeader from '../SubHeader'

export default class Layout extends Component {
  render() {
    return (
      <Aux>
        <SubHeader />
        <main className='Content'>
          {this.props.children}
        </main>
      </Aux>
    )
  }
}
