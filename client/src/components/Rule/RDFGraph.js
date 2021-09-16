import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';

import * as d3 from "d3"

import './RDFGraph.css';

const NODE_RADIUS = 10;

function filterNodesById(nodes,id){
	return nodes.filter(function(n) { return n.id === id; });
}

function filterNodesByType(nodes,value){
	return nodes.filter(function(n) { return n.type === value; });
}

function triplesToGraph(triples){
			//Graph
			var graph={nodes:[], links:[]};

			//Initial Graph from triples
			triples.forEach(function(triple){
				var subjId = triple.subject;
				var predId = triple.predicate;
				var objId = triple.object;

				var subjNode = filterNodesById(graph.nodes, subjId)[0];
				var objNode  = filterNodesById(graph.nodes, objId)[0];

				if(subjNode==null){
					subjNode = {id:subjId, label:subjId, weight:1};
					graph.nodes.push(subjNode);
				}

				if(objNode==null){
					objNode = {id:objId, label:objId, weight:1};
					graph.nodes.push(objNode);
				}


				graph.links.push({source:subjNode, target:objNode, predicate:predId, weight:1});
			});

			return graph;
}

function update(svg, graph, force){
  var width = 500
  var height = 500

  var simulation = d3.forceSimulation()
    .force("link", d3.forceLink().id(function(d) { return d.id; }))
    .force("charge", d3.forceManyBody().strength(-100))
    .force("center", d3.forceCenter(width / 2, height / 2));

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
			    .append("svg:polyline")
			    .attr("points", "0,-5 10,0 0,5")
			    ;

  var link = svg.append("g")
                .style("stroke", "#aaa")
                .selectAll("line")
                .data(graph.links)
                .enter().append("line")
                .attr("class", "link")
                .attr("marker-end", "url(#end)");

  var node = svg.append("g")
            .attr("class", "node")
            .selectAll("circle")
            .data(graph.nodes)
            .enter().append("circle")
            .attr("r", NODE_RADIUS)
            .attr('stroke', 'black')
            .attr('fill', '#69a3b2')
            .call(d3.drag()
              .on("start", dragstarted)
              .on("drag", dragged)
              .on("end", dragended));

  var label = svg.append("g")
      .attr("class", "labels")
      .selectAll("text")
      .data(graph.nodes)
      .enter().append("text")
        .attr("class", "label")
        .attr("font-size", "10px")
        .text(function(d) { return d.label; });

  var linkLabel = svg.append("g")
                    .attr("class", "labels")
                    .selectAll("text")
                    .data(graph.links)
                    .enter().append("text")
                      .attr("class", "label")
                      .attr("font-size", "10px")
                      .text(function(d) { return d.predicate; });

  simulation
      .nodes(graph.nodes)
      .on("tick", ticked);

  simulation.force("link")
      .links(graph.links);

  function ticked() {
    link
        .attr("x1", function(d) { return d.source.x; })
        .attr("y1", function(d) { return d.source.y; })
        .attr("x2", function(d) { return d.target.x; })
        .attr("y2", function(d) { return d.target.y; });

    node
         .attr("cx", function (d) { return d.x; })
         .attr("cy", function(d) { return d.y; });

    label
    		.attr("x", function(d) { return d.x; })
        .attr("y", function (d) { return d.y; });
    linkLabel
        .attr("x", function(d) { return (d.source.x + d.target.x)/2; })
        .attr("y", function(d) { return (d.source.y + d.target.y)/2; })
    }

  function dragstarted(event, d) {
    if (!event.active) simulation.alphaTarget(0.3).restart();
    d.fx = d.x;
    d.fy = d.y;
  }

  function dragged(event, d) {
    d.fx = event.x;
    d.fy = event.y;
  }

  function dragended(event, d) {
    if (!event.active) simulation.alphaTarget(0);
    d.fx = null;
    d.fy = null;
  }
}

export default function RDFGraph(props) {
  const svgRef = React.useRef(null)
  const { rdfTriples } = props
  //const classes = useStyles()
  const width = 600
  const height = 300
  const margin = { top: 30, right: 30, bottom: 30, left: 60 }
  const svgWidth = width + margin.left + margin.right;
  const svgHeight = height + margin.top + margin.bottom;
  const [displayedRule, setDisplayedRule] = React.useState(false);

  useEffect(() => {
    const svg = d3.select(svgRef.current);
  	var force = d3.forceSimulation()
  	var graph = triplesToGraph(rdfTriples);

    update(svg, graph, force)
  }, [])

  return (
    <div className="rdfGraphContainer">
      <svg ref={svgRef} id="rdfGraphCanvas" className="rdfGraphCanvas" width={500} height={500}>
        <g className="marker" />
        <g className="node" />
        <g className="link" />
        <g className="link-text" />
        <g className="node-text" />
      </svg>
    </div>
  );
}
