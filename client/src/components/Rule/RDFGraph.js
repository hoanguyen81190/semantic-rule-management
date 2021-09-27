import React, { useState, useEffect } from 'react'
import { makeStyles } from '@material-ui/core/styles'
import Button from '@material-ui/core/Button'
import Dialog from '@material-ui/core/Dialog'
import DialogActions from '@material-ui/core/DialogActions'
import DialogContent from '@material-ui/core/DialogContent'
import DialogContentText from '@material-ui/core/DialogContentText'
import DialogTitle from '@material-ui/core/DialogTitle'
import Paper from '@material-ui/core/Paper'
import Draggable from 'react-draggable'
import TextField from '@material-ui/core/TextField'
import Autocomplete from '@material-ui/lab/Autocomplete'

import * as d3 from "d3"

import { updateGraph } from '../../core/d3_util.js'

import { triplesToGraph, quadsToRDFModels } from '../../core/rdf_parser'

import './RDFGraph.css'

export default function RDFGraph(props) {
  const svgRef = React.useRef(null)
  const { rdfTriples, rerender, isEditable } = props
  //const classes = useStyles()
  var width = 600
  var height = 800
  const [displayedRule, setDisplayedRule] = React.useState(false)
	const [openEditDialog, setOpenEditDialog] = React.useState(false)
	const [editNode, setEditNode] = React.useState(null)

  useEffect(() => {
		// let zoom = d3.zoom()
		// 							.scaleExtent([1, 5])
		// 							.translateExtent([[0, 0], [width, height]])
		// 							.on('zoom', handleZoom)
    const svg = d3.select(svgRef.current)//.call(zoom)
    svg.selectAll("*").remove()
  	var force = d3.forceSimulation()
		var graph = triplesToGraph(rdfTriples)

    updateGraph(svg, graph, force, width, height)
  }, [rdfTriples, isEditable, rerender])

  return (
    <svg ref={svgRef} id="rdfGraphCanvas" className="rdfGraphCanvas" width={500} height={500}>
      <g className="marker" />
      <g className="node" />
      <g className="link" />
      <g className="link-text" />
      <g className="node-text" />
    </svg>
  )
}
