import React, { useState, useEffect } from 'react'
import { makeStyles } from '@material-ui/core/styles'
import IconButton from '@material-ui/core/IconButton'
import AddIcon from '@material-ui/icons/Add'
import { Typography } from '@material-ui/core'
import TextField from '@material-ui/core/TextField'
import Grid from '@material-ui/core/Grid'

import Card from '@material-ui/core/Card'
import CardContent from '@material-ui/core/CardContent'

import RDFGraph from '../../../components/Rule/RDFGraph'
import { RDFTriple } from "../../../core/rdfModel"
import Autocomplete from '@material-ui/lab/Autocomplete'

import ac_rest_manager from '../../../core/ac_rest_manager'
import { constructQueryBuilder, selectQueryBuilder, common_queries } from '../../../core/comunica'
import store from '../../../core/store'
import ONTOLOGY from "../../../core/ontologyConstants"
import './EditFact.css'

const useStyles = makeStyles((theme) => ({
  root: {
    '& > *': {
      margin: theme.spacing(1),
    },
  },
  card: {
    margin: "2%",
    //minHeight: "50%"
  },
  autoComplete: {
    height: 140,
    width: 160,
    fontSize: 10,
  }
}))

export default function EditFact(props) {
  const classes = useStyles()
  const { callback } = props

  const inputSubjectRef = React.useRef(null)
  const inputPredicateRef = React.useRef(null)
  const inputObjectRef = React.useRef(null)

  const [spacing, setSpacing] = React.useState(2)
  const [ edittingGraph, setEdittingGraph ] = React.useState({prefixes: [], triples: []})
  const [ rerender, setRerender ] = React.useState(0)
  const [ suggestSubjectList, setSuggestSubjectList] = React.useState(0)

  useEffect(() => {
    if(store.getState().ontology_classes.length === 0) {
      ac_rest_manager.sparqlQuery("select", common_queries.get_all_classes, (data) => {
        if (data) {
          var dataAction = {
            type: 'ALL_ONTOLOGY_CLASSES',
            ontology_classes: data
          }

          store.dispatch(dataAction)
        }
      })

      ac_rest_manager.sparqlQuery("select", common_queries.get_all_properties, (data) => {
        if (data) {
          var dataAction = {
            type: 'ALL_ONTOLOGY_PROPERTIES',
            ontology_properties: data
          }

          store.dispatch(dataAction)
        }
      })
    }
  }, [])

  const handleAddNewObject = (event, index) => {
    var subject = inputSubjectRef.current.value
    var predicate = inputPredicateRef.current.value
    var object = inputObjectRef.current.value
    if(subject !== "" && predicate !== "" && object !== "") {
      var subParts = subject.split('#')
      var predParts = predicate.split('#')
      var objParts = object.split('#')

      //add to Prefixes
      if (subParts.length > 1) {
        addToPrefixes(subParts[0])
      }

      var ontology = addToPrefixes(predParts[0])
      addToPrefixes(objParts[0])

      var newObject = new RDFTriple(subParts.length > 1 ? subParts[1]:subject, predParts[1], objParts[1], ontology)
      edittingGraph.triples.push(newObject)
      setEdittingGraph({...edittingGraph})
      setRerender(rerender + 1)
    }

    function addToPrefixes(p) {
      if (edittingGraph.prefixes.indexOf(p) === -1) {
        edittingGraph.prefixes.push(p)
      }
      return ONTOLOGY.ontologyLookUp.get(p)
    }

  }

  console.log("edit graph", edittingGraph)

  return (
      <Card className={classes.card}>
        <CardContent>
          <Typography>
          Fact
          </Typography>
          <Grid container className={classes.root} spacing={spacing}>
            <Grid item>
              <Autocomplete
                freeSolo
                id="ontology-suggestion"
                options={store.getState().ontology_classes}
                getOptionLabel={(c) => c['?s'] !== undefined? c['?s'].value : c}
                className={classes.autoComplete}
                renderInput={(params) => <TextField required inputRef={inputSubjectRef} {...params} label="Variable" variant="outlined" />}
              />
            </Grid>
            <Grid item>
              <Autocomplete
                id="ontology-suggestion"
                options={store.getState().ontology_properties}
                getOptionLabel={(c) => c['?s'].value}
                className={classes.autoComplete}
                renderInput={(params) => <TextField required inputRef={inputPredicateRef} {...params} label="Predicate" variant="outlined" />}
              />
            </Grid>
            <Grid item>
              <Autocomplete
                id="ontology-suggestion"
                options={store.getState().ontology_classes}
                getOptionLabel={(c) => c['?s'].value}
                className={classes.autoComplete}
                renderInput={(params) => <TextField required inputRef={inputObjectRef} {...params} label="Object" variant="outlined" />}
              />
            </Grid>
            <Grid item>
              <IconButton onClick={handleAddNewObject}>
                <AddIcon />
              </IconButton >
              </Grid>
          </Grid>
          <RDFGraph rdfTriples={edittingGraph.triples} rerender={rerender} isEditable={true}/>
        </CardContent>
      </Card>
  );
}
