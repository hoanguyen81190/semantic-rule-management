import { config } from '../config/config'

export const HTTP_INTERFACES = {
  INTERFACE_SECURE: "HTTPS-SECURE-JSON",
	INTERFACE_INSECURE: "HTTP-INSECURE-JSON",
	HTTP_METHOD: "http-method"
}

export function OrchestrationFlags(onlyPreferred,
                                      overrideStore,
                                      externalServiceRequest,
                                      enableInterCloud,
                                      enableQoS,
                                      matchmaking,
                                      metadataSearch,
                                      triggerInterCloud,
                                      pingProviders) {
  return {
    onlyPreferred : onlyPreferred,
    overrideStore : overrideStore,
    externalServiceRequest : externalServiceRequest,
    enableInterCloud : enableInterCloud,
    enableQoS : enableQoS,
    matchmaking : matchmaking,
    metadataSearch : metadataSearch,
    triggerInterCloud : triggerInterCloud,
    pingProviders : pingProviders
  }
}

export function OrchestratorFormBuilder (serviceDefinition, flags, httpInterface) {
  return {
    requesterSystem: {
      systemName: config.clientSystemName,
      address: config.serverAddress,
      port: config.serverPort,
      authenticationInfo: ""//config.serverSSLKeyStorePublicKey
    },
    requestedService: {
      serviceDefinitionRequirement: serviceDefinition,
      interfaceRequirements: [
        httpInterface
      ],
      securityRequirements: null,
      metadataRequirements: null,
      versionRequirement: null,
      maxVersionRequirement: null,
      minVersionRequirement: null
    },
    preferredProviders: [],
    orchestrationFlags: flags
  }
}
