import React, { Component } from 'react'
import { View, Button, Text } from '@tarojs/components'
import { observer, inject } from 'mobx-react'

import './index.scss'

type PageStateProps = {
  store: {
    counterStore: {
      counter: number,
      increment: Function,
      decrement: Function,
      incrementAsync: Function
    },
    counterClassStore: {
      counter: number,
      increment: Function,
      decrement: Function,
      incrementAsync: Function
    }
  }
}

interface Index {
  props: PageStateProps;
}

@inject('store')
@observer
class Index extends Component {
  componentWillMount () { }

  componentDidMount () { }

  componentWillUnmount () { }

  componentDidShow () { }

  componentDidHide () { }

  increment = () => {
    const { counterStore } = this.props.store
    counterStore.increment()
  }

  decrement = () => {
    const { counterStore } = this.props.store
    counterStore.decrement()
  }

  incrementAsync = () => {
    const { counterStore } = this.props.store
    counterStore.incrementAsync()
  }

  incrementClass = () => {
    const { counterClassStore } = this.props.store
    counterClassStore.increment()
  }

  decrementClass = () => {
    const { counterClassStore } = this.props.store
    counterClassStore.decrement()
  }

  incrementAsyncClass = () => {
    const { counterClassStore } = this.props.store
    counterClassStore.incrementAsync()
  }
  
  incrementClassPlusTwo = () => {
    const { counterClassStore } = this.props.store
    counterClassStore.incrementThr()
  }

  render () {
    console.log(this.props.store, 'store')
    const { counterStore: { counter }, counterClassStore } = this.props.store
    return (
      <View className='index'>
        <Button onClick={this.increment}>+</Button>
        <Button onClick={this.decrement}>-</Button>
        <Button onClick={this.incrementAsync}>Add Async</Button>
        <Text>{counter}</Text>

        <Button onClick={this.incrementClass}>+</Button>
        <Button onClick={this.incrementClassPlusTwo}>+2</Button>
        <Button onClick={this.decrementClass}>-</Button>
        <Button onClick={this.incrementAsyncClass}>Add Async</Button>
        <Text>{counterClassStore.counter || 0}</Text>
        <Text>{counterClassStore.yuanMoney || 0}</Text>
      </View>
    )
  }
}

export default Index
