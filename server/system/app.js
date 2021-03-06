/**
 * @author Svetlin Tanyi <szvetlin@aitia.ai> on 2020. 01. 29.
 */

import express from 'express'
import bodyParser from 'body-parser'
import clientRouter from './routes'
import os from 'os'
import { config } from './config/config'
import Boom from 'boom'
import logger from 'morgan'
import { responseMiddleware } from './middlewares/responseMiddleware'
import { errorMiddleware } from './middlewares/errorMiddleware'
import https from 'https'
import fs from 'fs'
import path from 'path'
import helmet from 'helmet'
import colors from 'colors'
import { readCoreSystemInfoFile } from './utils/startupHelper'
import { echo as echoSR, register, unregister } from './services/arrowhead/serviceRegistry'
import { echo as echoAUTH } from './services/arrowhead/authorization'
import { echo as echoORCH } from './services/arrowhead/orchestrator'
import { echo as echoDM, getSystemList, dataPut} from './services/arrowhead/dataManager'
import { validateENV } from './utils/startupHelper'
import { serviceRegistryEntry } from './utils/systemUtils'

export const app = express()

let options = {}

if(config.serverSSLEnabled) {
  options = {
    pfx: [{
      buf: fs.readFileSync(path.resolve(__dirname, 'certificates', config.serverSSLKeyStore)),
      passphrase: config.serverSSLKeyStorePassword
    }],
    ca: [fs.readFileSync(path.resolve(__dirname, 'certificates', config.serverSSLTrustStore)), config.serverSSLTrustStorePassword],
    rejectUnauthorized: false,
    requestCert: false//config.serverSSLClientAuth === 'need',
  }
}

// async function testComunica() {
//   const newEngine = require('@comunica/actor-init-sparql-file').newEngine;
//   const myEngine = newEngine();
//
//   const config = { sources: ['C:/workingFolder2021/PhD/semantic-rule-management/server/SAI.ttl'] }
//
//   const query = `
//   PREFIX owl: <http://www.w3.org/2002/07/owl#>
//   PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
//
//   SELECT ?s WHERE {
//     ?s rdf:type owl:ObjectProperty.
//   } LIMIT 10
//   `
//
//   const { bindingsStream } = await myEngine.query(query, config)
//   bindingsStream.on('data', (data) => console.log(data.toObject()));
//   bindingsStream.on('end', () => console.log('Done!'))
//
//   console.log("HERE")
// }

export async function initExpress () {
  validateENV()

  if (config.env !== 'test' && config.env !== 'production') {
    app.use(logger('dev'))
  }
  app.use(responseMiddleware())
  app.use(bodyParser.json({limit: '5mb'}))
  app.use(bodyParser.urlencoded({extended: false, limit: '5mb'}))


  app.use(helmet())

  //Add your routes here
  app.use('/api', clientRouter)

  app.use((req, res, next) => {
    const err = new Error('Not Found')
    err.status = 404
    res.locals.message = err.message
    res.locals.error = config.env === 'development' ? err : {}
    throw Boom.create(404, err)
  })
  app.use(errorMiddleware())
}

export async function start () {
  // testComunica()

  return initExpress()
    .then(async () => {
      const response = await echoSR()
      console.log(response.green)
    })
    // .then( async () => {
    //   const response = await register(serviceRegistryEntry,true)
    //   console.log(response)
    // })
    .then(async () => {
      await readCoreSystemInfoFile(true)
    })
   /* .then(async () => {
      const response = await unregister()
      console.log('unregister', response)
    })*/
    .then( async () => {
      const response = await echoAUTH()
      console.log(response.green)
    })
    .then( async () => {
      const response = await echoORCH()
      console.log(response.green)
    })
    .then( async () => {
      const response = await echoDM()
      console.log(response.green)
    })
    // .then( async () => {
    //   const response = await getSystemList()
    //   console.log('gethistorian', response)
    // })
    // .then( async () => {
    //   readTurtleFile()
    // })
    .then(() => {
      return new Promise((resolve) => {
        if(config.serverSSLEnabled) {
          //  SECURE mode
          https.createServer(options, app).listen(config.serverPort, () => {
            console.log('System started in SECURE mode at', `https://${config.serverAddress}:${config.serverPort}`)
            return resolve()
          })
        } else {
          // INSECURE mode
          app.listen(config.serverPort, () => {
            console.log('System started in INSECURE mode at', `http://${config.serverAddress}:${config.serverPort}`)
            return resolve()
          })
        }
      })
    })
    .catch( (e) => {
      console.log(typeof e === 'string' ? `ERROR: ${e}`.red : e)
      console.log(`ERROR: System not started on ${os.hostname()}, now exiting.`.red)
      process.exit()
    })
}
