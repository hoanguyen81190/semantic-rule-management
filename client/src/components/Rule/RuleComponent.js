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

import RDFGraph from '../../components/Rule/RDFGraph'

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

  }
}))

/*
<List component="nav" className={classes.root} aria-label="mailbox folders">
  {jenaRules.statement.body.map((titem, tindex) => {
    return (<Grid container spacing={3}>
      <Grid item xs={4}>
        <Paper className={classes.paper}>{titem.subject.value}</Paper>
      </Grid>
      <Grid item xs={4}>
        <Paper className={classes.paper}>{titem.predicate.value}</Paper>
      </Grid>
      <Grid item xs={4}>
        <Paper className={classes.paper}>{titem.object.value}</Paper>
      </Grid>
    </Grid>)
  })}
</List>
*/

export default function RuleComponent(props) {
  const { jenaRules } = props
  const classes = useStyles()

  return (
    <Grid container className={classes.root} spacing={2}>
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
            {jenaRules.statement.body.map((titem, tindex) => (
              <TableRow key={tindex}>
                <TableCell component="th" scope="row">
                  {titem.subject.value}
                </TableCell>
                <TableCell >{titem.predicate.value}</TableCell>
                <TableCell >{titem.object.value}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Grid>
      <Grid key="graph" className={classes.graph} item>
        <RDFGraph rdfTriples={jenaRules.statement.body} isEditable={false}/>
      </Grid>
    </Grid>
  )
}
