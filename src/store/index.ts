import counter from './counter'
import CounterClass from './counter-class'

const store = {
    counterStore: counter,
    counterClassStore: new CounterClass(),
}


export default store;