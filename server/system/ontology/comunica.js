const newEngine = require('@comunica/actor-init-sparql-file').newEngine;
const myEngine = newEngine();

const config = { sources: ['C:/workingFolder2021/PhD/semantic-rule-management/server/system/ontology/SAI.ttl',
                           'C:/workingFolder2021/PhD/semantic-rule-management/server/system/ontology/rdf.ttl'] }

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

export async function sparqlConstructQuery(query, callback) {
  const quadsStream = await myEngine.query(query, config)
  const results = await quadsStream.quads()

  return results
}
