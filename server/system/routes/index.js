/**
 * @author Svetlin Tanyi <szvetlin@aitia.ai> on 2020. 01. 29.
 */

import Router from 'express-promise-router'
import networkService from '../services/network/networkService'
import { orchestration, consumeServiceHTTP } from '../services/arrowhead/orchestrator'
import { HTTP_INTERFACES, OrchestrationFlags, OrchestratorFormBuilder } from '../utils/OrchestratorFormBuilder'
import { PROXY_APIS, AUTONOMIC_ORCHESTRATION_APIS } from '../utils/constants'
const router = Router()

router.get(PROXY_APIS.GET_ALL_CONSUMER_SYSTEMS, (req, res, next) => {
  var flags = OrchestrationFlags(false, true, false, false, false, false, false, false, false)
  var orchestrator_form = OrchestratorFormBuilder(AUTONOMIC_ORCHESTRATION_APIS.GET_ALL_RULES,
                                                  flags, HTTP_INTERFACES.INTERFACE_SECURE)
  orchestration(orchestrator_form, '/', (orchestration_response) => {
    consumeServiceHTTP(orchestration_response.response[0], (data) => {
      res.json({succeed: true, data: data})
    })

  })
})

router.get(PROXY_APIS.GET_ALL_RULES, (req, res, next) => {
  // var flags = OrchestrationFlags(false, true, false, false, false, false, false, false, false)
  // var orchestrator_form = OrchestratorFormBuilder(AUTONOMIC_ORCHESTRATION_APIS.GET_ALL_KNOWLEDGE,
  //                                                 flags, HTTP_INTERFACES.INTERFACE_SECURE)
  // orchestration(orchestrator_form, '/', (orchestration_response) => {
  //   consumeServiceHTTP(orchestration_response.response[0], (data) => {
  //     res.json({succeed: true, data: data})
  //   })
  //
  // })
  networkService.get("https://127.0.0.1:8461/auto/orchestration/rules")
    .then(response => {
      if(response.status === 200) {
        console.log("consuming successfully ")
        res.json({succeed: true, data: response.data})
      }
    })
    .catch(error => {
      console.log("consuming error", error)

    })
})

router.get(PROXY_APIS.GET_KNOWLEDGE, (req, res, next) => {
  // var flags = OrchestrationFlags(false, true, false, false, false, false, false, false, false)
  // var orchestrator_form = OrchestratorFormBuilder(AUTONOMIC_ORCHESTRATION_APIS.GET_ALL_KNOWLEDGE,
  //                                                 flags, HTTP_INTERFACES.INTERFACE_SECURE)
  // orchestration(orchestrator_form, '/', (orchestration_response) => {
  //   consumeServiceHTTP(orchestration_response.response[0], (data) => {
  //     res.json({succeed: true, data: data})
  //   })
  //
  // })
  networkService.get("https://127.0.0.1:8461/auto/orchestration/knowledge")
    .then(response => {
      if(response.status === 200) {
        console.log("consuming successfully ")
        res.json({succeed: true, data: response.data})
      }
    })
    .catch(error => {
      console.log("consuming error", error)

    })
})

router.get(PROXY_APIS.GET_ALL_QUERIES, (req, res, next) => {
  // var flags = OrchestrationFlags(false, true, false, false, false, false, false, false, false)
  // var orchestrator_form = OrchestratorFormBuilder(AUTONOMIC_ORCHESTRATION_APIS.GET_ALL_KNOWLEDGE,
  //                                                 flags, HTTP_INTERFACES.INTERFACE_SECURE)
  // orchestration(orchestrator_form, '/', (orchestration_response) => {
  //   consumeServiceHTTP(orchestration_response.response[0], (data) => {
  //     res.json({succeed: true, data: data})
  //   })
  //
  // })
  networkService.get("https://127.0.0.1:8461/auto/orchestration/queries")
    .then(response => {
      if(response.status === 200) {
        console.log("consuming successfully ")
        res.json({succeed: true, data: response.data})
      }
    })
    .catch(error => {
      console.log("consuming error", error)

    })
})

export default router
