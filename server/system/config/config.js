/**
 * @author Svetlin Tanyi <szvetlin@aitia.ai> on 2020. 01. 29.
 */

import './dotenv'
import { getBool } from '../utils/utils'
import forge from 'node-forge'
import fs from "fs"
import path from 'path'

export let serverSSLKeyStorePublicKey = null

if(getBool(process.env.SERVER_SSL_ENABLED)) {
  const certificate = fs.readFileSync(path.resolve(__dirname, `../certificates/${process.env.SERVER_SSL_KEY_STORE}`))
//const privateKey = pki.decryptRsaPrivateKey(certificate, config.serverSSLKeyStorePassword)
  const p12Der = forge.util.decode64(certificate.toString('base64'))
  const p12Asn1 = forge.asn1.fromDer(p12Der)
  const p12 = forge.pkcs12.pkcs12FromAsn1(p12Asn1, process.env.SERVER_SSL_KEY_STORE_PASSWORD)

  const bag = p12.getBags({ bagType: forge.pki.oids.pkcs8ShroudedKeyBag })[
    forge.pki.oids.pkcs8ShroudedKeyBag
    ][0];

//console.log(bag)
  const publicKey = forge.pki.setRsaPublicKey(bag.key.n, bag.key.e)
  const publicKeyPem = forge.pki.publicKeyToPem(publicKey)
//console.log(forge.pki.publicKeyToPem(publicKey))
  const lines = publicKeyPem.split('\r\n')
  lines.splice(0, 1)
  lines.splice(lines.length - 2, 2)
  serverSSLKeyStorePublicKey = lines.join('') //public key joined into a single line without header
}

export const config = {
  env: process.env.NODE_ENV,
  clientSystemName: process.env.CLIENT_SYSTEM_NAME,
  serverAddress: process.env.SERVER_ADDRESS,
  serverPort: process.env.SERVER_PORT,
  srAddress: process.env.SR_ADDRESS,
  srPort: process.env.SR_PORT,
  serverSSLEnabled: getBool(process.env.SERVER_SSL_ENABLED),
  tokenSecurityFilterEnabled: process.env.TOKEN_SECURITY_FILTER_ENABLED,
  serverSSLKeyStoreType: process.env.SERVER_SSL_KEYSTORE_TYPE,
  serverSSLKeyStore: process.env.SERVER_SSL_KEY_STORE,
  serverSSLKeyStorePassword: process.env.SERVER_SSL_KEY_STORE_PASSWORD,
  serverSSLKeyAlias: process.env.SERVER_SSL_KEY_ALIAS,
  serverSSLKeyPassword: process.env.SERVER_SSL_KEY_PASSWORD,
  serverSSLClientAuth: process.env.SERVER_SSL_CLIENT_AUTH,
  serverSSLTrustStoreType: process.env.SERVER_SSL_TRUST_STORE_TYPE,
  serverSSLTrustStore: process.env.SERVER_SSL_TRUST_STORE,
  serverSSLTrustStorePassword: process.env.SERVER_SSL_TRUST_STORE_PASSWORD,
  serverSSLKeyStorePublicKey: serverSSLKeyStorePublicKey
}
