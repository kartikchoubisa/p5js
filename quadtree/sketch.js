const CANVAS_SIZE = window.innerHeight;
const QUERY_SIZE = 200;
const POINTS_COUNT = 100;
const QUADTREE_CAPACITY = 4;


let qtree
let kdtree

let points_array = [];
let count = 0; //stores the number of points checked by quadtree query function

let MODE = "qtree"

function generate_random_points() {
  //generating random points
  points_array = []
  for (let i = 0; i < POINTS_COUNT; i++) {
    let x = randomGaussian(width / 2, width / 4);
    let y = randomGaussian(height / 2, height / 4);
    let p = new Point(x, y);
    points_array.push(p);
  }
  return points_array
}

function setup_quadtree() {
  //creating qtree spanning entire canvas
  let boundary = new Rectangle(0, 0, CANVAS_SIZE, CANVAS_SIZE);
  qtree = new Quadtree(boundary, QUADTREE_CAPACITY);

  //filling qtree with points
  //TODO: instead of inserting each point one by one, use a qtree.build() funciton
  for (let p of points_array) {
    qtree.insert(p);
  }
}

function setup_kdtree() {
  //creating KdTree
  boundary = new Rectangle(0, 0, CANVAS_SIZE, CANVAS_SIZE);
  kdtree = new KdTree();
  // t.build([new Point(30,20), new Point(70,60), new Point(50,80), new Point(20,40)], r);
  kdtree.build(points_array, boundary);

  // console.log(kdtree);
  // kdtree.show();
}

function setup() {
  // create canvas
  createCanvas(CANVAS_SIZE, CANVAS_SIZE);

  //generate points
  points_array = generate_random_points();

  setup_quadtree();
  setup_kdtree();
}

function draw_query_rectangle() {
  //draw query rectangle  
  let range = new Rectangle(mouseX, mouseY, QUERY_SIZE, QUERY_SIZE);
  noStroke();
  fill(255, 255, 255, 100);
  rect(range.x, range.y, range.w, range.h);
  return range
}

function draw_qtree_grid(qtree) {
  rect(qtree.boundary.x, qtree.boundary.y, qtree.boundary.w, qtree.boundary.h);
  if (qtree.divided) {
    draw_qtree_grid(qtree.northwest);
    draw_qtree_grid(qtree.northeast);
    draw_qtree_grid(qtree.southwest);
    draw_qtree_grid(qtree.southeast);
  }

}


function draw_kdtree_grid(kdtree) {
  var node = kdtree.root;

  function f(node) {
    if (node === null) {
      return;
    }

    if (node.point) {

      rect(node.boundary.x, node.boundary.y, node.boundary.w, node.boundary.h);
    }

    if (node.left !== null) {
      f(node.left);
    }
    if (node.right !== null) {
      f(node.right);
    }
  }

  f(node);
}


//Toggle mode on mouse click
function mousePressed() {
  if (MODE == qtree) {
    MODE = kdtree;
  }
  else if (MODE == kdtree) {
    MODE = qtree;
  }
}

function draw() {

  MODE = eval(MODE) // some weird js hack to get object from string
  background(0);


  //draw boundaries
  stroke(50);
  strokeWeight(1);
  noFill();
  if (MODE == qtree) {
    draw_qtree_grid(qtree);
  }
  else if (MODE == kdtree) {
    draw_kdtree_grid(kdtree);
  }

  //drawing points
  stroke(244, 243, 238);
  strokeWeight(4);
  for (let p of points_array) {
    point(p.x, p.y);
  }
  
  //drawing query rectangle
  range = draw_query_rectangle()
  
  //querying the tree for points inside range
  count = 0;
  var [ans, searchedNodes] = MODE.query(range);
  
  //print the number of points checked by the query function
  // console.log(`${count} points checked`);
  
  //draw searched Nodes (boundaries)
  stroke(150);
  strokeWeight(1);
  fill(100, 150, 100, 100);
  for (let r of searchedNodes) {
    rect(r.x, r.y, r.w, r.h);
  }
  
  //drawing the points inside the query range
  for (let p of ans) {
    stroke(0, 204, 50);
    strokeWeight(8);
    point(p.x, p.y);
  }

  //drawing text
  let padding = 10;
  textSize(16)
  fill(255,255,255)
  noStroke()
  push();
  textAlign(RIGHT,TOP)
  translate(width-padding, padding);
  text(`${count} points checked`, 0,0)
  translate(0,20);
  text(`MODE : ${MODE.constructor.name}`, 0,0)
  pop();

}