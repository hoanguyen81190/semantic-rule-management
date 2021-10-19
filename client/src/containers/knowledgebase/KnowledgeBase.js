import React, { useState, useEffect } from 'react'

import { makeStyles } from '@material-ui/core/styles'
import withStyles from '@material-ui/core/styles/withStyles'
import IconButton from '@material-ui/core/IconButton'
import { Typography } from '@material-ui/core'
import RefreshIcon from '@material-ui/icons/Refresh'

import ac_rest_manager from '../../core/ac_rest_manager.js'
import { turtleParser, quadsToRDFModels } from '../../core/rdf_parser'

import Grid from '@material-ui/core/Grid'
import RdfTriplesTable from '../../components/Rule/RdfTriplesTable'
import RDFGraph from '../../components/Rule/RDFGraph'
import Prefixes from '../../components/Prefixes/Prefixes'
import Divider from '@material-ui/core/Divider'

const useStyles = makeStyles((theme) => ({
  refreshButton: {
  },
  graph: {
    backgroundColor: "green",
    zIndex: 100
  },
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

const KnowledgeBase = (props) => {
  const classes = useStyles()
  const [secondary, setSecondary] = React.useState(false)
  const [rdfTriples, setRdfTriples] = React.useState([])

  const [selectedIndex, setSelectedIndex] = React.useState(false)

  useEffect(() => {
    ac_rest_manager.getKnowledge((data) => {
      var turtleQuads = turtleParser(data, (output) => {
        setRdfTriples(quadsToRDFModels(output))
      })
    })
  }, [])

  const handleRefreshClick = (e , v) => {
    ac_rest_manager.getKnowledge((data) => {
      var turtleQuads = turtleParser(data, (output) => {
        setRdfTriples(quadsToRDFModels(output))
      })
    })
  }

  return( <div>
  <Prefixes />
  <Divider />
  <IconButton className={classes.refreshButton} edge="end" aria-label="refresh" onClick={handleRefreshClick}>
    <RefreshIcon />
    <Typography>
      Refresh
    </Typography>
  </IconButton>
  <Divider />
  <Grid container className={classes.root} spacing={2}>
    <Grid key="list" className={classes.list} item>
      <RdfTriplesTable rdfTriples={rdfTriples} isEditting={false}/>
    </Grid>
    <Grid key="graph" className={classes.graph} item>
      <RDFGraph className={classes.graph} rdfTriples={rdfTriples} isEditable={false}/>
    </Grid>
  </Grid>

  </div>)
}



export default withStyles(useStyles)(KnowledgeBase);
