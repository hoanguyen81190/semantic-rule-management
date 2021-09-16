export const OntologyColors = ["black", "white", "blue", "red", "green", "yellow", "purple"]

const DEFAULT_ONTOLOGY = "default"
const JENA_ONTOLOGY = "jena"

export class RDFTriple {
  constructor(subject, predicateString, object, isFunc) {
    this.subject = subject
    this.object = object

    if (isFunc) {
      this.ontology = JENA_ONTOLOGY
      this.predicate = predicateString
    }

    else {
      var ontology = predicateString.split(':')[0]
      if (ontology === '') {
        this.ontology = DEFAULT_ONTOLOGY
      }
      else {
        this.ontology = ontology
      }
      this.predicate = predicateString.split(':')[1]}
  }
}
