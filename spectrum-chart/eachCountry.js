const infoBox = d3.select('.operatorTip');

const r = d3.format('.0f');
const f = d3.format('.1f');
const p = d3.format('.0%');
const dropdownISO = 'BW';
const countryList = [];

/* Create list of countries */
/* Load data from operators_sql.csv file */
// d3.csv('csv/operators_sql.csv',d3.autoType).then(function (opData) {
//   /* Load data from countries.csv file */
//   d3.csv('csv/country.csv',d3.autoType).then(function (countryData) {
//     // only capture unique countries
//     const uniqueCountries = d3.map(opData, (d) => (d.Country_ID)).keys();
//     countryData = d3.map(countryData, (d) => (d.ID));
//     // create array of countrie ISO, Name, and Region
//     uniqueCountries.forEach((cntryID) => {
//       countryList.push([countryData.get(cntryID).ID, countryData.get(cntryID).ISO, countryData.get(cntryID).CountryName, countryData.get(cntryID).Region]);
//     });
//     /* sort countries alphabetically */
//     countryList.sort((a, b) => d3.ascending(a[0], b[0]));

//     // Handler for dropdown value change
//     const dropdownChange = function () {
//       const newCountryISO = d3.select(this).property('value');

//       // updateBars(newData);
//     };

//     const dropdown = d3.select('#dropDown')
//       .insert("select", "svg")
//       .on('change', dropdownChange);

//     dropdown.selectAll('option')
//       .data(countryList)
//       .enter().append('option')
//       .attr('value', (d) => d[1])
//       .text((d) => d[2])

//   });
// });


d3.csv('csv/freqAssignment_sql.csv',d3.autoType).then(function (freqData) {
  /* Load data from spectrumLicense.csv file */
  d3.csv('csv/spectrumLicense_sql.csv',d3.autoType).then(function (licData) {
    /* Load data from operators.csv file */
    d3.csv('csv/operators_sql.csv',d3.autoType).then(function (opData) {
      /* Load data from operators.csv file */
      d3.csv('csv/owner_sql.csv',d3.autoType).then(function (ownData) {
        /* Load data from operators.csv file */
        d3.csv('csv/shareHolding_sql.csv',d3.autoType).then(function (shareData) {
          /* Load data from countries.csv file */
          d3.csv('csv/country.csv',d3.autoType).then(function (countryData) {
            /* Load data from freqBands.csv file */
            d3.csv('csv/freqBands_sql.csv',d3.autoType).then(function (bandData) {




              opData = opData.map((v) => { v.Operator_DOM = `AA_${String(v.Operator)}`; return v; });

              /* perform join of countries to Operators */
              const OperatorCountryJoin = join(countryData, opData, 'ID', 'Country_ID', (op, cnt) => ({
                Operator_ID: op.ID,
                Operator: op.Operator,
                Operator_DOM: op.Operator_DOM,
                Country: (cnt !== undefined) ? cnt.CountryName : null,
                ISO: (cnt !== undefined) ? cnt.ISO : null,
                URL: op.URL,
                Previously: op.Previously,
                Wiki_URL: op.Wiki_URL,
                OperatorType: op.OperatorType,
                StockExchange: op.StockExchange,
                StockSymbol: op.StockSymbol,
              }));

              /* perform 1st join of countries to Licenses */
              const LicenseCountryJoinTmp = join(OperatorCountryJoin, licData, 'Operator_ID', 'Operator_ID', (lic, op) => ({
                ID: lic.ID,
                Country: (op !== undefined) ? op.Country : null,
                ISO: (op !== undefined) ? op.ISO : null,
                Operator: (op !== undefined) ? op.Operator : null,
                Operator_DOM: (op !== undefined) ? op.Operator_DOM : null,
                Operator_ID: lic.Operator_ID,
                licStartYear: lic.licStartYear,
                licEndYear: lic.licEndYear,
                Band_ID: lic.Band_ID,
              }));

              const LicenseCountryJoin = join(bandData, LicenseCountryJoinTmp, 'ID', 'Band_ID', (lic, bnd) => ({
                ID: lic.ID,
                Country: lic.Country,
                ISO: lic.ISO,
                Operator: lic.Operator,
                Operator_DOM: lic.Operator_DOM,
                Operator_ID: lic.Operator_ID,
                Band: (bnd !== undefined) ? bnd.band : null,
                Type: (bnd !== undefined) ? bnd.Type : null,
              }));

              /* perform outside join of spectrum license table (licData)
                 with individual frequency assignment elements
                 of spectrum license in frequeny assignment table (freqData) */
              const licenseJoin = join(LicenseCountryJoin, freqData, 'ID', 'license_ID', (freq, lic) => ({
                freqStart: freq.freqStart,
                freqEnd: freq.freqEnd,
                freqSize: freq.freqEnd - freq.freqStart,
                Country: (lic !== undefined) ? lic.Country : null,
                Operator: (lic !== undefined) ? lic.Operator : null,
                Operator_DOM: (lic !== undefined) ? lic.Operator_DOM : null,
                ISO: (lic !== undefined) ? lic.ISO : null,
                Operator_ID: (lic !== undefined) ? lic.Operator_ID : null,
                license_ID: (lic !== undefined) ? lic.ID : null,
                Band: (lic !== undefined) ? lic.Band : null,
                Type: (lic !== undefined) ? lic.Type : null,
              }));

              /* perform outside join of freqData and opData, bringing in URL, Previously and Wiki url fields */
              /* this is the core table used to populate the graph */
              const operators = join(OperatorCountryJoin, licenseJoin, 'Operator_ID', 'Operator_ID', (licJ, op) => ({
                Country: licJ.Country,
                Operator: licJ.Operator,
                Operator_DOM: licJ.Operator_DOM,
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
                Wiki: (op !== undefined) ? op.Wiki_URL : null,
              }));
              /* filter operators to country selected in dropdown */
              // console.log(dropdownISO);
              // var countryOperators =  operatorJoin.filter((d) => d.ISO == dropdownISO);

              // join ownData & shareData linking investor names to investments/shareholdings
              const ownership = join(ownData, shareData, 'ID', 'Owner_ID', (share, own) => ({
                Percent: share.SharePercent,
                Operator_ID: share.Investment_ID,
                Owner_ID: share.Owner_ID,
                OwnerName: (own !== undefined) ? own.Name : null,
                OwnerURL: (own !== undefined) ? own.URL : null,
              }));

              // only capture unique countries
              const uniqueCountries = d3.map(opData, (d) => (d.Country_ID)).keys();
              countryData = d3.map(countryData, (d) => (d.ID));
              // create array of countrie ISO, Name, and Region
              uniqueCountries.forEach((cntryID) => {
                countryList.push([countryData.get(cntryID).ID, countryData.get(cntryID).ISO, countryData.get(cntryID).CountryName, countryData.get(cntryID).Region]);
              });
              /* sort countries alphabetically */
              countryList.sort((a, b) => d3.ascending(a[0], b[0]));

              // Handler for dropdown value change
              const dropdownChange = function () {
                const newCountryISO = d3.select(this).property('value');
                console.log("newcountryISO");
                console.log(newCountryISO);
                var svgBands = d3.selectAll('svgBand');
                svgBands.remove();
                d3.select('#svg800').remove();
                d3.select('#svg900').remove();
                d3.select('#svg1800').remove();
                displayAssignments(800, 790, 862, 821, 832, operators, newCountryISO);
                displayAssignments(900, 880, 960, 915, 925, operators, newCountryISO);
                displayAssignments(1800, 1710, 1880, 1784.8, 1805.2, operators, newCountryISO);                

                // updateBars(newData);
              };

              const dropdown = d3.select('#dropDown')
                .insert("select", "svg")
                .on('change', dropdownChange);

              dropdown.selectAll('option')
                .data(countryList)
                .enter().append('option')
                .attr('value', (d) => d[1])
                .text((d) => d[2])






              /* Display 800MHz assignments */
              /* variables: band, bandStart, bandEnd, guardStart, guardEnd, band data  */
              displayAssignments(800, 790, 862, 821, 832, operators, dropdownISO);
              /* Display 900MHz assignments */
              displayAssignments(900, 880, 960, 915, 925, operators, dropdownISO);
              // /* Display 1800MHz assignments */
              displayAssignments(1800, 1710, 1880, 1784.8, 1805.2, operators, dropdownISO);
              // // /* Display 2100MHz assignments */
              displayAssignments(2100, 1920, 2170, 1980, 2110, operators, dropdownISO);
              // // /* Display 2600MHz assignments */
              displayAssignments(2600, 2500, 2690, 2570, 2620, operators, dropdownISO);  
            });
          });
        });
      });
    });
  });
});


function displayAssignments(band, bandStart, bandEnd, guardStart, guardEnd, operators, ISO) {
  // displayAssignments imports a csv file of spectrum assignments
  // for a given frequency range and displays them as a chart

  /* filter data to relevant selected frequency and country */
  var freqDataBand =  operators.filter((d) => d.Band == band && d.ISO == ISO);
  const bandID = `#M${band}`;
  const svgID =  `svg${band}`;
  const margin = {
    top: 60, right: 50, bottom: 30, left: 120 
  };
  
  const width = 1200 - margin.left - margin.right;
  const height = 300 - margin.top - margin.bottom;
  let totSpec = '';
  let sumSpec = 0;
  let midRect = 0;
  let freqMid = 0;
  let freqRightMid = 0;
  let freqLeftMid = 0;
  let opLogo = '';

  let guardBand = '';
  if (band == '2600') {
    guardBand = 'TDD';
  } else if (band == '2100') {
    guardBand = 'Guard Band?';
  } else {
    guardBand = 'Guard Band';
  }

  var h = d3.select(bandID)
    .append("div")
    .append("svg")
    .attr("id", svgID)
    .attr("class", "svgBand")
    .attr("width", 1400)
    .attr("height", 300)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");    

  // set the domain and ranges for x and y
  var x = d3.scaleLinear()
    .domain([bandStart, bandEnd])
    .rangeRound([0, width]);

  var y = d3.scaleBand()
    .domain(['GH'])
    .range([0,height])
    .padding(0.2);

  /* Set X-axis at top and add title/legend */
  h.append('g')
    .attr('class', 'axis axis--x')
    .call(d3.axisTop(x).ticks(20).tickSize(-height))
    .append('text')
    .classed('FreqLegend', true)
    .attr('x', 20)
    .attr('y', -30)
    .text(`${band} MHz Band`);

  /* Set lower X-axis and legend */
  h.append('g')
    .attr('class', 'axis axis--x')
    .attr('transform', `translate(0,${height})`)
    .call(d3.axisBottom(x).ticks(20).tickSize(-height))
    .append('text')
    .attr('x', 20)
    .attr('y', 30)
    .text('Frequency (MHz)');

  /* Add the frequency assignments */
  console.log(freqDataBand);
  h.selectAll('.bar')
    .data(freqDataBand)
    .enter()
    .append('g')
    .attr('class', 'bars')
    .attr('data-toggle', 'modal')
    .attr('data-target', '#myModal')
    .append('rect')
    .attr('class', (d) => `${d.Operator_DOM.replace(/\s+/g, '_').replace(/\W/g, '')} ${d.Country.replace(/\s+/g, '_').replace(/'/g, '')}`)
    .classed('bar', true)
    .attr('y', (d) => y('GH'))
    .attr('x', (d) => x(d.freqStart))
    .attr('width', (d) => x(d.freqEnd) - x(d.freqStart))
    .attr('height', y.bandwidth());

  /* Add operator label to each spectrum assignment */
  const bars = h.selectAll('.bars');
  bars.append('text')
    .attr('class', 'label')
    .attr('transform', 'rotate(-90)')
    .attr('y', (d) => x(d.freqStart) + (x(d.freqEnd) - x(d.freqStart)) / 2 + 5)
    .attr('x', (d) => -y('GH') - y.bandwidth() + 10)
    .text((d) => d.Operator);
    // .call(wrap, y.bandwidth());

  /* Add rectangles for guard bands */
  h.selectAll('guard')
    .data(freqDataBand)
    .enter()
    .append("g")
    .attr("class", "guardbands")
    .append('rect')
    .attr('class', 'guardband')
    .attr("y", function (d) {
        return y('GH');
    })
    .attr("x", x(guardStart))
    .attr("width", function (d) {
        return x(guardEnd) - x(guardStart);
    })
    .attr("height", y.bandwidth());

  /* Add label to guardbands */
  h.selectAll('.guardbands')
    .append('text')
    .attr('class', 'label')
    .attr('transform', 'rotate(-90)')
    .attr('y', (d) => x(guardStart) + (x(guardEnd) - x(guardStart)) / 2 + 5)
    .attr('x', (d) => -y('GH') - y.bandwidth() + 10)
    .text(guardBand);


  /* MHz ToolTip for each operator spectrum assignment */
  bars.on('mouseover', (d) => {
    /* calculate total spectrum assigned */
    const infoB = h.selectAll(`.${d.Operator_DOM.replace(/\s+/g, '_')
      .replace(/\W/g, '')}.${d.Country.replace(/\s+/g, '_')
      .replace(/'/g, '')}`).each((d, i) => {
      totSpec = `${f(d.freqSize)} + ${totSpec}`;
      sumSpec += d.freqSize;
      midRect = x(d.freqStart) + (x(d.freqEnd) - x(d.freqStart)) / 2;
      /*  outline spectrum blocks  */
      h.append('rect')
        .style('stroke', 'black')
        .style('stroke-width', '2')
        .style('fill', 'none')
        .style('stroke-linecap', 'round')
        .style('stroke-linejoin', 'round')
        .attr('class', 'infoLine opData')
        .datum(d)
        .attr('y', y('GH'))
        .attr('x', x(d.freqStart))
        .attr('width', x(d.freqEnd) - x(d.freqStart))
        .attr('height', y.bandwidth());
      /*  background for frequency text   */
      h.append('rect')
        .style('fill', 'white')
        .attr('class', 'infoLine')
        .style('opacity', 0.5)
        .attr('y', y('GH') + 3)
        .attr('x', x(d.freqStart) + 1)
        .attr('width', x(d.freqEnd) - x(d.freqStart) - 2)
        .attr('height', 36);
      /* add spectrum start freq */
      h.append('text')
        .attr('class', 'specInfo')
        .attr('transform', 'rotate(-90)')
        .attr('x', -y('GH') - 35)
        .attr('y', x(d.freqStart) + 10)
        .text(d.freqStart);
      /* add spectrum stop freq */
      h.append('text')
        .attr('class', 'specInfo')
        .attr('transform', 'rotate(-90)')
        .attr('x', -y('GH') - 35)
        .attr('y', x(d.freqEnd) - 5)
        .text(d.freqEnd);
      /* add short vertical lines under each block */
      h.append('line')
        .style('stroke', 'black')
        .style('stroke-width', '2')
        .style('stroke-linecap', 'round')
        .style('stroke-linejoin', 'round')
        .attr('class', 'infoLine')
        .attr('x1', midRect)
        .attr('y1', y('GH') + y.bandwidth())
        .attr('x2', midRect)
        .attr('y2', y('GH') + y.bandwidth() + 10);
      if (freqLeftMid > midRect || freqLeftMid === 0) freqLeftMid = midRect;
      if (freqRightMid < midRect || freqRightMid === 0) freqRightMid = midRect;
      freqMid = freqLeftMid + (freqRightMid - freqLeftMid) / 2;
    });

    // draw a horizontal line connecting the two spectrum blocks
    h.append('line')
      .style('stroke', 'black')
      .style('stroke-width', '2')
      .style('stroke-linecap', 'round')
      .style('stroke-linejoin', 'round')
      .attr('class', 'infoLine')
      .attr('x1', freqLeftMid)
      .attr('y1', y('GH') + y.bandwidth() + 10)
      .attr('x2', freqRightMid)
      .attr('y2', y('GH') + y.bandwidth() + 10);
    /* add short vert line to connect to infoBox */
    h.append('line')
      .style('stroke', 'black')
      .style('stroke-width', '2')
      .style('stroke-linecap', 'round')
      .style('stroke-linejoin', 'round')
      .attr('class', 'infoLine')
      .attr('x1', freqMid)
      .attr('y1', y('GH') + y.bandwidth() + 12)
      .attr('x2', freqMid)
      .attr('y2', y('GH') + y.bandwidth() + 19);
    /* add horizontal line connecting vert lines under blocks */
    infoBox.transition()
      .duration(200)
      .style('opacity', 1);
    /* note that there is a naming convention for the operator logos that must be followed */
    opLogo = `<img src="operator-logo/${d.ISO.toLowerCase()}-${d.Operator.replace(/\s+/g, '_').toLowerCase()}.png">`;
    //  draw mouseover box
    let svgContainerDiv = document.getElementById(`M${band}`);
    console.log(svgContainerDiv);
    infoBox.html(`<table class="operatorTip selected"><tbody><tr><th>${opLogo}</th><th><h1>${d.Operator}</h1></th></tr><tr><td>Band:</td><td>${d.Band}</td></tr><tr><td>Assignment (MHz):</td><td>${totSpec.replace(/\s\+\s$/, '')}</td></tr><tr><td>Total (MHz):</td><td>${f(sumSpec)}</td><tr></tbody></table>`)
      .style('left', svgContainerDiv.ofsetLeft + svgContainerDiv.offsetWidth/5  + "px")
      .style('top', svgContainerDiv.offsetTop + y.bandwidth()*2 + "px")
      .style('width', svgContainerDiv.offsetWidth/2 + "px");
  })
    .on('mouseout', (d) => {
      totSpec = '';
      sumSpec = 0;
      freqLeftMid = 0;
      freqRightMid = 0;
      freqMid = 0;
      h.selectAll('line.infoLine').remove();
      h.selectAll('rect.infoLine').remove();
      h.selectAll('text.specInfo').remove();
      h.selectAll(`.${d.Operator.replace(/\s+/g, '_').replace(/\W/g, '')}.${'GH'.replace(/\s+/g, '_').replace(/'/g, '')}`)
        .classed('selected', false);
      infoBox.transition()
        .duration(500)
        .style('opacity', 0);
    });

  // open modal dialogue on click
  $('#myModal').on('show.bs.modal', () => {
    const e = d3.select('.opData').data().pop();
    const freqDataOperator = freqDataBand.filter((d) => e.Operator_ID == d.Operator_ID);
    const sharesHeld = ownership.filter((d) => e.Operator_ID == d.Operator_ID);
    const freqsHeld = operatorJoin.filter((d) => e.Operator_ID == d.Operator_ID);
    const opLicenses = d3.nest()
      .key((d) => d.Band)
      .entries(freqsHeld);
    d3.selectAll('.opLogo').html(`<img src="operator-logo/${e.ISO.toLowerCase()}-${e.Operator.replace(/\s+/g, '_').toLowerCase()}.png"> `);
    const modalTitle = d3.selectAll('h2.modal-title');
    modalTitle.html(`${e.Operator}<br\>(${e.Country})`);
    const modalBody = d3.selectAll('.modal-body');
    modalBody.html(`Country: ${e.Country}<br>Operator: ${e.Operator}<br>URL: <a href="${e.URL}">${e.URL}</a><br>Previously: ${e.Previously}<br>Wikipedia: <a href="${e.Wiki}">${e.Wiki}</a>`);
    modalBody.append('div').html('<b>Bands in which operator has a spectrum license</b>');
    opLicenses.forEach((d) => {
      modalBody.append('div')
        .text(`${d.key} MHz`);
    });
    modalBody.append('div').html('<b>Ownership structure</b>');
    sharesHeld.forEach((d) => {
      modalBody.append('div')
        .html(`<a href="${d.OwnerURL}">${d.OwnerName}</a>: ${d.Percent}%`);
    });
  });
}

function cleanText() {
  const translate_re = /[öäüÖÄÜ]/g;
  const translate = {
    ä: 'a',
    ö: 'o',
    ü: 'u',
    Ä: 'A',
    Ö: 'O',
    Ü: 'U', // probably more to come
  };
  return function (s) {
    return (s.replace(translate_re, (match) => translate[match]));
  };
}

/*  Perform an outer join on two arrays.
    Source"  http://learnjsdata.com/combine_data.html */
function join(lookupTable, mainTable, lookupKey, mainKey, select) {
  const l = lookupTable.length;
  const m = mainTable.length;
  const lookupIndex = [];
  const output = [];
  for (let i = 0; i < l; i++) { // loop through l items
    const row = lookupTable[i];
    lookupIndex[row[lookupKey]] = row; // create an index for lookup table
  }
  for (let j = 0; j < m; j++) { // loop through m items
    const y = mainTable[j];
    const x = lookupIndex[y[mainKey]]; // get corresponding row from lookupTable
    output.push(select(y, x)); // select only the columns you need
  }
  return output;
}

/*  Create an html table from an array.
    Source:  http://www.d3noob.org/2013/02/add-html-table-to-your-d3js-graph.html
    format: tabulate(data, ["field1", "field3"]); */
function tabulate(data, columns) {
  const table = d3.select('body').append('table')
    .attr('style', 'margin-left: 250px');
  const thead = table.append('thead');
  const tbody = table.append('tbody');

  // append the header row
  thead.append('tr')
    .selectAll('th')
    .data(columns)
    .enter()
    .append('th')
    .text((column) => column);

  // create a row for each object in the data
  const rows = tbody.selectAll('tr')
    .data(data)
    .enter()
    .append('tr');

  // create a cell in each row for each column
  const cells = rows.selectAll('td')
    .data((row) => columns.map((column) => ({ column, value: row[column] })))
    .enter()
    .append('td')
    .attr('style', 'font-family: Courier')
    .html((d) => d.value);

  return table;
}

function getTranslation(transform) {
  /* Create a dummy g for calculation purposes only. This will never
       be appended to the DOM and will be discarded once this function
       returns.  */
  const g = document.createElementNS('http://www.w3.org/2000/svg', 'g');

  /* Set the transform attribute to the provided string value. */
  g.setAttributeNS(null, 'transform', transform);

  /* consolidate the SVGTransformList containing all transformations
       to a single SVGTransform of type SVG_TRANSFORM_MATRIX and get
       its SVGMatrix.  */
  const { matrix } = g.transform.baseVal.consolidate();

  /* As per definition values e and f are the ones for the translation. */
  return [matrix.e, matrix.f];
}

/* Text wrapping function */
/* Source: https://gist.github.com/ericsoco/647db6ebadd4f4756cae */
function wrap(text, width) {
  text.each(function () {
    const breakChars = ['/', '&', '-'];
    const text = d3.select(this);
    let textContent = text.text();
    let spanContent;
    breakChars.forEach((char) => {
      /* Add a space after each break char for the function to use to determine line breaks */
      textContent = textContent.replace(char, `${char} `);
    });
    const words = textContent.split(/\s+/).reverse();
    let word;
    let line = [];
    let lineNumber = 0;
    const x = text.attr('x');
    const y = text.attr('y');
    const dy = parseFloat(text.attr('dy') || 0);
    let tspan = text.text(null).append('tspan').attr('x', x).attr('y', y)
      .attr('dy', `${dy}em`);
    while (word == words.pop()) {
      line.push(word);
      tspan.text(line.join(' '));
      /* console.log("text:" + tspan.text() +" Length: " + tspan.node().getComputedTextLength());  */
      const tabs = d3.selectAll('div.tab-pane').classed('tab-pane', false).classed('fade', false);
      if (tspan.node().getComputedTextLength() > width) {
        line.pop();
        spanContent = line.join(' ');
        breakChars.forEach((char) => {
          /* Remove spaces trailing breakChars that were added above */
          spanContent = spanContent.replace(`${char} `, char);
        });
        tspan.text(spanContent);
        line = [word];
        ++lineNumber;
        // console.log("lineNumber: " + lineNumber + "and y:" + y);
        tspan = text.append('tspan').attr('x', x).attr('y', parseInt(y) + lineNumber * 12).attr('dy', `${dy}em`)
          .text(word);
      }
      tabs.classed('tab-pane', true).classed('fade', true);
    }
  });
}


// // handle on click event
// d3.select('#dropDown')
//   .on('change', function() {
//     var newData = eval(d3.select(this).property('value'));
//     console.log("newData")
//     console.log(newData);
//     //updateLegend(newData);
// });
