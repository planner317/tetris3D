"use strict";

// manager
var portal317 = new PortalCube()
function PortalCube() {
  this.Cube = 8456;
  var portalCube

  function loadModel() {
    portalCube.traverse(function (child) {
      portalCube.scale.set(1.63, 1.63, 1.63)
      portalCube.children[0].castShadow = true;
      portalCube.children[0].receiveShadow = true;
      portal317.Cube = portalCube
    });
  }



  var manager = new THREE.LoadingManager(loadModel);

  manager.onProgress = function (item, loaded, total) {
    console.log(item, loaded, total);
  };

  // texture Diffuse
  var textureLoader = new THREE.TextureLoader(manager);
  var textureD = textureLoader.load('../model/cube_heart.jpg');

  // texture Light
  var textureLoader = new THREE.TextureLoader(manager);
  var textureL = textureLoader.load('../model/cube_heart_light.jpg');
  // model
  function onProgress(xhr) {
    if (xhr.lengthComputable) {
      var percentComplete = xhr.loaded / xhr.total * 100;
      console.log('model ' + Math.round(percentComplete, 2) + '% downloaded');
    }
  }

  function onError() { console.log("ошибка"); }

  var objLoader = new THREE.OBJLoader(manager);

  objLoader.load('../model/cub.obj', function (obj) {
    portalCube = obj;
  }, onProgress, onError);

}