/**
 * @author Svetlin Tanyi <szvetlin@aitia.ai> on 2020. 02. 13.
 */

import networkService from '../network/networkService'
import axios from 'axios'
import { config } from '../../config/config'
import { coreSystemInfo } from '../../utils/startupHelper'

export async function echo() {
  return new Promise(async (resolve, reject) => {
    const dataManagerAddress = coreSystemInfo && coreSystemInfo.datamanager ? `${config.serverSSLEnabled ? 'https' : 'http' }://${coreSystemInfo.datamanager.address}:${coreSystemInfo.datamanager.port}/datamanager` : null
    if(!dataManagerAddress){
      return reject('No address for Data Manager')
    }

    let response = null
    const source = axios.CancelToken.source()

    setTimeout(() => {
      if (response === null) {
        source.cancel('Data Manager is not available...')
      }
    }, 1000)


    response = await networkService.get(dataManagerAddress + '/echo', {cancelToken: source.token})
      .then(() => {
        return resolve('Data Manager is accessible')
      }).catch(error => {
        if (axios.isCancel(error)) {
          return reject(error.message)
        }
        return reject(error)
      })
  })
}

//==========================================================//
//                        historian                         //
//==========================================================//
export async function getSystemList() {
  return new Promise((resolve, reject) => {
    const dataManagerAddress = coreSystemInfo && coreSystemInfo.datamanager ? `${config.serverSSLEnabled ? 'https' : 'http' }://${coreSystemInfo.datamanager.address}:${coreSystemInfo.datamanager.port}/datamanager` : null
    if(!dataManagerAddress){
      return reject('No address for Data Manager')
    }

    //check entry validity

    networkService.get(dataManagerAddress + '/historian')
      .then(response => {
        if(response.status === 200) {
          return resolve(response.data)
        }
      })
      .catch(error => {
        console.log('Error during system list query', error)
        return reject(error.response.data.errorMessage)
      })
  })
}

export async function dataPut(dataPutRequest, serviceName) {
  return new Promise((resolve, reject) => {
    const dataManagerAddress = coreSystemInfo && coreSystemInfo.datamanager ? `${config.serverSSLEnabled ? 'https' : 'http' }://${coreSystemInfo.datamanager.address}:${coreSystemInfo.datamanager.port}/datamanager` : null
    if(!dataManagerAddress){
      return reject('No address for Data Manager')
    }
    //check entry validity

    console.log("LOOK", dataManagerAddress + '/historian/' + config.clientSystemName + '/' + serviceName, dataPutRequest)

    networkService.put(dataManagerAddress + '/historian/' + config.clientSystemName + '/' + serviceName, dataPutRequest)
      .then(response => {
        if(response.status === 200) {
          return resolve(response.data)
        }
      })
      .catch(error => {
        console.log('Error during event put data', error)
        return reject(error.response.data.errorMessage)
      })
  })
}
