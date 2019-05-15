/******************************************************************************
Name: Siebren Kazemier
School: Uva
Student number: 12516597
Project: Assignment week 5, Creating scatter plot
******************************************************************************/
const width = 1000;
const height = 500;

const margin = {top: 80, bottom: 60, right: 40, left: 80};
const padding = 0.25

var yearList = [2012, 2013, 2014, 2015, 2016, 2016];

var dataDict = {};

window.onload = function() {
    getData();
};

// Retrive data through an API
function getData(year) {
    var teensInViolentArea = "https://stats.oecd.org/SDMX-JSON/data/CWB/AUS+AUT+BEL+BEL-VLG+CAN+CHL+CZE+DNK+EST+FIN+FRA+DEU+GRC+HUN+ISL+IRL+ISR+ITA+JPN+KOR+LVA+LTU+LUX+MEX+NLD+NZL+NOR+POL+PRT+SVK+SVN+ESP+SWE+CHE+TUR+GBR+USA+OAVG+NMEC+BRA+BGR+CHN+COL+CRI+HRV+CYP+IND+IDN+MLT+PER+ROU+RUS+ZAF.CWB11/all?startTime=2010&endTime=2017"
    var teenPregnancies = "https://stats.oecd.org/SDMX-JSON/data/CWB/AUS+AUT+BEL+BEL-VLG+CAN+CHL+CZE+DNK+EST+FIN+FRA+DEU+GRC+HUN+ISL+IRL+ISR+ITA+JPN+KOR+LVA+LTU+LUX+MEX+NLD+NZL+NOR+POL+PRT+SVK+SVN+ESP+SWE+CHE+TUR+GBR+USA+OAVG+NMEC+BRA+BGR+CHN+COL+CRI+HRV+CYP+IND+IDN+MLT+PER+ROU+RUS+ZAF.CWB46/all?startTime=1960&endTime=2017"
    var GDP = "https://stats.oecd.org/SDMX-JSON/data/SNA_TABLE1/AUS+AUT+BEL+CAN+CHL+CZE+DNK+EST+FIN+FRA+DEU+GRC+HUN+ISL+IRL+ISR+ITA+JPN+KOR+LVA+LTU+LUX+MEX+NLD+NZL+NOR+POL+PRT+SVK+SVN+ESP+SWE+CHE+TUR+GBR+USA+EU28+EU15+OECDE+OECD+OTF+NMEC+ARG+BRA+BGR+CHN+COL+CRI+HRV+CYP+IND+IDN+MLT+ROU+RUS+SAU+ZAF+FRME+DEW.B1_GE.HCPC/all?startTime=2012&endTime=2018&dimensionAtObservation=allDimensions"

    var requests = [d3.json(teensInViolentArea), d3.json(teenPregnancies), d3.json(GDP)];

    Promise.all(requests).then(function(response) {
        var teensInViolentAreaData = transformResponse(response[0]);
        var teenPregnanciesData = transformResponse(response[1]);
        var GDPdata = transformResponse2(response[2]);

        formatData(teensInViolentAreaData, teenPregnanciesData, GDPdata, yearList);
        scatterPlot();
    }).catch(function(e){
        throw(e);
    });
}


// transforms the data to a useable form
// coppied function from: https://data.mprog.nl/course/10%20Homework/100%20D3%20Scatterplot/scripts/transformResponseV1.js
function transformResponse(data){
    // Save data
    let originalData = data;

    // access data property of the response
    let dataHere = data.dataSets[0].series;

    // access variables in the response and save length for later
    let series = data.structure.dimensions.series;
    let seriesLength = series.length;

    // set up array of variables and array of lengths
    let varArray = [];
    let lenArray = [];

    series.forEach(function(serie){
        varArray.push(serie);
        lenArray.push(serie.values.length);
    });

    // get the time periods in the dataset
    let observation = data.structure.dimensions.observation[0];

    // add time periods to the variables, but since it"s not included in the
    // 0:0:0 format it"s not included in the array of lengths
    varArray.push(observation);

    // create array with all possible combinations of the 0:0:0 format
    let strings = Object.keys(dataHere);

    // set up output object, an object with each country being a key and an array
    // as value
    let dataObject = {};

    // for each string that we created
    strings.forEach(function(string){
        // for each observation and its index
        observation.values.forEach(function(obs, index){
            let data = dataHere[string].observations[index];
            if (data != undefined){

                // set up temporary object
                let tempObj = {};

                let tempString = string.split(":").slice(0, -1);
                tempString.forEach(function(s, indexi){
                    tempObj[varArray[indexi].name] = varArray[indexi].values[s].name;
                });

                // every datapoint has a time and ofcourse a datapoint
                tempObj["Time"] = obs.name;
                tempObj["Datapoint"] = data[0];
                tempObj["Indicator"] = originalData.structure.dimensions.series[1].values[0].name;

                // Add to total object
                if (dataObject[tempObj["Country"]] == undefined){
                  dataObject[tempObj["Country"]] = [tempObj];
                } else {
                  dataObject[tempObj["Country"]].push(tempObj);
                };
            }
        });
    });
    // return the finished product!
    return dataObject;
}
// transforms the data to a useable form
// coppied function from : https://data.mprog.nl/course/10%20Homework/100%20D3%20Scatterplot/scripts/transformResponseV2.js
function transformResponse2(data){

    // Save data
    let originalData = data;

    // access data
    let dataHere = data.dataSets[0].observations;

    // access variables in the response and save length for later
    let series = data.structure.dimensions.observation;
    let seriesLength = series.length;

    // get the time periods in the dataset
    let observation = data.structure.dimensions.observation[0];

    // set up array of variables and array of lengths
    let varArray = [];
    let lenArray = [];

    series.forEach(function(serie){
        varArray.push(serie);
        lenArray.push(serie.values.length);
    });

    // add time periods to the variables, but since it"s not included in the
    // 0:0:0 format it"s not included in the array of lengths
    varArray.push(observation);

    // create array with all possible combinations of the 0:0:0 format
    let strings = Object.keys(dataHere);

    // set up output array, an array of objects, each containing a single datapoint
    // and the descriptors for that datapoint
    let dataObject = {};

    // for each string that we created
    strings.forEach(function(string){
        observation.values.forEach(function(obs, index){
            let data = dataHere[string];
            if (data != undefined){

                // set up temporary object
                let tempObj = {};

                // split string into array of elements seperated by ":"
                let tempString = string.split(":")
                tempString.forEach(function(s, index){
                    tempObj[varArray[index].name] = varArray[index].values[s].name;
                });

                tempObj["Datapoint"] = data[0];

                // Add to total object
                if (dataObject[tempObj["Country"]] == undefined){
                  dataObject[tempObj["Country"]] = [tempObj];
                } else if (dataObject[tempObj["Country"]][dataObject[tempObj["Country"]].length - 1]["Year"] != tempObj["Year"]) {
                    dataObject[tempObj["Country"]].push(tempObj);
                };

            }
        });
    });

    // return the finished product!
    return dataObject;
}

// creates a useable data set
function formatData(firstData, secondData, thirdData, yearList) {
    for(var year of yearList) {
        var dataList = [];
        // creates a list with first data
        for(var countries of Object.entries(firstData)) {
            for(let lines of countries[1]) {
                if(year == lines.Time & lines.Country != "OECD - Average" & Object.keys(lines).length == 4) {
                    let dict = {};
                    dict["country"] = lines.Country;
                    dict["teensInViolentArea"] = lines.Datapoint;

                    // adds second data
                    for(var secondCountries of Object.entries(secondData)){
                        if(secondCountries[0] == dict["country"]) {
                            for(let years of secondCountries[1]) {
                                if(Object.keys(years).length == 4) {
                                    dict["teenPregnancies"] = years.Datapoint;
                                }
                            }
                        }
                    }
                    // adds third data
                    for(var thirdCountries of Object.entries(thirdData)) {
                        if(thirdCountries[0] == dict["country"]) {
                            for(let years of thirdCountries[1]) {
                                if(Object.keys(years).length == 5) {
                                    dict["GDP"] = years.Datapoint;
                                }
                            }
                        }
                    }
                    if(Object.keys(dict).length == 4) {
                        dataList.push(dict);
                    }
                }
            }
        }
        dataDict[year] = dataList;
    }
}

function scatterPlot() {
    // get highest value
    var maxValue = d3.max(dataDict[2012], function(d){ return d.teenPregnancies});
    var secondMaxValue = d3.max(dataDict[2012], function(d){ return d.teensInViolentArea});
    var thirdMaxValue = d3.max(dataDict[2012], function(d){ return d.GDP});
    var thirdMinValue = d3.min(dataDict[2012], function(d){ return d.GDP});

    // create svg
    var svg = d3.select("body")
                  .append("svg")
                  .attr("width", width)
                  .attr("height", height);

    // Create a scale for y-axis (teenPregnancies)
    var yScale = d3.scaleLinear()
                   .domain([0, maxValue])
                   .range([height - margin.bottom, margin.top]);

    // Create a scale for x-axis (teensInViolentArea)
    var xScale = d3.scaleLinear()
                   .domain([0, secondMaxValue])
                   .range([margin.left, width - margin.right]);

    // Create y-axis (teenPregnancies)
    var yAxis = d3.axisLeft()
                    .scale(yScale);

    // Create y-axis (teensInViolentArea)
    var xAxis = d3.axisBottom()
                    .scale(xScale);

    // Create dots
    var dots = svg.selectAll("circle")
                  .data(dataDict[2012])
                  .enter()
                  .append("circle");

    // makes color list
    var colors = d3.scaleLinear()
                   .domain([thirdMinValue, thirdMaxValue/2, thirdMaxValue])
                   .range(["#8c510a", "#01665e"]);


    var legendRectSize = 12;
    // add legend
    var legend = d3.select("svg")
                   .append("g")
                   .selectAll("g")
                   .data(colors.domain())
                   .enter()
                   .append("g")
                   .attr("class", "legend")
                   .attr("transform", function(d, i) {
                       var h = legendRectSize * 2;
                       var x = width - margin.right - 120;
                       var y = i * h + 2;
                       return "translate(" + x + "," + y + ")";
                   });

    // add rects to graph
    legend.append("rect")
          .attr("width", legendRectSize)
          .attr("height", legendRectSize)
          .style("fill", colors)
          .style("stroke", colors)
          .attr("id", function(d, i) {
             return "squere" + i
          })
          .on("mouseover", handleMouseOverLegend)
          .on("mouseout", handleMouseOutLegend);

    // add text to graph
    legend.append("text")
          .attr("class", "legend")
          .attr("x", legendRectSize + 6)
          .attr("y", legendRectSize - 1)
          .text(function(d) { return Math.round(d) + " USD per head" });

    // add size and color to dots
    dots.attr("cx", function(d) {
            return xScale(d.teensInViolentArea)
        })
        .attr("r", function(d) {
            return d.GDP / 10000 + 4
        })
        .attr("fill", function(d) {
            return colors(d.GDP)
        })
        // splits dots in different catagories
        .attr("class", function(d) {
            if(d.GDP < (thirdMaxValue / 3)) {
                return "firstThird"
            }
            else if(d.GDP > (thirdMaxValue / 3) * 2) {
                return "thirdThird"
            }
            else {
                return "secondThird"
            }
        })
        .attr("opacity", 0.7)
        .on("mouseout", handleMouseOut)
        .on("mouseover", handleMouseOver)
        // transition when loads the page
        .transition()
        .duration(700)
        .attr("cy", function(d) {
            return yScale(d.teenPregnancies)
        });


    // add correct margins to y axis (teenPregnancies)
    svg.append("g")
       .attr("transform", "translate("+ (margin.left) + ",0)")
       .attr("class", "yAxis")
       .call(yAxis);

    // add correct margins to x axis (teensInViolentArea)
    svg.append("g")
       .attr("transform", "translate(0, " + (height - margin.bottom) +  ")")
       .attr("class", "xAxis")
       .call(xAxis);

    // add text near x-axis
    svg.append("text")
       .attr("class", "label")
       .attr("x", (width-margin.right-margin.left)/2 +margin.left)
       .attr("y", height - margin.bottom + 40)
       .attr("opacity", 0.8)
       .attr("text-anchor", "middle")
       .text("Teens in violent area (%)")

    // create text near y-axis
    svg.append("text")
       .attr("class", "label")
       .attr("x", -(height-margin.top-margin.bottom)/2 - margin.top)
       .attr("y", margin.left - 35)
       .attr("transform", "rotate(-90)")
       .attr("opacity", 0.8)
       .attr("text-anchor", "middle")
       .text("Teen pregnancies (%)")

   // create title
   svg.append("text")
      .attr("class", "title")
      .attr("x", (width-margin.right-margin.left)/2 +margin.left)
      .attr("y", margin.top / 2)
      .attr("text-anchor", "middle")
      .attr("font-size", 30)
      .attr("font-family", "Arial")
      .attr("opacity", 0.8)
      .text("Teen in violent area's and pregnancies")


    // Update new data
    d3.selectAll(".date")
      .on("click", function() {
        var date = this.getAttribute("value");
        var circle = d3.select("body");
        var svg = d3.select("body");
        var duration = 750;

        // get highest value
        var maxValue = d3.max(dataDict[date], function(d){ return d.teenPregnancies});
        var secondMaxValue = d3.max(dataDict[date], function(d){ return d.teensInViolentArea});
        var thirdMaxValue = d3.max(dataDict[date], function(d){ return d.GDP});

    // changes scale for y-axis (teenPregnancies)
    yScale.domain([0, maxValue])
          .range([height - margin.bottom, margin.top]);

    // changes scale for x-axis (teensInViolentArea)
    xScale.domain([0, secondMaxValue])
          .range([margin.left, width - margin.right]);

    // update axis
    var yAxis = d3.axisLeft().scale(yScale);
    var xAxis = d3.axisBottom().scale(xScale);

    // makes color list
    var colors = d3.scaleLinear()
                 .domain([thirdMinValue, thirdMaxValue/2, thirdMaxValue])
                 .range(["#8c510a", "#01665e"]);

    circle.selectAll("circle")
          .data(dataDict[date]);

    // update old circles
    circle.attr("class", "update");

    circle.selectAll("circle").transition()
       .duration(duration)
       .attr("r", function(d) {
           return d.GDP / 10000 + 4
    })
       .attr("cy", function(d) {
           return yScale(d.teenPregnancies)
    })
       .attr("cx", function(d) {
           return xScale(d.teensInViolentArea)
    })
       .attr("fill", function(d) {
                return colors(d.GDP)
    });

    // Remove old circles as needed.
    circle.exit().remove();

    // change the x axis
    svg.select(".xAxis")
      .transition()
      .duration(duration)
      .call(xAxis);

    // change the y axis
    svg.select(".yAxis").transition()
      .duration(duration)
      .call(yAxis);
    })
}

// Create event for mouse over
function handleMouseOver(d, i) {
    // change dot size
    d3.select(this)
      .attr("r", ((d.GDP / 10000 + 4 ) * 1.5))
      .attr("opacity", 1);

    var svg = d3.select("svg");
    // add country's text
    svg.append("text")
       .attr("id", "country")
       .attr("x", margin.left + 10)
       .attr("y", margin.top + 50)
       .attr("font-size", 70)
       .attr("font-family", "Arial")
       .transition()
       .duration(50)
       .attr("opacity", 0.6)
       .text(d.country)
    // add teenPtragnancies text
    svg.append("text")
       .attr("id", "country")
       .attr("x", margin.left + 10)
       .attr("y", margin.top + 80)
       .attr("font-size", 20)
       .attr("font-family", "Arial")
       .transition()
       .duration(50)
       .attr("opacity", 0.6)
       .text("Teen pregnancies: " + d.teenPregnancies + "%");
   // add teensInViolentAreas text
   svg.append("text")
      .attr("id", "country")
      .attr("x", margin.left + 10)
      .attr("y", margin.top + 100)
      .attr("font-size", 20)
      .attr("font-family", "Arial")
      .transition()
      .duration(50)
      .attr("opacity", 0.6)
      .text("Teens in voilent area's: " + d.teensInViolentArea + "%")
   // Append GDP text
   svg.append("text")
      .attr("id", "country")
      .attr("x", margin.left + 10)
      .attr("y", margin.top + 120)
      .attr("font-size", 20)
      .attr("font-family", "Arial")
      .transition()
      .duration(50)
      .attr("opacity", 0.6)
      .text("GDP: " + Math.round(d.GDP) + " USD per head")
}
// handles mouse out
function handleMouseOut(d, i) {
    // change size dots back to normal
    d3.select(this)
      .attr("r",  d.GDP / 10000 + 4)
      .attr("opacity", 0.7);
      // removes text slowly
      var svg = d3.select("svg");
      svg.selectAll("#country")
         .transition()
         .duration(700)
         .attr("opacity", 0).remove();
}

// handles mouseover legend
function handleMouseOverLegend(d, i, input) {
    // changes size squere
    d3.select(this)
      .attr("width", 16)
      .attr("height", 16)
      .attr("x", -2)
      .attr("y", -2);

    var svg = d3.select("svg");
    // changes dot copacity corresponding to gdp
    if(this.id == "squere0"){
        svg.selectAll(".firstThird")
           .attr("opacity", 1);
    }
    else if(this.id == "squere1") {
        svg.selectAll(".secondThird")
           .attr("opacity", 1);
    }
    else {
        svg.selectAll(".thirdThird")
           .attr("opacity", 1)
    }

}
// handles mouseout legend
function handleMouseOutLegend(d, i, input) {
    d3.select(this)
      .attr("width", 12)
      .attr("height", 12)
      .attr("x", 0)
      .attr("y", 0)

    // changes apacity back to normal
    var svg = d3.select("svg");
    svg.selectAll(".firstThird")
      .attr("opacity", 0.7)
    svg.selectAll(".secondThird")
      .attr("opacity", 0.7)
    svg.selectAll(".thirdThird")
      .attr("opacity", 0.7)
};
