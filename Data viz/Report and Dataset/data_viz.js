function init() {
//Stacked Bar Chart
// set the dimensions and margins of the graph
const margin = {top: 10, right: 30, bottom: 20, left: 50},
    width = 1000 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;

// var svg = d3.select("#barchart")
//             .append("svg")
//             .attr("width", width + margin.left + margin.right)
//             .attr("height", height + margin.top + margin.bottom+50)
//     g = svg.append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")");

// /*
//  * Scale for bar widths.
//  */
// var x = d3.scaleBand()
//     .rangeRound([0, width])
//     .padding(0.1)
//     .align(0.1);

// /*
//  * Scale for bar heights.
//  */
// var y = d3.scaleLinear()
//     .rangeRound([height, 0]);

// /*
//  * Scale for fill color of the categorical data (age groups).
//  */
// var colorScale = d3.scaleOrdinal()
//                   .range(['#008837','#f0544f','#7b3294']);

// var columns,
//     numStates,
//   stack,
//   layers,
//   yGroupMax,
//   yStackMax,
//   rect;

// /*
//  * Create request for CSV-data, and then process the response.
//  */
// d3.csv("Type_of_Powerplant_by_Country.csv", addTotalsColumn, function(error, data) {
//   if (error) throw error;

//   data.sort(function(a, b) { return b.total - a.total; });
  
//   columns = data.columns.slice(1);
//   numStates = data.length;
//   stack = d3.stack().keys(columns);
  
//   layers = stack(data).map(function (layer) { return layer.map(function(e, i) {
//       return { countrycode: e.data.countrycode, 
//                x: i,
//              y: e.data[layer.key],
//          type: layer.key,
//          total: e.data.total };
//     });
//   });
//   for (s = 0; s < numStates; ++s) {
//     var y0 = 0;
//     for (ag = 0; ag < columns.length; ++ag) {
//       var e = layers[ag][s];
//       e.y0 = y0;
//       y0 += e.y;
//     }
//   }

//   /*
//    * Calculate the maximum of the total populations,
//    * and the maximum of the age groups.
//    */
//   yGroupMax = d3.max(layers, function(layer) { return d3.max(layer, function(d) { return d.y }); });
//   yStackMax = d3.max(layers, function(layer) { return d3.max(layer, function(d) { return d.y0 + d.y; }); });

// /*
//    * Set the domains for the x-, y-axis and categorical color scales.
//    */
//   x.domain(data.map(function(d) { return d.countrycode; }));
//   y.domain([0, d3.max(data, function(d) { return d.total; })]).nice();
//   colorScale.domain(data.columns.slice(1));

//   /*
//    * Render the bars.
//    */
//   g.selectAll(".serie")
//     .data(layers)
//     .enter().append("g")
//       .attr("class", "serie")
//       .attr("fill", function(d) { return colorScale(d[0].type); })
//     .selectAll("rect")
//     .data(function(d) { return d; })
//     .enter().append("rect")
//       .attr("x", function(d) { return x(d.countrycode); })
//       .attr("y", height)
//       .attr("width", x.bandwidth())
//       .attr("height", 0);

//   rect = g.selectAll("rect");

//   /*
//    * Initial animation to gradually "grow" the bars from the x-axis.
//    */
//   rect.transition()
//       .delay(function(d, i) { return i; })
//       .attr("y", function(d) { return y(d.y0 + d.y) })
//       .attr("height", function(d) { return y(d.y0) - y(d.y0 + d.y) });

//    /*
//    * Add SVG title elements for each age group bar segment.
//    */
//   rect.append("svg:title")
//       .text(function(d) { return d.countrycode+", "+d.type+": "+d.y+" (total: "+d.total+")"; });

//   /*
//    * X-axis set-up and y-axis
//    */
//   g.append("g")
//       .attr("class", "axisWhite")
//       .attr("transform", "translate(0," + height + ")")
//       .call(d3.axisBottom(x));

//   g.append("g")
//     .attr("class","axisWhite")
//     .call(d3.axisLeft(y));

//   /*
//    * Add labels to the axes.
//    */
//   svg.append("text")
//    .attr("text-anchor", "middle")
//    .attr("transform", "translate("+(width/2)+","+(height+60)+")")
//    .attr("fill","red")
//    .text("Country");

//   svg.append("text")
//    .attr("text-anchor", "middle")
//    .attr("transform", "translate(0,"+(height/2)+")rotate(-90)")
//    .attr("dy", "20.0")
//    .attr("fill","Red")
//      .text("Number of Plant"); 

//   /*
//    * Set up the legend explaning the age group categories.
//    */
//   var legend = g.selectAll(".legend")
//     .data(data.columns.slice(1).reverse())
//     .enter().append("g")
//       .attr("class", "legend")
//       .attr("transform", function(d, i) { return "translate(0," + (i*20) + ")"; });

//   legend.append("rect")
//       .attr("x", width - 38)
//       .attr("width", 18)
//       .attr("height", 18)
//       .attr("fill", colorScale);

//   legend.append("text")
//       .attr("x", width - 44)
//       .attr("y", 9)
//       .attr("dy", ".35em")
//       .attr("fill","white")
//       .attr("text-anchor", "end")
//       .text(function(d) { return d; });
// });

// /*
//  * Sort the rows of the CSV response in descending order.
//  */
// function addTotalsColumn(d, i, columns) {
//   for (i = 1, t = 0; i < columns.length; ++i) t += d[columns[i]] = +d[columns[i]];
//   d.total = t;
//   return d;
// }

// d3.selectAll("input").on("change", change);

// function change() {
//   if (this.value === "grouped") transitionGrouped();
//   else transitionStacked();
// }

// /*
//  * Reset the domain for the y-axis scaling to maximum of the age group totals,
//  * transition the x-axis changes to the bar widths, and then transition the
//  * y-axis changes to the bar heights.
//  */
// function transitionGrouped() {
//   y.domain([0, yGroupMax]);

//   rect.transition()
//       .duration(500)
//       .delay(function(d, i) { return i; })
//         .attr("x", function(d) { return x(d.countrycode) + 0.5 + columns.indexOf(d.type)*(x.bandwidth()/columns.length); })
//         .attr("width", x.bandwidth() / columns.length)
//       .transition()
//          .attr("y", function(d) { return y(d.y); })
//          .attr("height", function(d) { return height - y(d.y); });
// }

// /*
//  * Reset the domain for the y-axis scaling to maximum of the population totals,
//  * transition the y-axis changes to the bar heights, and then transition the
//  * x-axis changes to the bar widths.
//  */
// function transitionStacked() {
//   y.domain([0, yStackMax]);

//   rect.transition()
//       .duration(500)
//       .delay(function(d, i) { return i; })
//         .attr("y", function(d) { return y(d.y0 + d.y); })
//         .attr("height", function(d) { return y(d.y0) - y(d.y0 + d.y); })
//       .transition()
//         .attr("x", function(d) { return x(d.countrycode); })
//         .attr("width", x.bandwidth());
// }


// //Line Chart
// // append the svg object to the body of the page
// // set the dimensions and margins of the graph

// // append the svg object to the body of the page
// var svg2 = d3.select("#my_dataviz")
//   .append("svg")
//     .attr("width", width + margin.left + margin.right)
//     .attr("height", height + margin.top + margin.bottom+50)
//   .append("g")
//     .attr("transform",
//           "translate(" + margin.left + "," + margin.top + ")");

// //Read the data
// d3.csv("Installed_Capacity_Pumping_Capacity_by_Country.csv", function(data) {
    
//     // List of groups = species here = value of the first column called group -> I show them on the X axis
//     var groups = data.map(d => (d.countrycode))
//     // List of groups (here I have one group per column)
//     var allGroup = ["Installed_capacity", "Pumping_capacity"]

//     // add the options to the button
//     d3.select("#selectButton")
//       .selectAll('myOptions')
//       .data(allGroup)
//       .enter()
//       .append('option')
//       .text(function (d) { return d; }) // text showed in the menu
//       .attr("value", function (d) { return d; }) // corresponding value returned by the button

//     // A color scale: one color for each group
//     var myColor = d3.scaleOrdinal()
//       .domain(allGroup)
//       .range(d3.schemeSet2);

//     // Add X axis --> it is a date format
//     var x = d3.scaleBand()
//       .domain(groups)
//       .range([ 0, width ]);
//     svg2.append("g")
//       .attr("transform", "translate(0," + height + ")")
//       .attr("class", "axisWhite")
//       .call(d3.axisBottom(x));

//     // Add Y axis
//     var y = d3.scaleLinear()
//       .domain( [0,d3.max(data, function(d) { return +d.Installed_capacity; })])
//       .rangeRound([ height, 0 ]);
//     svg2.append("g")
//       .attr("class", "axisWhite")
//       .call(d3.axisLeft(y));

//       /*
//    * Add labels to the axes.
//    */
//   svg2.append("text")
//    .attr("text-anchor", "middle")
//    .attr("transform", "translate("+(width/2)+","+(height+60)+")")
//    .attr("fill","red")
//    .text("Country");

//   svg2.append("text")
//    .attr("text-anchor", "middle")
//    .attr("transform", "translate(0,"+(height/2)+")rotate(-90)")
//    .attr("dy", "20.0")
//    .attr("fill","Red")
//      .text("Installed Capacity/Pumping_capacity (kWh)"); 

//     const line=svg2.append("path")

//     // create a tooltip
//     const Tooltip = d3.select("#my_dataviz")
//       .append("div")
//       .style("opacity", 0)
//       .attr("class", "tooltip")
//       .style("background-color", "white")
//       .style("border", "solid")
//       .style("border-width", "2px")
//       .style("border-radius", "5px")
//       .style("padding", "5px")

//       // Three function that change the tooltip when user hover / move / leave a cell
//       var mouseover = function(d) {
//         Tooltip
//           .style("opacity", 1)
//       }
//       var mousemove = function(d) {
//         Tooltip
//           .html("Exact value: " + d.value)
//           .style("left", (d3.mouse(this)[0]+70) + "px")
//           .style("top", (d3.mouse(this)[1]) + "px")
//       }
//       var mouseleave = function(d) {
//         Tooltip
//           .style("opacity", 0)
//       }

//     // Add the points
//     const points=svg2
//       .append("g")
//       .selectAll("dot")
//       .data(data)
//       .enter().append("circle")
//         .on("mouseover", mouseover)
//         .on("mousemove", mousemove)
//         .on("mouseleave", mouseleave)

//     var legend = svg2.selectAll(".legend")
//          .data(allGroup.slice())
//              .enter().append("g")
//              .attr("class", "legend")
//              .attr("transform", function(d, i) { return "translate(-20," + i * 40 + ")"; });
      
//       legend.append("rect")
//              .attr("x", width -65)
//              .attr("width", 18)
//              .attr("height", 18)
//              .style("fill", myColor);
    
//       legend.append("text")
//               .attr("x", width - 68)
//               .attr("y", 9)
//               .attr("dy", ".35em")
//               .attr("fill","white")
//               .style("text-anchor", "end")
//               .text(function(d) { return d;  });


//     // A function that update the chart
//     function update(selectedGroup) {

//       // Create new data with the selection?
//       var dataFilter = data.map(function(d){return {countrycode: d.countrycode, value:d[selectedGroup]} })

//     // Add the line
//     line
//       .datum(dataFilter)
//       .attr("fill", "none")
//       .attr("stroke-width", 4)
//       .attr("stroke", function(d){ return myColor(selectedGroup) })
//       .transition()
//       .duration(1000)
//       .attr("d", d3.line()
//         .x(function(d) { return x(d.countrycode)+10 })
//         .y(function(d) { return y(d.value) })
//         )

//       // // Give these new data to update line
//       // line
//       //     .datum(dataFilter)
//       //     .transition()
//       //     .duration(1000)
//       //     .attr("d", d3.line()
//       //         .x(function(d) { return x(d.countrycode)+10 })
//       //         .y(function(d) { return y(d.value) })
//       //     )
//       //     .attr("stroke", function(d){ return myColor(selectedGroup) })

//       //Add the points
//       points
//         .data(dataFilter)
//         .transition()
//         .duration(1000)
//         .attr("class", "myCircle")
//         .attr("r", 8)
//         .attr("stroke-width", 3)
//         .attr("fill", "white")
//         .attr("cx", d => x(d.countrycode)+10)
//         .attr("cy", d => y(d.value))
//         .attr("stroke", function(d){ return myColor(selectedGroup) })
      

//     }

//     // When the button is changed, run the updateChart function
//     d3.select("#selectButton").on("change", function(d) {
//         // recover the option that has been chosen
//         var selectedOption = d3.select(this).property("value")
//         // run the updateChart function with this selected option
//         update(selectedOption)
//     })

// })









//  const svg3 = d3.select("#choropleth"),
//    path = d3.geoPath(),
//    data = d3.map(),
//    worldmap = "https://raw.githubusercontent.com/leakyMirror/map-of-europe/master/GeoJSON/europe.geojson",
//    worldpopulation = "electricity-per-capita.csv";

//  let centered, world;

//  // style of geographic projection and scaling
//  const projection = d3.geoRobinson()
//    .scale(115)
//    .center([0,41])
//    .translate([width/2 , height/2]);

//  // Define color scale
//  const colors = d3.scaleThreshold()
//    .domain([100000, 1000000, 10000000, 30000000, 100000000, 500000000,50000000000])
//    .range(d3.schemeOrRd[8]);

//  // add tooltip
//  const tooltip = d3.select("body").append("div")
//    .attr("class", "tooltip")
//    .style("opacity", 0);

//  // Load external data and boot
//  d3.queue()
//    .defer(d3.json, worldmap)
//    .defer(d3.csv, worldpopulation, function(d) {
//      data.set(d.Code, +d.Hydro_electric_per_capita);
//    })
//    .await(ready);

//  // Add clickable background
//  svg3.append("rect")
//    .attr("class", "background")
//    .attr("width", width)
//    .attr("height", height)
//    .on("click", click);


//  // ----------------------------
//  //Start of Choropleth drawing
//  // ----------------------------
//  function ready(error, topo) {
//    // topo is the data received from the d3.queue function (the world.geojson)
//    // the data from world_population.csv (country code and country population) is saved in data variable

//    let mouseOver = function(d) {
//      d3.selectAll(".Country")
//        .transition()
//        .duration(200)
//        .style("opacity", .5)
//        .style("stroke", "transparent");
//      d3.select(this)
//        .transition()
//        .duration(200)
//        .style("opacity", 1)
//        .style("stroke", "black");
//      tooltip.style("left", (d3.event.pageX + 15) + "px")
//        .style("top", (d3.event.pageY - 28) + "px")
//        .transition().duration(400)
//        .style("opacity", 1)
//        .text(d.properties.NAME + ': ' + Math.round((d.total / 1000000) * 10) / 10 + ' mio.');
//    }

//    let mouseLeave = function() {
//      d3.selectAll(".Country")
//        .transition()
//        .duration(200)
//        .style("opacity", 1)
//        .style("stroke", "transparent");
//      tooltip.transition().duration(300)
//        .style("opacity", 0);
//    }

//    // Draw the map
//    world = svg3.append("g")
//      .attr("class", "world");
//    world.selectAll("path")
//      .data(topo.features)
//      .enter()
//      .append("path")
//      // draw each country
//      // d3.geoPath() is a built-in function of d3 v4 and takes care of showing the map from a properly formatted geojson file, if necessary filtering it through a predefined geographic projection
//      .attr("d", d3.geoPath().projection(projection))

//      //retrieve the name of the country from data
//      .attr("data-name", function(d) {
//        return d.properties.NAME
//      })

//      // set the color of each country
//      .attr("fill", function(d) {
//        d.total = data.get(d.properties.ISO2) || 0;
//        return colors(d.total);
//      })

//      // add a class, styling and mouseover/mouseleave and click functions
//      .style("stroke", "transparent")
//      .attr("class", function(d) {
//        return "Country"
//      })
//      .attr("id", function(d) {
//        return d.properties.ISO2
//      })
//      .style("opacity", 1)
//      .on("mouseover", mouseOver)
//      .on("mouseleave", mouseLeave)
//      .on("click", click);
  
//    // Legend
//    const x = d3.scaleLinear()
//      .domain([2.6, 75.1])
//      .rangeRound([600, 860]);

//    const legend = svg3.append("g")
//      .attr("id", "legend");

//    const legend_entry = legend.selectAll("g.legend")
//      .data(colors.range().map(function(d) {
//        d = colors.invertExtent(d);
//        if (d[0] == null) d[0] = x.domain()[0];
//        if (d[1] == null) d[1] = x.domain()[1];
//        return d;
//      }))
//      .enter().append("g")
//      .attr("class", "legend_entry");

//    const ls_w = 20,
//      ls_h = 20;

//    legend_entry.append("rect")
//      .attr("x", 20)
//      .attr("y", function(d, i) {
//        return height - (i * ls_h) - 2 * ls_h;
//      })
//      .attr("width", ls_w)
//      .attr("height", ls_h)
//      .style("fill", function(d) {
//        return colors(d[0]);
//      })
//      .style("opacity", 0.8);

//    legend_entry.append("text")
//      .attr("x", 50)
//      .attr("y", function(d, i) {
//        return height - (i * ls_h) - ls_h - 6;
//      })
//      .text(function(d, i) {
//        if (i === 0) return "< " + d[1] / 1000000 + " m";
//        if (d[1] < d[0]) return d[0] / 1000000 + " m +";
//        return d[0] / 1000000 + " m - " + d[1] / 1000000 + " m";
//      });

//    legend.append("text").attr("x", 15).attr("y", 280).text("Population (Million)");
//  }

//  // Zoom functionality
//  function click(d) {
//    var x, y, k;

//    if (d && centered !== d) {
//     var centroid = path.centroid(d);
//      x = -(centroid[0] * 6);
//      y = (centroid[1] * 6);
//      k = 3;
//      centered = d;
//    } else {
//      x = 0;
//      y = 0;
//      k = 1;
//      centered = null;
//    }

//    world.selectAll("path")
//        .classed("active", centered && function(d) { return d === centered; });

//    world.transition()
//        .duration(750)
//        .attr("transform", "translate(" + x + "," + y + ") scale(" + k + ")" );
  
// }







// const svg3 = d3.select("#choropleth"),

//   path = d3.geoPath(),
//   data = d3.map(),
//   worldmap = "https://raw.githubusercontent.com/holtzy/D3-graph-gallery/master/DATA/world.geojson",
//   worldpopulation = "electricity-per-capita.csv";

// let centered, world;

// // style of geographic projection and scaling
// const projection = d3.geoRobinson()
//   .scale(130)
//   .translate([width / 2, height / 2]);

// // Define color scale
// const colorScale = d3.scaleThreshold()
//   .domain([2, 10, 10000000, 30000000, 100000000, 500000000,5000000000])
//   .range(d3.schemeOrRd[8]);

// // add tooltip
// const tooltip = d3.select("body").append("div")
//   .attr("class", "tooltip")
//   .style("opacity", 0);


// Promise.all([
// d3.json(worldmap),
// d3.csv(worldpopulation,function(d) {
//     data.set(d.Code, +d.Hydro_electric_per_capita)
// })
// ]).then (function(loadData){
//   let topo = loadData[0]

//   let mouseOver = function(d) {
//     d3.selectAll(".Country")
//       .transition()
//       .duration(200)
//       .style("opacity", .5)
//       .style("stroke", "transparent");
//     d3.select(this)
//       .transition()
//       .duration(200)
//       .style("opacity", 1)
//       .style("stroke", "black");
//     tooltip2.style("left", (d3.event.pageX + 15) + "px")
//       .style("top", (d3.event.pageY - 28) + "px")
//       .transition().duration(400)
//       .style("opacity", 1)
//       .text(d.properties.name + ': ' + Math.round((d.total / 1000000) * 10) / 10 + ' mio.');
//   }

//   let mouseLeave = function() {
//     d3.selectAll(".Country")
//       .transition()
//       .duration(200)
//       .style("opacity", 1)
//       .style("stroke", "transparent");
//     tooltip2.transition().duration(300)
//       .style("opacity", 0);
//   }

//   // Draw the map
//   world = svg3.append("g")
//     .attr("class", "world");
//   world.selectAll("path")
//     .data(topo.features)
//     .enter()
//     .append("path")
//     // draw each country
//     // d3.geoPath() is a built-in function of d3 v4 and takes care of showing the map from a properly formatted geojson file, if necessary filtering it through a predefined geographic projection
//     .attr("d", d3.geoPath().projection(projection))

//     //retrieve the name of the country from data
//     .attr("data-name", function(d) {
//       return d.properties.name
//     })

//     // set the color of each country
//     .attr("fill", function(d) {
//       d.total = data.get(d.id) || 0;
//       return colorScale(d.total);
//     })

//     // add a class, styling and mouseover/mouseleave and click functions
//     .style("stroke", "transparent")
//     .attr("class", function(d) {
//       return "Country"
//     })
//     .attr("id", function(d) {
//       return d.id
//     })
//     .style("opacity", 1)
//     .on("mouseover", mouseOver)
//     .on("mouseleave", mouseLeave)
//     .on("click", click);
  
//   // Legend
//   const x = d3.scaleLinear()
//     .domain([2.6, 75.1])
//     .rangeRound([600, 860]);

//   const legend = svg3.append("g")
//     .attr("id", "legend")
//     .attr("fill","white");

//   const legend_entry = legend.selectAll("g.legend")
//     .data(colorScale.range().map(function(d) {
//       d = colorScale.invertExtent(d);
//       if (d[0] == null) d[0] = x.domain()[0];
//       if (d[1] == null) d[1] = x.domain()[1];
//       return d;
//     }))
//     .enter().append("g")
//     .attr("class", "legend_entry");

//   const ls_w = 20,
//     ls_h = 20;

//   legend_entry.append("rect")
//     .attr("x", 20)
//     .attr("y", function(d, i) {
//       return height - (i * ls_h) - 2 * ls_h;
//     })
//     .attr("width", ls_w)
//     .attr("height", ls_h)
//     .style("fill", function(d) {
//       return colorScale(d[0]);
//     })
//     .style("opacity", 0.8);

//   legend_entry.append("text")
//     .attr("x", 50)
//     .attr("y", function(d, i) {
//       return height - (i * ls_h) - ls_h - 7;
//     })
//     .text(function(d, i) {
//       if (i === 0) return  0 + " kWh";
//       if (d[1] < d[0]) return d[0] / 100000 + " kWh +";
//       return d[1] / 100000 + " kWh ";
//     });

//   legend.append("text").attr("x", 15).attr("y", 280).text("Electric Per Capita (kWh)");

//   // Zoom functionality
// function click(d) {
//   var x, y, k;

//   if (d && centered !== d) {
//     var centroid = path.centroid(d);
//     x = -(centroid[0] * 1);
//     y = (centroid[1] * 1);
//     k = 3;
//     centered = d;
//   } else {
//     x = 0;
//     y = 0;
//     k = 1;
//     centered = null;
//   }

//   world.selectAll("path")
//       .classed("active", centered && function(d) { return d === centered; });

//   world.transition()
//       .duration(750)
//       .attr("transform", "translate(" + x + "," + y + ") scale(" + k + ")" );
  
// }
// })





// const svg3 = d3.select("#choropleth"),
//   width2 = +800,
//   height2 = +1500;

// // Map and projection
// const path = d3.geoPath();
// const projection = d3.geoMercator()
//   .scale(70)
//   .center([0,30])
//   .translate([width2 / 2, height2 / 2]);

// // Data and color scale
// let data = new Map()
// const colorScale = d3.scaleThreshold()
//   .domain([100000, 1000000, 10000000, 30000000, 100000000, 500000000])
//   .range(d3.schemeOrRd[7]);

// // add tooltip
// const tooltip = d3.select("body").append("div")
//   .attr("class", "tooltip")
//   .style("opacity", 0);

// // Load external data and boot
// Promise.all([
// d3.json("https://raw.githubusercontent.com/holtzy/D3-graph-gallery/master/DATA/world.geojson"),
// d3.csv("https://gist.githubusercontent.com/EliabethValdez/3230162d80d5f7d8978d94572857fa1b/raw/1eabfa8e41ddd811fa09085fdb49fbc3e080a964/world.csv", function(d) {
//     data.set(d.code, +d.pop);
// })
// ]).then(function(loadData){
//     let topo = loadData[0]
//     let centered,world
//     let mouseOver = function(d) {
//    d3.selectAll(".Country")
//       .transition()
//       .duration(200)
//       .style("opacity", .5)
//       .style("stroke", "transparent");
//     d3.select(this)
//       .transition()
//       .duration(200)
//       .style("opacity", 1)
//       .style("stroke", "black");
//     tooltip.style("left", (d3.event.pageX + 15) + "px")
//       .style("top", (d3.event.pageY - 28) + "px")
//       .transition().duration(400)
//       .style("opacity", 1)
//       .text(d.properties.name + ': ' + d.total + ' Deaths');
    
//   }

//   let mouseLeave = function() {
//     d3.selectAll(".Country")
//       .transition()
//       .duration(200)
//       .style("opacity", 1)
//       .style("stroke", "transparent");
//     tooltip.transition().duration(300)
//       .style("opacity", 0);
//   }

//   // Draw the map
//   svg3.append("g")
//     .selectAll("path")
//     .data(topo.features)
//     .enter()
//     .append("path")
//       // draw each country
//       .attr("d", d3.geoPath()
//         .projection(projection)
//       )
//       // set the color of each country
//       .attr("fill", function (d) {
//         d.total = data.get(d.id) || 0;
//         return colorScale(d.total);
//       })
//       .style("stroke", "transparent")
//       .attr("class", function(d){ return "Country" } )
//       .style("opacity", 1)
//       .on("mouseover", mouseOver )
//       .on("mouseleave", mouseLeave )
//       .on("click", click);

//   // Legend
//   const x = d3.scaleLinear()
//     .domain([2.6, 75.1])
//     .rangeRound([600, 860]);

//   const legend = svg3.append("g")
//     .attr("id", "legend")
//     .attr("fill","white");

//   const legend_entry = legend.selectAll("g.legend")
//     .data(colorScale.range().map(function(d) {
//       d = colorScale.invertExtent(d);
//       if (d[0] == null) d[0] = x.domain()[0];
//       if (d[1] == null) d[1] = x.domain()[1];
//       return d;
//     }))
//     .enter().append("g")
//     .attr("class", "legend_entry");

//   const ls_w = 20,
//     ls_h = 20;

//   legend_entry.append("rect")
//     .attr("x", 20)
//     .attr("y", function(d, i) {
//       return height - (i * ls_h) - 2 * ls_h;
//     })
//     .attr("width", ls_w)
//     .attr("height", ls_h)
//     .style("fill", function(d) {
//       return colorScale(d[0]);
//     })
//     .style("opacity", 0.8);

//   legend_entry.append("text")
//     .attr("x", 50)
//     .attr("y", function(d, i) {
//       return height - (i * ls_h) - ls_h - 7;
//     })
//     .text(function(d, i) {
//       if (i === 0) return  0 + " kWh";
//       if (d[1] < d[0]) return d[0] / 100000 + " kWh +";
//       return d[1] / 100000 + " kWh ";
//     });

//   legend.append("text").attr("x", 15).attr("y", 280).text("Electricity per capita(kWh)");

// // Zoom functionality
// function click(d) {
//   var x, y, k;

//   if (d && centered !== d) {
//     var centroid = path.centroid(d);
//     x = -(centroid[0] * 6);
//     y = (centroid[1] * 6);
//     k = 3;
//     centered = d;
//   } else {
//     x = 0;
//     y = 0;
//     k = 1;
//     centered = null;
//   }

//   world.selectAll("path")
//       .classed("active", centered && function(d) { return d === centered; });

//   world.transition()
//       .duration(750)
//       .attr("transform", "translate(" + x + "," + y + ") scale(" + k + ")" );
//   }
    
// })

// //Choropleth 2
// const initialYear=1999;
// var w=500,h=1000;

//   // Render SVG On DOM
//   let svg3 = d3.select("#choropleth").append("svg").attr("height", h).attr("width", w);


//   // Map & Projection
//   let projection = d3.geoMercator().scale(115).center([0, 41]).translate([w/2, h/2]);
//   let path = d3.geoPath().projection(projection);

//   // Get Data From CSV File
//   d3.csv("hydro-electricity-per-capita.csv").then((data) => {
//     // Generate Hue Scheme Based On Data
//     let color = d3.scaleLinear()
//     .domain([d3.min(data, (d) => { if (d.Year == initialYear && d.Code != "" && d.Code != "OWID_WRL") return parseFloat(d.Hydro_electric_per_capita); }), 0, d3.max(data, (d) => { if (d.Year == initialYear && d.Code != "" && d.Code != "OWID_WRL") return parseFloat(d.Hydro_electric_per_capita); })])
//     .range(["red", "lightgreen", "green"]);

//     let globalChangeValue = 0; // Worldwide Aggregate Change in TWh

//     // Bind Data From CSV To GeoJSON Properties
//     d3.json("world.geojson").then((json) => {
//       data.forEach(datum => {
//         if (datum.Year == initialYear)
//           for (let i = 0; i < json.features.length; i++) {
//             let properties = json.features[i].properties;
//             if (properties.name == datum.entity) { properties.value = datum.Hydro_electric_per_capita; break; }
//             else if (datum.Entity == "World") { globalChangeValue = datum.Hydro_electric_per_capita; break; }
//           }
//       });

//       // Draw Choropleth Using Paths On SVG Element
//       svg3.selectAll("path").data(json.features).enter().append("path").attr("d", path)
//       .style("fill", (d) => { return (d.properties.value) ? color(d.properties.value) : "#CCCCCC"; })
//       .classed("country", true)
//       // Mouse Events Work Only If Data Exists For Region
//       .on("mouseenter", function() { if (!d3.select(this).attr("style").includes("fill: rgb(204, 204, 204);")) d3.select(this).classed("countryHovered", true); })
//       .on("mouseout", function() { if (!d3.select(this).attr("style").includes("fill: rgb(204, 204, 204);")) d3.select(this).classed("countryHovered", false); })
//       .on("click", function (d, i) {
//         if (i.properties.value) {
//           choroplethRegionUpdate(i.properties.name);
//           d3.select("#countrySelected").attr("id", "");
//           if (activeRegion == i.properties.name) d3.select(this).attr("id", "countrySelected");
//         }
//       })
//       // Tooltip Content
//       .append("title").text((d) => {
//         if (d.properties.value) return "Annual Change Renewables: " + d.properties.value + " TWh\nCountry: " + d.properties.name + "\nYear: " + initialYear;
//         return "No Data\nCountry: " + d.properties.name + "\nYear: " + initialYear;
//       });

//       // Draw Global Change Text Indicator
//       svg3.append("text").attr("id", "globalChange").text("Global Change: " + globalChangeValue + " TWh").attr("x", w - 210).attr("y", h - 10);

//       // Draw Color Gradient Scale
//       svg3.append("rect").attr("id", "colorScale").attr("x", 20).attr("y", h - 50).attr("width", 120).attr("height", 20);
//       // Get Linear Color Gradient
//       const defs = svg.append("defs"), linearGradient = defs.append("linearGradient").attr("id", "linear-gradient");
//       linearGradient.selectAll(".stop").data(color.range()).enter().append("stop").attr("offset", (d, i) => i / (color.range().length - 1)).attr("stop-color", d => d);
//       // Append Gradient To Rectangle
//       svg3.select("#colorScale").style("fill", "url(#linear-gradient)").style("opacity", "0.7");
//       // Draw Color Gradient Scale
//       svg3.append("text").text("0").attr("x", 78).attr("y", h - 55);
//       svg3.append("text").text("TWh").attr("x", 160).attr("y", h - 55);
//       svg3.append("text").text(Math.ceil(color.domain()[0])).attr("x", 10).attr("y", h - 55).attr("id", "minMarker");
//       svg3.append("text").text(Math.ceil(color.domain()[2])).attr("x", 130).attr("y", h - 55).attr("id", "maxMarker");
//       // Draw No Data Hue Indicator
//       svg3.append("rect").attr("x", 20).attr("y", h - 20).attr("width", 30).attr("height", 20).attr("fill", "#ccc");
//       svg3.append("text").text("No Data").attr("x", 55).attr("y", h - 5);
//     });
//   });
// }

// // Update Choropleth Based On New Year Selection
// function updateChoropleth(newYear) {
//   // Initialise Dimensions

//   // Get Reference To SVG Element On DOM
//   let svg = d3.select("#choropleth").select("svg");

//   // Map & Projection
//   let projection = d3.geoMercator().scale(115).center([0, 41]).translate([w/2, h/2]);
//   let path = d3.geoPath().projection(projection);

//   // Get Data From CSV File
//   d3.csv("hydro-electricity-per-capita.csv").then((data) => {
//     // Generate Hue Scheme Based On Data
//     let color = d3.scaleLinear()
//     .domain([d3.min(data, (d) => { if (d.Year == newYear && d.Code != "" && d.Code != "OWID_WRL") return parseFloat(d.Hydro_electric_per_capita); }), 0, d3.max(data, (d) => { if (d.Year == newYear && d.Code != "" && d.Code != "OWID_WRL") return parseFloat(d.Hydro_electric_per_capita); })])
//     .range(["red", "lightgreen", "green"]);

//     let globalChangeValue = 0; // Worldwide Aggregate Change in TWh

//     // Bind Data From CSV To GeoJSON Properties
//     d3.json("world.geojson").then((json) => {
//       data.forEach(datum => {
//         if (datum.Year == newYear)
//           for (let i = 0; i < json.features.length; i++) {
//             let properties = json.features[i].properties;
//             if (properties.name == datum.entity) { properties.value = datum.Hydro_electric_per_capita; break; }
//             else if (datum.Entity == "World") { globalChangeValue = datum.Hydro_electric_per_capita; break; }
//           }
//       });

//       // Update Choropleth Paths & Add Transition
//       svg.selectAll("path").data(json.features).transition().duration(500).ease(d3.easeCubicInOut).attr("d", path)
//       .style("fill", (d) => { return (d.properties.value) ? color(d.properties.value) : "#CCCCCC"; })
//       .select("title").text((d) => {
//         if (d.properties.value) return "Annual Change Renewables: " + d.properties.value + " TWh\nCountry: " + d.properties.name + "\nYear: " + newYear;
//         else return "No Data\nCountry: " + d.properties.name + "\nYear: " + newYear;
//       });

//       // Update Global Change Text
//       svg.select("#globalChange").text("Global Change: " + globalChangeValue + " TWh");

//       // Update Color Scale Text
//       d3.select("#minMarker").text(Math.ceil(color.domain()[0]));
//       d3.select("#maxMarker").text(Math.ceil(color.domain()[2]));
//     });
//   });

// //Choropleth 3
// var svg3 = d3.select("#choropleth")
//  .attr("width", width + margin.left + margin.right)
//  .attr("height", height + margin.top + margin.bottom)
//  .append("g")
//  .attr("transform",
//           "translate(" + margin.left + "," + margin.top + ")");

// var projection = d3.geoMercator()
//   .scale(70)
//   .center([0,20])
//   .translate([width / 2 - margin.left, height / 2]);

// var domain = [100000000, 500000000]
// var labels = ["0 kWh", "100 kWh", "250 kWh","500 kWh","1000 kWh","2500 kWh", "5000 kWh"]
// var range = ["#F8CAEE","#BF76AF","#852170"]
// var colorScale = d3.scaleThreshold()
//   .domain(domain)
//   .range(range);

// var promises = []
// var data = d3.map();
// promises.push(d3.json("https://raw.githubusercontent.com/holtzy/D3-graph-gallery/master/DATA/world.geojson"))
// promises.push(d3.csv("https://raw.githubusercontent.com/holtzy/D3-graph-gallery/master/DATA/world_population.csv", function(d) { data.set(d.code, +d.pop); }))
// myDataPromises = Promise.all(promises).then(function(my_data) {
//  var legend_x = width - margin.left
// var legend_y = height - 30
//  var topo = my_data[0]
//  // do some stuff
//  let mouseOver = function(d) {
       
//      d3.select(this)
//       .transition()
//         .duration(200)
//         .style("opacity", 1)
//         .style("stroke", "black")
// }

// let mouseLeave = function(d) {
//     d3.selectAll(".topo")
//         .transition()
//         .duration(200)
//         .style("stroke", "transparent")
// }     


//  svg3.append("g")
//      .selectAll("path")
     
//      .data(topo.features)
//      .enter()
//      .append("path")
//      .attr("class", "topo")
//        // draw each country
//        .attr("d", d3.geoPath()
//          .projection(projection)
//        )
//        // set the color of each country
//        .attr("fill", function (d) {
//          d.total = data.get(d.id) || 0;
//          return colorScale(d.total);
//        })
//        .style("opacity", .7)
//       .on("mouseover", mouseOver )
//       .on("mouseleave", mouseLeave )

  
//   svg3.append("g")
//   .attr("class", "legend")
//   .attr("transform", "translate(" + legend_x + "," + legend_y+")");

//   var legend = d3.legendColor()
//      .labels(labels)
//      .title("Population")
//      .scale(colorScale)
    
    
//   svg3.select(".legend")
//     .call(legend);

// });





}
// Initialise Global Variables
const year = document.getElementById("year");
const yearLabel = document.getElementById("yearLabel");
const playButton = document.getElementById("plause");
const buttons = document.getElementById("buttons").children;
const regionSelector = document.getElementById("countrySelector");
const chart1 = document.getElementById("primaryChart");
const chart2 = document.getElementById("secondaryChart");
const chart2Heading = document.getElementById("secondaryChartTitle");
const chartShare = document.getElementById("shareChart");
const chartShareHeading = document.getElementById("shareChartHeading");
const chartConsumption = document.getElementById("consumptionChart");
const legendConsumption = document.getElementById("consumptionLegend")
const chartHeight = 500;
let activeRegion = "World";

// Initialise All Visualisations
function main() {
    drawChoropleth("2020");
}
window.onload = init;

