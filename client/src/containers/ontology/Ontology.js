import React, { useState, useEffect } from 'react'
import { makeStyles } from '@material-ui/core/styles'

import withStyles from '@material-ui/core/styles/withStyles'

import RDFGraph from '../../components/Rule/RDFGraph'
import Prefixes from '../../components/Prefixes/Prefixes'
import Divider from '@material-ui/core/Divider'
import { Typography } from '@material-ui/core'

import store from '../../core/store'
import ac_rest_manager from '../../core/ac_rest_manager.js'

//import sosaTurtle from './sosa.ttl'
import saiOWL from './AutoIoT.ttl'
import { jenaRuleParser, turtleParser } from '../../core/rdf_parser'
import { ontologyQueryBuilder } from '../../core/comunica'
import ONTOLOGY from '../../core/ontologyConstants'

const useStyles = makeStyles((theme) => ({

}));

const Ontology = (props) => {
  //const classes = useStyles()
  const { classes, ...rest } = props
  const [dense, setDense] = React.useState(false)
  const [secondary, setSecondary] = React.useState(false)
  const [rdfTriples, setRdfTriples] = React.useState([])

  const [selectedOntology, setSelectedOntology] = React.useState(ONTOLOGY.ontologyConstants.AUTO)
  const [open, setOpen] = React.useState({})
  const handleClick = () => {

  }

  useEffect(() => {
    ac_rest_manager.sparqlQuery("construct", selectedOntology.displayName, (data) => {
      console.log("response useEffect", data)
      setRdfTriples(data)
    })
  }, [])

  const onSelectOntology = (ontology) => {
    ac_rest_manager.sparqlQuery("construct", ontology.displayName, (data) => {
      if (data) {
        console.log("response", selectedOntology, data)
        setRdfTriples(data)
        setSelectedOntology(ontology)
      }
    })
  }

  return( <div>
  <Prefixes onClickCallback={onSelectOntology}/>
  <Divider />
  <Typography>
    {selectedOntology.displayName}
  </Typography>
  <Divider />
  <RDFGraph rdfTriples={rdfTriples} isEditable={false} />
  </div>)
}



export default withStyles(useStyles)(Ontology)
