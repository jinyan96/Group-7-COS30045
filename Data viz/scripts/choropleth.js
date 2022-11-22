/*********************************
   CHOROPLETH EVENTS & FUNCTIONS
 *********************************/

// Render Choropleth On Primary Chart
function drawChoropleth(initialYear) {
  // Initialise Dimensions
  let w = chart1.offsetWidth, h = chartHeight;

  // Render SVG On DOM
  let svg = d3.select("#"+chart1.id).append("svg").attr("height", h).attr("width", w);

  // Map & Projection
  let projection = d3.geoMercator().scale(250).center([0, 41]).translate([w/2, h/2]);
  let path = d3.geoPath().projection(projection);


  // Get Data From CSV File
  d3.csv("./datasets/hydro-electricity-per-capita.csv",function(data) {
    // Generate Hue Scheme Based On Data
    let color = d3.scaleLinear()
        .domain([d3.min(data, (d) => { if (d.year == initialYear && d.code != "" && d.code != "ERP") return parseFloat(d.renewables); }),  d3.max(data, (d) => { if (d.year == initialYear && d.code != "" && d.code != "ERP") return parseFloat(d.renewables/4); }),  d3.max(data, (d) => { if (d.year == initialYear && d.code != "" && d.code != "ERP") return parseFloat(d.renewables/3); }),  d3.max(data, (d) => { if (d.year == initialYear && d.code != "" && d.code != "ERP") return parseFloat(d.renewables/2); }), d3.max(data, (d) => { if (d.year == initialYear && d.code != "" && d.code != "OWID_WRL") return parseFloat(d.renewables); })])
    .range([ "#eff3ff","#bdd7e7","#6baed6","#3182bd","#08519c"]);

    let globalChangeValue = 0; // Europe Aggregate Change

    // Bind Data From CSV To GeoJSON Properties
    d3.json("https://raw.githubusercontent.com/leakyMirror/map-of-europe/master/GeoJSON/europe.geojson",function(err,json) {
      data.forEach(datum => {
        if (datum.year == initialYear)
          for (let i = 0; i < json.features.length; i++) {
            let properties = json.features[i].properties;
            if (properties.NAME == datum.entity) { properties.value = datum.renewables; break; }
            else if (datum.entity == "Europe") { globalChangeValue = datum.renewables; break; }
          }
      });

      // Draw Choropleth Using Paths On SVG Element
      svg.selectAll("path").data(json.features).enter().append("path").attr("d", path)
      .style("fill", (d) => { return (d.properties.value) ? color(d.properties.value) : "#CCCCCC"; })
      .classed("country", true)
      // Mouse Events Work Only If Data Exists For Region
      .on("mouseenter", function() { if (!d3.select(this).attr("style").includes("fill: rgb(204, 204, 204);")) d3.select(this).classed("countryHovered", true); })
      .on("mouseout", function() { if (!d3.select(this).attr("style").includes("fill: rgb(204, 204, 204);")) d3.select(this).classed("countryHovered", false); })
      .on("click", function (d) {
        if (d.properties.value) {
          choroplethRegionUpdate(d.properties.NAME);
          d3.select("#countrySelected").attr("id", "");
          if (activeRegion == d.properties.NAME) d3.select(this).attr("id", "countrySelected");
        }
      })
      // Tooltip Content
      .append("title").text((d) => {
        if (d.properties.value) return "Annual HydroPower Emission: " + d.properties.value + " TWh\nCountry: " + d.properties.NAME + "\nYear: " + initialYear;
        return "No Data\nCountry: " + d.properties.NAME + "\nYear: " + initialYear;
      });

      // Zoom functionality
function click(d) {
  var x, y, k;

  if (d && centered !== d) {
    var centroid = path.centroid(d);
    x = -(centroid[0] * 6);
    y = (centroid[1] * 6);
    k = 3;
    centered = d;
  } else {
    x = 0;
    y = 0;
    k = 1;
    centered = null;
  }

  svg.selectAll("path")
      .classed("active", centered && function(d) { return d === centered; });

  world.transition()
      .duration(750)
      .attr("transform", "translate(" + x + "," + y + ") scale(" + k + ")" );
  
}


      
      // Draw Color Gradient Scale
      svg.append("rect").attr("id", "colorScale").attr("x", 20).attr("y", h - 50).attr("width", 400).attr("height", 20);
      // Get Linear Color Gradient
      const defs = svg.append("defs"), linearGradient = defs.append("linearGradient").attr("id", "linear-gradient");
      linearGradient.selectAll(".stop").data(color.range()).enter().append("stop").attr("offset", (d, i) => i / (color.range().length - 1)).attr("stop-color", d => d);
      // Append Gradient To Rectangle
      svg.select("#colorScale").style("fill", "url(#linear-gradient)").style("opacity", "0.7");
      // Draw Color Gradient Scale
      svg.append("text").text(Math.ceil(color.domain()[0])).attr("x", 10).attr("y", h - 55).attr("id", "minMarker").attr("fill","white");
      svg.append("text").text("TWh").attr("x", 450).attr("y", h - 55).attr("fill","red");
      svg.append("text").text(Math.ceil(color.domain()[1])).attr("x", 100).attr("y", h - 55).attr("id", "maxMarker4").attr("fill","white");
      svg.append("text").text(Math.ceil(color.domain()[2])).attr("x", 200).attr("y", h - 55).attr("id", "maxMarker3").attr("fill","white");
      svg.append("text").text(Math.ceil(color.domain()[3])).attr("x", 300).attr("y", h - 55).attr("id", "maxMarker2").attr("fill","white");
      svg.append("text").text(Math.ceil(color.domain()[4])).attr("x", 400).attr("y", h - 55).attr("id", "maxMarker").attr("fill","white");
      // Draw No Data Hue Indicator
      svg.append("rect").attr("x", 20).attr("y", h - 20).attr("width", 30).attr("height", 20).attr("fill", "#ccc");
      svg.append("text").text("No Data").attr("x", 55).attr("y", h - 5).attr("fill","white");
    });
  });
}

// Update Choropleth Based On New Year Selection
function updateChoropleth(newYear) {
  // Initialise Dimensions
  let w = chart1.offsetWidth, h = chartHeight;

  // Get Reference To SVG Element On DOM
  let svg = d3.select("#" + chart1.id).select("svg");

  // Map & Projection
  let projection = d3.geoMercator().scale(250).center([0, 41]).translate([w/2, h/2]);
  let path = d3.geoPath().projection(projection);

  // Get Data From CSV File
  d3.csv("./datasets/hydro-electricity-per-capita.csv",function(data){
    // Generate Hue Scheme Based On Data
    let color = d3.scaleLinear()
    .domain([d3.min(data, (d) => { if (d.year == newYear && d.code != "" && d.code != "ERP") return parseFloat(d.renewables); }),d3.max(data, (d) => { if (d.year == newYear && d.code != "" && d.code != "ERP") return parseFloat(d.renewables/4); }),d3.max(data, (d) => { if (d.year == newYear && d.code != "" && d.code != "ERP") return parseFloat(d.renewables/3); }),d3.max(data, (d) => { if (d.year == newYear && d.code != "" && d.code != "ERP") return parseFloat(d.renewables/2); }),  d3.max(data, (d) => { if (d.year == newYear && d.code != "" && d.code != "ERP") return parseFloat(d.renewables); })])
    .range([ "#eff3ff","#bdd7e7","#6baed6","#3182bd","#08519c"]);

    let globalChangeValue = 0; // Europe Aggregate Change in TWh

    // Bind Data From CSV To GeoJSON Properties
    d3.json("https://raw.githubusercontent.com/leakyMirror/map-of-europe/master/GeoJSON/europe.geojson",function(err,json) {
      data.forEach(datum => {
        if (datum.year == newYear)
          for (let i = 0; i < json.features.length; i++) {
            let properties = json.features[i].properties;
            if (properties.NAME == datum.entity) { properties.value = datum.renewables; break; }
            else if (datum.entity == "World") { globalChangeValue = datum.renewables; break; }
          }
      });

      // Update Choropleth Paths & Add Transition
      svg.selectAll("path").data(json.features).transition().duration(500).ease(d3.easeCubicInOut).attr("d", path)
      .style("fill", (d) => { return (d.properties.value) ? color(d.properties.value) : "#CCCCCC"; })
      .select("title").text((d) => {
        if (d.properties.value) return "Annual HydroPower Emission: " + d.properties.value + " TWh\nCountry: " + d.properties.NAME + "\nYear: " + newYear;
        else return "No Data\nCountry: " + d.properties.NAME + "\nYear: " + newYear;
      });



      // Update Color Scale Text
      d3.select("#minMarker").text(Math.ceil(color.domain()[0]));
      d3.select("#maxMarker4").text(Math.ceil(color.domain()[1]));
      d3.select("#maxMarker3").text(Math.ceil(color.domain()[2]));
      d3.select("#maxMarker2").text(Math.ceil(color.domain()[3]));
      d3.select("#maxMarker").text(Math.ceil(color.domain()[4]));
    });
  });
}
