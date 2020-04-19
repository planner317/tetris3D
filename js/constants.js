"use strict";

// Global constants.
const TESTING = !true;
const FLIP_BOARD = !true;
const CORNER_CUBES = !true;
const FLOOR_TEXTURE_PATH = "img/floor1.jpg";
const CUBE_TEXTURE_PATH = "img/cube-face.png";
const ADD_GRID_HELPER = !true;
const ADD_AXIS_HELPER = !true;
const CUBE_SIZE = 40;
let BOARD_SIZE = 4;
let userGeometry = 0;
let CUBMAT = 0;
let kasha = 0;
const BOARD_HEIGHT = 10;
const DEFAULT_BOARD = 0;
const ROTATION_AMOUNT = 0.05;
const MINIMUM_SPEED_MODIFIER = 0.1;

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
  userGeometry = e.target.value
  if (e.target.value==3) kasha=1
}
function setMat(e) {
  CUBMAT = e.target.value
}