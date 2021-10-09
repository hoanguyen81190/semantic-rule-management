import React, { useState, useEffect } from 'react'
import { makeStyles } from '@material-ui/core/styles'

import Table from '@material-ui/core/Table'
import TableBody from '@material-ui/core/TableBody'
import TableCell from '@material-ui/core/TableCell'
import TableContainer from '@material-ui/core/TableContainer'
import TableHead from '@material-ui/core/TableHead'
import TableRow from '@material-ui/core/TableRow'

import IconButton from '@material-ui/core/IconButton'
import DeleteIcon from '@material-ui/icons/Clear'

import { displayObjectText } from '../../core/rdf_parser'

const useStyles = makeStyles((theme) => ({
  table: {
    // borderTopWidth: 0.7,
    // borderStyle: 'solid'
  }
}))

export default function RdfTriplesTable(props) {
  const { rdfTriples, isEditting, deleteCallback } = props
  const classes = useStyles()

  useEffect(() => {
  }, [rdfTriples])

  return (
        <Table className={classes.table} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell>Subject</TableCell>
              <TableCell>Predicate</TableCell>
              <TableCell>Object</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rdfTriples.map((titem, tindex) => (
              <TableRow key={tindex}>
                <TableCell component="th" scope="row">
                  {displayObjectText(titem.subject)}
                </TableCell>
                <TableCell >{displayObjectText(titem.predicate)}</TableCell>
                <TableCell >{displayObjectText(titem.object)}</TableCell>
                {isEditting ? <TableCell><IconButton key="delete-triple-button" onClick={(e, i) => deleteCallback(tindex)}>
                                                  <DeleteIcon style={{fill: "#f50057"}}/>
                                                </IconButton ></TableCell> : null}
              </TableRow>
            ))}
          </TableBody>
        </Table>
  )
}
