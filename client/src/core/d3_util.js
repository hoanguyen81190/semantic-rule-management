import * as d3 from 'd3'
import ONTOLOGY from './ontologyConstants'
import * as colors from '@material-ui/core/colors'

const NODE_RADIUS = 30
const RECT_WIDTH = 80
const RECT_HEIGHT = 35

// function handleZoom(e) {
//   d3.select(svgRef.current)
//     .attr('transform', e.transform)
// }

function objColor(obj) {
	var color = "white"

	if (obj.ontology !== undefined) {
		if (obj.ontology === '') {
			color = ONTOLOGY.ontologyConstants.AUTO.colorCode
		}
		else {
			color = ONTOLOGY.ontologyConstants[obj.ontology.toUpperCase()].colorCode
		}
	}
	else if (!obj.isVar) {
		color = colors.blueGrey[100]
	}
	return color
}

export function updateGraph(svg, zoom, graph, force, width, height) {
  var simulation = d3.forceSimulation()
    .force("link", d3.forceLink().id(function(d) { return d.id }))
    .force("charge", d3.forceManyBody().strength(-500))
    .force("center", d3.forceCenter(width / 2, height / 3))

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

  svg.append("defs")
					.selectAll("node")
					//.select('svg g')
          .data(["end"])
          .enter().append("marker")
          .attr("id", String)
          .attr("viewBox", "0 -5 10 10")
          .attr("refX", 26)
          .attr("refY", 0)
          .attr("markerWidth", 6)
          .attr("markerHeight", 6)
          .attr("orient", "auto")
          .append("path")
					.attr("d", "M0,-5L10,0L0,5")


  var first_link = svg
								//.select('svg g')
								.append("g")
                .selectAll("line")
                .data(graph.first_links)
                .enter().append("line")
                .attr("class", "link")
                .style("stroke-width", 3)
                .style("stroke", function(d) { return objColor(d.obj) })
                //.attr("marker-end", "url(#end)")

  var second_link = svg
								.select('svg g')
								.append("g")
                .selectAll("line")
                .data(graph.second_links)
                .enter().append("line")
                .attr("class", "link")
								.attr('cx', function(d) { return d.x; })
		.attr('cy', function(d) { return d.y; })
                .style("stroke-width", 3)
                .style("stroke", function(d) { return objColor(d.obj) })
                .attr("marker-end", "url(#end)")
  //.call(d3.behavior.zoom().scaleExtent([1, 200]).on("zoom", zoom))
  var node = svg
						.select('svg g')
						.append("g")
            .attr("class", "node")
            .selectAll("circle")
            .data(graph.nodes)
            .enter().append("circle")
						.attr('cx', function(d) { return d.x; })
    				.attr('cy', function(d) { return d.y; })
            .attr("r", NODE_RADIUS)
            .attr('stroke', 'black')
            .attr('fill', function(d) { return objColor(d.obj) })
            //.style('stroke-dasharray', function(d) { return d.isEditable? "5,5" : ""})
            .call(d3.drag()
              .on("start", dragstarted)
              .on("drag", dragged)
              .on("end", dragended))

  var label = svg.select('svg g')
			.append("g")
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

  var predicate = svg.select('svg g')
						.append("g")
            .attr("class", "predicate")
            .selectAll("rect")
            .data(graph.predicates)
            .enter().append("rect")
            .attr('width', RECT_WIDTH)
            .attr('height', RECT_HEIGHT)
            .attr('stroke', 'black')
						.attr('cx', function(d) { return d.x; })
.attr('cy', function(d) { return d.y; })
            .attr('fill', function(d) { return objColor(d.obj) })
            .call(d3.drag()
              .on("start", dragstarted)
              .on("drag", dragged)
              .on("end", dragended))

  var linkLabel = svg.select('svg g')
										.append("g")
                    .attr("class", "labels")
                    .selectAll("text")
                    .data(graph.predicates)
                    .enter().append("text")
                      .attr("class", "label")
                      .attr("font-size", "10px")
                      .style("text-anchor", "middle")
                      .text(function(d) { return d.label })

  simulation
      .force("collide", d3.forceCollide().strength(1).radius(80).iterations(1))
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
