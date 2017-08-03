var MHz900 = d3.select("#MHz900"),
    margin900 = { top: 60, right: 50, bottom: 30, left: 90 },
    width900 = +MHz900.attr("width") - margin900.left - margin900.right,
    height900 = +MHz900.attr("height") - margin900.top - margin900.bottom,
    bandStart900 = 880,
    bandEnd900 = 960,
    guardStart900 = 915,
    guardEnd900 = 925,
    availSpec900 = bandEnd900 - bandStart900 + guardStart900 - guardEnd900;

var MHz1800 = d3.select("#MHz1800"),
    margin1800 = { top: 60, right: 50, bottom: 30, left: 120 },
    width1800 = +MHz1800.attr("width") - margin1800.left - margin1800.right,
    height1800 = +MHz1800.attr("height") - margin1800.top - margin1800.bottom,
    bandStart1800 = 1710.2,
    bandEnd1800 = 1879.8,
    guardStart1800 = 1784.8,
    guardEnd1800 = 1805.2,
    availSpec1800 = bandEnd1800 - bandStart1800 + guardStart1800 - guardEnd1800;


var x900 = d3.scaleLinear().rangeRound([0, width900]),
    y900 = d3.scaleBand().rangeRound([0, height900]).padding(0.1);

var x1800 = d3.scaleLinear().rangeRound([0, width1800]),
    y1800 = d3.scaleBand().rangeRound([0, height1800]).padding(0.1);

var yaxis900 = d3.axisLeft(y900)
    .tickSize(5);

var g = MHz900.append("g")
    .attr("transform", "translate(" + margin900.left + "," + margin900.top + ")");

var h = MHz1800.append("g")
    .attr("transform", "translate(" + margin1800.left + "," + margin1800.top + ")");

var infoBox = d3.select("body").append("div")
    .attr("class", "operatorTip")
    .style("opacity", 0);

var countryBox = d3.select("body").append("div")
    .attr("class", "countryTip")
    .style("opacity", 0);

var r = d3.format(".0f");
var f = d3.format(".1f");
var p = d3.format('.0%');

var totSpec = "";
var sumSpec = 0;
var sumSpec1800 = 0;
var topOffset = d3.select(".tab-content").node().getBoundingClientRect()["top"];


/* Load 900MHz data file */
d3.csv("900MHz.csv", function(d) {
    d.freqStart = +d.freqStart;
    d.freqEnd = +d.freqEnd;
    return d;
}, function(error, data) {
    if (error) throw error;

    /* Sort data by Country */
    data = data.sort(function(a, b) {
        return d3.ascending(a.Country, b.Country);
    });

    x900.domain([d3.min(data, function(d) { return d.freqStart; }), d3.max(data, function(d) { return d.freqEnd; })]);
    y900.domain(data.map(function(d) { return d.Country; }));


    /* Set lower X-axis and legend */
    g.append("g")
        .attr("class", "axis axis--x")
        .attr("transform", "translate(0," + height900 + ")")
        .call(d3.axisBottom(x900).ticks(20).tickSize(-height900))
        .append("text")
        .attr("x", 20)
        .attr("y", 30)
        .text("Frequency (MHz)");

    /* Set X-axis at top and add title/legend */
    g.append("g")
        .attr("class", "axis axis--x")
        .call(d3.axisTop(x900).ticks(20).tickSize(-height900))
        .append("text")
        .classed("FreqLegend", true)
        .attr("x", 20)
        .attr("y", -30)
        .text("900 MHz Band");

    /* Set Y-axis with text wrapping function */
    g.append("g")
        .attr("class", "axis axis--y")
        .call(yaxis900)
        .selectAll(".tick text")
        .classed("countryStyle", true)
        .call(wrap, margin900.left);

    /*  Build mouseover for y axis legend */
    g.selectAll(".axis--y .tick text")
        .on("mouseover", function() {
            totSpec = 0;
            var myElement = d3.select(this);
            var countryName = myElement.text();
            /* determine y coordinates of row selected */
            var yText = getTranslation(d3.select(this.parentNode).attr("transform"));
            /*  determine absolute coordinates for left edge of SVG */
            var matrix = this.getScreenCTM()
                .translate(+this.getAttribute("cx"), +this.getAttribute("cy"));
            g.selectAll("." + countryName.replace(/\s+/g, '_')).each(function(d) {
                totSpec += d.freqEnd;
                totSpec -= d.freqStart;
                sumSpec = sumSpec + d.freqEnd - d.freqStart;
            });
            var availPercent900 = totSpec / availSpec900;
            countryBox.transition()
                .duration(200)
                .style("opacity", .9);
            countryBox.html(countryName + '</br>' + r(totSpec) + ' MHz assigned out of ' + availSpec900 + ' MHz available. <br><b>Band occupancy ' + p(availPercent900) + '</b>')
                .style("left", (window.pageXOffset + matrix.e) + "px")
                .style("top", yText[1] + topOffset + 5 - window.pageYOffset + "px")
                .style("height", y900.bandwidth() + "px")
                .style("width", width900 + "px");
        })
        .on("mouseout", function() {
            countryBox.transition()
                .duration(500)
                .style("opacity", 0);
        });

    /* Iterate through data file */
    g.selectAll(".bar")
        .data(data)
        .enter().append("g")
        .attr("class", "bars")
        .append("rect")
        .attr("class", function(d) { return d.Operator.replace(/\s+/g, '_').replace(/\W/g, '') + " " + d.Country.replace(/\s+/g, '_'); })
        .classed("bar", true)
        .attr("y", function(d) { return y900(d.Country); })
        .attr("x", function(d) { return x900(d.freqStart); })
        .attr("width", function(d) { return x900(d.freqEnd) - x900(d.freqStart); })
        .attr("height", y900.bandwidth());

    /* Add guards bands */
    g.selectAll("guard")
        .data(data)
        .enter().append("g")
        .attr("class", "guardbands")
        .append("rect")
        .attr("class", "guardband")
        .attr("y", function(d) { return y900(d.Country); })
        .attr("x", x900(guardStart900))
        .attr("width", function(d) { return x900(guardEnd900) - x900(guardStart900); })
        .attr("height", y900.bandwidth());

    /*  Add label to guardbands */
    g.selectAll(".guardbands")
        .append("text")
        .attr("class", "label")
        .attr('transform', 'rotate(-90)')
        .attr("y", function(d) { return x900(guardStart900) + (x900(guardEnd900) - x900(guardStart900)) / 2 + 5; })
        .attr("x", function(d) { return -y900(d.Country) - y900.bandwidth() + 10; })
        .text("Guard Band")
        .call(wrap, y900.bandwidth());

    /*  Add label to each spectrum assignments */
    var bars900 = MHz900.selectAll(".bars");

    bars900.append("text")
        .attr("class", "label")
        .attr('transform', 'rotate(-90)')
        .attr("y", function(d) { return x900(d.freqStart) + (x900(d.freqEnd) - x900(d.freqStart)) / 2 + 5; })
        .attr("x", function(d) { return -y900(d.Country) - y900.bandwidth() + 10; })
        .text(function(d) { return d.Operator; })
        .call(wrap, y900.bandwidth());

    /* ToolTip for spectrum assignments - repeat for Label text */
    bars900.on("mouseover", function(d) {
            /* calculate total spectrum assigned */
            g.selectAll("." + d.Operator.replace(/\s+/g, '_').replace(/\W/g, '') + "." + d.Country.replace(/\s+/g, '_')).each(function(d) {
                totSpec = f(d.freqEnd - d.freqStart) + " + " + totSpec;
                sumSpec = sumSpec + d.freqEnd - d.freqStart;
            });
            g.selectAll("." + d.Operator.replace(/\s+/g, '_').replace(/\W/g, '') + "." + d.Country.replace(/\s+/g, '_'))
                .classed("selected", true)
            infoBox.transition()
                .duration(200)
                .style("opacity", .9);
            infoBox.html('<div class="tab-row"><div class="cell-right">Country:</div><div class="cell-left">' + d.Country + '</div></div><div class="tab-row"><div class="cell-right">Operator:</div><div class="cell-left">' + d.Operator + '</div></div><div class="tab-row"><div class="cell-right">Band:</div><div class="cell-left">' + d.Band + '</div></div><div class="tab-row"><div class="cell-right">Assignment:</div><div class="cell-left">' + totSpec.replace(/\s\+\s$/, '') + ' MHz</div></div><div class="tab-row"><div class="cell-right">Total:</div><div class="cell-left">' + f(sumSpec) + " MHz</div></div>")
                .style("left", x900(d.freqStart) + 20 + "px")
                .style("top", y900(d.Country) + y900.bandwidth() + topOffset + margin900.top + 5 + "px");
                /* reminder: 170 is styled height of infobox */
            console.log("d.Country: " + d.Country + " y(d.country): " + y900(d.Country) + " topoffset: " + topOffset); 
        })
        .on("mouseout", function(d) {
            totSpec = "";
            sumSpec = 0;
            g.selectAll("." + d.Operator.replace(/\s+/g, '_').replace(/\W/g, '') + "." + d.Country.replace(/\s+/g, '_'))
                .classed("selected", false)
            infoBox.transition()
                .duration(500)
                .style("opacity", 0);
        });
});



/* Load data from 1800 MHz file */
d3.csv("1800MHz.csv", function(d) {
    d.freqStart = +d.freqStart;
    d.freqEnd = +d.freqEnd;
    return d;
}, function(error, data) {
    if (error) throw error;

    /* Sort data by Country */
    data = data.sort(function(a, b) {
        return d3.ascending(a.Country, b.Country);
    });

    x1800.domain([d3.min(data, function(d) { return d.freqStart; }), d3.max(data, function(d) { return d.freqEnd; })]);
    y1800.domain(data.map(function(d) { return d.Country; }));


    /* Set lower X-axis and legend */
    h.append("g")
        .attr("class", "axis axis--x")
        .attr("transform", "translate(0," + height1800 + ")")
        .call(d3.axisBottom(x1800).ticks(20).tickSize(-height1800))
        .append("text")
        .attr("x", 20)
        .attr("y", 30)
        .text("Frequency (MHz)");

    /* Set X-axis at top and add title/legend */
    h.append("g")
        .attr("class", "axis axis--x")
        .call(d3.axisTop(x1800).ticks(20).tickSize(-height1800))
        .append("text")
        .classed("FreqLegend", true)
        .attr("x", 20)
        .attr("y", -30)
        .text("1800 MHz Band");

    /* Set Y-axis in 1800*/
    h.append("g")
        .attr("class", "axis axis--y")
        .call(d3.axisLeft(y1800).tickSize(5))
        .selectAll(".tick text")
        .classed("countryStyle", true)
        .call(wrap, margin1800.left);


    /*  Build mouseover infobox for each country in y axis legend in 1800 */
    h.selectAll(".axis--y .tick text")
        .on("mouseover", function() {
            totSpec1800 = 0;
            var myElement = d3.select(this);
            var countryName = myElement.text();
            /* determine y coordinates of row selected */
            var yText = getTranslation(d3.select(this.parentNode).attr("transform"));
            /*  determine absolute coordinates for left edge of SVG */
            var matrix = this.getScreenCTM()
                .translate(+this.getAttribute("cx"), +this.getAttribute("cy"));
            h.selectAll("." + countryName.replace(/\s+/g, '_')).each(function(d) {
                totSpec1800 += d.freqEnd;
                totSpec1800 -= d.freqStart;
                sumSpec1800 = sumSpec1800 + d.freqEnd - d.freqStart;
            });
            var availPercent1800 = totSpec1800 / availSpec1800;
            countryBox.transition()
                .duration(200)
                .style("opacity", .9);
            countryBox.html(countryName + '</br>' + r(totSpec1800) + ' MHz assigned out of ' + r(availSpec1800) + ' MHz available. <br><b>Band occupancy ' + p(availPercent1800) + '</b>')
                .style("left", (window.pageXOffset + matrix.e) + "px")
                .style("top", yText[1] + topOffset + 5 - window.pageYOffset + "px")
                .style("height", y1800.bandwidth()  + "px")
                .style("width", width1800 + "px");

        })
        .on("mouseout", function() {
            countryBox.transition()
                .duration(500)
                .style("opacity", 0);
        });

    /* Iterate through data file */
    h.selectAll(".bar")
        .data(data)
        .enter().append("g")
        .attr("class", "bars")
        .append("rect")
        .attr("class", function(d) { return d.Operator.replace(/\s+/g, '_').replace(/\W/g, '') + " " + d.Country.replace(/\s+/g, '_'); })
        .classed("bar", true)
        .attr("y", function(d) { return y1800(d.Country); })
        .attr("x", function(d) { return x1800(d.freqStart); })
        .attr("width", function(d) { return x1800(d.freqEnd) - x1800(d.freqStart); })
        .attr("height", y1800.bandwidth());

    /* Add rectangles for guards bands */
    h.selectAll("guard")
        .data(data)
        .enter().append("g")
        .attr("class", "guardbands")
        .append("rect")
        .attr("class", "guardband")
        .attr("y", function(d) { return y1800(d.Country); })
        .attr("x", x1800(guardStart1800))
        .attr("width", function(d) { return x1800(guardEnd1800) - x1800(guardStart1800); })
        .attr("height", y1800.bandwidth());

    /* Add label to guardbands */
    h.selectAll(".guardbands")
        .append("text")
        .attr("class", "label")
        .attr('transform', 'rotate(-90)')
        .attr("y", function(d) { return x1800(guardStart1800) + (x1800(guardEnd1800) - x1800(guardStart1800)) / 2 + 5; })
        .attr("x", function(d) { return -y1800(d.Country) - y1800.bandwidth() + 10; })
        .text("Guard Band")
        .call(wrap, y1800.bandwidth());


    /* Add operator label to each spectrum assignment */
    var bars1800 = MHz1800.selectAll(".bars");

    bars1800.append("text")
        .attr("class", "label")
        .attr('transform', 'rotate(-90)')
        .attr("y", function(d) { return x1800(d.freqStart) + (x1800(d.freqEnd) - x1800(d.freqStart)) / 2 + 5; })
        .attr("x", function(d) { return -y1800(d.Country) - y1800.bandwidth() + 10; })
        .text(function(d) { return d.Operator; })
        .call(wrap, y1800.bandwidth());

    /* 1800MHz ToolTip for each operator spectrum assignment */
    bars1800.on("mouseover", function(d) {
            /* calculate total spectrum assigned */
            h.selectAll("." + d.Operator.replace(/\s+/g, '_').replace(/\W/g, '') + "." + d.Country.replace(/\s+/g, '_')).each(function(d) {
                totSpec = f(d.freqEnd - d.freqStart) + " + " + totSpec;
                sumSpec = sumSpec + d.freqEnd - d.freqStart;
            });
            h.selectAll("." + d.Operator.replace(/\s+/g, '_').replace(/\W/g, '') + "." + d.Country.replace(/\s+/g, '_'))
                .classed("selected", true)
            infoBox.transition()
                .duration(200)
                .style("opacity", .9);
            infoBox.html('<div class="tab-row"><div class="cell-right">Country:</div><div class="cell-left">' + d.Country + '</div></div><div class="tab-row"><div class="cell-right">Operator:</div><div class="cell-left">' + d.Operator + '</div></div><div class="tab-row"><div class="cell-right">Band:</div><div class="cell-left">' + d.Band + '</div></div><div class="tab-row"><div class="cell-right">Assignment:</div><div class="cell-left">' + totSpec.replace(/\s\+\s$/, '') + ' MHz</div></div><div class="tab-row"><div class="cell-right">Total:</div><div class="cell-left">' + f(sumSpec) + " MHz</div></div>")
                .style("left", x1800(d.freqStart) + 20 + "px")
                .style("top", y1800(d.Country) + y1800.bandwidth() + topOffset + margin1800.top + 5  + "px");
             console.log("d.Country: " + y1800(d.Country) + " y1800.bandwidth: " + y1800.bandwidth() + " topOffset: " + topOffset);  
        })
        .on("mouseout", function(d) {
            totSpec = "";
            sumSpec = 0;
            h.selectAll("." + d.Operator.replace(/\s+/g, '_').replace(/\W/g, '') + "." + d.Country.replace(/\s+/g, '_'))
                .classed("selected", false)
            infoBox.transition()
                .duration(500)
                .style("opacity", 0);
        });
});


function getTranslation(transform) {
    // Create a dummy g for calculation purposes only. This will never
    // be appended to the DOM and will be discarded once this function 
    // returns.
    var g = document.createElementNS("http://www.w3.org/2000/svg", "g");

    // Set the transform attribute to the provided string value.
    g.setAttributeNS(null, "transform", transform);

    // consolidate the SVGTransformList containing all transformations
    // to a single SVGTransform of type SVG_TRANSFORM_MATRIX and get
    // its SVGMatrix. 
    var matrix = g.transform.baseVal.consolidate().matrix;

    // As per definition values e and f are the ones for the translation.
    return [matrix.e, matrix.f];
}

/* wrap text function, taken from
   https://gist.github.com/ericsoco/647db6ebadd4f4756cae */

function wrap(text, width) {
    text.each(function() {
        var breakChars = ['/', '&', '-'],
            text = d3.select(this),
            textContent = text.text(),
            spanContent;
        breakChars.forEach(char => {
            // Add a space after each break char for the function to use to determine line breaks
            textContent = textContent.replace(char, char + ' ');
        });
        var words = textContent.split(/\s+/).reverse(),
            word,
            line = [],
            lineNumber = 0,
            lineHeight = 1.1, // ems
            x = text.attr('x'),
            y = text.attr('y'),
            dy = parseFloat(text.attr('dy') || 0),
            tspan = text.text(null).append('tspan').attr('x', x).attr('y', y).attr('dy', dy + 'em');
        while (word = words.pop()) {
            line.push(word);
            tspan.text(line.join(' '));
            if (tspan.node().getComputedTextLength() > width) {
                line.pop();
                spanContent = line.join(' ');
                breakChars.forEach(char => {
                    // Remove spaces trailing breakChars that were added above
                    spanContent = spanContent.replace(char + ' ', char);
                });
                tspan.text(spanContent);
                line = [word];
                tspan = text.append('tspan').attr('x', x).attr('y', y).attr('dy', ++lineNumber * lineHeight + dy + 'em').text(word);
            }
        }
    });
}