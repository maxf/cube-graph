/* global d3 */

var svg = d3.select("svg"),
  width = +svg.attr("width"),
  height = +svg.attr("height");

//var color = d3.scaleOrdinal(d3.schemeCategory20);

const layout = (graph) => {
  return new Promise((resolve) => {
    var simulation = d3
      .forceSimulation()
      .alphaMin(0.3)
      .force("link", d3.forceLink().id(function(d) {
        return d.id;
      }))
      .force("charge", d3.forceManyBody())
      .force("center", d3.forceCenter(width / 2, height / 2))
      .on("end", resolve(graph));

    simulation.nodes(graph.nodes);
    simulation.force("link").links(graph.links);
  });
};

const render = (graph) => {

  d3.select("#target").append("g")
    .attr("class", "links")
    .selectAll("line")
    .data(graph.links)
    .enter().append("line")
    .attr("stroke-width", 1)
    .attr("x1", function(d) { return d.source.x; })
    .attr("y1", function(d) { return d.source.y; })
    .attr("x2", function(d) { return d.target.x; })
    .attr("y2", function(d) { return d.target.y; });

  d3.select("#target").append("g")
    .attr("class", "nodes")
    .selectAll("circle")
    .data(graph.nodes)
    .enter().append("circle")
    .attr("r", 5)
    .attr("cx", function(d) { return d.x; })
    .attr("cy", function(d) { return d.y; })
    .attr("fill", 'green');
}


const showGraph = function(states, edges) {
  const graph = {
    nodes: states,
    links: edges
  }
//  layout(graph).then(render);
  render(graph);
};
