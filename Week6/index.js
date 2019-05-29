/******************************************************************************
Name: Siebren Kazemier
School: Uva
Student number: 12516597
Project: Assignment week 6, Creating a linked views
******************************************************************************/

window.onload = function() {
    importData();
};

// format and select the data
function importData() {
    d3v5.json("voorraad_woningen.json").then(function(data) {
        // creates a list with years
        var yearList = [];
        for(var row of data.data) {
            if(yearList.indexOf(row[0]) < 0) {
                yearList.push(row[0]);
            }
        }
        // adds data to the years
        var yearDict = {};
        for(var year of yearList) {
            let provinceDict = {};
            for(var row of data.data) {
                let dict = {};
                if(row[0] == year) {
                    dict["Start stock (100x)"] = row[2] / 100;
                    dict["New construction"] = row[3];
                    dict["Other addition"] = row[4];
                    dict["Demolition"] = row[5];
                    dict["Other withdrawal"] = row[6];
                    dict["Correction"] = row[7];
                    dict["Balance stock"] = row[8];
                    dict["End stock (100x)"] = row[9] / 100;
                    dict["growth"] = (row[9] - row[2]) / row[2] * 100;
                    provinceDict[row[1]] = dict;
                }
            }
            yearDict[year] = provinceDict;
        }
        nldChart(yearDict);
        barChart(yearDict, 2012);
    });
};

// creates data map
function nldChart(yearDict) {
    function makeChart(yearDict, colorDataset) {
        var map = new Datamap({
            element: document.getElementById('first'),
            scope: 'nld',
            fills: { defaultFill: '#F5F5F5' },
            data: colorDataset,
            geographyConfig: {
               borderColor: 'black',
               highlightBorderWidth: 2,
                // don't change color on mouse hover
                highlightFillColor: function(geo) {
                    return geo['fillColor'] || '#F5F5F5';
                },
                // only change border
                highlightBorderColor: '#B7B7B7',
                // show desired information in tooltip
                popupTemplate: function(geo, data) {
                    // don't show tooltip if country don't present in dataset
                    if (!data) { return ; }
                    // tooltip content
                    return ['<div class="hoverinfo">',
                        '<strong>', geo.properties.name, '</strong>',
                        '<br>Growth: <strong>', data.numberOfThings.toFixed(2) + "%", '</strong>',
                        '</div>'].join('');
                    }
                },

            setProjection: function(element, options) {
                var projection, path;
                    projection = d3v3.geo.mercator()
                    .center([5.5, 52.3])
                    .scale(5500)
                    .translate([element.offsetWidth / 2, element.offsetHeight / 2]);

            var path = d3v3.geo.path()
                .projection(projection);

            return {path: path, projection: projection};
            }
        })
    }

    // creates list of provinces
    var provinceList = provinces(yearDict);

    // creates colorscale for map
    var colorDataset = mapColors(yearDict, provinceList, 2012)
    makeChart(yearDict, colorDataset);
    legend(yearDict, 2012);

    // append title
    d3v5.select(".datamap").append("text")
        .attr("x", 330)
        .attr("y", 30)
        .attr("font-size", 30)
        .attr("font-family", "Arial")
        .attr("text-anchor", "middle")
        .attr("opacity", 0.9)
        .text("Building growth")

// #############################################################################
//                                     UPDATE MAP
// #############################################################################

    d3v5.selectAll(".date")
      .on("click", function() {
          $('#first').empty();

        var date = this.getAttribute("value");
        // creates colorscale for map
        var colorDataset = mapColors(yearDict, provinceList, date)
        makeChart(yearDict, colorDataset)
        barChart(yearDict, date);
        legend(yearDict, date)

        // append title
        d3v5.select(".datamap").append("text")
            .attr("x", 330)
            .attr("y", 30)
            .attr("font-size", 30)
            .attr("font-family", "Arial")
            .attr("text-anchor", "middle")
            .attr("opacity", 0.9)
            .text("Building growth")
    })

};

// creates color pallet for data map
function mapColors(yearDict, provinceList, year) {
    // get heighest and lowest values
    var maxGrowth = maxMinMap(yearDict, year, "growth", "max");
    var minGrowth = maxMinMap(yearDict, year, "growth", "min");

    // color scale
    var colorScale = d3v5.scaleLinear()
            .domain([minGrowth,maxGrowth])
            .range(["#8c510a","#01665e",])

    var colorDataset = {};
    var series = [];

    // creates useable dataset for map
    for (var province of provinceList) {
        let provinceCode = [province, yearDict[year][province]["growth"]];
        series.push(provinceCode);
    }

    series.forEach(function(item){ //
        // item example value ["USA", 70]
        var iso = item[0],
            value = item[1];
        colorDataset[iso] = { numberOfThings: value, fillColor: colorScale(value) };
    });
    return colorDataset;
}

// creates list with provinces
function provinces(yearDict) {
    var provinceList = [];

    for (var province of Object.keys(yearDict[2012])) {
        provinceList.push(province);
    }
    return provinceList;
};

// calculates max or min values
function maxMinMap(yearDict, year, propperty, maxMin) {
    var provinceList = provinces(yearDict);
    var List = [];

    for (items of provinceList) {
        List.push(yearDict[year][items][propperty]);
    };
    if (maxMin == "max") {
        var maxMin = d3v5.max(List);
    }
    else if (maxMin == "min") {
        var maxMin = d3v5.min(List)
    }
    return maxMin;
}


function legend(yearDict, year) {
    const place = {top: 0, left: 100}; // -550 en -250

    var width = 100;
    var height = 200;
    var amount = 20;

    // make datalist for color bar
    var dataList = [];
        for (var i = 0; i <= amount; i++) {
            dataList.push(i);
        }

    // min max values
    var max = parseFloat(maxMinMap(yearDict, year, "growth", "max"))
    var min = parseFloat(maxMinMap(yearDict, year, "growth", "min"))
    var middle = (max + min)/ 2
    var textList = [max.toFixed(2), middle.toFixed(2), min.toFixed(2)]

    // color scale
    var colorScale = d3v5.scaleLinear()
        .domain([0,amount])
        .range(["#01665e", "#8c510a"])

    // make svg element
    var svg = d3v5.select(".datamap")
                    .append("svg")
                    .attr("class", "legend")
                    .attr("width", width)
                    .attr("height", height)
                    .attr("x", place.left)
                    .attr("y", place.top)

    // make legend bar
    var legendBar = svg.selectAll("rect")
                    .data(dataList)
                    .enter()
                    .append("rect");

    // make text
    var text = svg.selectAll("text")
                    .data(textList)
                    .enter()
                    .append("text")

    // make color bar
    legendBar.attr("width", 20)
        .attr("height", 10)
        .attr("x", 10 )
        .attr("y", function(d) {
            return 10 * d;
        })
        .attr("fill", function(d) {
            return colorScale(d)
        });

    // append text next to bar
    text.attr("x", 35)
       .attr("y", function(d, i) {
           return 92 * i + 12;
       })
       .attr("font-size", 12)
       .attr("font-family", "Arial")
       .text(function(d){
           return d + "%";
       })
}

// #############################################################################
//                                     BARCHART
// #############################################################################

function barChart(yearDict, year) {
    d3v5.select(".barChart").remove();

    var width = 800;
    var height = 400;
    const padding = 0.25
    const margin = {top: 80, bottom: 60, right: 40, left: 80};

    // Create svg
    var svg = d3v5.select("#second")
                .append("svg")
                .attr("class", "barChart")
                .attr("width", width)
                .attr("height", height)

    // get min and max value
    var maxValue = maxMinBarchart(yearDict, year, "Nederland", "max");
    var minValue = maxMinBarchart(yearDict, year, "Nederland", "min");
    var reformedData = reformData(yearDict, year, "Nederland");

    // gets names for x-axis
    var names = [];
    for(items of reformedData) {
        names.push(items.names);
    }

    // Create a scale for x-axis
    var xScale = d3v5.scaleBand()
                   .domain(names)
                   .range([margin.left, width - margin.right])
                   .paddingInner(padding);

    // check if minValue is smaller then 0
    if (minValue > 0) {
        var value = 0;
    }
    else {
        var value = minValue;
    }

    // Create a scale for y-axis
    var yScale = d3v5.scaleLinear()
                  .domain([value, maxValue])
                  .range([height - margin.bottom, margin.top]);

    // Create a color scale
    var colorScale = d3v5.scaleLinear()
          .domain([minValue,maxValue])
          .range(["#8c510a","#01665e"])

    // Create Bars
    var rect = svg.selectAll("rect")
                .data(reformedData)
                .enter()
                .append("rect");

    // Create y-axis
    const yAxis = d3v5.axisLeft()
                    .scale(yScale);

    // Create x-axis
    const xAxis = d3v5.axisBottom()
                    .scale(xScale);

    // adds size and colour to the bars
    rect.attr("width", xScale.bandwidth())
        .attr("x", function(d, i) {
          return xScale(d.names);
        })
        .transition()
        .duration(500)
        .delay(function (d, i) {
            return i * 40;
        })
        .attr("height", function(d) {
            return height - yScale(d.values) - margin.bottom;
        })
        .attr("y", function(d) {
          return yScale(d.values);
        })
        .attr("fill", function(d) {
            return colorScale(d.values)
        });

    rect.on("mouseenter", handleMouseEnter)
        .on("mouseout", handleMouseOut);

    // add correct margins to x axis
    svg.append("g")
        .attr('transform', 'translate(0, ' + (height - margin.bottom) + ')')
        .attr("class", "xAxis")
        .call(xAxis);

    // add correct margins to y axis
    svg.append("g")
        .attr('transform', 'translate('+ (margin.left) + ',0)')
        .attr("class", "yAxis")
        .call(yAxis);

    // create titles near g
    svg.append("text")
        .attr("x", -height/2 - 10)
        .attr("y", 30)
        .attr("font-size", 16)
        .attr("font-family", "Arial")
        .attr("text-anchor", "middle")
        .attr("transform", "rotate(-90)")
        .attr("opacity", 0.9)
        .text("Amount of buildings")


    // update barGraph
    d3v5.selectAll('.datamaps-subunit').on('click', function(geography) {
        var region = geography.id;
        var duration = 700;

        // get min and max value
        var maxValue = maxMinBarchart(yearDict, year, region, "max");
        var minValue = maxMinBarchart(yearDict, year, region, "min");
        var reformedData = reformData(yearDict, year, region);

        // check if minValue is smaller then 0
        if (minValue > 0) {
            var value = 0;
        }
        else {
            var value = minValue;
        }

        // changes scale for y-axis
        yScale.domain([value, maxValue])
              .range([height - margin.bottom, margin.top]);

        // update colorScale
        var colorScale = d3v5.scaleLinear()
              .domain([minValue, maxValue])
              .range(["#8c510a", "#01665e"])

        // update data
        rect.data(reformedData);

        // update bar height
        rect.transition()
            .duration(duration)
            .attr("height", function(d) {
                if (d.values < 0) {
                    return yScale(d.values) - yScale(0);
                }
                else {
                    return yScale(0) - yScale(d.values);
                }
           })
           .attr("y", function(d) {
                if (d.values < 0) {
                    return yScale(0)
                }
                else {

                    return yScale(d.values);
                }

           })
           .attr("fill", function(d) {
               return colorScale(d.values)
           })

        // change the y axis
        svg.select(".yAxis").transition()
          .duration(duration)
          .call(yAxis);

        // change the x axis
        svg.select(".xAxis").transition()
            .duration(duration)
            .attr('transform', 'translate(0, ' + (yScale(0)) + ')')
            .call(xAxis);
    })
}

function maxMinBarchart(yearDict, year, place, maxMin) {
    // get highest or lowest value
    let List = [];

    for (var i = 0; i < Object.values(yearDict[year][place]).length; i++) {
        if (Object.keys(yearDict[year][place])[i] != "growth") {
            List.push(Object.values(yearDict[year][place])[i]);
        }
    }
    if (maxMin == "max") {
        var maxMin = d3v5.max(List);
    }
    else if (maxMin == "min") {
        var maxMin = d3v5.min(List)
    }
    return maxMin;
}

function reformData(yearDict, year, place) {
    var list = [];

    for (var i = 0; i < Object.values(yearDict[year][place]).length; i++) {
        if (Object.keys(yearDict[year][place])[i] != "growth") {
            let dict = {};
            dict["values"] = Object.values(yearDict[year][place])[i]
            dict["names"] = Object.keys(yearDict[year][place])[i]
            list.push(dict);
        }
    }
    return list;
}

// Create event for mouse over
function handleMouseEnter(d, i) {
    // change dot size
    d3v5.select(this)
        .attr("opacity", 0.7);

    var svg = d3v5.select(".barChart");

    // add country's text
    svg.append("text")
       .attr("id", "barData")
       .attr("x", 80)
       .attr("y", 60)
       .attr("font-size", 50)
       .attr("font-family", "Arial")
       .transition()
       .duration(50)
       .attr("opacity", 0.6)
       .text(d.names + ": " + d.values.toFixed(0))
};

// handles mouse out
function handleMouseOut(d, i) {
    // change size dots back to normal
    d3v5.select(this)
        .attr("opacity", 1);

    // removes text slowly
    var svg = d3v5.select(".barChart");
        svg.selectAll("#barData")
        .transition()
        .duration(700)
        .attr("opacity", 0).remove();
};
