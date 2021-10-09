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
import Divider from '@material-ui/core/Divider'

import RDFGraph from '../../components/Rule/RDFGraph'
import RdfTriplesTable from './RdfTriplesTable'

import { displayObjectText } from '../../core/rdf_parser'

const useStyles = makeStyles((theme) => ({
  megaRoot: {

  },
  root: {
    //layout: 1,
    height: "100%",
    width: "100%"
  },
  list: {
    height: "70vh",
    width: "30%",
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
    // borderTopWidth: 1,
    // borderStyle: 'solid'
  }
}))

export default function RuleComponent(props) {
  const { jenaRules } = props
  const classes = useStyles()

  return (
    <div className={classes.megaRoot} >
    <Table className={classes.table} aria-label="simple table">
      <TableBody>
        {jenaRules.statement.head.map((titem, tindex) => (
          titem.getDisplayComponent(tindex, null)
        ))}
      </TableBody>
    </Table>
    <Grid container className={classes.root} spacing={2}>
      <Grid key="list" className={classes.list} item>
        <RdfTriplesTable rdfTriples={jenaRules.statement.body} isEditting={false}/>
      </Grid>
      <Grid key="graph" className={classes.graph} item>
        <RDFGraph rdfTriples={jenaRules.statement.body} isEditable={false}/>
      </Grid>
    </Grid>
    </div>
  )
}
