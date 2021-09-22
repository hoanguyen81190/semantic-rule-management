import * as colors from '@material-ui/core/colors';

const ontologyConstants = {
  BASE: {
    url: "http://www.semanticweb.org/an.nlam/ontologies/2017/1/AutoIoT#",
    name: "",
    color: "#64b5f6",
    colorCode: colors.blue[300]
  },
  SAI: {
    url: "https://arrowhead.eu/arrowheadtools/sai#",
    name: "sai",
    color: "#ffca28",
    colorCode: colors.amber[400]
  },
  // SAN: {
  //   url: "http://www.irit.fr/recherches/MELODI/ontologies/SAN#",
  //   name: "san",
  //   color: "#81c784",
  //   colorCode: colors.green[300]
  // },
  // DUL: {
  //   url: "http://www.ontologydesignpatterns.org/ont/dul/DUL.owl#",
  //   name: "dul",
  //   color: "#fff176",
  //   colorCode: colors.yellow[300]
  // },
  // DOGONT: {
  //   url: "http://elite.polito.it/ontologies/dogont.owl#",
  //   name: "dogont",
  //   color: "#dce775",
  //   colorCode: colors.lime[300]
  // },
  // MSM: {
  //   url: "http://iserve.kmi.open.ac.uk/ns/msm#",
  //   name: "msm",
  //   color: "#4db6ac",
  //   colorCode: colors.teal[300]
  // },
  // IOTO: {
  //   url: "http://www.irit.fr/recherches/MELODI/ontologies/IoT-O#",
  //   name: "ioto",
  //   color: "#7986cb",
  //   colorCode: colors.indigo[300]
  // },
  // SSN: {
  //   url: "http://purl.oclc.org/NET/ssnx/ssn#",
  //   name: "ssn",
  //   color: "#ef5350",
  //   colorCode: colors.red[400]
  // },
  // MUO: {
  //   url: "http://purl.oclc.org/NET/muo/muo#",
  //   name: "muo",
  //   color: "#ba68c8",
  //   colorCode: colors.purple[300]
  // },
  SOSA: {
    url: "http://www.w3.org/ns/sosa#",
    name: "sosa",
    color: "#f06292",
    colorCode: colors.pink[300]
  },
  RDF: {
    url: "http://www.w3.org/1999/02/22-rdf-syntax-ns#",
    name: "rdf",
    color: "#ffb74d",
    colorCode: colors.orange[300]
  },
  RDFS: {
    url: "http://www.w3.org/2000/01/rdf-schema#",
    name: "rdfs",
    color: "#9ccc65", //9ccc65
    colorCode: colors.lightGreen[300]
  },
  XSD: {
    url: "http://www.w3.org/2001/XMLSchema#",
    name: "xsd",
    color: "#bdbdbd",
    colorCode: colors.grey[400]
  },
  JENA: {
    url: "",
    name: "jena",
    color: "#a1887f",
    colorCode: colors.brown[400]
  },
  OWL: {
    url: "http://www.w3.org/2002/07/owl#",
    name: "owl",
    color: "#ef5350",
    colorCode: colors.red[300]
  }
}

const ontologyLookUp = new Map()
ontologyLookUp.set("http://www.semanticweb.org/an.nlam/ontologies/2017/1/AutoIoT", ontologyConstants.BASE.name)
ontologyLookUp.set("https://arrowhead.eu/arrowheadtools/sai", ontologyConstants.SAI.name)
ontologyLookUp.set("http://www.w3.org/ns/sosa", ontologyConstants.SOSA.name)
ontologyLookUp.set("http://www.w3.org/1999/02/22-rdf-syntax-ns", ontologyConstants.RDF.name)
ontologyLookUp.set("http://www.w3.org/2000/01/rdf-schema", ontologyConstants.RDFS.name)
ontologyLookUp.set("http://www.w3.org/2001/XMLSchema", ontologyConstants.XSD.name)
ontologyLookUp.set("", ontologyConstants.JENA.name)
ontologyLookUp.set("http://www.w3.org/2002/07/owl", ontologyConstants.OWL.name)

export default { ontologyConstants, ontologyLookUp }
