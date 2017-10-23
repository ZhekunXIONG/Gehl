var plainFont;
var boldFont

var chartLeft = 50;
var chartRight = 750;
var distance

var chartTop = 50;
var chartBottom = 450;

var minHour = 10;
var maxHour = 21;

var compareTable;
var interestTable;
var weatherTable;
var halfHourCount;

var index = 9;

var minP = 0;
var maxP = 150;
var legendNames = ['Jul.25(Tue)', 'Jul.26(Wed)', 'Jul.27(Thu)', 'Jul.28(Fri)', 'Jul.31(Mon)', 'Aug.01(Tue)', 'Aug.02(Wed)', 'Aug.03(Thu)', 'Aug.04(Fri)', 'Aug.06(Sun)'];
var startHour = ["11'30AM", "12'30PM", "11AM", "10'30AM", "10'30AM", "11AM", "11AM", "11AM", "10'30AM", "11AM"]
var lastHour = ["2PM", "2'30PM", "4'30PM", "4'00PM","5'30PM", "7PM", "8'30PM", "3PM", "7PM", "8'30PM"]
var imgMapList = []
var imgMap


function preload() {
  plainFont = loadFont("data/Gotham-Book.ttf");
  boldFont = loadFont("data/Gotham-Bold.ttf");
  compareTable = loadTable("data/alldays_halfhour.csv", "header");
  interestTable = loadTable("data/alldays_interest_halfhour.csv", "header");
  weatherTable = loadTable("data/infoweather.csv","header");
  imgPerson = loadImage("img/person.png");
  
  for (var i=0; i<10; i++){
    var imgMap = loadImage("img/pmesh_"+str(i)+".jpg");
    imgMapList.push(imgMap)
  }  
}


function setup() {
  createCanvas(1100, 600);
  
  halfHourCount = compareTable.getRowCount()-1;
  
  distance = (chartRight - chartLeft)/halfHourCount

  
  // Create Slider of Date
  slider = createSlider(0, 9, 9, 1);
  slider.position(200, 550);
  slider.size(400);
  slider.changed(showTime);
}


function showTime(){
  index = slider.value();
}


function draw() {
  background(255, 81, 81);
  imageMode(CENTER);
  
  textFont(boldFont, 15);
  fill(255);
  noStroke();
  textAlign(LEFT);
  text("GoPro", chartLeft-10, 50);
  text("Pedestrian", chartLeft-10, 65);
  text("Detection", chartLeft-10, 80);

  // draw weather info
  textAlign(RIGHT)
  textFont(plainFont)
  textSize(10)
  text(weatherTable.get(0, index), 1100-50, 45)
  textFont(boldFont)
  textSize(25)
  text(weatherTable.get(1, index), 1100-50, 90)
  textSize(15)
  text(weatherTable.get(2, index), 1100-50, 110)
  textFont(plainFont)
  textSize(50)
  text(weatherTable.get(3, index), 1100-70, 165)
  ellipse(1100-55, 135, 10,10);
  fill(255, 81, 81);
  ellipse(1100-55, 135, 5, 5);
  stroke(255);
  strokeWeight(2);
  strokeCap(PROJECT);
  line(850, 180, 1100-55, 180)


  // draw the text for the legend
  fill(255);
  noStroke();
  textSize(10)
  textFont(boldFont)
  
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
  strokeWeight(0.5)
  line(chartLeft, chartBottom, chartRight, chartBottom)
  // beginShape();

  for (var d = 0; d < halfHourCount; d += 1) {
    if (!(compareTable.get(d, index) == 0) && !(compareTable.get(d+1, index) == 0)){
    //vertex(compareX(d), compareY(d, index));
      strokeWeight(1);
      line(compareX(d), compareY(d, index, compareTable), compareX(d+1), compareY(d+1, index, compareTable))
    }
  }
  //endShape();

  // second pass: draw the points and interestedness
  noStroke();
  fill(255);
  var data =[]
  for (var d = 0; d < halfHourCount; d += 1) {
    if (compareTable.get(d, index) != 0){
      data.push(compareTable.get(d, index))
      strokeWeight(0.2)
      stroke(255)
      line(compareX(d, index), compareY(d, index, compareTable), compareX(d, index), chartBottom)
      noStroke();
      fill(255)
      ellipse(compareX(d, index), compareY(d, index, compareTable), 6, 6);
      
      // draw interestedness people icons
      var numInterest = interestTable.get(d, index);
      var column = ceil(numInterest/6)
      if (numInterest != 0){
        for (var num = 0; num<numInterest; num++){
          image(imgPerson, compareX(d, index), compareY(d, index, compareTable) - (num+1.5)*12, imgPerson.width/25, imgPerson.height/25)
        }
      }
      //fill(255, 246, 0)
      //stroke(255, 246, 0)
      //strokeWeight(2)
      //line(compareX(d, index)-3, compareY(d, index, interestTable), compareX(d, index)+3, compareY(d, index, interestTable))
    }
  }
  
  // min and max dashlines
  stroke(255);
  var mindata = min(data)
  var maxdata = max(data)
  lineminY = map(mindata, minP, maxP, chartBottom, chartTop)
  linemaxY = map(maxdata, minP, maxP, chartBottom, chartTop)
  
  textAlign(LEFT);
  textSize(15)
  text(mindata, chartLeft, lineminY-10)
  text(maxdata, chartLeft, linemaxY-10)
  
  var distance = (chartRight-chartLeft)/100
  for (var i=0; i<100; i++){
    var start = chartLeft + distance*i+distance*1/4
    var end = chartLeft + distance*(i+1)-distance*1/4 
    line(start, lineminY, end, lineminY-5)
    line(start, linemaxY, end, linemaxY-5)
  }
  
  // draw hour
  fill(255)
  noStroke();
  textFont(plainFont);
  textAlign(CENTER);
  for (var hour=minHour; hour<=maxHour; hour++) {
    var xy = map(hour, minHour, maxHour, chartLeft, chartRight);
    var texthour = hour + "'00"; 
    textSize(10)
    text(texthour, xy, 470);
  }
  
  var legendX = map(index, 0, 9, 210, 600)
  text(legendNames[index], legendX, 540)


  // draw total number
  noStroke();
  textAlign(LEFT)
  textFont(boldFont)
  textSize(35)
  text(compareTable.get(22, index), 850, 600-150)
  fill(249, 153, 255)
  text(interestTable.get(22, index), 980, 600-150)
  
  fill(255);
  textSize(15)
  text(startHour[index], 850, 600-85)
  text(lastHour[index], 850, 600-50)
  
  textSize(10)
  text("pedestrians in total", 850, 600-135)
  fill(249, 153, 255)
  text("INTERESTED", 980, 600-135)
  fill(255);
  text("From", 850, 600-100)
  text("To", 850, 600-65)
  
  // pie chart
  ellipse(1100-55-35, 600-45-35 ,70,70)
  var prop = interestTable.get(22, index)/compareTable.get(22, index)
  fill(249, 153, 255)
  arc(1100-55-35, 600-45-35, 70, 70, radians(0),radians(prop*360))
  fill(255, 81, 81)
  ellipse(1100-55-35, 600-45-35, 30, 30)
  
  // HEATMAP
  image(imgMapList[index], 1100-55-195/2, 290, 195, 195)
  textAlign(RIGHT);
  fill(255)
  text("Pedestrian Heatmap", 1100-55, 400)
}


function compareX(d) {
  xcoord = map(d, 0, halfHourCount, chartLeft, chartRight) + distance/2;
  return xcoord
}

function compareY(d, index, table) {
  return map(table.get(d, index), 
             minP, maxP, 
             chartBottom, chartTop)
}