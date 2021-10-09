const newEngine = require('@comunica/actor-init-sparql-file').newEngine;
const myEngine = newEngine();

const config = { sources: ['C:/workingFolder2021/PhD/semantic-rule-management/server/system/ontology/AutoIoT.ttl',
                           'C:/workingFolder2021/PhD/semantic-rule-management/server/system/ontology/SAI.ttl',
                           'C:/workingFolder2021/PhD/semantic-rule-management/server/system/ontology/rdf.ttl'] }

const auto_config = { sources: ['C:/workingFolder2021/PhD/semantic-rule-management/server/system/ontology/AutoIoT.ttl'] }
const sai_config = { sources: ['C:/workingFolder2021/PhD/semantic-rule-management/server/system/ontology/SAI.ttl'] }
const rdf_config = { sources: ['C:/workingFolder2021/PhD/semantic-rule-management/server/system/ontology/rdf.ttl'] }


/**
const query = `
PREFIX owl: <http://www.w3.org/2002/07/owl#>
PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>

SELECT ?s WHERE {
  ?s rdf:type owl:ObjectProperty.
} LIMIT 10
`
*/

export async function sparqlSelectQuery(query, callback) {
  const { bindingsStream } = await myEngine.query(query, config)
  var results = []
  bindingsStream.on('data', (data) => results.push(data))
  bindingsStream.on('end', () => callback(results))
}

export async function sparqlConstructQuery(source, callback) {
  var source_config = config
  if (source === 'AutoIoT') {
    source_config = auto_config
  } else if (source === 'SAI') {
    source_config = sai_config
  } else if (source === 'RDF') {
    source_config = rdf_config
  } else {
    callback([])
    return
  }
  const query = `
  CONSTRUCT WHERE {
    ?s ?p ?o
  } LIMIT 100`

  const result = await myEngine.query(query, source_config)
  var outputs = []
  result.quadStream.on('data', (data) => outputs.push(data))
  result.quadStream.on('end', () => callback(outputs))
}
