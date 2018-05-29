let infoBox = d3.select('.operatorTip');
let countryBox = d3.select('.countryTip');


let infoBox2 = d3.select('.operatorTip').node();
let infoBoxWidth = infoBox2.getBoundingClientRect().width;

let r = d3.format(".0f");
let f = d3.format(".1f");
let p = d3.format('.0%');

let totSpec = "";
let sumSpec = 0;
let numAssigns = 0;

/* Display 900MHz assignments */
/*      band, bandStart, bandEnd, guardStart, guardEnd  */
displayAssignments(900, 880, 960, 915, 925);
/* Display 1800MHz assignments */
displayAssignments(1800, 1710, 1880, 1784.8, 1805.2);
/* Display 2100MHz assignments */
displayAssignments(2100, 1920, 2170, 1980, 2110);
/* Display 2600MHz assignments */
displayAssignments(2600, 2500, 2690, 2570, 2620);

function displayAssignments(band, bandStart, bandEnd, guardStart, guardEnd) {
    // displayAssignments imports a csv file of spectrum assignments 
    // for a given frequency range and displays them as a chart

    let specID = "#MHz" + band,
        divID = "M" + band;
    let svgContainerDiv = document.getElementById(divID);

    let MHz = d3.select(specID),
        margin = { top: 60, right: 50, bottom: 30, left: 120 },
        width = +MHz.attr("width") - margin.left - margin.right,
        height = +MHz.attr("height") - margin.top - margin.bottom,
        availSpec = bandEnd - bandStart + guardStart - guardEnd,
        totSpec = "",
        sumSpec = 0,
        midRect = 0,
        freqMid = 0,
        freqRightMid = 0,
        freqLeftMid = 0,
        opLogo = "",
        cntryISO = "";

    let x = d3.scaleLinear().rangeRound([0, width]),
        y = d3.scaleBand().rangeRound([0, height]).padding(0.2);

    let h = MHz.append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    let guardBand = "";
    if (band == "2600") {
        guardBand = "TDD";
    } else if (band == "2100") {
        guardBand = "Guard Band?";
    } else {
        guardBand = "Guard Band";
    }

    /* Load data from freqAssignments.csv file */
    d3.csv('csv/freqAssignment.csv', function(error, freqData) {
        /* Load data from spectrumLicense.csv file */
        d3.csv('csv/spectrumLicense.csv', function(error, licData) {
            /* Load data from operators.csv file */
            d3.csv('csv/operator.csv', function(error, opData) {
                /* Load data from operators.csv file */
                d3.csv('csv/owner.csv', function(error, ownData) {
                    /* Load data from operators.csv file */
                    d3.csv('csv/shareholding.csv', function(error, shareData) {

                        freqData.forEach(function(d) {
                            d.ID = +d.ID;
                            d.license_ID = +d.license_ID;
                            d.freqStart = +d.freqStart;
                            d.freqEnd = +d.freqEnd;
                        });

                        licData.forEach(function(d) {
                            d.ID = +d.ID;
                            d.Operator_ID = +d.Operator_ID;
                        });

                        opData.forEach(function(d) {
                            d.ID = +d.ID;
                        });

                        ownData.forEach(function(d) {
                            d.ID = +d.ID;
                        });

                        shareData.forEach(function(d) {
                            d.ID = +d.ID;
                            d.Owner_ID = +d.Owner_ID;
                            d.Operator_ID = +d.Operator_ID;
                            d.SharePercent = +d.SharePercent;
                        });

                        /* perform outside join of spectrum license table (licData) with individual frequency assignment elements
                           of spectrum license in frequeny assignment table (freqData) */
                        var licenseJoin = join(licData, freqData, "ID", "license_ID", function(freq, lic) {
                            return {
                                freqStart: freq.freqStart,
                                freqEnd: freq.freqEnd,
                                freqSize: freq.freqEnd - freq.freqStart,
                                Country: (lic !== undefined) ? lic.Country : null,
                                Operator: (lic !== undefined) ? lic.Operator : null,
                                ISO: (lic !== undefined) ? lic.ISO : null,
                                Operator_ID: (lic !== undefined) ? lic.Operator_ID : null,
                                license_ID: (lic !== undefined) ? lic.ID : null,
                                Band: (lic !== undefined) ? lic.Band : null,
                                Type: (lic !== undefined) ? lic.Type : null

                            };
                        });

                        /* perform outside join of freqData and opData, bringing in URL, Previously and Wiki url fields*/
                        var operatorJoin = join(opData, licenseJoin, "ID", "Operator_ID", function(licJ, op) {
                            return {
                                Country: licJ.Country,
                                Operator: licJ.Operator,
                                ISO: licJ.ISO,
                                Operator_ID: licJ.Operator_ID,
                                Band: licJ.Band,
                                Type: licJ.Type,
                                license_ID: licJ.license_ID,
                                freqStart: licJ.freqStart,
                                freqEnd: licJ.freqEnd,
                                freqSize: licJ.freqSize,
                                URL: (op !== undefined) ? op.URL : null,
                                Previously: (op !== undefined) ? op.Previously : null,
                                Wiki: (op !== undefined) ? op.Wiki_URL : null
                            };
                        });
                        /* perform outside join on ownData and shareData linking investor names to their investments and shareholdings */
                        var ownership = join(ownData, shareData, "ID", "Owner_ID", function(share, own) {
                            return {
                                Percent: share.SharePercent,
                                Operator_ID: share.Operator_ID,
                                Owner_ID: share.Owner_ID,
                                OwnerName: (own !== undefined) ? own.Name : null,
                                OwnerURL: (own !== undefined) ? own.URL : null,
                            };
                        });

                        /* filter data to relevant selected frequency */
                        freqDataBand = operatorJoin.filter(function(d) { return d.Band == band });

                        /* Sort data by Country */
                        freqDataBand = freqDataBand.sort(function(a, b) {
                            return d3.ascending(a.Country, b.Country);
                        });


                        x.domain([bandStart, bandEnd]);
                        y.domain(freqDataBand.map(function(d) { return d.Country; }));

                        /* Set lower X-axis and legend */
                        h.append("g")
                            .attr("class", "axis axis--x")
                            .attr("transform", "translate(0," + height + ")")
                            .call(d3.axisBottom(x).ticks(20).tickSize(-height))
                            .append("text")
                            .attr("x", 20)
                            .attr("y", 30)
                            .text("Frequency (MHz)");

                        /* Set X-axis at top and add title/legend */
                        h.append("g")
                            .attr("class", "axis axis--x")
                            .call(d3.axisTop(x).ticks(20).tickSize(-height))
                            .append("text")
                            .classed("FreqLegend", true)
                            .attr("x", 20)
                            .attr("y", -30)
                            .text(band + " MHz Band");

                        /* Set Y-axis */
                        h.append("g")
                            .attr("class", "axis axis--y")
                            .call(d3.axisLeft(y))
                            .selectAll(".tick text")
                            .classed("countryStyle", true)

                        /*  Build mouseover infobox for each country in y axis legend */
                        h.selectAll(".axis--y .tick text")
                            .on("mouseover", function() {
                                totSpec = 0;
                                let myElement = d3.select(this);
                                let countryName = myElement.text();
                                /*  determine absolute coordinates for left edge of SVG */
                                let matrix = this.getScreenCTM()
                                    .translate(+this.getAttribute("cx"), +this.getAttribute("cy"));
                                h.selectAll("." + countryName.replace(/\s+/g, '_').replace(/'/g, "")).each(function(d) {
                                    totSpec += d.freqEnd;
                                    totSpec -= d.freqStart;
                                    sumSpec = sumSpec + d.freqEnd - d.freqStart;
                                    cntryISO = d.ISO;
                                });
                                let availPercent = totSpec / availSpec;

                                countryBox.transition()
                                    .duration(200)
                                    .style("opacity", .9);
                                let pnode = d3.select(this.parentNode).attr("transform");
                                /* console.debug(pnode);
                                console.log("y.bandwidth(): " + y.bandwidth()/2);
                                console.log("svgContainerDiv: " + svgContainerDiv.offsetTop);
                                console.log("window.pageXOffset: " + window.pageXOffset); */
                                let yText = getTranslation(d3.select(this.parentNode).attr("transform"));
                                countryBox.html('<table selected"><tbody><tr><td rowspan="3"><img src="flag/' + cntryISO + '.png"></td><td>' + countryName + '</td></tr><tr><td>' + r(totSpec) + ' MHz assigned out of ' + r(availSpec) + ' MHz available.</td></tr><tr><td><b>Band occupancy ' + p(availPercent) + '</td></tr></tbody></table>')
                                    /* countryBox.html('<table selected"><tbody><tr><th>' + opLogo + '</th><th><h1>' + d.Operator + '</h1></th></tr><tr><td>Band:</td><td>' + d.Band + '</td></tr><tr><td>Assignment:</td><td>' + totSpec.replace(/\s\+\s$/, '') + ' MHz</td></tr><tr><td>Total:</td><td>' + f(sumSpec) + " MHz</td><tr></tbody></table>") */

                                    .style("left", (window.pageXOffset + matrix.e) + "px")
                                    // .style("top", (svgContainerDiv.offsetTop + yText[1] - window.pageYOffset) + "px")
                                    .style('top', matrix.f - y.bandwidth() / 2 + 7 + 'px')
                                    .style("height", y.bandwidth() + "px")
                                    .style("width", width + "px");
                            })
                            .on("mouseout", function() {
                                countryBox.transition()
                                    .duration(500)
                                    .style("opacity", 0);
                            });

                        /* Add rectangles for guard bands */
                        h.selectAll("guard")
                            .data(freqDataBand)
                            .enter()
                            .append("g")
                            .attr("class", "guardbands")
                            .append("rect")
                            .attr("class", "guardband")
                            .attr("y", function(d) { return y(d.Country); })
                            .attr("x", x(guardStart))
                            .attr("width", function(d) { return x(guardEnd) - x(guardStart); })
                            .attr("height", y.bandwidth());

                        /* Add label to guardbands */
                        h.selectAll(".guardbands")
                            .append("text")
                            .attr("class", "label")
                            .attr('transform', 'rotate(-90)')
                            .attr("y", function(d) { return x(guardStart) + (x(guardEnd) - x(guardStart)) / 2 + 5; })
                            .attr("x", function(d) { return -y(d.Country) - y.bandwidth() + 10; })
                            .text(guardBand)
                            .call(wrap, y.bandwidth() - 10);

                        /* Iterate through csv file */
                        h.selectAll(".bar")
                            .data(freqDataBand)
                            .enter()
                            .append("g")
                            .attr("class", "bars")
                            .attr("data-toggle", "modal")
                            .attr("data-target", "#myModal")
                            .append("rect")
                            .attr("class", function(d) { return d.Operator.replace(/\s+/g, '_').replace(/\W/g, '') + " " + d.Country.replace(/\s+/g, '_').replace(/'/g, ""); })
                            .classed("bar", true)
                            .attr("y", function(d) { return y(d.Country); })
                            .attr("x", function(d) { return x(d.freqStart); })
                            .attr("width", function(d) { return x(d.freqEnd) - x(d.freqStart); })
                            .attr("height", y.bandwidth());

                        /* Add operator label to each spectrum assignment */
                        let bars = MHz.selectAll(".bars");
                        bars.append("text")
                            .attr("class", "label")
                            .attr('transform', 'rotate(-90)')
                            .attr("y", function(d) { return x(d.freqStart) + (x(d.freqEnd) - x(d.freqStart)) / 2 + 5; })
                            .attr("x", function(d) { return -y(d.Country) - y.bandwidth() + 10; })
                            .text(function(d) { return d.Operator; })
                            .call(wrap, y.bandwidth());

                        /* MHz ToolTip for each operator spectrum assignment */
                        bars.on("mouseover", function(d) {
                            /* calculate total spectrum assigned */
                            let infoB = h.selectAll("." + d.Operator.replace(/\s+/g, '_').replace(/\W/g, '') + "." + d.Country.replace(/\s+/g, '_').replace(/'/g, "")).each(function(d, i) {
                                totSpec = f(d.freqSize) + " + " + totSpec;
                                sumSpec = sumSpec + d.freqSize;
                                midRect = x(d.freqStart) + (x(d.freqEnd) - x(d.freqStart)) / 2;
                                /*  outline spectrum blocks  */
                                h.append("rect")
                                    .style("stroke", "black")
                                    .style("stroke-width", "2")
                                    .style("fill", "none")
                                    .style("stroke-linecap", "round")
                                    .style("stroke-linejoin", "round")
                                    .attr("class", "infoLine opData")
                                    .datum(d)
                                    .attr("y", y(d.Country))
                                    .attr("x", x(d.freqStart))
                                    .attr("width", x(d.freqEnd) - x(d.freqStart))
                                    .attr("height", y.bandwidth());
                                /*  background for frequency text   */
                                h.append("rect")
                                    .style("fill", "white")
                                    .attr("class", "infoLine")
                                    .style("opacity", .5)
                                    .attr("y", y(d.Country) + 3 )
                                    .attr("x", x(d.freqStart) + 1)
                                    .attr("width", x(d.freqEnd) - x(d.freqStart) - 2)
                                    .attr("height", 36);
                                /* add spectrum start freq */
                                h.append("text")
                                    .attr("class", "specInfo")
                                    .attr('transform', 'rotate(-90)')
                                    .attr("x", -y(d.Country) - 35)
                                    .attr("y", x(d.freqStart) +10)
                                    .text(d.freqStart);                                        
                                /* add spectrum stop freq */
                                h.append("text")
                                    .attr("class", "specInfo")
                                    .attr('transform', 'rotate(-90)')
                                    .attr("x", -y(d.Country) - 35)
                                    .attr("y", x(d.freqEnd) -5)
                                    .text(d.freqEnd);                                        
                                /* add short vertical lines under each block */
                                h.append("line")
                                    .style("stroke", "black")
                                    .style("stroke-width", "2")
                                    .style("stroke-linecap", "round")
                                    .style("stroke-linejoin", "round")
                                    .attr("class", "infoLine")
                                    .attr("x1", midRect)
                                    .attr("y1", y(d.Country) + y.bandwidth())
                                    .attr("x2", midRect)
                                    .attr("y2", y(d.Country) + y.bandwidth() + 10);
                                if (freqLeftMid > midRect || freqLeftMid === 0) freqLeftMid = midRect;
                                if (freqRightMid < midRect || freqRightMid === 0) freqRightMid = midRect;
                                freqMid = freqLeftMid + (freqRightMid - freqLeftMid) / 2;
                            });

                            // draw a horizontal line connecting the two spectrum blocks
                            h.append("line")
                                .style("stroke", "black")
                                .style("stroke-width", "2")
                                .style("stroke-linecap", "round")
                                .style("stroke-linejoin", "round")
                                .attr("class", "infoLine")
                                .attr("x1", freqLeftMid)
                                .attr("y1", y(d.Country) + y.bandwidth() + 10)
                                .attr("x2", freqRightMid)
                                .attr("y2", y(d.Country) + y.bandwidth() + 10);
                            /* add short vert line to connect to infoBox */
                            h.append("line")
                                .style("stroke", "black")
                                .style("stroke-width", "2")
                                .style("stroke-linecap", "round")
                                .style("stroke-linejoin", "round")
                                .attr("class", "infoLine")
                                .attr("x1", freqMid)
                                .attr("y1", y(d.Country) + y.bandwidth() + 12)
                                .attr("x2", freqMid)
                                .attr("y2", y(d.Country) + y.bandwidth() + 19);
                            /* add horizontal line connecting vert lines under blocks */
                            infoBox.transition()
                                .duration(200)
                                .style("opacity", 1);
                            /* note that there is a naming convention for the operator logos that must be followed */
                            opLogo = '<img src="operator-logo/' + d.ISO + '-' + d.Operator.replace(/\s+/g, '_').toLowerCase() + '.png">';
                            infoBox.html('<table class="operatorTip selected"><tbody><tr><th>' + opLogo + '</th><th><h1>' + d.Operator + '</h1></th></tr><tr><td>Band:</td><td>' + d.Band + '</td></tr><tr><td>Assignment (MHz):</td><td>' + totSpec.replace(/\s\+\s$/, '') + '</td></tr><tr><td>Total (MHz):</td><td>' + f(sumSpec) + "</td><tr></tbody></table>")
                                .style("left", freqMid + "px")
                                .style("top", y(d.Country) + y.bandwidth() + margin.top + svgContainerDiv.offsetTop + 25 + "px");
                        })
                        .on("mouseout", function(d) {
                            totSpec = "";
                            sumSpec = 0;
                            freqLeftMid = 0;
                            freqRightMid = 0;
                            freqMid = 0;
                            h.selectAll("line.infoLine").remove();
                            h.selectAll("rect.infoLine").remove();
                            h.selectAll("text.specInfo").remove();
                            h.selectAll("." + d.Operator.replace(/\s+/g, '_').replace(/\W/g, '') + "." + d.Country.replace(/\s+/g, '_').replace(/'/g, ""))
                                .classed("selected", false)
                            infoBox.transition()
                                .duration(500)
                                .style("opacity", 0);
                        });

                        // open modal dialogue on click
                        $('#myModal').on('show.bs.modal', function() {
                            let e = d3.select(".opData").data().pop();
                            let freqDataOperator = freqDataBand.filter(function(d) { return e.Operator_ID == d.Operator_ID });
                            let sharesHeld = ownership.filter(function(d) { return e.Operator_ID == d.Operator_ID });
                            let freqsHeld = operatorJoin.filter(function(d) { return e.Operator_ID == d.Operator_ID });
                            let opLicenses = d3.nest()
                                .key(function(d) { return d.Band; })
                                .entries(freqsHeld);
                            d3.selectAll('.opLogo').html('<img src="operator-logo/' + e.ISO + '-' + e.Operator.replace(/\s+/g, '_').toLowerCase() + '.png"> ');
                            let modalTitle = d3.selectAll("h2.modal-title");
                            modalTitle.html(e.Operator + '<br\>(' + e.Country + ')');
                            let modalBody = d3.selectAll(".modal-body");
                            modalBody.html('Country: ' + e.Country + '<br>Operator: ' + e.Operator + '<br>URL: <a href="' + e.URL + '">' + e.URL + '</a><br>Previously: ' + e.Previously + '<br>Wikipedia: <a href="' + e.Wiki + '">' + e.Wiki + '</a>');
                            modalBody.append('div').html("<b>Bands in which operator has a spectrum license</b>")
                            opLicenses.forEach(function(d) {
                                modalBody.append('div')
                                    .text(d.key + " MHz");
                            });
                            modalBody.append('div').html("<b>Ownership structure</b>")
                            sharesHeld.forEach(function(d) {
                                modalBody.append('div')
                                    .html('<a href="' + d.OwnerURL + '">' + d.OwnerName + "</a>: " + d.Percent + '%');
                            });
                        })
                    });
                });
            });
        });

    });
}

function cleanText() {
    var translate_re = /[öäüÖÄÜ]/g;
    var translate = {
        "ä": "a",
        "ö": "o",
        "ü": "u",
        "Ä": "A",
        "Ö": "O",
        "Ü": "U" // probably more to come
    };
    return function(s) {
        return (s.replace(translate_re, function(match) {
            return translate[match];
        }));
    }
};

/*  Perform an outer join on two arrays.
    Source"  http://learnjsdata.com/combine_data.html */
function join(lookupTable, mainTable, lookupKey, mainKey, select) {
    var l = lookupTable.length,
        m = mainTable.length,
        lookupIndex = [],
        output = [];
    for (var i = 0; i < l; i++) { // loop through l items
        var row = lookupTable[i];
        lookupIndex[row[lookupKey]] = row; // create an index for lookup table
    }
    for (var j = 0; j < m; j++) { // loop through m items
        var y = mainTable[j];
        var x = lookupIndex[y[mainKey]]; // get corresponding row from lookupTable
        output.push(select(y, x)); // select only the columns you need
    }
    return output;
};

/*  Create an html table from an array.
    Source:  http://www.d3noob.org/2013/02/add-html-table-to-your-d3js-graph.html
    format: tabulate(data, ["field1", "field3"]); */
function tabulate(data, columns) {
    var table = d3.select("body").append("table")
        .attr("style", "margin-left: 250px"),
        thead = table.append("thead"),
        tbody = table.append("tbody");

    // append the header row
    thead.append("tr")
        .selectAll("th")
        .data(columns)
        .enter()
        .append("th")
        .text(function(column) { return column; });

    // create a row for each object in the data
    var rows = tbody.selectAll("tr")
        .data(data)
        .enter()
        .append("tr");

    // create a cell in each row for each column
    var cells = rows.selectAll("td")
        .data(function(row) {
            return columns.map(function(column) {
                return { column: column, value: row[column] };
            });
        })
        .enter()
        .append("td")
        .attr("style", "font-family: Courier")
        .html(function(d) { return d.value; });

    return table;
}

function getTranslation(transform) {
    /* Create a dummy g for calculation purposes only. This will never
       be appended to the DOM and will be discarded once this function 
       returns.  */
    let g = document.createElementNS("http://www.w3.org/2000/svg", "g");

    /* Set the transform attribute to the provided string value. */
    g.setAttributeNS(null, "transform", transform);

    /* consolidate the SVGTransformList containing all transformations
       to a single SVGTransform of type SVG_TRANSFORM_MATRIX and get
       its SVGMatrix.  */
    let matrix = g.transform.baseVal.consolidate().matrix;

    /* As per definition values e and f are the ones for the translation. */
    return [matrix.e, matrix.f];
}

/* Text wrapping function */
/* Source: https://gist.github.com/ericsoco/647db6ebadd4f4756cae */
function wrap(text, width) {
    text.each(function() {
        let breakChars = ['/', '&', '-'],
            text = d3.select(this),
            textContent = text.text(),
            spanContent;
        breakChars.forEach(char => {
            /* Add a space after each break char for the function to use to determine line breaks */
            textContent = textContent.replace(char, char + ' ');
        });
        let words = textContent.split(/\s+/).reverse(),
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
            /* console.log("text:" + tspan.text() +" Length: " + tspan.node().getComputedTextLength());  */
            let tabs = d3.selectAll('div.tab-pane').classed('tab-pane', false).classed('fade', false);
            if (tspan.node().getComputedTextLength() > width) {
                line.pop();
                spanContent = line.join(' ');
                breakChars.forEach(char => {
                    /* Remove spaces trailing breakChars that were added above */
                    spanContent = spanContent.replace(char + ' ', char);
                });
                tspan.text(spanContent);
                line = [word];
                tspan = text.append('tspan').attr('x', x).attr('y', y).attr('dy', ++lineNumber * lineHeight + dy + 'em').text(word);
            }
            tabs.classed('tab-pane', true).classed('fade', true);
        }
    });
}