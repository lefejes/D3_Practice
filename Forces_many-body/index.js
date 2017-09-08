const w = window.innerWidth;
const h = window.innerHeight;

const color = d3.scaleOrdinal(d3.schemeCategory20c);

const bounds = (max) => (pos, r) => Math.max(r, Math.min(max - r, pos));
const boundsX = bounds(w);
const boundsY = bounds(h);

const svg = d3.select('body').append('svg')
	.attr('width', w)
	.attr('height', h);

const simulation = d3.forceSimulation()
  .alphaDecay(0)
	.force('charge', d3.forceManyBody())
	.on('tick', () => {
		svg.selectAll('circle')
			.attr('cx', (d) => d.x = boundsX(d.x, d.r + 100))
			.attr('cy', (d) => d.y = boundsY(d.y, d.r + 100));
	});

svg.on('mousemove', function() {
	const point = d3.mouse(this);
  const node = {
    x: point[0],
    y: point [1],
    r: d3.randomUniform(2, 20)()
  };

  simulation.nodes(simulation.nodes().concat(node));

	svg.append('circle')
    .data([node])
    .attr('fill', color(Math.floor(node.r)))
		.attr('cx', node.x)
		.attr('cy', node.y)
		.attr('r', 1e-6)
			.transition()
				.attr('r', node.r)
			.transition()
				.delay(3000)
				.attr('r', 1e-6)
        .on('end', () => simulation.nodes(simulation.nodes().slice(1)))
				.remove();
});
