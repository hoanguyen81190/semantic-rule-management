/**
 * @author Svetlin Tanyi <szvetlin@aitia.ai> on 2020. 01. 29.
 */

import Router from 'express-promise-router'
import networkService from '../services/network/networkService'
import { orchestration, consumeServiceHTTP } from '../services/arrowhead/orchestrator'
import { sparqlSelectQuery, sparqlConstructQuery } from '../ontology/comunica'
import { HTTP_INTERFACES, OrchestrationFlags, OrchestratorFormBuilder } from '../utils/OrchestratorFormBuilder'
import { PROXY_APIS, AUTONOMIC_ORCHESTRATION_APIS, COMUNICA_APIS } from '../utils/constants'
const router = Router()

router.get(PROXY_APIS.GET_ALL_CONSUMER_SYSTEMS, (req, res, next) => {
  var flags = OrchestrationFlags(false, true, false, false, false, false, false, false, false)
  var orchestrator_form = OrchestratorFormBuilder(AUTONOMIC_ORCHESTRATION_APIS.GET_ALL_CONSUMER_SYSTEMS,
                                                  flags, HTTP_INTERFACES.INTERFACE_SECURE)
  orchestration(orchestrator_form, '/', (orchestration_response) => {
    if (orchestration_response.response === undefined || orchestration_response.response.length == 0) {
      console.log("Arrowhead returns nothing")
      res.json({succeed: false, data: null})
    }
    else {
      consumeServiceHTTP(orchestration_response.response[0], null, (data) => {
        res.json({succeed: true, data: data})
      })
    }
  })
})

router.get(PROXY_APIS.GET_ALL_RULES, (req, res, next) => {
  var flags = OrchestrationFlags(false, true, false, false, false, false, false, false, false)
  var orchestrator_form = OrchestratorFormBuilder(AUTONOMIC_ORCHESTRATION_APIS.GET_ALL_RULES,
                                                  flags, HTTP_INTERFACES.INTERFACE_SECURE)
  orchestration(orchestrator_form, '/', (orchestration_response) => {
    if (orchestration_response.response === undefined || orchestration_response.response.length == 0) {
      console.log("Arrowhead returns nothing")
      res.json({succeed: false, data: null})
    }
    else {
      consumeServiceHTTP(orchestration_response.response[0], null, (data) => {
        res.json({succeed: true, data: data})
      })
    }
  })
})

router.get(PROXY_APIS.GET_ALL_RULES_2, (req, res, next) => {
  var flags = OrchestrationFlags(false, true, false, false, false, false, false, false, false)
  var orchestrator_form = OrchestratorFormBuilder(AUTONOMIC_ORCHESTRATION_APIS.GET_ALL_RULES_2,
                                                  flags, HTTP_INTERFACES.INTERFACE_SECURE)
  orchestration(orchestrator_form, '/', (orchestration_response) => {
    if (orchestration_response.response === undefined || orchestration_response.response.length == 0) {
      console.log("Arrowhead returns nothing")
      res.json({succeed: false, data: null})
    }
    else {
      consumeServiceHTTP(orchestration_response.response[0], null, (data) => {
        res.json({succeed: true, data: data})
      })
    }
  })
})

router.get(PROXY_APIS.GET_KNOWLEDGE, (req, res, next) => {
  var flags = OrchestrationFlags(false, true, false, false, false, false, false, false, false)
  var orchestrator_form = OrchestratorFormBuilder(AUTONOMIC_ORCHESTRATION_APIS.GET_ALL_KNOWLEDGE,
                                                  flags, HTTP_INTERFACES.INTERFACE_SECURE)
  orchestration(orchestrator_form, '/', (orchestration_response) => {
    consumeServiceHTTP(orchestration_response.response[0], null, (data) => {
      res.json({succeed: true, data: data})
    })

  })
})

router.get(PROXY_APIS.GET_ALL_QUERIES, (req, res, next) => {
  var flags = OrchestrationFlags(false, true, false, false, false, false, false, false, false)
  var orchestrator_form = OrchestratorFormBuilder(AUTONOMIC_ORCHESTRATION_APIS.GET_ALL_QUERIES,
                                                  flags, HTTP_INTERFACES.INTERFACE_SECURE)
  orchestration(orchestrator_form, '/', (orchestration_response) => {
    consumeServiceHTTP(orchestration_response.response[0], null, (data) => {
      res.json({succeed: true, data: data})
    })

  })
})

router.post(PROXY_APIS.POST_REGISTER_RULE, (req, res, next) => {
  var payload = req.body
  var flags = OrchestrationFlags(false, true, false, false, false, false, false, false, false)
  var orchestrator_form = OrchestratorFormBuilder(AUTONOMIC_ORCHESTRATION_APIS.REGISTER_RULE,
                                                  flags, HTTP_INTERFACES.INTERFACE_SECURE)
  orchestration(orchestrator_form, '/', (orchestration_response) => {
    consumeServiceHTTP(orchestration_response.response[0], payload, (data) => {
      res.json({succeed: true, data: data})
    })

  })
})

router.post(PROXY_APIS.POST_DELETE_RULE, (req, res, next) => {
  var flags = OrchestrationFlags(false, true, false, false, false, false, false, false, false)
  var orchestrator_form = OrchestratorFormBuilder(AUTONOMIC_ORCHESTRATION_APIS.DELETE_RULE,
                                                  flags, HTTP_INTERFACES.INTERFACE_SECURE)
  orchestration(orchestrator_form, '/', (orchestration_response) => {
    consumeServiceHTTP(orchestration_response.response[0], (data) => {
      res.json({succeed: true, data: data})
    })

  })
})

//------------------------COMUNICA-------------------------
router.post(COMUNICA_APIS.SPARQL_QUERY, async (req, res, next) => {
  const { type, query } = req.body

  if (type === "select") {
    await sparqlSelectQuery(query, (result) => {
      res.json({data: result})
    })
  }
  else if (type === "construct") {
    await sparqlConstructQuery(query, (result) => {
      res.json({data: result})
    })
  }
})

export default router
