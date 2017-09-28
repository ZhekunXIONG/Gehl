var plainFont;
var boldFont

var chartLeft = 50;
var chartRight = 750;

var chartTop = 50;
var chartBottom = 450;

var minHour = 11;
var maxHour = 20;

var compareTable;
var hourCount;

var index = 8;

var minP = 0;
var maxP = 240;

var legendNames = ['Jul.25(Tue)', 'Jul.26(Wed)', 'Jul.28(Fri)', 'Jul.31(Mon)', 'Aug.01(Tue)', 'Aug.02(Wed)', 'Aug.03(Thu)', 'Aug.04(Fri)', 'Aug.06(Sun)'];
var startHour = ["12PM", "1PM", "11AM", "11AM", "11AM", "11AM", "11AM", "11AM", "11AM"]
var lastHour = ["2PM", "2PM", "4PM", "5PM", "8PM", "8PM", "3PM", "7PM", "8PM"]


function preload() {
  plainFont = loadFont("data/Roboto-Light.ttf");
  boldFont = loadFont("data/Roboto-Bold.ttf");
  compareTable = loadTable("data/alldays.csv", "header");
}


function setup() {
  createCanvas(1200, 800);
  
  hourCount = compareTable.getRowCount() - 1;
  
  // Create Slider of Date
  slider = createSlider(0, 8, 8, 1);
  slider.position(200, 550);
  slider.size(400);
  slider.changed(showTime);
}


function showTime(){
  index = slider.value();
}


function draw() {
  background(255, 81, 82);
  
  textFont(boldFont, 12);
  fill(255);
  noStroke();
  textAlign(LEFT);
  text("GoPro Pedestrian Detection", chartLeft-10, 30);


  // draw the text for the legend
  fill(255);
  
  // draw Y-axis's text
  textAlign(LEFT);
  for (var t = minP; t <= maxP; t += 30) {
    var ty = map(t, minP, maxP, chartBottom, chartTop);
    var degrees = floor(t);
    //if (t == maxTemp) {
    //  degrees += 'F';  // add the F to the 0° mark
    //}
    text(degrees, 770, ty);
  }

  // first pass: draw the connected lines
  noFill();
  stroke(255);
  line(chartLeft, chartBottom, chartRight, chartBottom)
  // beginShape();

  for (var d = 0; d < hourCount-1; d += 1) {
    if (!(compareTable.get(d, index) == 0) && !(compareTable.get(d+1, index) == 0)){
    //vertex(compareX(d), compareY(d, index));
      strokeWeight(1);
      line(compareX(d), compareY(d, index), compareX(d+1), compareY(d+1, index))
    }
  }
  //endShape();

  // second pass: draw the points
  noStroke();
  fill(255);
  for (var hour = 0; hour < hourCount; hour += 1) {
    if (compareTable.get(hour, index) != 0){
      strokeWeight(0.2)
      stroke(255)
      line(compareX(hour, index), compareY(hour, index), compareX(hour, index), chartBottom)
      noStroke();
      ellipse(compareX(hour, index), compareY(hour, index), 6, 6);
    }
  }
  
  // draw hour
  noStroke();
  textFont(plainFont);
  textAlign(CENTER);
  for (var hour=minHour; hour<=maxHour; hour++) {
    var xy = map(hour, minHour, maxHour, chartLeft, chartRight);
    var texthour = hour + "'00"; 
    textSize(10)
    text(texthour, xy, 500);
  }
  
  var legendX = map(index, 0, 8, 210, 600)
  text(legendNames[index], legendX, 540)


  textAlign(LEFT)
  textFont(boldFont)
  textSize(30)
  text(compareTable.get(9, index), 850, 360)
  
  textSize(20)
  text(startHour[index], 850, 450)
  text(lastHour[index], 930, 450)
  
  textSize(15)
  text("pedestrians passed by", 850, 380)
  text("From", 850, 430)
  text("To", 930, 430)




}


function compareX(hour) {
  return map(hour, 0, hourCount-1, chartLeft+35, chartRight-35);
}


function compareY(hour, index) {
  return map(compareTable.get(hour, index), 
             minP, maxP, 
             chartBottom, chartTop)
}