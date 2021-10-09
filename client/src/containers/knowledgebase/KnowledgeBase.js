import React, { useState, useEffect } from 'react'

import { makeStyles } from '@material-ui/core/styles'
import withStyles from '@material-ui/core/styles/withStyles'
import IconButton from '@material-ui/core/IconButton'
import { Typography } from '@material-ui/core'
import RefreshIcon from '@material-ui/icons/Refresh'

import ac_rest_manager from '../../core/ac_rest_manager.js'
import { turtleParser } from '../../core/rdf_parser'

import RDFGraph from '../../components/Rule/RDFGraph'
import Prefixes from '../../components/Prefixes/Prefixes'
import Divider from '@material-ui/core/Divider'

const useStyles = makeStyles((theme) => ({
  refreshButton: {
    zIndex: -1
    //backgroundColor: "red"
  },
  graph: {
    backgroundColor: "green",
    zIndex: 100
  }
}))

const KnowledgeBase = (props) => {
  const classes = useStyles()
  const [secondary, setSecondary] = React.useState(false)
  const [rdfTriples, setRdfTriples] = React.useState([])

  const [selectedIndex, setSelectedIndex] = React.useState(false)

  useEffect(() => {
    ac_rest_manager.getKnowledge((data) => {
      var turtleQuads = turtleParser(data)
      setRdfTriples(turtleQuads)
    })
  }, [])

  const handleRefreshClick = (e , v) => {
    console.log("refresh")
    ac_rest_manager.getKnowledge((data) => {
      var turtleQuads = turtleParser(data)
      setRdfTriples(turtleQuads)
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
  <RDFGraph className={classes.graph} rdfTriples={rdfTriples} isEditable={false}/>
  </div>)
}



export default withStyles(useStyles)(KnowledgeBase);
