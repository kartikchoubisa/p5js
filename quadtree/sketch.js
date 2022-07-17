const CANVAS_SIZE = 600;
const QUERY_SIZE = 200;
const POINTS_COUNT  = 200;
const QUADTREE_CAPACITY = 4;

let qtree
let points_array = []; 
let count = 0; //stores the number of points checked by quadtree query function

function setup() {
  // create canvas
  createCanvas(CANVAS_SIZE,CANVAS_SIZE);

  //creating qtree spanning entire canvas
  let boundary = new Rectangle(0,0,CANVAS_SIZE,CANVAS_SIZE);
  qtree = new Quadtree(boundary, QUADTREE_CAPACITY);

  //generating random points
  for (let i = 0; i < POINTS_COUNT; i++) {
    let x = randomGaussian(width/2, width/4);
    let y = randomGaussian(height/2, height/4);
    let p = new Point(x, y);
    points_array.push(p);
  }

  //filling qtree with points
  for (let p of points_array) {
    qtree.insert(p);
  }
}

function show_qtree(qtree) {
  rect(qtree.boundary.x, qtree.boundary.y, qtree.boundary.w, qtree.boundary.h);
  if (qtree.divided) {
    show_qtree(qtree.northwest);
    show_qtree(qtree.northeast);
    show_qtree(qtree.southwest);
    show_qtree(qtree.southeast);
  }
}

function draw() {

  background(0);

  //drawing points
  stroke(244, 243, 238);
  strokeWeight(4);
  for (let p of points_array) {
    point(p.x, p.y);
  }

  //draw quadtree boundaries
  stroke(50);
  strokeWeight(1);
  noFill();
  show_qtree(qtree);

  //draw query rectangle  
  let range = new Rectangle(mouseX, mouseY, QUERY_SIZE, QUERY_SIZE);
  noStroke();
  fill(255,255,255, 100);
  rect(range.x, range.y, range.w, range.h);

  //querying the quadtree for points inside range
  count = 0;
  [ans, unsearched_quads, searched_quads] = qtree.query(range);

  //console log the number of points checked by the query function
  console.log(`${count} points checked`);

  //draw searched quadrants (boundaries)
  stroke(150);
  strokeWeight(1);
  fill(100, 150, 100, 100);
  for (let r of searched_quads) {
    rect(r.x, r.y, r.w, r.h);
  }

  //drawing the points inside the range
  for (let p of ans) {
    stroke(0, 204, 50);
    strokeWeight(8);
    point(p.x, p.y);
  }  

}