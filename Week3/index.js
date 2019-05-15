<<<<<<< HEAD
let canvas = document.querySelector('canvas');
canvas.width = 1000;
canvas.height = 500;

let xGrid = 10;
let yGrid = 10;
let cellSize = 10;

let ctx=canvas.getContext('2d');

let data = {
  Australia: 1000,
  India: 2700,
  USA: 500,
  Brasil: 2100,
  China: 3000
}

const entries = Object.entries(data);

function drawGrids()
{
  ctx.beginPath();

  while(xGrid < canvas.height)
  {
    ctx.moveTo(0, xGrid);
    ctx.lineTo(canvas.width, xGrid);
    xGrid += cellSize;
  }

  while(yGrid < canvas.width)
  {
    ctx.moveTo(yGrid, 0);
    ctx.lineTo(yGrid, canvas.height)
    yGrid += cellSize;
  }
  ctx.strokeStyle = "grey";
  ctx.stroke();

}

function blocks(count)
{
  return count * cellSize;
}

function drawAxis()
{
  let yPlot = 40;
  let start = 0;
  ctx.beginPath();
  ctx.strokeStyle = "black";

  // draws the axis
  ctx.moveTo(blocks(5), blocks(5));
  ctx.lineTo(blocks(5), blocks(40));
  ctx.lineTo(blocks(80), blocks(40));

  // draws the text near the axis
  ctx.moveTo(blocks(5), blocks(40));

  while(yPlot > 0)
  {
    ctx.strokeText(start, blocks(2), blocks(yPlot));
    yPlot -= 5;
    start += 500;
  }
  ctx.stroke();
}

function drawChart()
{
  ctx.beginPath();
  ctx.strokeStyle = "black";
  ctx.moveTo(blocks(5), blocks(40));

  var xPlot = 10;

  for(const [country, population] of entries)
  {
    var populationInBlocks = population / 100;
    ctx.lineTo(blocks(xPlot), blocks(40 - populationInBlocks));
    ctx.strokeText(country, blocks(xPlot + 1), blocks(40 - populationInBlocks));
    ctx.arc(blocks(xPlot), blocks(40-populationInBlocks), 2, 0, Math.PI*2, true);
    xPlot+=5;
  }
  ctx.stroke();
}


drawGrids();
drawAxis();
drawChart();





// show the data in browser
function showData()
{
  for(let info in hallo)
  {
    console.log(info);
  }
}


let temperature = [];
let hour = [];
let day = [];

var fileName = "data.json";
var txtFile = new XMLHttpRequest();
txtFile.onreadystatechange = function() {
  if (txtFile.readyState === 4 && txtFile.status == 200) {
      // console.log(JSON.parse(txtFile.responseText));
      // document.getElementById('bottle').textContent = JSON.parse(txtFile.responseText["LAT;;;;;52.3740"]);
      var items = JSON.parse(txtFile.responseText);
      console.log(JSON.parse(txtFile.responseText));
      //
      // for(var i; i < )

      // var items = test["Year;Month;Day;Hour;Minute;Temperature"];
      // //
      for(line in items)
      {
        // console.log(items[line].split(".")[1]);


        console.log(items[line])
        // temperature.push(items[line].split(".")[1])
        // day.push(items[line].split(";")[2])
        // hour.push(items[line].split(";")[3])
      }
      // console.log(JSON.parse(txtFile.responseText.Year))

  }
}
txtFile.open("GET", fileName);
txtFile.send();

console.log(temperature)

// console.log(Object.keys(txtFile));





// let temperatures = [];
//
// fetch("./data.json")
//   .then(function(resp) {
//     return resp.json();
//   })
//   .then(function(data) {
//     console.log(data);
//     temperatures = data["LAT;;;;;52.3740"];
//   });
//
// function parseData(data)
// {
//   // delete first rows of data
//   for(let i = 0; i < 10; i++)
//   {
//     delete data[i];
//   }
//   // splits data on ";"
//
//   // for(line in data)
//   // {
//   //   console.log(data[line].split(".")[1]);
//   // }
//   // temperature.splice(0, 9);
// }
=======
let canvas = document.querySelector('canvas');
canvas.width = 1000;
canvas.height = 500;

let xGrid = 10;
let yGrid = 10;
let cellSize = 10;

let ctx=canvas.getContext('2d');

let data = {
  Australia: 1000,
  India: 2700,
  USA: 500,
  Brasil: 2100,
  China: 3000
}

const entries = Object.entries(data);

function drawGrids()
{
  ctx.beginPath();

  while(xGrid < canvas.height)
  {
    ctx.moveTo(0, xGrid);
    ctx.lineTo(canvas.width, xGrid);
    xGrid += cellSize;
  }

  while(yGrid < canvas.width)
  {
    ctx.moveTo(yGrid, 0);
    ctx.lineTo(yGrid, canvas.height)
    yGrid += cellSize;
  }
  ctx.strokeStyle = "grey";
  ctx.stroke();

}

function blocks(count)
{
  return count * cellSize;
}

function drawAxis()
{
  let yPlot = 40;
  let start = 0;
  ctx.beginPath();
  ctx.strokeStyle = "black";

  // draws the axis
  ctx.moveTo(blocks(5), blocks(5));
  ctx.lineTo(blocks(5), blocks(40));
  ctx.lineTo(blocks(80), blocks(40));

  // draws the text near the axis
  ctx.moveTo(blocks(5), blocks(40));

  while(yPlot > 0)
  {
    ctx.strokeText(start, blocks(2), blocks(yPlot));
    yPlot -= 5;
    start += 500;
  }
  ctx.stroke();
}

function drawChart()
{
  ctx.beginPath();
  ctx.strokeStyle = "black";
  ctx.moveTo(blocks(5), blocks(40));

  var xPlot = 10;

  for(const [country, population] of entries)
  {
    var populationInBlocks = population / 100;
    ctx.lineTo(blocks(xPlot), blocks(40 - populationInBlocks));
    ctx.strokeText(country, blocks(xPlot + 1), blocks(40 - populationInBlocks));
    ctx.arc(blocks(xPlot), blocks(40-populationInBlocks), 2, 0, Math.PI*2, true);
    xPlot+=5;
  }
  ctx.stroke();
}


drawGrids();
drawAxis();
drawChart();





// show the data in browser
function showData()
{
  for(let info in hallo)
  {
    console.log(info);
  }
}


let temperature = [];

var fileName = "data.json";
var txtFile = new XMLHttpRequest();
txtFile.onreadystatechange = function() {
  if (txtFile.readyState === 4 && txtFile.status == 200) {
      console.log(JSON.parse(txtFile.responseText));
  }
}
txtFile.open("GET", fileName);
txtFile.send();


console.log(Object.keys(txtFile));





// let temperatures = [];
//
// fetch("./data.json")
//   .then(function(resp) {
//     return resp.json();
//   })
//   .then(function(data) {
//     console.log(data);
//     temperatures = data["LAT;;;;;52.3740"];
//   });
//
// function parseData(data)
// {
//   // delete first rows of data
//   for(let i = 0; i < 10; i++)
//   {
//     delete data[i];
//   }
//   // splits data on ";"
//
//   // for(line in data)
//   // {
//   //   console.log(data[line].split(".")[1]);
//   // }
//   // temperature.splice(0, 9);
// }
>>>>>>> f1f2d0d2d7b33662f6d6ee0c5aab566f1d980fa6
