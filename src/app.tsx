import React, { Component } from 'react'
import { Provider } from 'mobx-react'
import store from './store'
import './app.scss'

class App extends Component {
  times = 1;
  publish = () => {
    setTimeout(() => {
      console.log('dddd---setTimeout')
      this.times = this.times + 1;
      if(this.times < 10 ) {
        store.counterStoreT.increment()
        this.publish()
      }
    }, 1000);
  }

  componentDidMount () {
    console.log('----app渲染完成-----')
    this.publish()
  }

  componentDidShow () {
    console.log('----app---componentDidShow-----')
  }

  componentDidHide () {
    console.log('----app---componentDidHide-----')
  }

  componentDidCatchError () {}

  // this.props.children 就是要渲染的页面
  render () {
    return (
      <Provider store={store}>
        {this.props.children}
      </Provider>
    )
  }
}

export default App
