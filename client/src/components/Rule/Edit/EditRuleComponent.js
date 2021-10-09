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

import EditAction from './EditAction'

import { RDFTriple } from "../../../core/rdfModel"
import * as ActionModel from "../../../core/actionModel"
import Autocomplete from '@material-ui/lab/Autocomplete'

import RDFGraph from '../RDFGraph'
import RdfTriplesTable from '../RdfTriplesTable'
import ac_rest_manager from '../../../core/ac_rest_manager'
import { constructQueryBuilder, selectQueryBuilder, common_queries } from '../../../core/comunica'
import { convertToAutoCompleteRDF, parseObject, displayObjectText } from '../../../core/rdf_parser'
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
  const { callback, currentRules, consumerSystems } = props
  const classes = useStyles()

  const inputSubjectRef = React.useRef(null)
  const inputPredicateRef = React.useRef(null)
  const inputObjectRef = React.useRef(null)

  const editSystemNameRef = React.useRef(null)
  const editRuleNameRef = React.useRef(null)

  const [ spacing, setSpacing ] = React.useState(2)

  //rule information
  // const [ editSystemName, setEditSystemName ] = React.useState('')
  // const [ editRuleName, setEditRuleName ] = React.useState('')
  const [ editActionList, setEditActionList ] = React.useState([])
  const [ edittingGraph, setEdittingGraph ] = React.useState({prefixes: [], triples: []})

  const [ openActionDialog, setOpenActionDialog ] = React.useState(false)

  //visualization
  const [ disableEditPred, setDisableEditPred ] = React.useState(false)
  const [ disableEditObj, setDisableEditObj ] = React.useState(false)
  const [ variablesList, setVariablesList ] = React.useState([])
  const [ rerender, setRerender ] = React.useState(0)

  const [ subjectSuggestionList, setSubjectSuggestionList ] = React.useState([])
  const [ predicateSuggestionList, setPredicateSuggestionList ] = React.useState([])
  const [ objectSuggestionList, setObjectSuggestionList ] = React.useState([])

  const [ errorMessage, setErrorMessage ] = React.useState('')

  useEffect(() => {
    if(store.getState().ontology_classes.length === 0) {
      ac_rest_manager.sparqlQuery("select", common_queries.get_all_classes, (quads) => {
        if (quads) {
          let objList = quads.filter((thing, index, self) =>
            index === self.findIndex((t) => (
              t['?sai'].value === thing['?sai'].value
            ))
          )
          var data = convertToAutoCompleteRDF(objList)
          var dataAction = {
            type: 'ALL_ONTOLOGY_CLASSES',
            ontology_classes: data
          }

          store.dispatch(dataAction)
          setSubjectSuggestionList(data)
          setObjectSuggestionList(data)
        }
      })
    }

    if(store.getState().ontology_properties.length <= 4) {
      const queryRDF = common_queries.get_all_properties
      ac_rest_manager.sparqlQuery("select", queryRDF, (quads) => {
        if (quads) {
          let objList = quads.filter((thing, index, self) =>
            index === self.findIndex((t) => (
              t['?sai'].value === thing['?sai'].value
            ))
          )
          var data = convertToAutoCompleteRDF(objList)
          var dataAction = {
            type: 'ALL_ONTOLOGY_PROPERTIES',
            ontology_properties: convertToAutoCompleteRDF(quads)
          }

          store.dispatch(dataAction)
          setPredicateSuggestionList(store.getState().ontology_properties)
        }
      // const queryRDF = selectQueryBuilder([ONTOLOGY.ontologyConstants.RDF], ['?sai'], [['?sai', '?pai', 'rdf:Property']], 1000)
      // ac_rest_manager.sparqlQuery("select", queryRDF, (quads) => {
      //   if (quads) {
      //     var dataAction = {
      //       type: 'ALL_ONTOLOGY_PROPERTIES',
      //       ontology_properties: convertToAutoCompleteRDF(quads)
      //     }
      //
      //     store.dispatch(dataAction)
      //
      //     const queryOWL = selectQueryBuilder([ONTOLOGY.ontologyConstants.SAI], ['?sai'], [['?sai', '?pai', 'owl:ObjectProperty']], 1000)
      //     ac_rest_manager.sparqlQuery("select", queryOWL, (quads) => {
      //       if (quads) {
      //         var dataAction = {
      //           type: 'CONCAT_ONTOLOGY_PROPERTIES',
      //           ontology_properties: convertToAutoCompleteRDF(quads)
      //         }
      //
      //         store.dispatch(dataAction)
      //       }
      //     })
      //   }
      })
    }
  }, [consumerSystems])

  function triplesToQueryConditions() {
    //var triples = edittingGraph.triples.filter(triple => triple.subject.value === variable || triple.object.value === variable)
    var conditions = []
    edittingGraph.triples.map((titem, tindex) => {
      conditions.push([displayObjectText(titem.subject), displayObjectText(titem.predicate), displayObjectText(titem.object)])
    })
    return conditions
  }

  const handleAddPredicate = (event, index) => {
    // var subjectString = inputSubjectRef.current.value
    // if(subjectString !== "") {
    //   let constraints = triplesToQueryConditions()
    //
    //   //default
    //   if(constraints.length === 0) {
    //     setPredicateSuggestionList(store.getState().ontology_properties)
    //   }
    //   else {
    //     const query = selectQueryBuilder(ONTOLOGY.ontologyList,
    //                                      ['?sai'],
    //                                      constraints,
    //                                      1000)
    //     console.log("pred query", query)
    //     ac_rest_manager.sparqlQuery("select", query, (quads) => {
    //       setPredicateSuggestionList(convertToAutoCompleteRDF(quads))
    //       setDisableEditPred(false)
    //     })
    //   }
    //   setDisableEditPred(false)
    // }
  }

  const handleAddObject = (event, index) => {
    // var subjectString = inputSubjectRef.current.value
    // var predicate = inputPredicateRef.current.value
    // if(subjectString !== "") {
    //   let constraints = triplesToQueryConditions(subjectString)
    //   // if(constraints.length === 0) {
    //   //   objectSuggestionList = store.getState().ontology_classes
    //   //   setDisableEditPred(false)
    //   // }
    //   // else {
    //   const currentCondition = [subjectString, predicate, '?sai']
    //   constraints.push(currentCondition)
    //   const query = selectQueryBuilder([ONTOLOGY.ontologyConstants.SAI],
    //                                    ['?sai'],
    //                                    constraints,
    //                                    1000)
    //
    //   console.log("object query", query)
    //
    //   ac_rest_manager.sparqlQuery("select", query, (quads) => {
    //     console.log("returned quads", quads)
    //     let objList = quads.filter((thing, index, self) =>
    //       index === self.findIndex((t) => (
    //         t['?sai'].value === thing['?sai'].value
    //       ))
    //     )
    //     console.log("filtered quads", objList)
    //     setObjectSuggestionList(convertToAutoCompleteRDF(objList))
    //     setDisableEditObj(false)
    //   })
      // }
    // }
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
      // setDisableEditPred(true)
      // setDisableEditObj(true)
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
        if (variablesList.findIndex(i => i.value === v.value) === -1) {
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

  const handleAddActionClick = (event, action) => {
    setOpenActionDialog(true)
  }

  const handleOKClick = (event, index) => {
    //checking if new rule is valid
    //consumer Name
    if (editSystemNameRef.current.value === '') {
      setErrorMessage('Consumer System Name can not be empty')
    }
    else if (editRuleNameRef.current.value === '') {
      setErrorMessage('Rule Name can not be empty')
    }
    else if (editActionList.length <= 0) {
      setErrorMessage('Action list can not be empty')
    }
    else if (edittingGraph.triples.length <= 0) {
      setErrorMessage('Statement can not be empty')
    }
    else {
      var duplicatedName = currentRules.findIndex((t) => (
        (t.systemName === editSystemNameRef.current.value) &&
          (t.name === editRuleNameRef.current.value)
      ))

      if (duplicatedName !== -1) {
        setErrorMessage('Rule ' + editRuleNameRef.current.value + ' has existed for system' + editSystemNameRef.current.value)
      }
      else {
        setErrorMessage('')
        callback({
          systemName: editSystemNameRef.current.value,
          name: editRuleNameRef.current.value,
          statement: {
            body: edittingGraph.triples,
            head: editActionList
          }
        })
      }
    }
  }

  const handleCancelClick = (event, iindex) => {
    callback(null)
  }

  /*Handle acc new action*/
  const updateActionClick = (ok, newAction) => {
    if (ok) {
      editActionList.push(newAction)
      setRerender(rerender + 1)
    }
    setOpenActionDialog(false)
  }

  /*Handle delete triple*/
  const onDeleteTriple = (delete_index) => {
    edittingGraph.triples.splice(delete_index, 1)
    setRerender(rerender + 1)
  }

  const onDeleteAction = (delete_index) => {
    editActionList.splice(delete_index, 1)
    setRerender(rerender + 1)
  }

  return (
    <div>
    {/*------------------- Modify information of the rule ------------------- */}
    <Typography color='error'>
      {errorMessage}
    </Typography>
    <Grid container className={classes.name} spacing={2} alignItems='center'>
      <Grid item xs={4} className={classes.textField}>
        <Autocomplete
          freeSolo
          id="system-suggestion"
          options={consumerSystems}
          getOptionLabel={(c) => c}
          renderInput={(params) => <TextField id="standard-full-width" variant="outlined" fullWidth label="System Name"
                                              inputRef={editSystemNameRef} {...params}  />}
        />
      </Grid>
      <Grid item xs={4} className={classes.textField}>
        <TextField id="standard-full-width" variant="outlined" fullWidth label="Rule Name"
                    inputRef={editRuleNameRef}/>
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
          titem.getDisplayComponent(tindex, {deleteCallback: onDeleteAction})
        ))}
      </TableBody>
    </Table>
    {/*------------------ BODY: Statement & Viz------------------ */}
    <Grid container className={classes.root} spacing={2}>
      {/*------------------ Left ------------------ */}
      <Grid key="list" className={classes.list} item>
        <RdfTriplesTable rdfTriples={edittingGraph.triples} isEditting={true} deleteCallback={onDeleteTriple}/>
      </Grid>
      {/*------------------ Right ------------------ */}
      <Grid key="graph" className={classes.graph} item >
        <Grid container alignItems='center' className={classes.editTriple} spacing={0}>
          <Grid item xs={3} className={classes.autoComplete}>
            {/*------------------ subject ------------------ */}
            <Autocomplete
              freeSolo
              id="ontology-suggestion-subject"
              options={subjectSuggestionList.concat(variablesList)}
              getOptionLabel={(c) => c.displayedName !== undefined? c.displayedName : c.value || c}
              renderInput={(params) => <TextField required inputRef={inputSubjectRef}
                                                  {...params} label="Variable" variant="outlined" />}
            />
            </Grid>
            <Grid item className={classes.arrowButton}>
              <IconButton onClick={handleAddPredicate}>
                <ArrowRightAltIcon />
              </IconButton >
            </Grid>
            {/*------------------ Predicate ------------------ */}
            <Grid item xs={3} className={classes.autoComplete}>
              <Autocomplete
                disabled={disableEditPred}
                id="ontology-suggestion-predicate"
                options={predicateSuggestionList}
                getOptionLabel={(c) => c.displayedName}
                /*onChange={(e, v) => setDisableEditObj(true)}*/
                renderInput={(params) => <TextField required inputRef={inputPredicateRef}
                                                    {...params} label="Predicate" variant="outlined" />}
              />
            </Grid>
            <Grid item className={classes.arrowButton}>
              <IconButton onClick={handleAddObject} disabled={disableEditPred}>
                <ArrowRightAltIcon />
              </IconButton >
            </Grid>
            {/*------------------ Object ------------------ */}
            <Grid item xs={3} className={classes.autoComplete}>
              <Autocomplete
                freeSolo
                disabled={disableEditObj}
                id="ontology-suggestion-object"
                options={objectSuggestionList.concat(variablesList)}
                getOptionLabel={(c) => c.displayedName !== undefined? c.displayedName : c.value || c}
                renderInput={(params) => <TextField required inputRef={inputObjectRef}
                                                    {...params} label="Object" variant="outlined" />}
              />
            </Grid>
            <Grid item className={classes.arrowButton}>
              <IconButton key="add-triple-button" onClick={handleAddNewTriple}>
                <AddIcon />
              </IconButton >
            </Grid>
          </Grid>
        <RDFGraph rdfTriples={edittingGraph.triples} rerender={rerender} isEditable={false}/>
      </Grid>
    </Grid>
    {/*------------------ Action Dialog ------------------ */}
    <EditAction openActionDialog={openActionDialog} onCloseCallback={updateActionClick} variablesList={variablesList}/>
    </div>
  )
}
