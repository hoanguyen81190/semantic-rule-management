import { createStore } from 'redux';

/*
* The store is responsible for storing data that needs to be shared between different parts of the application.
*/

const initialState = {
  consumerSystems: []
};

const store = createStore ((state = initialState, action) => {
  switch(action.type) {
    case 'ADD_CONSUMER_SYSTEMS': {
      return { ...state, consumerSystems: state.consumerSystems.concat(action.consumerSystems) };
    }

    default:
      return state;
  }
});



export default store;
