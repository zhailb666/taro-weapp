import counter, { counterStoreT }  from './counter'
import CounterClass from './counter-class'

const Store = {
    counterStore: counter,
    counterStoreT,
    counterClassStore: new CounterClass(),
}

export type StoreType = typeof Store;

export default Store;