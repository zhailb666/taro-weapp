import React, { Component } from 'react'
import { View, Button, Text } from '@tarojs/components'
import { observer, inject } from 'mobx-react'

import './index.scss'
import { StoreType } from 'src/store'

type PageStateProps = {
  store: StoreType
}

interface Index {
  props: PageStateProps;
}

@inject('store') // {/*❓2*/}
@observer // {/*❓4*/}
class Index extends Component {
  index = 1;
  componentWillMount () { }

  componentDidMount () {
    const { counterStore } = this.props.store
    console.log('测试页面渲染完成');
   }

  componentWillUnmount () { }

  componentDidShow () { }

  componentDidHide () { }

  // shouldComponentUpdate(nextProps, nextState) {  //{/*❓3*/}
  //   debugger
  //  }

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
    this.index = this.index + 1
    console.log(`${this.index}渲染次数`,this.props.store, 'store')
    const { counterStore: { counter }, counterClassStore, counterStoreT} = this.props.store
    console.log(counterStoreT.counter, '测试taro的render机制') //❓1
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
        <View>{counterClassStore.counter || 0}</View>
        <View>{counterClassStore.yuanMoney || 0}</View>
        <View>{counterStoreT.counter || 0}</View> {/*❓1*/}
      </View>
    )
  }
}

export default Index
