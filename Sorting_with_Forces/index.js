var w = window.innerWidth;
var h = window.innerHeight;

var scaleR = d3.scaleLinear(d3.range(2, 20));
var scaleColor = d3.scaleOrdinal()
  .domain([0, 1, 2])
  .range(['red', 'blue', 'green']);

var scaleX = d3.scaleLinear()
  .domain([0, 2])
  .range([0, w])

var posY = (d) => {
	var f = (d.r / 12);

	if (f < 0.33) {
		return h * 0.2;
	}
	else if (f < 0.67) {
		return h * 0.5;
	}
	else {
		return h * 0.8;
	}
}

var simulation = d3.forceSimulation()
	.alpha(0)
	.alphaTarget(0.5)
	.velocityDecay(0.8)
	.force('collide', d3.forceCollide((d) => d.r + 5).iterations(16))
	.force('x', d3.forceX((d) => scaleX((d.type + 1) % 3)).strength(0.4))
	.force('y', d3.forceY(posY).strength(0.4))
	.on('tick', () => {
		svg.selectAll('circle')
			.attr('cx', (d) => d.x)
			.attr('cy', (d) => d.y);
	});

var previous;

var svg = d3.select('body').append('svg')
	.attr('width', w)
	.attr('height', h)
	.on('mousemove', function mousemove() {
		var point = d3.mouse(this);
		var type = Math.random() * 12 | 0;
		var node = { 
			x: point[0],
			y: point[1],
			type: type,
			r: scaleR(type)
		};

		simulation.nodes(simulation.nodes().concat(node));

		svg.append('circle')
			.data([node])
			.attr('cx', (d) => d.x)
			.attr('cy', (d) => d.y)
			.attr('fill', (d) => scaleColor((d.type + 1) % 3))
			.attr('r', 1e-6)
				.transition()
					.duration(500)
					.attr('r', node.r)
				.transition()
					.delay(2000)
					.duration(2000)
					.attr('r', 1e-6)
					.on('end', () => simulation.nodes(simulation.nodes().slice(1)))
					.remove();
	});
