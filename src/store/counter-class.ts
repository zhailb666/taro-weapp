import { observable, computed, action } from "mobx"

export default class CounterClassStore {

  @observable counter: number = 0; // Observable 值可以是JS基本数据类型、引用类型、普通对象、类实例、数组和映射

  counterStore() {
    this.counter++
  }

  increment() {
    this.counter++
  }

  @action
  incrementTwo = () => {
    this.counter = this.counter + 2
  }

  @action('incrementThree')
  incrementThr = () => {
    this.counter = this.counter + 2
  }

  decrement() {
    this.counter--
  }

  incrementAsync() {
    setTimeout(() => {
      this.counter++
    }, 1000)
  }

  @computed //产生一个新值 计算值(computed values)是可以根据现有的状态或其它计算值衍生出的值。 概念上来说，它们与excel表格中的公式十分相似
  get counterMoney() {
    return `${this.counter}¥`;
  }
}


// 以下是核心API

// 一： observable
/**
 * 用法:

observable(value)
@observable classProperty = value
Observable 值可以是JS基本数据类型、引用类型、普通对象、类实例、数组和映射。
 */

// 二：computed
/**
 * 计算值(computed values)是可以根据现有的状态或其它计算值衍生出的值。 概念上来说，它们与excel表格中的公式十分相似。
 *  不要低估计算值，因为它们有助于使实际可修改的状态尽可能的小。 此外计算值还是高度优化过的，所以尽可能的多使用它们。
    不要把 computed 和 autorun 搞混。它们都是响应式调用的表达式，但是，如果你想响应式的产生一个可以被其它 observer 使用的值，
    请使用 @computed，
    如果你不想产生一个新值，而想要达到一个效果，请使用 autorun。 举例来说，效果是像打印日志、发起网络请求等这样命令式的副作用。
 */

// 三： reactions (observer)
/**
 * Reactions(反应) & Derivations(衍生)
计算值 是自动响应状态变化的值。 反应 是自动响应状态变化的副作用。 
反应可以确保当相关状态发生变化时指定的副作用(主要是 I/O)可以自动地执行，比如打印日志、网络请求、等等。 
使用反应最常见的场景是 React 组件的 observer 装饰器(参见下文)

用法:
observer(React.createClass({ ... }))
observer((props, context) => ReactElement)
observer(class MyComponent extends React.Component { ... })
@observer class MyComponent extends React.Component { ... }
*/


// 四：action (动作)
/**
 * 何时使用动作？
   应该永远只对修改状态的函数使用动作。 只执行查找，过滤器等函数不应该被标记为动作，以允许 MobX 跟踪它们的调用。
 */
