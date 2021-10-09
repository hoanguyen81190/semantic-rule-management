import * as colors from '@material-ui/core/colors'

const ontologyConstants = {
  AUTO: {
    url: "http://www.semanticweb.org/an.nlam/ontologies/2017/1/AutoIoT#",
    name: "",
    displayName: "AutoIoT",
    colorCode: colors.blueGrey[500]
  },
  SAI: {
    url: "https://arrowhead.eu/arrowheadtools/sai#",
    name: "sai",
    displayName: "SAI",
    colorCode: colors.pink[300]
  },
  RDFS: {
    url: "http://www.w3.org/2000/01/rdf-schema#",
    name: "rdfs",
    displayName: "RDFS",
    colorCode: colors.lightGreen[300]
  },
  RDF: {
    url: "http://www.w3.org/1999/02/22-rdf-syntax-ns#",
    name: "rdf",
    displayName: "RDF",
    colorCode: colors.blue[300]
  },
  SOSA: {
    url: "http://www.w3.org/ns/sosa#",
    name: "sosa",
    displayName: "SOSA",
    colorCode: colors.yellow[300]
  },
  XSD: {
    url: "http://www.w3.org/2001/XMLSchema#",
    name: "xsd",
    displayName: "XSD",
    colorCode: colors.deepPurple[400]
  },
  JENA: {
    url: "built-in functions from Jena",
    name: "jena",
    displayName: "Jena",
    colorCode: colors.deepOrange[400]
  },
  OWL: {
    url: "http://www.w3.org/2002/07/owl#",
    name: "owl",
    displayName: "OWL",
    colorCode: colors.red[300]
  },
  SAN: {
    url: "http://www.irit.fr/recherches/MELODI/ontologies/SAN#",
    name: "san",
    displayName: "SAN",
    colorCode: colors.amber[300]
  },
  DUL: {
    url: "http://www.ontologydesignpatterns.org/ont/dul/DUL.owl#",
    name: "dul",
    displayName: "DUL",
    colorCode: colors.cyan[300]
  },
  DOGONT: {
    url: "http://elite.polito.it/ontologies/dogont.owl#",
    name: "dogont",
    displayName: "DogOnt",
    colorCode: colors.lime[300]
  },
  MSM: {
    url: "http://iserve.kmi.open.ac.uk/ns/msm#",
    name: "msm",
    displayName: "MSM",
    colorCode: colors.teal[300]
  },
  IOTO: {
    url: "http://www.irit.fr/recherches/MELODI/ontologies/IoT-O#",
    name: "ioto",
    displayName: "IoTo",
    colorCode: colors.indigo[300]
  },
  SSN: {
    url: "http://purl.oclc.org/NET/ssnx/ssn#",
    name: "ssn",
    colorCode: colors.green[800]
  },
  MUO: {
    url: "http://purl.oclc.org/NET/muo/muo#",
    name: "muo",
    colorCode: colors.brown[300]
  },
  // SWRL: {
  //   url: "http://www.w3.org/2003/11/swrl#",
  //   name: "swrl",
  //   colorCode: colors.grey[800]
  // },
}

const ontologyList = [ontologyConstants.AUTO, ontologyConstants.SAI, ontologyConstants.RDF, ontologyConstants.RDFS,
                      ontologyConstants.SOSA]

const ontologyLookUp = new Map()
ontologyLookUp.set("http://www.semanticweb.org/an.nlam/ontologies/2017/1/AutoIoT", ontologyConstants.AUTO.name)
ontologyLookUp.set("https://arrowhead.eu/arrowheadtools/sai", ontologyConstants.SAI.name)
ontologyLookUp.set("http://www.w3.org/ns/sosa", ontologyConstants.SOSA.name)
ontologyLookUp.set("http://www.w3.org/1999/02/22-rdf-syntax-ns", ontologyConstants.RDF.name)
ontologyLookUp.set("http://www.w3.org/2000/01/rdf-schema", ontologyConstants.RDFS.name)
ontologyLookUp.set("http://www.w3.org/2001/XMLSchema", ontologyConstants.XSD.name)
ontologyLookUp.set("", ontologyConstants.JENA.name)
ontologyLookUp.set("http://www.w3.org/2002/07/owl", ontologyConstants.OWL.name)
ontologyLookUp.set("http://www.irit.fr/recherches/MELODI/ontologies/SAN", ontologyConstants.SAN.name)
ontologyLookUp.set("http://www.ontologydesignpatterns.org/ont/dul/DUL.owl", ontologyConstants.DUL.name)
ontologyLookUp.set("http://elite.polito.it/ontologies/dogont.owl", ontologyConstants.DOGONT.name)
ontologyLookUp.set("http://iserve.kmi.open.ac.uk/ns/msm", ontologyConstants.MSM.name)
ontologyLookUp.set("http://www.irit.fr/recherches/MELODI/ontologies/IoT-O", ontologyConstants.IOTO.name)
ontologyLookUp.set("http://purl.oclc.org/NET/ssnx/ssn", ontologyConstants.SSN.name)
ontologyLookUp.set("http://purl.oclc.org/NET/muo/muo", ontologyConstants.MUO.name)
//ontologyLookUp.set("http://www.w3.org/2003/11/swrl", ontologyConstants.SWRL.name)
//ontologyLookUp.set("http://www.w3.org/2002/07/owl", ontologyConstants.OWL.name)

export default { ontologyConstants, ontologyLookUp, ontologyList }
