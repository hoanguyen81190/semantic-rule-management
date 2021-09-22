export const OntologyColors = ["black", "white", "blue", "red", "green", "yellow", "purple"]

export class RDFTriple {
  constructor(subject, predicate, object, ontology) {
    this.subject = {value: subject}
    this.object = {value: object}
    this.ontology = ontology
    this.predicate = {value: predicate}
  }
}
