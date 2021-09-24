import { createStore } from 'redux';

/*
* The store is responsible for storing data that needs to be shared between different parts of the application.
*/

const initialState = {
  consumerSystems: [],
  knowledgebase_prefix: [],
  ontology:[],
  ontology_classes: [],
  ontology_properties: []
};

const store = createStore ((state = initialState, action) => {
  switch(action.type) {
    case 'ADD_CONSUMER_SYSTEMS': {
      return { ...state, consumerSystems: state.consumerSystems.concat(action.consumerSystems) }
    }

    case 'ADD_KNOWLEDGE_BASE_PREFIX': {
      return { ...state, knowledgebase_prefix: state.knowledgebase_prefix.concat(action.prefix)}
    }

    case 'ALL_ONTOLOGY_INSTANCES': {
      return { ...state, ontology: action.ontology}
    }

    case 'ALL_ONTOLOGY_CLASSES': {
      return { ...state, ontology_classes: action.ontology_classes}
    }

    case 'ALL_ONTOLOGY_PROPERTIES': {
      return { ...state, ontology_properties: state.ontology_properties.concat(action.ontology_properties)}
    }

    default:
      return state;
  }
});



export default store;
