var svg = d3.select("svg"),
    margin = {top: 60, right: 50, bottom: 30, left: 90},
    width = +svg.attr("width") - margin.left - margin.right,
    height = +svg.attr("height") - margin.top - margin.bottom;

var x = d3.scaleLinear().rangeRound([0, width]),
    y = d3.scaleBand().rangeRound([0, height]).padding(0.1);

var g = svg.append("g")
    .attr("transform", "translate(" + margin.left  + "," + margin.top + ")");

var infoBox = d3.select("body").append("div")
    .attr("class", "tooltip")
    .style("opacity", 0);

var f = d3.format(".1f");

var totSpec = "";
var sumSpec = 0;

/* Load data file */
d3.csv("900MHz.csv", function(d) {
  d.freqStart = +d.freqStart;
  d.freqEnd = +d.freqEnd;
  return d;
}, function(error, data) {
  if (error) throw error;

  x.domain([d3.min(data, function(d) { return d.freqStart; }), d3.max(data, function(d) { return d.freqEnd; })]);
  y.domain(data.map(function(d) { return d.Country; }));

  /* Set lower X-axis and legend */
  g.append("g")
      .attr("class", "axis axis--x")
      .attr("transform", "translate(0," + height + ")")
      .call(d3.axisBottom(x).ticks(20).tickSize(-height))
    .append("text")
      .attr("x", 20)
      .attr("y", 30)
      .text("Frequency (MHz)");

  /* Set X-axis at top and add title/legend */
  g.append("g")
      .attr("class", "axis axis--x")
      .call(d3.axisTop(x).ticks(20).tickSize(-height))
    .append("text")
      .classed("FreqLegend", true)
      .attr("x", 20)
      .attr("y", -30)
      .text("900 MHz Band");
  
  /* Set Y-axis */
  g.append("g")
      .attr("class", "axis axis--y")
      .call(d3.axisLeft(y).tickSize(5))
    .selectAll(".tick text")
      .classed("countryName", true)
      .call(wrap, margin.left);

  /* Iterate through data file */
  g.selectAll(".bar")
    .data(data)
    .enter().append("g")
    .attr("class", "bars")
    .append("rect")
      .attr("class", function(d) { return d.Operator.replace(/\s+/g, '_').replace(/\W/g,'') + " " + d.Country.replace(/\s+/g, '_'); })
      .classed("bar", true)
      .attr("y", function(d) { return y(d.Country);    })
      .attr("x", function(d) { return x(d.freqStart); })
      .attr("width", function(d) { return x(d.freqEnd) - x(d.freqStart); })
      .attr("height", y.bandwidth());

    /*  Add label to each spectrum assignments */
    var bars = svg.selectAll(".bars");
    bars.append("text")
      .attr("class", "label")
      .attr('transform', 'rotate(-90)')
      .attr("y", function(d) { return x(d.freqStart) + (x(d.freqEnd) - x(d.freqStart))/2 + 5; })
      .attr("x", function(d) { return -y(d.Country) - y.bandwidth() + 10 ; })
      .text(function(d) { return d.Operator; })
      .call(wrap, y.bandwidth())

        /* ToolTip for spectrum assignments */  
    .on("mouseover", function(d) {
      /* calculate total spectrum assigned */
      g.selectAll("." + d.Operator.replace(/\s+/g, '_').replace(/\W/g,'') + "." + d.Country.replace(/\s+/g, '_')).each(function(d) {
        totSpec = f(d.freqEnd - d.freqStart) + " + " + totSpec;
        sumSpec = sumSpec + d.freqEnd - d.freqStart;
      });
      g.selectAll("." + d.Operator.replace(/\s+/g, '_').replace(/\W/g,'') + "." + d.Country.replace(/\s+/g, '_'))
      .classed("selected", true)
      infoBox.transition()
        .duration(200)
        .style("opacity", );
      infoBox.html('<div class="tab-row"><div class="cell-right">Country:</div><div class="cell-left">' + d.Country + '</div></div><div class="tab-row"><div class="cell-right">Operator:</div><div class="cell-left">' + d.Operator + '</div></div><div class="tab-row"><div class="cell-right">Band:</div><div class="cell-left">' + d.Band + '</div></div><div class="tab-row"><div class="cell-right">Assignment:</div><div class="cell-left">' + totSpec.replace(/\s\+\s$/, '') + ' MHz</div></div><div class="tab-row"><div class="cell-right">Total:</div><div class="cell-left">' + f(sumSpec) + " MHz</div></div>")
        .style("left", (svg.attr("width") - 20) + "px")
        .style("top", y(d.Country) + margin.top + "px");
      })
    .on("mouseout", function(d) {
      totSpec = "";
      sumSpec = 0;
       g.selectAll("." + d.Operator.replace(/\s+/g, '_').replace(/\W/g,'') + "." + d.Country.replace(/\s+/g, '_'))
       .classed("selected", false)
       infoBox.transition()
         .duration(500)
         .style("opacity", 0);
       });  
});

/*  Wrap text function  */

function wrap (text, width) {

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