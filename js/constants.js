"use strict";

// Global constants.
const COL = [
  0xFF0000,
  0xff007e,
  0xff00fc,
  0x6600ff,
  0x002aff,
  0x0096ff,
  0x00d8ff,
  0x00ffc6,
  0x00ff3c,
  0x48ff00,
  0xfff000,
  0xff9c00,
  0xff6000,
  0xff3600,
]
const TESTING = !true;
const FLIP_BOARD = !true;
const CORNER_CUBES = !true;
const FLOOR_TEXTURE_PATH = "img/floor1.jpg";
const CUBE_TEXTURE_PATH = "img/cube-face.png";
const ADD_GRID_HELPER = !true;
const ADD_AXIS_HELPER = !true;
const CUBE_SIZE = 40;
let BOARD_SIZE = 4;
let userGeometry = "portalBox";
let CUBMAT = 0;
let mix = 0;
let mobil = 1;
const BOARD_HEIGHT = 10;
const DEFAULT_BOARD = 0;
const ROTATION_AMOUNT = 0.05;
const MINIMUM_SPEED_MODIFIER = 0.1;
const COLLECTION_GEOMETRY=["box", "boxSmooth", "portalBox", "sphere"];
// Testing
var camera_y, camera_x, camera_z;
if (TESTING) {
  camera_y = 300;
  camera_x = 600;
  camera_z = 600;
} else {
  camera_y = 300;
  camera_x = 300;
  camera_z = 300;
}
if (FLIP_BOARD) {
  camera_x *= -1;
  camera_z *= -1;
}
const CAMERA_Y = camera_y;
const CAMERA_X = camera_x;
const CAMERA_Z = camera_z;
const CAMERA_POINT_Y = 200;
const CAMERA_POINT_X = 0;
const CAMERA_POINT_Z = 0;

function setPole(e) {
  BOARD_SIZE = e.target.value
  pole.innerText = e.target.value + " x " + e.target.value;
}
function setForm(e) {
  console.log(e.target.value);
  if (e.target.value == "random") mix = 1
  else  userGeometry = e.target.value
}
function setMat(e) {
  CUBMAT = e.target.value
}