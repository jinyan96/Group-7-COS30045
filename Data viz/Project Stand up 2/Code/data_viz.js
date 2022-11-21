function init() {
//Stacked Bar Chart
// set the dimensions and margins of the graph
const margin = {top: 10, right: 30, bottom: 20, left: 50},
    width = 1000 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;

// append the svg object to the body of the page
const svg = d3.select("#chart-svg")
  .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform", `translate(${margin.left},${margin.top})`);

// Parse the Data
d3.csv("Type_of_Powerplant_by_Country.csv").then( function(data) {

  // List of subgroups = header of the csv files = soil condition here
  const subgroups = ["HDAM","HPHS","HROR"];

  // List of groups = species here = value of the first column called group -> I show them on the X axis
  const groups = data.map(d => (d.countrycode))

  // Add X axis
  const x = d3.scaleBand()
      .domain(groups)
      .range([0, width])
      .padding([0.2])
  svg.append("g")
    .attr("transform", `translate(0, ${height})`)
    .call(d3.axisBottom(x).tickSizeOuter(0));

  // Add Y axis
  const y = d3.scaleLinear()
    .domain([0, d3.max(data, function(d) { return +1200; })])
    .range([ height, 0 ]);
  svg.append("g")
    .call(d3.axisLeft(y));


  // color palette = one color per subgroup
  const color = d3.scaleOrdinal()
    .domain(subgroups)
    .range(['#008837','#f0544f','#7b3294'])

  //stack the data? --> stack per subgroup
  const stackedData = d3.stack()
    .keys(subgroups)
    (data)
  
  // ----------------
  // Create a tooltip
  // ----------------
  const tooltip = d3.select("#chart-svg")
    .append("div")
    .style("opacity", 0)
    .attr("class", "tooltip")
    .style("background-color", "white")
    .style("border", "solid")
    .style("border-width", "1px")
    .style("border-radius", "5px")
    .style("padding", "10px")

  // Three function that change the tooltip when user hover / move / leave a cell
  const mouseover = function(event, d) {
    const subgroupName = d3.select(this.parentNode).datum().key;
    const subgroupValue = d.data[subgroupName];
    tooltip
        .html("Type: " + subgroupName + "<br>" + "Count: " + subgroupValue)
        .style("opacity", 1)

  }
  var mousemove = function(d) {
    tooltip
      .style("left", (d3.mouse(this)[0]+90) + "px") // It is important to put the +90: other wise the tooltip is exactly where the point is an it creates a weird effect
      .style("top", (d3.mouse(this)[1]) + "px")
  }
  const mouseleave = function(event, d) {
    tooltip
      .style("opacity", 0)
  }

  // Show the bars
  svg.append("g")
    .selectAll("rect")
    // Enter in the stack data = loop key per key = group per group
    .data(stackedData)
    .join("g")
      .attr("fill", d => color(d.key))
      .selectAll("rect")
      // enter a second time = loop subgroup per subgroup to add all rectangles
      .data(d => d)
      .join("rect")
        .attr("x", d => x(d.data.countrycode))
        .attr("y", d => y(d[1]))
        .attr("height", d => y(d[0]) - y(d[1]))
        .attr("width",x.bandwidth())
        .attr("stroke","grey")
        .on("mouseover", mouseover)
        .on("mousemove", mousemove)
        .on("mouseleave", mouseleave)

     var legend = svg.selectAll(".legend")
         .data(subgroups.slice().reverse())
             .enter().append("g")
             .attr("class", "legend")
             .attr("transform", function(d, i) { return "translate(-20," + i * 40 + ")"; });
      
      legend.append("rect")
             .attr("x", width -50)
             .attr("width", 18)
             .attr("height", 18)
             .style("fill", color);
    
         legend.append("text")
               .attr("x", width - 52)
               .attr("y", 9)
               .attr("dy", ".35em")
               .attr("fill","white")
               .style("text-anchor", "end")
               .text(function(d) { return d;  });


})

//Line Chart
// append the svg object to the body of the page

const svg2 = d3.select("#my_dataviz")
  .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform", `translate(${margin.left},${margin.top})`);

//Read the data
d3.csv("Installed_capacity_Pumping_capacity_by_Country.csv").then( function(data) {

    const groups = data.map(d => (d.countrycode))
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
    const myColor = d3.scaleOrdinal()
      .domain(allGroup)
      .range(d3.schemeSet2);

  // Add X axis
  const x = d3.scaleBand()
      .domain(groups)
      .range([0, width])
      .padding([0.2])
  svg2.append("g")
    .attr("transform", `translate(0, ${height})`)
    .call(d3.axisBottom(x).tickSizeOuter(0));

    // Add Y axis
    const y = d3.scaleLinear()
      .domain([0, d3.max(data, function(d) { return +d.Installed_capacity; })])
      .range([ height, 0 ]);
    svg2.append("g")
      .call(d3.axisLeft(y));

    // Add the line
    const line=svg2.append("path")
      .datum(data)
      .attr("fill", "none")
      .attr("stroke", function(d){return myColor("Installed_capacity")})
      .attr("stroke-width", 1.5)
      .attr("d", d3.line()
        .x(function(d) { return x(d.countrycode) })
        .y(function(d) { return y(d.Installed_capacity) })
        )

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
       const dataFilter = data.map(function(d){return { countrycode:d.countrycode, value:d[selectedGroup]} })

      // Give these new data to update line
      line
          .datum(dataFilter)
          .transition()
          .duration(1000)
          .attr("d", d3.line()
              .x(function(d) { return x(d.countrycode) })
              .y(function(d) { return y(d.value) })
          )
          .attr("stroke", function(d){ return myColor(selectedGroup) })
    }

    // When the button is changed, run the updateChart function
    d3.select("#selectButton").on("change", function(event,d) {
        // recover the option that has been chosen
        const selectedOption = d3.select(this).property("value")
        // run the updateChart function with this selected option
        update(selectedOption)
    })

})
// const svg2 = d3.select("#my_dataviz")
//   .append("svg")
//     .attr("width", width + margin.left + margin.right)
//     .attr("height", height + margin.top + margin.bottom)
//   .append("g")
//     .attr("transform", `translate(${margin.left},${margin.top})`);

// //Read the data
// d3.csv("jrc-hydro-power-plant-database.csv").then( function(data) {

//     // List of groups (here I have one group per column)
//     var allGroup = ["installed_capacity_MW", "pumping_MW"]

//     const groups = data.map(d => (d.country_code))

//     // add the options to the button
//     d3.select("#selectButton")
//       .selectAll('myOptions')
//       .data(allGroup)
//       .enter()
//       .append('option')
//       .text(function (d) { return d; }) // text showed in the menu
//       .attr("value", function (d) { return d; }) // corresponding value returned by the button

//     // A color scale: one color for each group
//     const myColor = d3.scaleOrdinal()
//       .domain(allGroup)
//       .range(d3.schemeSet2);

//     // Add X axis --> it is a date format
//     const x = d3.scaleBand()
//       .domain(groups)
//       .range([ 0, width ]);
//     svg2.append("g")
//       .attr("transform", `translate(0, ${height})`)
//       .call(d3.axisBottom(x));

//     // Add Y axis
//     const y = d3.scaleLinear()
//       .domain( [0,2000])
//       .range([ height, 0 ]);
//     svg2.append("g")
//       .call(d3.axisLeft(y));

//     // Initialize line with group a
//     const line = svg2
//       .append('g')
//       .append("path")
//         .datum(data)
//         .attr("d", d3.line()
//           .x(function(d) { return x(+d.country_code)})
//           .y(function(d) { return y(d.installed_capacity_MW) })
//         )
//         .attr("stroke", function(d){ return myColor("installed_capacity_MW") })
//         .style("stroke-width", 4)
//         .style("fill", "none")

//     // A function that update the chart
//     function update(selectedGroup) {

//       // Create new data with the selection?
//       const dataFilter = data.map(function(d){return {countrycode: d.country_code, value:d[selectedGroup]} })

//       // Give these new data to update line
//       line
//           .datum(dataFilter)
//           .transition()
//           .duration(1000)
//           .attr("d", d3.line()
//             .x(function(d) { return x(+d.country_code) })
//             .y(function(d) { return y(+d.value) })
//           )
//           .attr("stroke", function(d){ return myColor(selectedGroup) })
//     }

//     // When the button is changed, run the updateChart function
//     d3.select("#selectButton").on("change", function(event,d) {
//         // recover the option that has been chosen
//         const selectedOption = d3.select(this).property("value")
//         // run the updateChart function with this selected option
//         update(selectedOption)
//     })

// })

//Choropleth
// initial setup
const svg3 = d3.select("#choropleth"),

  path = d3.geoPath(),
  data = d3.map(),
  worldmap = "https://raw.githubusercontent.com/holtzy/D3-graph-gallery/master/DATA/world.geojson",
  worldpopulation = "electricity-per-capita.csv";

let centered, world;

// style of geographic projection and scaling
const projection = d3.geoRobinson()
  .scale(130)
  .translate([width / 2, height / 2]);

// Define color scale
const colorScale = d3.scaleThreshold()
  .domain([2, 10, 10000000, 30000000, 100000000, 500000000,5000000000])
  .range(d3.schemeOrRd[8]);

// add tooltip
const tooltip = d3.select("body").append("div")
  .attr("class", "tooltip")
  .style("opacity", 0);


Promise.all([
d3.json(worldmap),
d3.csv(worldpopulation,function(d) {
    data.set(d.Code, +d.Hydro_electric_per_capita)
})
]).then (function(loadData){
  let topo = loadData[0]

  let mouseOver = function(d) {
    d3.selectAll(".Country")
      .transition()
      .duration(200)
      .style("opacity", .5)
      .style("stroke", "transparent");
    d3.select(this)
      .transition()
      .duration(200)
      .style("opacity", 1)
      .style("stroke", "black");
    tooltip2.style("left", (d3.event.pageX + 15) + "px")
      .style("top", (d3.event.pageY - 28) + "px")
      .transition().duration(400)
      .style("opacity", 1)
      .text(d.properties.name + ': ' + Math.round((d.total / 1000000) * 10) / 10 + ' mio.');
  }

  let mouseLeave = function() {
    d3.selectAll(".Country")
      .transition()
      .duration(200)
      .style("opacity", 1)
      .style("stroke", "transparent");
    tooltip2.transition().duration(300)
      .style("opacity", 0);
  }

  // Draw the map
  world = svg3.append("g")
    .attr("class", "world");
  world.selectAll("path")
    .data(topo.features)
    .enter()
    .append("path")
    // draw each country
    // d3.geoPath() is a built-in function of d3 v4 and takes care of showing the map from a properly formatted geojson file, if necessary filtering it through a predefined geographic projection
    .attr("d", d3.geoPath().projection(projection))

    //retrieve the name of the country from data
    .attr("data-name", function(d) {
      return d.properties.name
    })

    // set the color of each country
    .attr("fill", function(d) {
      d.total = data.get(d.id) || 0;
      return colorScale(d.total);
    })

    // add a class, styling and mouseover/mouseleave and click functions
    .style("stroke", "transparent")
    .attr("class", function(d) {
      return "Country"
    })
    .attr("id", function(d) {
      return d.id
    })
    .style("opacity", 1)
    .on("mouseover", mouseOver)
    .on("mouseleave", mouseLeave)
    .on("click", click);
  
  // Legend
  const x = d3.scaleLinear()
    .domain([2.6, 75.1])
    .rangeRound([600, 860]);

  const legend = svg3.append("g")
    .attr("id", "legend")
    .attr("fill","white");

  const legend_entry = legend.selectAll("g.legend")
    .data(colorScale.range().map(function(d) {
      d = colorScale.invertExtent(d);
      if (d[0] == null) d[0] = x.domain()[0];
      if (d[1] == null) d[1] = x.domain()[1];
      return d;
    }))
    .enter().append("g")
    .attr("class", "legend_entry");

  const ls_w = 20,
    ls_h = 20;

  legend_entry.append("rect")
    .attr("x", 20)
    .attr("y", function(d, i) {
      return height - (i * ls_h) - 2 * ls_h;
    })
    .attr("width", ls_w)
    .attr("height", ls_h)
    .style("fill", function(d) {
      return colorScale(d[0]);
    })
    .style("opacity", 0.8);

  legend_entry.append("text")
    .attr("x", 50)
    .attr("y", function(d, i) {
      return height - (i * ls_h) - ls_h - 7;
    })
    .text(function(d, i) {
      if (i === 0) return  0 + " kWh";
      if (d[1] < d[0]) return d[0] / 100000 + " kWh +";
      return d[1] / 100000 + " kWh ";
    });

  legend.append("text").attr("x", 15).attr("y", 280).text("Electric Per Capita (kWh)");

  // Zoom functionality
function click(d) {
  var x, y, k;

  if (d && centered !== d) {
    var centroid = path.centroid(d);
    x = -(centroid[0] * 1);
    y = (centroid[1] * 1);
    k = 3;
    centered = d;
  } else {
    x = 0;
    y = 0;
    k = 1;
    centered = null;
  }

  world.selectAll("path")
      .classed("active", centered && function(d) { return d === centered; });

  world.transition()
      .duration(750)
      .attr("transform", "translate(" + x + "," + y + ") scale(" + k + ")" );
  
}
})





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
window.onload = init;

