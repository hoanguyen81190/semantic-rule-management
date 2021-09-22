import ONTOLOGY from './ontologyConstants'
function buildPrefixString(prefix) {
  return "PREFIX " + prefix.name + ':<' + prefix.url + '>'
}

function buildParameterString(params) {
  return params.join(' ')
}

function buildConditionString(conditions) {
  return '\r' + conditions.join(' ') + '.'
}

export const common_queries = {
  get_all_classes: selectQueryBuilder([ONTOLOGY.ontologyConstants.OWL], ['?s'], [['?s', '?p', 'owl:Class']], 1000),
  get_all_properties: selectQueryBuilder([ONTOLOGY.ontologyConstants.RDF], ['?s'], [['?s', '?p', 'rdf:Property']], 1000)
}

export function selectQueryBuilder(prefixes, params, conditions, limit) {
  var query = []
  prefixes.map((pitem, pindex) => {
    query.push(buildPrefixString(pitem))
  })
  query.push("")
  //open
  query.push("SELECT " + buildParameterString(params) + " WHERE {")
  conditions.map((citem, cindex) => {
    query.push(buildConditionString(citem))
  })
  query.push("} LIMIT " + limit)
  var queryString = query.join('\n')
  return queryString
}

export function constructQueryBuilder(prefixes, conditions1, conditions2, limit) {
  var query = []
  prefixes.map((pitem, pindex) => {
    query.push(buildPrefixString(pitem))
  })
  query.push("")
  //open
  if (conditions1 !== null) {
    query.push("CONSTRUCT {")
    conditions1.map((citem1, cindex1) => {
      query.push(buildConditionString(citem1))
    })
    query.push("} WHERE {")
  }
  else {
    query.push("CONSTRUCT WHERE {")
  }

  conditions2.map((citem2, cindex2) => {
    query.push(buildConditionString(citem2))
  })
  query.push("} LIMIT " + limit)
  var queryString = query.join('\n')

  return queryString
}
