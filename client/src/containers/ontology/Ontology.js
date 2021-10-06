import React, { useState, useEffect } from 'react';
import { Redirect, Route, Switch } from 'react-router-dom'

import { makeStyles } from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import ListItemText from '@material-ui/core/ListItemText';
import Avatar from '@material-ui/core/Avatar';
import FolderIcon from '@material-ui/icons/Folder';
import DeleteIcon from '@material-ui/icons/Delete';
import IconButton from '@material-ui/core/IconButton';
import ExpandLess from '@material-ui/icons/ExpandLess';
import ExpandMore from '@material-ui/icons/ExpandMore';
import Collapse from '@material-ui/core/Collapse';
import { Typography } from '@material-ui/core';
import withStyles from '@material-ui/core/styles/withStyles'

import TestComponent from '../../components/Test/TestComponent'

import NestedList from '../../components/List/NestedList'

import RDFGraph from '../../components/Rule/RDFGraph'

import store from '../../core/store'
import ac_rest_manager from '../../core/ac_rest_manager.js'

//import sosaTurtle from './sosa.ttl'
import saiOWL from './AutoIoT.ttl'
import { jenaRuleParser, turtleParser } from '../../core/rdf_parser'
import { selectQueryBuilder, constructQueryBuilder } from '../../core/comunica'
import ontologyConstants from '../../core/ontologyConstants'

const useStyles = makeStyles((theme) => ({

}));

const Ontology = (props) => {
  //const classes = useStyles()
  const { classes, ...rest } = props
  const [dense, setDense] = React.useState(false)
  const [secondary, setSecondary] = React.useState(false)
  const [consumerSystems, setConsumerSystems] = React.useState([])
  const [rdfTriples, setRdfTriples] = React.useState(null)

  const [selectedIndex, setSelectedIndex] = React.useState(-1)
  const [open, setOpen] = React.useState({})
  const handleClick = () => {

  }

  useEffect(() => {
    const query1 = constructQueryBuilder([], null, [['?s', '?p', '?o']], 100)

    ac_rest_manager.sparqlQuery("construct", query1, (data) => {
      setRdfTriples(data)
    })
    fetch(saiOWL)
      .then(r => r.text())
      .then(text => {
        var turtleQuads = turtleParser(text)
        //setRdfTriples(turtleQuads)
      })
  }, [])


  const handleListItemClick = (event, iindex) => {
    // setOpen(!open)
    if (open[iindex] === undefined) {
      setOpen({...open, [iindex]: true})
    }
    else {
      setOpen({...open, [iindex]: !open[iindex]})

    }

    setSelectedIndex(iindex)
  }

  var content = <div />
  if (rdfTriples) {
    content = <RDFGraph rdfTriples={rdfTriples} isEditable={false}/>
  }

  return ( content )
}



export default withStyles(useStyles)(Ontology)
