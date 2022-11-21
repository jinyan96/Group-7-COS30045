// Initialise Global Variables
const year = document.getElementById("year");
const yearLabel = document.getElementById("yearLabel");
const playButton = document.getElementById("plause");
const regionSelector = document.getElementById("countrySelector");
const chart1 = document.getElementById("primaryChart");
const chart2 = document.getElementById("secondaryChart");
const chart2Heading = document.getElementById("secondaryChartTitle");
const chartShare = document.getElementById("shareChart");
const chartShareHeading = document.getElementById("shareChartHeading");
const chartConsumption = document.getElementById("consumptionChart");
const legendConsumption = document.getElementById("consumptionLegend")
const chartHeight = 500;
let activeRegion = "Europe";


function init() {
//Choropleth       
drawChoropleth("1965");

///Stacked Bar Chart
// set the dimensions and margins of the graph
const margin = {top: 10, right: 30, bottom: 20, left: 50},
    width = 1000 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;

var svg = d3.select("#barchart")
            .append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom+50)
    g = svg.append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")");

/*
 * Scale for bar widths.
 */
var x = d3.scaleBand()
    .rangeRound([0, width])
    .padding(0.1)
    .align(0.1);

/*
 * Scale for bar heights.
 */
var y = d3.scaleLinear()
    .rangeRound([height, 0]);

/*
 * Scale for fill color of the categorical data (age groups).
 */
var colorScale = d3.scaleOrdinal()
                  .range(['#008837','#f0544f','#7b3294']);

var columns,
    numStates,
  stack,
  layers,
  yGroupMax,
  yStackMax,
  rect;

/*
 * Create request for CSV-data, and then process the response.
 */
d3.csv("./datasets/Type_of_Powerplant_by_Country.csv", addTotalsColumn, function(error, data) {
  if (error) throw error;

  data.sort(function(a, b) { return b.total - a.total; });
  
  columns = data.columns.slice(1);
  numStates = data.length;
  stack = d3.stack().keys(columns);
  
  layers = stack(data).map(function (layer) { return layer.map(function(e, i) {
      return { countrycode: e.data.countrycode, 
               x: i,
             y: e.data[layer.key],
         type: layer.key,
         total: e.data.total };
    });
  });
  for (s = 0; s < numStates; ++s) {
    var y0 = 0;
    for (ag = 0; ag < columns.length; ++ag) {
      var e = layers[ag][s];
      e.y0 = y0;
      y0 += e.y;
    }
  }

  /*
   * Calculate the maximum of the total populations,
   * and the maximum of the age groups.
   */
  yGroupMax = d3.max(layers, function(layer) { return d3.max(layer, function(d) { return d.y }); });
  yStackMax = d3.max(layers, function(layer) { return d3.max(layer, function(d) { return d.y0 + d.y; }); });

/*
   * Set the domains for the x-, y-axis and categorical color scales.
   */
  x.domain(data.map(function(d) { return d.countrycode; }));
  y.domain([0, d3.max(data, function(d) { return d.total; })]).nice();
  colorScale.domain(data.columns.slice(1));

  /*
   * Render the bars.
   */
  g.selectAll(".serie")
    .data(layers)
    .enter().append("g")
      .attr("class", "serie")
      .attr("fill", function(d) { return colorScale(d[0].type); })
    .selectAll("rect")
    .data(function(d) { return d; })
    .enter().append("rect")
      .attr("x", function(d) { return x(d.countrycode); })
      .attr("y", height)
      .attr("width", x.bandwidth())
      .attr("height", 0);

  rect = g.selectAll("rect");

  /*
   * Initial animation to gradually "grow" the bars from the x-axis.
   */
  rect.transition()
      .delay(function(d, i) { return i; })
      .attr("y", function(d) { return y(d.y0 + d.y) })
      .attr("height", function(d) { return y(d.y0) - y(d.y0 + d.y) });

   /*
   * Add SVG title elements for each age group bar segment.
   */
  rect.append("svg:title")
      .text(function(d) { return d.countrycode+", "+d.type+": "+d.y+" (total: "+d.total+")"; });

  /*
   * X-axis set-up and y-axis
   */
  g.append("g")
      .attr("class", "axisWhite")
      .attr("transform", "translate(0," + height + ")")
      .call(d3.axisBottom(x));

  g.append("g")
    .attr("class","axisWhite")
    .call(d3.axisLeft(y));

  /*
   * Add labels to the axes.
   */
  svg.append("text")
   .attr("text-anchor", "middle")
   .attr("transform", "translate("+(width/2)+","+(height+60)+")")
   .attr("fill","red")
   .text("Country");

  svg.append("text")
   .attr("text-anchor", "middle")
   .attr("transform", "translate(0,"+(height/2)+")rotate(-90)")
   .attr("dy", "20.0")
   .attr("fill","Red")
     .text("Number of Plant"); 

  /*
   * Set up the legend explaning the group categories.
   */
  var legend = g.selectAll(".legend")
    .data(data.columns.slice(1).reverse())
    .enter().append("g")
      .attr("class", "legend")
      .attr("transform", function(d, i) { return "translate(0," + (i*20) + ")"; });

  legend.append("rect")
      .attr("x", width - 38)
      .attr("width", 18)
      .attr("height", 18)
      .attr("fill", colorScale);

  legend.append("text")
      .attr("x", width - 44)
      .attr("y", 9)
      .attr("dy", ".35em")
      .attr("fill","white")
      .attr("text-anchor", "end")
      .text(function(d) { return d; });
});

/*
 * Sort the rows of the CSV response in descending order.
 */
function addTotalsColumn(d, i, columns) {
  for (i = 1, t = 0; i < columns.length; ++i) t += d[columns[i]] = +d[columns[i]];
  d.total = t;
  return d;
}

d3.selectAll("input").on("change", change);

function change() {
  if (this.value === "grouped") transitionGrouped();
  else transitionStacked();
}

/*
 * Reset the domain for the y-axis scaling to maximum of the group totals,
 * transition the x-axis changes to the bar widths, and then transition the
 * y-axis changes to the bar heights.
 */
function transitionGrouped() {
  y.domain([0, yGroupMax]);

  rect.transition()
      .duration(500)
      .delay(function(d, i) { return i; })
        .attr("x", function(d) { return x(d.countrycode) + 0.5 + columns.indexOf(d.type)*(x.bandwidth()/columns.length); })
        .attr("width", x.bandwidth() / columns.length)
      .transition()
         .attr("y", function(d) { return y(d.y); })
         .attr("height", function(d) { return height - y(d.y); });
}

/*
 * Reset the domain for the y-axis scaling to maximum of the population totals,
 * transition the y-axis changes to the bar heights, and then transition the
 * x-axis changes to the bar widths.
 */
function transitionStacked() {
  y.domain([0, yStackMax]);

  rect.transition()
      .duration(500)
      .delay(function(d, i) { return i; })
        .attr("y", function(d) { return y(d.y0 + d.y); })
        .attr("height", function(d) { return y(d.y0) - y(d.y0 + d.y); })
      .transition()
        .attr("x", function(d) { return x(d.countrycode); })
        .attr("width", x.bandwidth());
}


//Line Chart
// append the svg object to the body of the page
// set the dimensions and margins of the graph

// append the svg object to the body of the page
var svg2 = d3.select("#my_dataviz")
  .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom+50)
  .append("g")
    .attr("transform",
          "translate(" + margin.left + "," + margin.top + ")");

//Read the data
d3.csv("./datasets/Installed_Capacity_Pumping_Capacity_by_Country.csv", function(data) {
    
    // List of groups = species here = value of the first column called group -> I show them on the X axis
    var groups = data.map(d => (d.countrycode))
    // List of groups (here I have one group per column)
    var allGroup = ["Installed_capacity", "Pumping_capacity"]

    // add the options to the button
    d3.select("#selectButton")
      .selectAll('myOptions')
      .data(allGroup)
      .enter()
      .append('option')
      .text(function (d) { return d; }) // text showed in the menu
      .attr("value", function (d) { return d; }) // corresponding value returned by the button

    // A color scale: one color for each group
    var myColor = d3.scaleOrdinal()
      .domain(allGroup)
      .range(d3.schemeSet2);

    // Add X axis --> it is a date format
    var x = d3.scaleBand()
      .domain(groups)
      .range([ 0, width ]);
    svg2.append("g")
      .attr("transform", "translate(0," + height + ")")
      .attr("class", "axisWhite")
      .call(d3.axisBottom(x));

    // Add Y axis
    var y = d3.scaleLinear()
      .domain( [0,d3.max(data, function(d) { return +d.Installed_capacity; })])
      .rangeRound([ height, 0 ]);
    svg2.append("g")
      .attr("class", "axisWhite")
      .call(d3.axisLeft(y));

      /*
   * Add labels to the axes.
   */
  svg2.append("text")
   .attr("text-anchor", "middle")
   .attr("transform", "translate("+(width/2)+","+(height+60)+")")
   .attr("fill","red")
   .text("Country");

  svg2.append("text")
   .attr("text-anchor", "middle")
   .attr("transform", "translate(0,"+(height/2)+")rotate(-90)")
   .attr("dy", "20.0")
   .attr("fill","Red")
     .text("Installed Capacity/Pumping_capacity (kWh)"); 

    const line=svg2.append("path")

    // create a tooltip
    const Tooltip = d3.select("#my_dataviz")
      .append("div")
      .style("opacity", 0)
      .attr("class", "tooltip")
      .style("background-color", "white")
      .style("border", "solid")
      .style("border-width", "2px")
      .style("border-radius", "5px")
      .style("padding", "5px")

      // Three function that change the tooltip when user hover / move / leave a cell
      var mouseover = function(d) {
        Tooltip
          .style("opacity", 1)
      }
      var mousemove = function(d) {
        Tooltip
          .html("Exact value: " + d.value)
          .style("left", (d3.mouse(this)[0]+70) + "px")
          .style("top", (d3.mouse(this)[1]) + "px")
      }
      var mouseleave = function(d) {
        Tooltip
          .style("opacity", 0)
      }

    // Add the points
    const points=svg2
      .append("g")
      .selectAll("dot")
      .data(data)
      .enter().append("circle")
        .on("mouseover", mouseover)
        .on("mousemove", mousemove)
        .on("mouseleave", mouseleave)

    var legend = svg2.selectAll(".legend")
         .data(allGroup.slice())
             .enter().append("g")
             .attr("class", "legend")
             .attr("transform", function(d, i) { return "translate(-20," + i * 40 + ")"; });
      
      legend.append("rect")
             .attr("x", width -65)
             .attr("width", 18)
             .attr("height", 18)
             .style("fill", myColor);
    
      legend.append("text")
              .attr("x", width - 68)
              .attr("y", 9)
              .attr("dy", ".35em")
              .attr("fill","white")
              .style("text-anchor", "end")
              .text(function(d) { return d;  });


    // A function that update the chart
    function update(selectedGroup) {

      // Create new data with the selection?
      var dataFilter = data.map(function(d){return {countrycode: d.countrycode, value:d[selectedGroup]} })

    // Add the line
    line
      .datum(dataFilter)
      .attr("fill", "none")
      .attr("stroke-width", 4)
      .attr("stroke", function(d){ return myColor(selectedGroup) })
      .transition()
      .duration(1000)
      .attr("d", d3.line()
        .x(function(d) { return x(d.countrycode)+10 })
        .y(function(d) { return y(d.value) })
        )

      // // Give these new data to update line
      // line
      //     .datum(dataFilter)
      //     .transition()
      //     .duration(1000)
      //     .attr("d", d3.line()
      //         .x(function(d) { return x(d.countrycode)+10 })
      //         .y(function(d) { return y(d.value) })
      //     )
      //     .attr("stroke", function(d){ return myColor(selectedGroup) })

      //Add the points
      points
        .data(dataFilter)
        .transition()
        .duration(1000)
        .attr("class", "myCircle")
        .attr("r", 8)
        .attr("stroke-width", 3)
        .attr("fill", "white")
        .attr("cx", d => x(d.countrycode)+10)
        .attr("cy", d => y(d.value))
        .attr("stroke", function(d){ return myColor(selectedGroup) })
      

    }

    // When the button is changed, run the updateChart function
    d3.select("#selectButton").on("change", function(d) {
        // recover the option that has been chosen
        var selectedOption = d3.select(this).property("value")
        // run the updateChart function with this selected option
        update(selectedOption)
    })

})

//Pie Chart
 var myDuration = 600;
  var firstTime = true;

  var radius = Math.min(width, height) / 2;

   var radius = Math.min(width, height) / 2;
  var color = d3.scaleOrdinal(d3.schemeCategory20);
  var pie = d3.pie()
  .value(function(d) { return d.count; })
  .sort(null);

  var arc = d3.arc()
  .innerRadius(radius - 100)
  .outerRadius(radius - 20);

  var svg4 = d3.select("#piechart").append("svg")
  .attr("width", width)
  .attr("height", height)
  .append("g")
  .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");

  d3.csv("./datasets/Type_of_powerplant_for_Pie_Chart.csv", type, function(error, data) {
    var countryByType = d3.nest()
    .key(function(d) { return d.type; })
    .entries(data)
    .reverse();

    var label = d3.select("form2").selectAll("label")
    .data(countryByType)
    .enter().append("label");

    label.append("input")
    .attr("type", "radio")
    .attr("name", "type")
    .attr("value", function(d) { return d.key; })
    .on("change", change)
    .filter(function(d, i) { return !i; })
    .each(change)
    .property("checked", true);

    label.append("span")
    .text(function(d) { return d.key; });

    //Legend
    // var legend2 = svg4.append('g')
    //         .attr("transform", function(d, i) { return "translate(0," + (i*20) + ")"; });

    //     legend2.selectAll('rect')
    //         .attr("x", width - 38)
    //   .attr("width", 18)
    //   .attr("height", 18)
    //   .attr("fill", color);

    //     legend2.selectAll("text")
    //         .data(data)
    //         .enter()
    //         .append("text")
    //         .text((d) => d.countrycode2)
    //         .attr("font-size", 12)
    //         .attr('x', (_, i) => i * 90 + 20)
    //         .attr("dy", ".35em")
    //         .attr('y', -10)
  
    function change(countrycode) {
      var path = svg4.selectAll("path");
      var data0 = path.data(),
      data1 = pie(countrycode.values);

      path = path.data(data1, key);

      path
      .transition()
      .duration(myDuration)
      .attrTween("d", arcTween)


      path
      .enter()
      .append("path")
      .each(function(d, i) {
        var narc = findNeighborArc(i, data0, data1, key) ;
        if(narc) {          
          this._current = narc;
          this._previous = narc;
        } else {          
          this._current = d;
        }
      }) 
     .attr("fill", function (d, i) {
                return color(d.data.countrycode);
            })
            .attr("d", function (d, i) {
                return arc(d, i)
            })
            .on("mouseover", function (event, d) {
                d3.select(this)
                    .attr("opacity", 7)
            })
            .on("mouseout", function (event, d) {
                d3.select(this)
                    .attr("opacity", 1)
            })
            .append("title")
            .text((d) => {
                return `${d.data.countrycode} ${d.data.count} `
            })
      .transition()
      .duration(myDuration)
      .attrTween("d", arcTween)
      ;

      path
      .exit()
      .transition()
      
      .duration(myDuration)
      .attrTween("d", function(d, index) {

        var currentIndex = this._previous.data.countrycode;
        var i = d3.interpolateObject(d,this._previous);
        return function(t) {
          return arc(i(t))
        }

      })
      .remove()


      firstTime = false;


    }
  });

  function key(d) {
    return d.data.type;

  }

  function type(d) {
    d.count = +d.count;
    return d;
  }

  function findNeighborArc(i, data0, data1, key) {
    var d;
    if(d = findPreceding(i, data0, data1, key)) {

      var obj = cloneObj(d)
      obj.startAngle = d.endAngle;
      return obj;

    } else if(d = findFollowing(i, data0, data1, key)) {

      var obj = cloneObj(d)
      obj.endAngle = d.startAngle;
      return obj;

    }

    return null


  }

// Find the element in data0 that joins the highest preceding element in data1.
function findPreceding(i, data0, data1, key) {
  var m = data0.length;
  while (--i >= 0) {
    var k = key(data1[i]);
    for (var j = 0; j < m; ++j) {
      if (key(data0[j]) === k) return data0[j];
    }
  }
}

// Find the element in data0 that joins the lowest following element in data1.
function findFollowing(i, data0, data1, key) {
  var n = data1.length, m = data0.length;
  while (++i < n) {
    var k = key(data1[i]);
    for (var j = 0; j < m; ++j) {
      if (key(data0[j]) === k) return data0[j];
    }
  }
}

function arcTween(d) {

  var i = d3.interpolate(this._current, d);

  this._current = i(0);

  return function(t) {
    return arc(i(t))
  }

}


function cloneObj(obj) {
  var o = {};
  for(var i in obj) {
    o[i] = obj[i];
  }
  return o;
}
}

window.onload = init ;



