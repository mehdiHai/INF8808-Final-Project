import * as preprocess from "./preprocess.js"
import distinctColors from 'distinct-colors'

const biggestCompaniesAircrafts = new Map();
let otherCompaniesAircrafts = new Map();
let colorScale = {}
let factor = 5;

export function drawWaffles(biggestCompaniesFlights, companiesAircrafts) {
	separateBigFromOthers(biggestCompaniesFlights, companiesAircrafts);


	setTooltip();
	
	drawOtherCompaniesWaffle();
	drawTopCompaniesWaffles();
}

function separateBigFromOthers(biggestCompaniesFlights, companiesAircrafts) {
	biggestCompaniesFlights.forEach((d, index) => {
		if(index < preprocess.getTopCompaniesCount())
			biggestCompaniesAircrafts.set(d[0], companiesAircrafts.get(d[0]))
		else {
			for (const typeCount of companiesAircrafts.get(d[0])) {
				const name = typeCount[0];

				if (!otherCompaniesAircrafts.get(name))
					otherCompaniesAircrafts.set(name, 0);
				otherCompaniesAircrafts.set(
					name,
					otherCompaniesAircrafts.get(name) + typeCount[1]
				);
			}
		}
	})
}

function createScale(data) {
	const domain = data.map((d) => {
		return d.category;
	});
	console.log()
	colorScale = d3.scaleOrdinal().domain(domain).range(distinctColors({count: 12}));
	addLegend(colorScale)
}

function calculateWaffleDimensions(data, factor) {
	const width = 1024;
	const height = 500;
	const squareSize = 20;
	const offset = 5;
	const total = data.reduce((acc, d) => acc + d.value, 0);
	let cols = Math.floor(Math.sqrt(((total / factor) * width) / height));
	if(cols === 0) cols = 1
	const rows = Math.ceil(total / factor / cols);

	return {
		width: cols * squareSize + cols * offset,
		height: rows * squareSize + rows * offset,
		rows,
		cols,
		squareSize,
		offset,
	};
}

function drawOtherCompaniesWaffle() {
	const data = waffleify(otherCompaniesAircrafts);
	const svg = d3.select("#viz4").append("svg").attr("id", "waffleChart");
	createScale(data);
	drawWaffle(data, svg);
}

function drawTopCompaniesWaffles() {
	d3.select("#viz4")
		.append("div")
		.attr("id", "waffleGroup");

	biggestCompaniesAircrafts.forEach((company) => {
		const svg = d3.select("#waffleGroup").append("svg").attr("id", company);
		drawWaffle(waffleify(company), svg);
	});
}

function waffleify(data) {
	const newData = [];
	console.log(data)
	newData.push({ category: "Autre", value: 0 });
	[...data.entries()].forEach((d) => {
		if (d[1] < factor) {
			newData[0].value += d[1];
		} else {
			newData.push({ category: d[0], value: d[1] });
		}
	});
	return newData;
}

function drawWaffle(data, svg) {
	// const domain = data.map((d) => {
	// 	return d.category;
	// });
	console.log(data)
	// const colorScale = d3.scaleOrdinal().domain(domain).range(d3.schemeTableau10);
	// addLegend(colorScale)
	const dimensions = calculateWaffleDimensions(data, factor);
	svg.attr("width", dimensions.width).attr("height", dimensions.height);
	data.forEach((d) => {
		d.value = Math.round(d.value / factor);
	});

	const waffles = [];
	data.forEach((d) => {
		for (let i = 0; i < d.value; i++) {
			waffles.push(d.category);
		}
	});

	let count = 0;
	for (var i = 0; i < dimensions.rows; i++) {
		for (var j = 0; j < dimensions.cols; j++) {
			const category = waffles[count];
			svg.append("rect")
				.attr(
					"x",
					j * dimensions.squareSize +
						(j - 1) * dimensions.offset +
						dimensions.offset
				)
				.attr(
					"y",
					i * dimensions.squareSize +
						(i - 1) * dimensions.offset +
						dimensions.offset
				)
				.attr("width", dimensions.squareSize)
				.attr("height", dimensions.squareSize)
				.style("fill", function () {
					return colorScale(category);
				})
				.style("opacity", function () {
					return category != undefined ? 1 : 0;
				})
				.attr("stroke", "black")
				.on("mouseover", function (m) {
					return showTooltip(m, category);
				})
				.on("mousemove", moveTooltip)
				.on("mouseleave", function () {
					return hideTooltip();
				});

			count++;
		}
	}
}

function setTooltip() {
	d3.select("#viz4")
		.append("div")
		.style("opacity", 0)
		.attr("class", "tooltip")
		.style("background-color", "black")
		.style("border-radius", "5px")
		.style("padding", "10px")
		.style("color", "white")
		.style("position", "absolute");
}

const showTooltip = function (m, d) {
	const tooltip = d3.select("#viz4").select(".tooltip");
	tooltip.transition().duration(100);
	tooltip
		.style("opacity", 1)
		.html(": " + d + " vols")
		.style("left", m.x + 30 + "px")
		.style("top", m.y + 30 + "px")
		.style("width", null);
};
const moveTooltip = function (m) {
	const tooltip = d3.select("#viz4").select(".tooltip");
	tooltip.style("left", m.x + 30 + "px").style("top", m.y + 30 + "px");
};
const hideTooltip = function () {
	const tooltip = d3.select("#viz4").select(".tooltip");
	tooltip.style("opacity", 0);
};

function addLegend(scale) {
	d3.select('#viz4').append('div').attr('class', 'legend')


}
