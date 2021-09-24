/*
RDFTriple object {
subject: string,
predicate: string,
object: string
}
*/
import rdfParser from "rdf-parse"
import { RDFTriple } from "./rdfModel"
import * as RdfString from "rdf-string"
import ONTOLOGY from "./ontologyConstants"

const ttl_read = require('@graphy/content.ttl.read')

const DEFAULT_ONTOLOGY = "base"
const JENA_ONTOLOGY = "jena"

export function ruleParser(stringInput) {
  var input = JSON.parse(stringInput)
  // var ruleRegex = /\[(.*?)\]/
  // var ruleString = stringInput.match(/\[(.*?)\]/)[1]
  // var ruleAndName = ruleString.match(/([^:]*):(.*)/)
  //
  // var name = ruleAndName[1]
  // var rule = ruleAndName[2]

  var rdfTriples = ""//rdfParser.parse(rule)
  console.log("PARSED RULE", input)
  return input;
}

export function turtleParser(stringInput) {
  var results = []
  ttl_read(stringInput, {
      // whew! simplified inline events style  ;)
      data(y_quad) {
          results.push(y_quad)
      },

      eof(h_prefixes) {
          console.log('done!');
      },
  })
  return results
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

//------------------------------------------------------------
function extractRules(stringInput) {
  var rulesText = stringInput.replace(/(\r\n|\n|\r)/gm, ' ');
  var ruleRegex = new RegExp('#( )*\\[([^\\]]+)\\]', 'g')
  var rules = []
  var match
  while((match = ruleRegex.exec(rulesText)) != null) {
    rules.push(parseRule(match[0]))
  }
  return rules
}

function parseStatement(statementString) {
  var parts = []
  if (statementString.search(/->/) != -1) {
    parts = statementString.split('->')
    return {
      body: extractRDFTriple(parts[0]),
      head: parts[1]
    }
  }
  else if (statementString.search(/<-/) != -1) {
    parts = statementString.split('<-')
    return {
      body: extractRDFTriple(parts[1]),
      head: parts[0]
    }
  }
  else {
    return null
  }

}

export function parseObject(objStr) {
  var ontologyParts = objStr.split(':')
  if (ontologyParts.length > 1) {//belongs to an ontology
    return {
      value: ontologyParts[1],
      ontology: ontologyParts[0]
    }
  }
  else { //either variable or a literal
    var variableParts = objStr.split('?')
    if (variableParts.length > 1) { //is a variable
      return {
        value: variableParts[1],
        isVar: true
      }
    }
    return {
      value: objStr,
      isVar: false
    }
  }
}

function parseRDFTriples(inputString) {
  var rdfString = inputString.trim()
  //Check if it is an RDFTriple
  var rdfNormal = rdfString.indexOf('(')

  if (rdfNormal > 0) {
    let comma = rdfString.indexOf(',')
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

function parseRule(ruleString) {
  //PARSE NAME
  var ruleRegex = /(?<=\[).+?(?=\])/i
  var rule = ruleRegex.exec(ruleString)
  var name = rule[0].substr(0, rule[0].indexOf(':'))
  var statement = rule[0].substr(rule[0].indexOf(':')+1)

  //PARSE STATEMENT
  return {
    name: name,
    statement: parseStatement(statement)
  }
}

export function jenaRuleParser(stringInput) {
  var prefixes = extractPrefixes(stringInput)
  var rules = extractRules(stringInput)
  return {
    prefixes: prefixes,
    rules: rules
  }
}

//-------------------------GRAPH--------------------------
function parseURLName(urlObj) {
  var parts = urlObj.value.split('#')

  return {
    value: parts[1],
    ontology: ONTOLOGY.ontologyLookUp.get(parts[0])
  }
}
function quadToRDFModel(quad) {
  return new RDFTriple(parseURLName(quad.subject),
                       parseURLName(quad.predicate),
                       parseURLName(quad.object)
                        )
}

export function quadsToRDFModels(quads) {
  var triples = []
  quads.map((titem, tindex) => {
    triples.push(quadToRDFModel(titem))
  })
  return triples
}

function filterNodesById(nodes,id){
	return nodes.filter(function(n) { return n.id === id; });
}

function filterNodesByType(nodes,value){
	return nodes.filter(function(n) { return n.type === value; });
}

export function triplesToGraph(inputTriples){
	//Graph
	var graph={nodes:[], first_links:[], second_links:[], predicates:[]}
	if (inputTriples === undefined || inputTriples.length === 0) {
		return graph
	}

  var triples = inputTriples

  if (inputTriples[0].termType === 'Quad') {
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
    var parts = qitem['?s'].value.split('#')
    results.push({
      name: parts[1],
      ontology: ONTOLOGY.ontologyLookUp.get(parts[0]),
      displayedName: ONTOLOGY.ontologyLookUp.get(parts[0]) + ':' + parts[1]
    })
  })
  return results
}
