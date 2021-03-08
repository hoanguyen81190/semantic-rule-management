/*
RDFTriple object {
subject: string,
predicate: string,
object: string
}
*/

export function ruleParser(stringInput) {
  console.log("input", stringInput)
  var ruleRegex = /\[.*\]/
  var ruleString = ruleRegex.exec(stringInput);
  console.log("ruleString", ruleString)
  var fullRuleName = ruleString.split(':')[0]
  var rule = ruleString.split(':')[1]
  var rdfTriples = rdfParser(rule)
  return {
    systemName: fullRuleName.split('_')[0],
    ruleName: fullRuleName.split('_')[1],
    rdfTriples: rdfTriples
  }
}

export function rdfParser(stringInput) {
  return []
}
