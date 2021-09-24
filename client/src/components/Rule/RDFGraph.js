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
import ONTOLOGY from '../../core/ontologyConstants'

import { triplesToGraph, quadsToRDFModels } from '../../core/rdf_parser'

import './RDFGraph.css'

const NODE_RADIUS = 30
const RECT_WIDTH = 80
const RECT_HEIGHT = 35


function objColor(obj) {
	var color = "white"
	console.log("obj", obj)

	if (obj.ontology !== undefined) {
		if (obj.ontology === '') {
			color = ONTOLOGY.ontologyConstants.BASE.color
		}
		else {
			color = ONTOLOGY.ontologyConstants[obj.ontology.toUpperCase()].color
		}
	}
	return color
}

export default function RDFGraph(props) {
  const svgRef = React.useRef(null)
  const { rdfTriples, rdfGraph, rerender, isEditable } = props
  //const classes = useStyles()
  var width = 600
  var height = 800
  const [displayedRule, setDisplayedRule] = React.useState(false)
	const [openEditDialog, setOpenEditDialog] = React.useState(false)
	const [editNode, setEditNode] = React.useState(null)
	function handleZoom(e) {
	  d3.select(svgRef.current)
	    .attr('transform', e.transform)
	}
  useEffect(() => {
		// let zoom = d3.zoom()
		// 							.scaleExtent([1, 5])
		// 							.translateExtent([[0, 0], [width, height]])
		// 							.on('zoom', handleZoom)
    const svg = d3.select(svgRef.current)//.call(zoom)
    svg.selectAll("*").remove()
  	var force = d3.forceSimulation()
		var graph = rdfGraph
		if(graph === undefined) {
			graph = triplesToGraph(rdfTriples)
		}

    update(svg, graph, force)
  }, [rdfTriples, rdfGraph, isEditable, rerender])

	const update = (svg, graph, force) => {
	  var simulation = d3.forceSimulation()
	    .force("link", d3.forceLink().id(function(d) { return d.id }))
	    .force("charge", d3.forceManyBody().strength(-500))
	    .force("center", d3.forceCenter(width / 2, height / 3))

		console.log("graph", graph)

		// svg.append("defs").append("svg:clipPath")
    //     .attr("id", "clip")
    //     .append("svg:rect")
    //     .attr("id", "clip-rect")
    //     .attr("x", 0)
    //               .attr("y", 0)
    //               .attr("height", height)
    //               .attr("width", width)
		// var graphGroup = svg.append("g")
    //         .attr("clip-path", "url(#clip)")//add the clip path
    //               .attr("height", height)
    //               .attr("width", width)
    //               .attr("class", "graph-group")

	  svg.append("defs").selectAll("node")
				    .data(["end"])
				    .enter().append("marker")
				    .attr("id", String)
				    .attr("viewBox", "0 -5 10 10")
				    .attr("refX", 30)
				    .attr("refY", -0.5)
				    .attr("markerWidth", 6)
				    .attr("markerHeight", 6)
				    .attr("orient", "auto")
				    .append("polyline")
						.attr("stroke", "black")
						.style("stroke-width", 3)
				    .attr("points", "0,-5 10,0 0,5")


	  var first_link = svg.append("g")
	                .selectAll("line")
	                .data(graph.first_links)
	                .enter().append("line")
	                .attr("class", "link")
									.style("stroke-width", 3)
									.style("stroke", function(d) { return objColor(d.obj) })
	                //.attr("marker-end", "url(#end)")

		var second_link = svg.append("g")
	                .selectAll("line")
	                .data(graph.second_links)
	                .enter().append("line")
	                .attr("class", "link")
									.style("stroke-width", 3)
									.style("stroke", function(d) { return objColor(d.obj) })
	                .attr("marker-end", "url(#end)")
		//.call(d3.behavior.zoom().scaleExtent([1, 200]).on("zoom", zoom))
	  var node = svg.append("g")
	            .attr("class", "node")
	            .selectAll("circle")
	            .data(graph.nodes)
	            .enter().append("circle")
	            .attr("r", NODE_RADIUS)
	            .attr('stroke', 'black')
	            .attr('fill', function(d) { return objColor(d.obj) })
							//.style('stroke-dasharray', function(d) { return d.isEditable? "5,5" : ""})
	            .call(d3.drag()
	              .on("start", dragstarted)
	              .on("drag", dragged)
	              .on("end", dragended))

	  var label = svg.append("g")
	      .attr("class", "labels")
				.attr("dy", ".3em")
				.style("text-anchor", "middle")
	      .selectAll("text")
	      .data(graph.nodes)
				.style("font-size", "10px")
				.style("font-size", function(d) { return (2 * NODE_RADIUS - 10) / this.getComputedTextLength()*10 + 'px'})
	      .enter().append("text")
	        .attr("class", "label")
	        .attr("font-size", "10px")
	        .text(function(d) { return d.label })

		var predicate = svg.append("g")
	            .attr("class", "predicate")
	            .selectAll("rect")
	            .data(graph.predicates)
	            .enter().append("rect")
	            .attr('width', RECT_WIDTH)
							.attr('height', RECT_HEIGHT)
	            .attr('stroke', 'black')
	            .attr('fill', function(d) { return objColor(d.obj) })
	            .call(d3.drag()
	              .on("start", dragstarted)
	              .on("drag", dragged)
	              .on("end", dragended))

	  var linkLabel = svg.append("g")
	                    .attr("class", "labels")
	                    .selectAll("text")
	                    .data(graph.predicates)
	                    .enter().append("text")
	                      .attr("class", "label")
	                      .attr("font-size", "10px")
												.style("text-anchor", "middle")
	                      .text(function(d) { return d.label })
		console.log("hello", graph.nodes.concat(graph.predicates))
	  simulation
	      .nodes(graph.nodes.concat(graph.predicates))
	      .on("tick", ticked)

	  simulation.force("link")
	      .links(graph.first_links.concat(graph.second_links))

	  function ticked() {
	    first_link
	        .attr("x1", function(d) { return d.source.x })
	        .attr("y1", function(d) { return d.source.y })
	        .attr("x2", function(d) { return d.target.x })
	        .attr("y2", function(d) { return d.target.y })

			second_link
					.attr("x1", function(d) { return d.source.x })
					.attr("y1", function(d) { return d.source.y })
					.attr("x2", function(d) { return d.target.x })
					.attr("y2", function(d) { return d.target.y })

	    node
	         .attr("cx", function (d) { return d.x })
	         .attr("cy", function(d) { return d.y })

	    label
	    		.attr("x", function(d) { return d.x })
	        .attr("y", function (d) { return d.y })
	    linkLabel
	        .attr("x", function(d) { return (d.x) })
	        .attr("y", function(d) { return (d.y) })
			predicate
					.attr("x", function(d) { return (d.x - RECT_WIDTH/2) })
					.attr("y", function(d) { return (d.y - RECT_HEIGHT/2) })
	    }

	  function dragstarted(event, d) {
	    if (!event.active) simulation.alphaTarget(0.3).restart()
	    d.fx = d.x
	    d.fy = d.y
	  }

	  function dragged(event, d) {
	    d.fx = event.x
	    d.fy = event.y
	  }

	  function dragended(event, d) {
	    if (!event.active) simulation.alphaTarget(0)
	    d.fx = null
	    d.fy = null
	  }
	}

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
