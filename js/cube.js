"use strict";

/* Cube Object.
 */
var Cube = function (x = 0, y = 0, z = 0, color = 0xffffff, blockNumber = 0, attachments = {}) {
  // Create geometry and material for cube.
  var g
  if (userGeometry == "box") g = new THREE.BoxGeometry(CUBE_SIZE , CUBE_SIZE , CUBE_SIZE );
  if (userGeometry == "sphere") g = new THREE.SphereBufferGeometry(20, 15, 15)
  if (userGeometry == "boxSmooth") {
    g = box317.box.children[0].geometry
  }
  if (userGeometry == "portalBox") {
    this.cube = new THREE.Object3D().copy(portal317.Cube);
    this.cube.children[0].material = material317.portalCube(color);
  }
  if (userGeometry != "portalBox") {

    var cubeMaterial = new THREE.MeshPhongMaterial({
      color: color,
      shininess: 150,
      specular: 0x222222
    });

    // Create mesh for cube.
    var cubeMesh = new THREE.Mesh(g, cubeMaterial);
    cubeMesh.castShadow = true;
    cubeMesh.receiveShadow = true;
    // Create geometry and material for black outline of the cube.

    // Set color, cube and outline meshes, their positions, and
    // the block number this cube is associated with.
    this.color = color;
    this.cube = cubeMesh;
  }

  this.x = x;
  this.y = y;
  this.z = z;
  this.blockNumber = blockNumber;

  // We want to know if this cube is attached to any other cubes.
  this.attachments = attachments;
  if (this.attachments.xPos == undefined) {
    this.attachments.xPos = false;
  }
  if (this.attachments.xNeg == undefined) {
    this.attachments.xNeg = false;
  }
  if (this.attachments.yPos == undefined) {
    this.attachments.yPos = false;
  }
  if (this.attachments.yNeg == undefined) {
    this.attachments.yNeg = false;
  }
  if (this.attachments.zPos == undefined) {
    this.attachments.zPos = false;
  }
  if (this.attachments.zNeg == undefined) {
    this.attachments.zNeg = false;
  }

  // Default ID of 0. This is used to know which cube in the block
  // this is.
  this.id = 0;

  // Update this cube's position.
  this.updatePosition();
};

/* Prototype functions.
 */
Cube.prototype = {
  constructor: Cube,

  getCoordinates: function () {
    return { x: this.x, y: this.y, z: this.z };
  },

  getX: function () {
    return this.x;
  },

  getY: function () {
    return this.y;
  },

  getZ: function () {
    return this.z;
  },

  setCoordinates: function (x = 0, y = 0, z = 0) {
    this.x = x;
    this.y = y;
    this.z = z;
    this.updatePosition();
  },

  setX: function (x = 0) {
    this.x = x;
    this.updatePosition();
  },

  setY: function (y = 0) {
    this.y = y;
    this.updatePosition();
  },

  setZ: function (z = 0) {
    this.z = z;
    this.updatePosition();
  },

  addX: function (xOffset = 0) {
    this.x += xOffset;
    this.updatePosition();
  },

  addY: function (yOffset = 0) {
    this.y += yOffset;
    this.updatePosition();
  },

  addZ: function (zOffset = 0) {
    this.z += zOffset;
    this.updatePosition();
  },

  getId: function () {
    return this.id;
  },

  setId: function (id = 0) {
    this.id = id;
  },

  updatePosition: function () {
    // We have the board centered on the y-axis, so we need to adjust the
    // position accordingly.
    var cubeOffset = CUBE_SIZE / 2;
    var xOffset = ((BOARD_SIZE / 2) * CUBE_SIZE) - cubeOffset;
    var zOffset = xOffset;
    var yOffset = cubeOffset
    var newX = (this.x * CUBE_SIZE) - xOffset;
    var newZ = (this.z * CUBE_SIZE) - zOffset;
    var newY = (this.y * CUBE_SIZE) + yOffset;

    // Move it to the provided location.
    this.cube.position.set(newX, newY, newZ);
  },

  // Update the texture if one has been loaded.
  updateTexture: function () {
    if (game.cubeMat == 0) this.cube.material = material317.metal2(this.color)
    if (game.cubeMat == 1) this.cube.material = material317.wood()
    if (game.cubeMat == 2) this.cube.material = material317.sponge(this.color)
    if (game.cubeMat == 3) this.cube.material = material317.glass(this.color)
    if (game.cubeMat == 4) this.cube.material = material317.stone()
  },

  // Reset the texture to the color for this cube.
  resetTexture: function () {
    this.cube.material = new THREE.MeshPhongMaterial({
      color: this.color
    });
  },

  addToScene: function (scene) {
    scene.add(this.cube);
  }
};
