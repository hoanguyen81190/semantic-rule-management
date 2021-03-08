import axios from 'axios';

import AC_Rest_APIs from './ac_rest_apis.js';
import CONSTANTS from '../common/constants';
import https from 'https';
import fs from 'fs';

const ac_rest_config = require('../config.json');

class ACRESTManager {
  getAll(callback) {
    axios.get(AC_Rest_APIs.GET_ALL)
          .then((response) => this.handleData(response, callback))
          .catch((error) => this.handleError(error))
  };

  getAllRules(callback) {
    axios.get(AC_Rest_APIs.GET_ALL_RULES)
          .then((response) => this.handleData(response, callback))
          .catch((error) => this.handleError(error))
  };

  getAllQueries(callback) {
    axios.get(AC_Rest_APIs.GET_ALL_QUERIES)
          .then((response) => this.handleData(response, callback))
          .catch((error) => this.handleError(error))
  };

  getKnowledge(callback) {
    axios.get(AC_Rest_APIs.GET_KNOWLEDGE)
          .then((response) => this.handleData(response, callback))
          .catch((error) => this.handleError(error))
  }

  registerRule(rule, callback) {
    axios.post(AC_Rest_APIs.POST_REGISTER_RULE, rule)
          .then((response) => this.handleData(response, callback))
          .catch((error) => this.handleError(error))
  }

  deleteRule(rule, callback) {
    axios.post(AC_Rest_APIs.POST_DELETE_RULE, rule)
          .then((response) => this.handleData(response, callback))
          .catch((error) => this.handleError(error))
  }

  handleData(response, callback) {
    if (response.status === 200) {
      callback(response.data.data)
    }
  }

  handleError(error){
    console.log("Something went wrong");
    console.log(error);
  }
}


export default new ACRESTManager();
