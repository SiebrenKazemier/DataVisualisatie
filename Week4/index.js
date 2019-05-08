/******************************************************************************
Name: Siebren Kazemier
School: Uva
Student number: 12516597
Project: Assignment week 4, Creating a bar graph
******************************************************************************/
var dataList = [];

var w = 1000;
var h = 500;

// Changes position of svg
const place = {top: 0, left: 0}
// change margins
const margin = {top: 80, bottom: 60, right: 40, left: 80};
const padding = 0.25

// select data
function importData() {
  d3.json("data.json").then(function(data) {
    for(var row of data.data) {
      // select data of a specified year
      if(row[1] === 2016) {
        let dict = {};
        dict["Country"] = row[0];
        dict["KTOE"] = row[2];
        dataList.push(dict);
      }
    }
    // get 10 highest values and removes total value
    dataList = dataList.sort(function(a, b){return b.KTOE-a.KTOE});
    dataList = dataList.slice(1, 21);

    // randomize data
    // dataList = shuffle(dataList);

    svgBarChart();
  });
}

// function to create a barchart
function svgBarChart() {
  var country = [];

  // append all the country's to a dataList
  for (var i = 0; i < dataList.length; i++)
  {
    country.push(dataList[i].Country);
  }

  // get highest value
  maxValue = d3.max(dataList, function(d){ return d.KTOE});

  // Create a scale for y-axis
  var yScale = d3.scaleBand()
                 .domain(country)
                 .range([margin.left, w - margin.right])
                 .paddingInner(padding);

  // Create a scale for x-axis
  var xScale = d3.scaleLinear()
                 .domain([0, maxValue])
                 .range([h - margin.bottom, margin.top]);

  // Create svg
  var svg = d3.select("body")
              .append("svg")
              .attr("width", w)
              .attr("height", h)
              .attr('transform', 'translate(' + place.left + ',' + place.top + ')')

  // Create Bars
  var rect = svg.selectAll("rect")
                .data(dataList)
                .enter()
                .append("rect");

  // Create y-axis
  const yAxis = d3.axisLeft()
                  .scale(xScale);

  // Create x-axis
  const xAxis = d3.axisBottom()
                  .scale(yScale);

  // create a tooltip with the given data
  var tooltip = svg.append("g")
                   .attr("class", "tooltip")
                   .style("display", "none");

  // adds size and colour to the bars
  rect.attr("width", yScale.bandwidth())
      .attr("height", function(d) {
          return h - xScale(d.KTOE) - margin.bottom;
      })
      .attr("x", function(d, i) {
        return yScale(d.Country);
      })
      .attr("y", function(d) {
        return xScale(d.KTOE);
      })
      .attr("fill", function(d) {
        return "rgb(0, 70, " + (d.KTOE / 1000 * 3) + ")"
      })
      // on mouse enter change colour
      .on('mouseenter', function (actual, i) {
            d3.select(this).attr('opacity', 0.5)
                           .transition()
                           .duration(300)
                           .attr('opacity', 0.6)
      })
      .on('mouseleave', function (actual, i) {
          d3.select(this).attr('opacity', 1)
                         .transition()
                         .duration(300)
                         .attr('opacity', 1)
      })
      // on mouse enter show tooltip
      .on("mouseover", function() {
          tooltip.style("display", null);
      })
      .on("mouseout", function() {
          tooltip.style("display", "none");
        })
      .on("mousemove", function(d) {
      var xPosition = d3.mouse(this)[0] + 10;
      var yPosition = d3.mouse(this)[1] - 30;

      tooltip.attr("transform", "translate(" + xPosition + "," + yPosition + ")");
      tooltip.select("text").text(d.KTOE);
      });

  // create text near y-axis
  svg.append('text')
     .attr('class', 'label')
     .attr('x', -(h-margin.top-margin.bottom)/2 - margin.top)
     .attr('y', margin.left - 60)
     .attr('transform', 'rotate(-90)')
     .attr('text-anchor', 'middle')
     .text('KTOE')
     .attr("font-family", "sans-serif")

 // create text near x-axis
 svg.append('text')
    .attr('class', 'label')
    .attr('x', (w-margin.right-margin.left)/2 +margin.left)
    .attr('y', h - margin.bottom + 40)
    .attr('text-anchor', 'middle')
    .text('Country')
    .attr("font-family", "sans-serif")

// create text above graph
svg.append('text')
   .attr('class', 'label')
   .attr('x', w / 2)
   .attr('y',  margin.top - 20)
   .attr('text-anchor', 'middle')
   .text('Kilotonne of oil equivalent per country')
   .attr("font-family", "sans-serif")
   .attr("font-size", "20px")
   .attr("font-weight", "bold")

// add tooltip form to rect
tooltip.append("rect")
   .attr("width", 60)
   .attr("height", 20)
   .attr("fill", "white")
   .style("opacity", 0.5);

// add tooltip text
tooltip.append("text")
       .attr("x", 30)
       .attr("dy", "1.2em")
       .style("text-anchor", "middle")
       .attr("font-size", "12px")
       .attr("font-weight", "bold");

// add correct margins to x axis
svg.append("g")
   .attr('transform', 'translate(0, ' + (h - margin.bottom) +  ')')
   .call(xAxis);

// add correct margins to y axis
svg.append("g")
   .attr('transform', 'translate('+ (margin.left) + ',0)')
   .call(yAxis);
};

importData();

// function to randomize a given list
function shuffle(array) {
  var currentIndex = array.length, temporaryValue, randomIndex;

  // While there remain elements to shuffle
  while (0 !== currentIndex) {

    // Pick a remaining element
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;

    // Swap element with the current element
    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }
  return array;
}
