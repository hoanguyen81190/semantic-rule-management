import React, { useState, useEffect } from 'react'
import { makeStyles } from '@material-ui/core/styles'
import Grid from '@material-ui/core/Grid'
import Table from '@material-ui/core/Table'
import TableBody from '@material-ui/core/TableBody'
import TableCell from '@material-ui/core/TableCell'
import TableContainer from '@material-ui/core/TableContainer'
import TableHead from '@material-ui/core/TableHead'
import TableRow from '@material-ui/core/TableRow'
import Paper from '@material-ui/core/Paper'
import Typography from '@material-ui/core/Typography'
import TextField from '@material-ui/core/TextField'
import IconButton from '@material-ui/core/IconButton'
import EditIcon from '@material-ui/icons/Edit'
import DeleteIcon from '@material-ui/icons/Delete'
import AddIcon from '@material-ui/icons/Add'
import ArrowRightAltIcon from '@material-ui/icons/ArrowRightAlt'
import Button from '@material-ui/core/Button'

import { RDFTriple } from "../../../core/rdfModel"
import Autocomplete from '@material-ui/lab/Autocomplete'

import RDFGraph from '../RDFGraph'
import ac_rest_manager from '../../../core/ac_rest_manager'
import { constructQueryBuilder, selectQueryBuilder, common_queries } from '../../../core/comunica'
import { convertToAutoCompleteRDF, parseObject } from '../../../core/rdf_parser'
import store from '../../../core/store'
import ONTOLOGY from "../../../core/ontologyConstants"
import './EditFact.css'

const useStyles = makeStyles((theme) => ({
  root: {
    //layout: 1,
    height: "100%",
    width: "100%"
  },
  list: {
    height: "70vh",
    width: "30%",
    backgroundColor: theme.palette.background.paper,
    overflowY: "scroll"
  },
  graph: {
    height: "70vh",
    width: "70%",
  },
  paper: {
    padding: theme.spacing(1),
    textAlign: 'center',
    color: theme.palette.text.secondary,
  },
  table: {

  },
  textField: {
    margin: 5
  },
  button: {
    //marginLeft: 10
  },
  editTriple: {
  },
  autoComplete: {
    fontSize: 10,
  },
  arrowButton: {
  },
}))

export default function EditRuleComponent(props) {
  const { callback } = props
  const classes = useStyles()

  const inputSubjectRef = React.useRef(null)
  const inputPredicateRef = React.useRef(null)
  const inputObjectRef = React.useRef(null)

  const [ spacing, setSpacing ] = React.useState(2)

  //rule information
  const [ editSystemName, setEditSystemName ] = React.useState('')
  const [ editRuleName, setEditRuleName ] = React.useState('')
  const [ editActionList, setEditActionList ] = React.useState([])
  const [ edittingGraph, setEdittingGraph ] = React.useState({prefixes: [], triples: []})

  //visualization
  const [ disableEditPred, setDisableEditPred ] = React.useState(true)
  const [ disableEditObj, setDisableEditObj ] = React.useState(true)
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

      const queryOWL = selectQueryBuilder([ONTOLOGY.ontologyConstants.AUTO], ['?s'], [['?s', '?p', 'owl:ObjectProperty']], 1000)
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
        setDisableEditObj(false)
      })
      // }
    }
  }

  const handleAddNewTriple = (event, index) => {
    var subject = inputSubjectRef.current.value
    var predicate = inputPredicateRef.current.value
    var object = inputObjectRef.current.value
    if(subject !== "" && predicate !== "" && object !== "") {
      var sub = parseObject(subject)
      var pred = parseObject(predicate)
      var obj = parseObject(object)

      //handle
      addToPrefixes(sub.ontology)
      addToPrefixes(pred.ontology)
      addToPrefixes(obj.ontology)

      addToVariablesList(sub)
      addToVariablesList(obj)

      var newObject = new RDFTriple(sub, pred, obj)
      edittingGraph.triples.push(newObject)
      setEdittingGraph({...edittingGraph})
      setDisableEditPred(true)
      setDisableEditObj(true)
      setRerender(rerender + 1)
    }

    //============SUPPORTING FUNCTIONS=============
    function addToPrefixes(p) {
      if (p !== undefined) {
        if (edittingGraph.prefixes.indexOf(ONTOLOGY.ontologyConstants[p.toUpperCase()]) === -1) {
          edittingGraph.prefixes.push(ONTOLOGY.ontologyConstants[p.toUpperCase()])
        }
      }
    }

    function addToVariablesList(v) {
      if (v.isVar !== undefined && v.isVar) {
        if (variablesList.indexOf(v) === -1) {
          variablesList.push(v)
        }
      }
    }
  }

  function getDisablePredicate() {
    if(inputSubjectRef.current) {
      return inputSubjectRef.current.value === ""
    }
    return false
  }

  const handleAddActionClick = (event, index) => {

  }

  const handleOKClick = (event, index) => {
    callback(true)
  }

  const handleCancelClick = (event, iindex) => {
    callback(false)
  }


  return (
    <div>
    {/*------------------- Modify information of the rule ------------------- */}
    <Grid container className={classes.name} spacing={2} alignItems='center'>
      <Grid item xs={4} className={classes.textField}>
        <TextField id="standard-full-width" variant="outlined" fullWidth label="System Name" />
      </Grid>
      <Grid item xs={4} className={classes.textField}>
        <TextField id="standard-full-width" variant="outlined" fullWidth label="Rule Name" />
      </Grid>
      <Grid item className={classes.button}>
        <Button variant="contained" onClick={handleAddActionClick}>
          add action
        </Button>
      </Grid>
      <Grid item className={classes.button}>
        <Button variant="contained" onClick={handleOKClick}>
          create
        </Button>
      </Grid>
      <Grid item >
        <Button variant="contained" onClick={handleCancelClick} >
          Cancel
        </Button>
      </Grid>
    </Grid>
    {/*------------------- HEAD: Action Table ------------------- */}
    <Table className={classes.table} aria-label="simple table">
      <TableBody>
        {editActionList.map((titem, tindex) => (
          titem.getDisplayComponent(tindex)
        ))}
      </TableBody>
    </Table>
    {/*------------------ BODY: Statement & Viz------------------ */}
    <Grid container className={classes.root} spacing={2}>
      {/*------------------ Left ------------------ */}
      <Grid key="list" className={classes.list} item>
        <Table className={classes.table} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell>Subject</TableCell>
              <TableCell>Predicate</TableCell>
              <TableCell>Object</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {edittingGraph.triples.map((titem, tindex) => (
              <TableRow key={tindex}>
                <TableCell component="th" scope="row">
                  {titem.subject.value}
                </TableCell>
                <TableCell>{titem.predicate.value}</TableCell>
                <TableCell>{titem.object.value}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Grid>
      {/*------------------ Right ------------------ */}
      <Grid key="graph" className={classes.graph} item >
        <Grid container alignItems='center' className={classes.editTriple} spacing={0}>
          <Grid item xs={3} className={classes.autoComplete}>
            <Autocomplete
              freeSolo
              id="ontology-suggestion-subject"
              options={store.getState().ontology_classes.concat(variablesList)}
              getOptionLabel={(c) => c.displayedName !== undefined? c.displayedName : c }
              renderInput={(params) => <TextField required inputRef={inputSubjectRef}
                                                  {...params} label="Variable" variant="outlined" />}
            />
            </Grid>
            <Grid item className={classes.arrowButton}>
              <IconButton onClick={handleAddPredicate}>
                <ArrowRightAltIcon />
              </IconButton >
            </Grid>
            <Grid item xs={3} className={classes.autoComplete}>
              <Autocomplete
                disabled={disableEditPred}
                id="ontology-suggestion-predicate"
                options={store.getState().ontology_properties}
                getOptionLabel={(c) => c.displayedName}
                onChange={(e, v) => setDisableEditObj(true)}
                renderInput={(params) => <TextField required inputRef={inputPredicateRef}
                                                    {...params} label="Predicate" variant="outlined" />}
              />
            </Grid>
            <Grid item className={classes.arrowButton}>
              <IconButton onClick={handleAddObject} disabled={disableEditPred}>
                <ArrowRightAltIcon />
              </IconButton >
            </Grid>
            <Grid item xs={3} className={classes.autoComplete}>
              <Autocomplete
                freeSolo
                disabled={disableEditObj}
                id="ontology-suggestion-object"
                options={store.getState().ontology_classes}
                getOptionLabel={(c) => c.displayedName !== undefined? c.displayedName : c}
                renderInput={(params) => <TextField required inputRef={inputObjectRef}
                                                    {...params} label="Object" variant="outlined" />}
              />
            </Grid>
            <Grid item className={classes.arrowButton}>
              <IconButton onClick={handleAddNewTriple}>
                <AddIcon />
              </IconButton >
            </Grid>
          </Grid>
        <RDFGraph rdfTriples={edittingGraph.triples} rerender={rerender} isEditable={false}/>
      </Grid>
    </Grid>
    {/*------------------ Action Dialog ------------------ */}
    </div>
  )
}
