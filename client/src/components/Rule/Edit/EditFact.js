import React, { useState, useEffect } from 'react'
import { makeStyles } from '@material-ui/core/styles'
import IconButton from '@material-ui/core/IconButton'
import AddIcon from '@material-ui/icons/Add'
import ArrowRightAltIcon from '@material-ui/icons/ArrowRightAlt'
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
import { convertToAutoCompleteRDF } from '../../../core/rdf_parser'
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
    width: 200,
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
  const [ disableEditPred, setDisableEditPred ] = React.useState(true)
  const [ disableEditObj, setdisableEditObj ] = React.useState(true)
  const [ variablesList, setVariablesList ] = React.useState([])
  const [ rerender, setRerender ] = React.useState(0)

  var predicateSuggestionList = []
  var objectSuggestionList = []

  useEffect(() => {
    if(store.getState().ontology_classes.length === 0) {
      ac_rest_manager.sparqlQuery("select", common_queries.get_all_classes, (quads) => {
        if (quads) {
          var data = convertToAutoCompleteRDF(quads)
          var dataAction = {
            type: 'ALL_ONTOLOGY_CLASSES',
            ontology_classes: data
          }

          store.dispatch(dataAction)
        }
      })
    }

    if(store.getState().ontology_properties.length === 0) {
      const queryRDF = selectQueryBuilder([ONTOLOGY.ontologyConstants.RDF], ['?s'], [['?s', '?p', 'rdf:Property']], 1000)
      ac_rest_manager.sparqlQuery("select", queryRDF, (quads) => {
        if (quads) {
          var dataAction = {
            type: 'ALL_ONTOLOGY_PROPERTIES',
            ontology_properties: convertToAutoCompleteRDF(quads)
          }

          store.dispatch(dataAction)
        }
      })

      const queryOWL = selectQueryBuilder([ONTOLOGY.ontologyConstants.OWL], ['?s'], [['?s', '?p', 'owl:ObjectProperty']], 1000)
      ac_rest_manager.sparqlQuery("select", queryOWL, (quads) => {
        if (quads) {
          var dataAction = {
            type: 'ALL_ONTOLOGY_PROPERTIES',
            ontology_properties: convertToAutoCompleteRDF(quads)
          }

          store.dispatch(dataAction)
        }
      })
    }
  }, [])

  function triplesToQueryConditions(variable) {
    var triples = edittingGraph.triples.filter(triple => triple.subject.value === variable)
    var conditions = []
    triples.map((titem, tindex) => {
      conditions.push([titem.subject.value, titem.ontology + ':' + titem.predicate.value, titem.object.value])
    })
    console.log("constraints", conditions)
    return conditions
  }

  const handleAddPredicate = (event, index) => {
    var subjectString = inputSubjectRef.current.value
    if(subjectString !== "") {
      var parts = subjectString.split(':')
      var subject = parts.length > 1 ? parts[1] : subjectString
      let constraints = triplesToQueryConditions(subject, '?p')

      //default
      if(constraints.length === 0) {
        predicateSuggestionList = store.getState().ontology_properties
      }
      else {
        console.log("constraints", constraints)
        // const currentCondition = [subject, ]
        // const query = selectQueryBuilder(edittingGraph.prefixes,
        //                                  ['?s'],
        //                                  constraints,
        //                                  1000)
        //
        // ac_rest_manager.sparqlQuery("select", query, (quads) => {
        //   predicateSuggestionList = convertToAutoCompleteRDF(quads)
        //   setDisableEditPred(false)
        // })
      }

      setDisableEditPred(false)
    }
  }

  const handleAddObject = (event, index) => {
    var subjectString = inputSubjectRef.current.value
    var predicate = inputPredicateRef.current.value
    if(subjectString !== "") {
      var parts = subjectString.split(':')
      var subject = parts.length > 1 ? parts[1] : subjectString
      var subjectVar = parts.length > 1 ? parts[1] : ('?' + subjectString)
      let constraints = triplesToQueryConditions(subject)
      // if(constraints.length === 0) {
      //   objectSuggestionList = store.getState().ontology_classes
      //   setDisableEditPred(false)
      // }
      // else {
      const currentCondition = [subjectVar, predicate, '?s']
      constraints.push(currentCondition)
      const query = selectQueryBuilder(ONTOLOGY.ontologyList,
                                       ['?s'],
                                       constraints,
                                       1000)

      ac_rest_manager.sparqlQuery("select", query, (quads) => {
        objectSuggestionList = convertToAutoCompleteRDF(quads)
        setdisableEditObj(false)
      })
      // }
    }
  }

  const handleAddNewTriple = (event, index) => {
    var subject = inputSubjectRef.current.value
    var predicate = inputPredicateRef.current.value
    var object = inputObjectRef.current.value
    if(subject !== "" && predicate !== "" && object !== "") {
      var sub = handleVariable(subject)
      var predParts = predicate.split(':')
      var obj = handleVariable(object)
      var ontology = addToPrefixes(predParts[0])

      var newObject = new RDFTriple(sub, predParts[1], obj, ontology)
      edittingGraph.triples.push(newObject)
      setEdittingGraph({...edittingGraph})
      setDisableEditPred(true)
      setdisableEditObj(true)
      setRerender(rerender + 1)
    }

    //============SUPPORTING FUNCTIONS=============
    function addToPrefixes(p) {
      if (edittingGraph.prefixes.indexOf(ONTOLOGY.ontologyConstants[p.toUpperCase()]) === -1) {
        edittingGraph.prefixes.push(ONTOLOGY.ontologyConstants[p.toUpperCase()])
      }
      return p
    }

    function addToVariablesList(v) {
      if (variablesList.indexOf(v) === -1) {
        variablesList.push(v)
      }
    }

    function handleVariable(input) {
      var parts = input.split(':')

      //add to Prefixes
      if (parts.length > 1) {
        addToPrefixes(parts[0])
      }
      else {
        addToVariablesList(input)
      }
      return input
    }

  }

  function getDisablePredicate() {
    if(inputSubjectRef.current) {
      return inputSubjectRef.current.value === ""
    }
    return false
  }

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
                id="ontology-suggestion-subject"
                options={store.getState().ontology_classes.concat(variablesList)}
                getOptionLabel={(c) => c.displayedName !== undefined? c.displayedName : c }
                className={classes.autoComplete}
                renderInput={(params) => <TextField required inputRef={inputSubjectRef}
                                                    {...params} label="Variable" variant="outlined" />}
              />
            </Grid>
            <IconButton onClick={handleAddPredicate}>
              <ArrowRightAltIcon />
            </IconButton >
            <Grid item>
              <Autocomplete
                disabled={disableEditPred}
                id="ontology-suggestion-predicate"
                options={store.getState().ontology_properties}
                getOptionLabel={(c) => c.displayedName}
                className={classes.autoComplete}
                onChange={(e, v) => setdisableEditObj(true)}
                renderInput={(params) => <TextField required inputRef={inputPredicateRef}
                                                    {...params} label="Predicate" variant="outlined" />}
              />
            </Grid>
            <IconButton onClick={handleAddObject} disabled={disableEditPred}>
              <ArrowRightAltIcon />
            </IconButton >
            <Grid item>
              <Autocomplete
                freeSolo
                disabled={disableEditObj}
                id="ontology-suggestion-object"
                options={store.getState().ontology_classes}
                getOptionLabel={(c) => c.displayedName !== undefined? c.displayedName : c}
                className={classes.autoComplete}
                renderInput={(params) => <TextField required inputRef={inputObjectRef}
                                                    {...params} label="Object" variant="outlined" />}
              />
            </Grid>
            <Grid item>
              <IconButton onClick={handleAddNewTriple}>
                <AddIcon />
              </IconButton >
              </Grid>
          </Grid>
          <RDFGraph rdfTriples={edittingGraph.triples} rerender={rerender} isEditable={true}/>
        </CardContent>
      </Card>
  );
}
