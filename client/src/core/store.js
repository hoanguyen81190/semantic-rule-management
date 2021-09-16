import { createStore } from 'redux';

/*
* The store is responsible for storing data that needs to be shared between different parts of the application.
*/

const initialState = {
  consumerSystems: [],
  knowledgebase_prefix: []
};

const store = createStore ((state = initialState, action) => {
  switch(action.type) {
    case 'ADD_CONSUMER_SYSTEMS': {
      return { ...state, consumerSystems: state.consumerSystems.concat(action.consumerSystems) };
    }

    case 'ADD_KNOWLEDGE_BASE_PREFIX': {
      return { ...state, knowledgebase_prefix: state.knowledgebase_prefix.concat(action.prefix)}
    }

    default:
      return state;
  }
});



export default store;
