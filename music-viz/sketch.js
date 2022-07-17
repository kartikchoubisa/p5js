var song
var fft
var particles = [];

function preload() {
  song = loadSound('./source.mp3');
  song.setVolume(0.5);
}

function setup() {
  // create canvas covering entire window
  createCanvas(500,500);
}

function draw() {

}