/*
RDFTriple object {
subject: string,
predicate: string,
object: string
}
*/
import rdfParser from "rdf-parse"
import { RDFTriple } from "./rdfModel"
import ONTOLOGY from "./ontologyConstants"
import * as ActionModel from "./actionModel"

const ttl_read = require('@graphy/content.ttl.read')

const DEFAULT_ONTOLOGY = "auto"
const JENA_ONTOLOGY = "jena"

export function getRuleResponseParser(response) {
  var systems = []
  var output = []
  response.map((ritem, rindex) => {
    if (systems.indexOf(ritem.systemName) === -1) {
      systems.push(ritem.systemName)
    }
    ritem.rules.map((jritem, jrindex) => {
      output.push({
        systemName: ritem.systemName,
        ...parseRule(jritem)
      })
    })
  })

  return {
    rules: output,
    systems: systems
  }
}

//-----------------------------------------------------------

export function turtleParser(stringInput) {
  var results = []
  ttl_read(stringInput, {
      // whew! simplified inline events style  )
      data(y_quad) {
          results.push(y_quad)
      },

      eof(h_prefixes) {
          console.log('done!')
      },
  })
  return results
}

//------------------------------------------------------------
export function jenaRuleParser(stringInput) {
  var prefixes = extractPrefixes(stringInput)
  var rules = extractRules(stringInput)
  return {
    prefixes: prefixes,
    rules: rules
  }
}

//------------------------------------------------------------
function extractPrefixes(stringInput) {
  var prefixRegex = new RegExp('@.*>','g')
  var prefixes = []
  var match = null
  while(match = prefixRegex.exec(stringInput)) {
    prefixes.push(match)
  }
  return prefixes
}

function extractRules(stringInput) {
  var rulesText = stringInput.replace(/(\r\n|\n|\r)/gm, ' ')
  var ruleRegex = new RegExp('#( )*\\[([^\\]]+)\\]', 'g')
  var rules = []
  var match
  while((match = ruleRegex.exec(rulesText)) != null) {
    rules.push({...parseRule(match[0]),
    systemName: "testFile"})
  }
  return rules
}

function parseRule(ruleString) {
  //PARSE NAME
  var ruleRegex = /(?<=\[).+?(?=\])/i
  var rule = ruleRegex.exec(ruleString)
  var name = rule[0].substr(0, rule[0].indexOf(':'))
  var name = name.replace(/ /g, '')
  var statement = rule[0].substr(rule[0].indexOf(':')+1)

  //PARSE STATEMENT
  return {
    name: name,
    statement: parseStatement(statement)
  }
}

function parseStatement(statementString) {
  var parts = []
  if (statementString.search(/->/) != -1) {
    parts = statementString.split('->')
    return {
      body: extractRDFTriple(parts[0]),
      head: parseActions(parts[1])
    }
  }
  else if (statementString.search(/<-/) != -1) {
    parts = statementString.split('<-')
    return {
      body: extractRDFTriple(parts[1]),
      head: parseActions(parts[0])
    }
  }
  else {
    return null
  }
}

function parseActions(actionString) {
  actionString = actionString.replace(/\"/g, '')

  var actions = []
  var match = null

  var substituteRegex = new RegExp('substituteService\(([^)]+)\)', 'g')
  while(match = substituteRegex.exec(actionString)) {
    let output = parseSubstituteAction(match[0])
    if(output !== undefined) {
      actions.push(output)
    }
  }

  var configureRegex = new RegExp('configure\(([^)]+)\)', 'g')
  while(match = configureRegex.exec(actionString)) {
    let output = parseConfigureAction(match[0])
    if(output !== undefined) {
      actions.push(output)
    }
  }

  return actions
}

function parseSubstituteAction(actionString) {
  let openChar = actionString.indexOf('(')
  actionString = actionString.substr(openChar + 1)
  var parts = actionString.split(',')
  if (parts.length < 5) {
    parts = actionString.split(' ')
  }
  return new ActionModel.SubstituteActionModel(
    parseObject(parts[0]),
    parseObject(parts[1]),
    parseObject(parts[2]),
  )
}

function parseConfigureAction(actionString) {
  let openChar = actionString.indexOf('(')
  actionString = actionString.substr(openChar + 1)
  let parts = actionString.split(',')
  if (parts.length < 3) {
    parts = actionString.split(' ')
  }
  return new ActionModel.ConfigureActionModel(
    parseObject(parts[0]),
    parseObject(parts[1]),
    parseObject(parts[2])
  )
}

function extractRDFTriple(stringInput) {
  var rdfTripleRegex = new RegExp('\(([^)]+)\)', 'g')
  var rdfTriples = []
  var match = null
  while(match = rdfTripleRegex.exec(stringInput)) {
    var output = parseRDFTriples(match[0])
    if(output !== undefined) {
      rdfTriples.push(output)
    }
  }
  return rdfTriples
}

function parseRDFTriples(inputString) {
  var rdfString = inputString.trim()
  let xsdPrefix = rdfString.indexOf('\^')
  if (xsdPrefix !== -1) {
    rdfString = rdfString.substr(0, xsdPrefix)
  }
  //Check if it is an RDFTriple
  var rdfNormal = rdfString.indexOf('(')

  if (rdfNormal > 0) {
    var comma = rdfString.indexOf(',')
    if (comma < 0) {
      comma = rdfString.indexOf(' ')
    }
    let func = rdfString.substr(0, rdfNormal)
    let predicate = {
      value: rdfString.substr(0, rdfNormal),
      ontology: JENA_ONTOLOGY
    }

    return new RDFTriple(parseObject(rdfString.substr(rdfNormal + 1, comma - rdfNormal - 1)),
                         predicate,
                         parseObject(rdfString.substr(comma + 1)))
  }
  else if (rdfNormal !== -1) {
    const parts = rdfString.substr(rdfNormal+1).split(/\s+/)
    var ontology = parts[1].split(':')[0]
    if (ontology === '') {
      ontology = DEFAULT_ONTOLOGY
    }
    let predicate = {
      value: parts[1].split(':')[1],
      ontology: ontology
    }
    return new RDFTriple(parseObject(parts[0]),
                         predicate,
                         parseObject(parts[2]))
  }

}

export function parseObject(objStr) {
  objStr = objStr.replace(/ /g, '')
  objStr = objStr.replace(/\'/g, '')
  var ontologyParts = objStr.split(':')
  if (ontologyParts.length > 1) {//belongs to an ontology
    var ontologyName = ontologyParts[0]
    if(ontologyName === '') {
      ontologyName = DEFAULT_ONTOLOGY
    }
    return {
      value: ontologyParts[1],
      ontology: ontologyName
    }
  }
  else { //either variable or a literal
    var variableParts = objStr.split('?')
    if (variableParts.length > 1) { //is a variable
      return {
        value: objStr,
        isVar: true
      }
    }
    return {
      value: objStr,
      isVar: false
    }
  }
}

//-------------------------GRAPH--------------------------
function parseURLName(urlObj) {
  console.log(urlObj.constructor.name, urlObj.termType)
  if (urlObj.termType === 'NamedNode') {
    var parts = urlObj.value.split('#')
    return {
      value: parts[1],
      ontology: ONTOLOGY.ontologyLookUp.get(parts[0])
    }
  }
  else {
    return {
      value: urlObj.value,
      isVar: false
    }
  }
}
function quadToRDFModel(quad) {
  var newTriple = new RDFTriple(parseURLName(quad.subject),
                       parseURLName(quad.predicate),
                       parseURLName(quad.object))
  if (newTriple.predicate.value === "hasBody") {
    newTriple = new RDFTriple(parseURLName(quad.subject),
                         parseURLName(quad.predicate),
                         parseURLName({value: "", isVar: false}))
  }
  return newTriple
}

export function quadsToRDFModels(quads) {
  var triples = []
  quads.map((titem, tindex) => {
    triples.push(quadToRDFModel(titem))
  })
  return triples
}

function filterNodesById(nodes,id){
	return nodes.filter(function(n) { return n.id === id })
}

function filterNodesByType(nodes,value){
	return nodes.filter(function(n) { return n.type === value })
}

export function triplesToGraph(inputTriples){
	//Graph
	var graph={nodes:[], first_links:[], second_links:[], predicates:[]}
	if (inputTriples === undefined || inputTriples.length === 0) {
		return graph
	}
  console.log("input triples", inputTriples)
  var triples = inputTriples
  if (inputTriples[0].termType === 'Quad' || inputTriples[0].graph !== undefined) {
    triples = quadsToRDFModels(inputTriples)
  }

	//Initial Graph from triples
	triples.forEach(function(triple){
		var subjId = triple.subject.value
		var predId = triple.predicate.value
		var objId = triple.object.value

		var subjNode = filterNodesById(graph.nodes, subjId)[0]
		var objNode  = filterNodesById(graph.nodes, objId)[0]

		if(subjNode==null){
			subjNode = {id:subjId, label:subjId, weight:1, obj:triple.subject}
			graph.nodes.push(subjNode)
		}

		if(objNode==null){
			objNode = {id:objId, label:objId, weight:1, obj:triple.object}
			graph.nodes.push(objNode)
		}
    var predNode = {id:subjId+predId+objId, label:predId, obj:triple.predicate, weight:1}
    graph.predicates.push(predNode)

		graph.first_links.push({source:subjNode, target:predNode, obj:triple.predicate, weight:1})
    graph.second_links.push({source:predNode, target:objNode, obj:triple.predicate, weight:1})
	})

	return graph
}

export function convertToAutoCompleteRDF(quads) {
  var results = []
  quads.map((qitem, qindex) => {
    var parts = qitem['?sai'].value.split('#')
    if(ONTOLOGY.ontologyLookUp.get(parts[0]) === undefined) {

    }
    else {
      results.push({
        name: parts[1],
        ontology: ONTOLOGY.ontologyLookUp.get(parts[0]),
        displayedName: ONTOLOGY.ontologyLookUp.get(parts[0]) + ':' + parts[1]
      })
    }
  })
  return results
}

//display
export function displayObjectText(obj) {
  if (obj.ontology !== undefined) {
    return obj.ontology + ':' + obj.value
  }
  return obj.value
}

/*-----------------------------------------------------------*/
export function buildObjectString(obj) {
  if (obj.ontology !== undefined) {
    var ontologyObj = ONTOLOGY.ontologyConstants[obj.ontology.toUpperCase()]
    return '<' + ontologyObj.url + obj.value + '>'
  }
  return obj.value
}
function buildPrefixes(prefixes) {
  var prefixesOutput = {}
  prefixes.map((pitem, pindex) => {
    prefixesOutput[pitem.name] = pitem.url
  })
  return prefixesOutput
}

function buildRdfTriple(triple) {
  console.log("triple", triple)
  if (triple.predicate.ontology === 'jena') {
    return triple.predicate.value + '(' + triple.subject.value + ' ' + triple.object.value + ')'
  }
  return '(' + buildObjectString(triple.subject) + ' '
             + buildObjectString(triple.predicate)
             + ' ' + buildObjectString(triple.object) + ')'
}
function buildAction(actions) {
  var actionStrings = []
  actions.map((aitem, aindex) => {
    actionStrings.push(aitem.getString())
  })
  return actionStrings.join(' ')
}
function buildStatement(statement) {
  var statementString = []
  statement.map((sitem, sindex) => {
    statementString.push(buildRdfTriple(sitem))
  })
  return statementString.join(' ')
}
function buildRule(ruleName, statement, actions) {
  return '[' + ruleName + ': ' + buildStatement(statement) + ' -> ' + buildAction(actions) + ']'
}
export function buildJenaRuleRequest(newRule) {
  return {
    systemName: newRule.systemName,
    rules: [buildRule(newRule.name, newRule.statement.body, newRule.statement.head)]
  }
}
