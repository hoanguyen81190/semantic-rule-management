import React, { useState, useEffect } from 'react'
import { makeStyles } from '@material-ui/core/styles'

import withStyles from '@material-ui/core/styles/withStyles'

import RDFGraph from '../../components/Rule/RDFGraph'
import Prefixes from '../../components/Prefixes/Prefixes'
import Divider from '@material-ui/core/Divider'
import { Typography } from '@material-ui/core'

import store from '../../core/store'
import ac_rest_manager from '../../core/ac_rest_manager.js'

import Grid from '@material-ui/core/Grid'
import RdfTriplesTable from '../../components/Rule/RdfTriplesTable'
import saiOWL from './AutoIoT.ttl'
import { jenaRuleParser, turtleParser, quadsToRDFModels } from '../../core/rdf_parser'
import { ontologyQueryBuilder } from '../../core/comunica'
import ONTOLOGY from '../../core/ontologyConstants'

const useStyles = makeStyles((theme) => ({
  root: {
    //layout: 1,
    height: "100%",
    width: "100%"
  },
  list: {
    height: "100vh",
    width: "30%",
    overflowY: "scroll",
  },
  graph: {
    height: "100vh",
    width: "70%",
  }
}))

const Ontology = (props) => {
  //const classes = useStyles()
  const classes = useStyles()
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
      setRdfTriples(quadsToRDFModels(data))
    })
  }, [])

  const onSelectOntology = (ontology) => {
    ac_rest_manager.sparqlQuery("construct", ontology.displayName, (data) => {
      if (data) {
        console.log("response", selectedOntology, data)
        setRdfTriples(quadsToRDFModels(data))
        setSelectedOntology(ontology)
      }
    })
  }

  return( <div className={classes.megaRoot}>
  <Prefixes onClickCallback={onSelectOntology}/>
  <Divider />
  <Typography>
    {selectedOntology.displayName}
  </Typography>
  <Divider />
  <Grid container className={classes.root} spacing={2}>
    <Grid key="list" className={classes.list} item>
      <RdfTriplesTable rdfTriples={rdfTriples} isEditting={false}/>
    </Grid>
    <Grid key="graph" className={classes.graph} item>
      <RDFGraph rdfTriples={rdfTriples} isEditable={false} />
    </Grid>
  </Grid>

  </div>)
}



export default withStyles(useStyles)(Ontology)
