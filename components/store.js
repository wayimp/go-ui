import { createStore } from 'redux'
import { createWrapper, HYDRATE } from 'next-redux-wrapper'

const initialState = {
  segment: 'reports',
  token: {}
}
// create your reducer
const reducer = (state = initialState, action) => {
  switch (action.type) {
    case 'TOKEN':
      return { ...state, token: action.payload }
    case 'FORM_CLEAR':
      return {
        ...state,
        form: { cart: {} }
      }
    default:
      return state
  }
}

// create a makeStore function
const makeStore = context => createStore(reducer)

// export an assembled wrapper
export const wrapper = createWrapper(makeStore, { debug: true })
