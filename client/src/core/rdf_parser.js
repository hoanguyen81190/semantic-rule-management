/*
RDFTriple object {
subject: string,
predicate: string,
object: string
}
*/
import rdfParser from "rdf-parse"
import { RDFTriple } from "./rdfModel"

const ttl_read = require('@graphy/content.ttl.read');

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

function parseRDFTriples(inputString) {
  var rdfString = inputString.trim()
  //Check if it is an RDFTriple
  var rdfNormal = rdfString.indexOf('(')
  if (rdfNormal !== 0) {
    var comma = rdfString.indexOf(',')
    var func = rdfString.substr(0, rdfNormal)
    return new RDFTriple(rdfString.substr(rdfNormal + 1, comma - rdfNormal - 1), rdfString.substr(0, rdfNormal), rdfString.substr(comma + 1), true)
  }
  else {
    const parts = rdfString.substr(rdfNormal+1).split(/\s+/)
    return new RDFTriple(parts[0], parts[1], parts[2], false)
  }
}

function extractRDFTriple(stringInput) {
  var rdfTripleRegex = new RegExp('\(([^)]+)\)', 'g')
  var rdfTriples = []
  var match = null
  while(match = rdfTripleRegex.exec(stringInput)) {
    rdfTriples.push(parseRDFTriples(match[0]))
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
