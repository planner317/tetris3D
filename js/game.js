"use strict";

/* Game Object.
 */
var game
function startGame() {
  game = new Game();
  if (!game.initialized) {
    game.init();
  }
  game.startGame()
  // Start the game/animation loop.
  game.animate();
  game.board.advance();
  document.documentElement.requestFullscreen()
}

var Game = function () {
  // Declare some public variables.
  this.scene = null;
  this.camera = null;
  this.board = null;
  this.renderer = null;
  this.geometry = null;
  this.material = null;
  this.mesh = null;

  // We need to be able to access a couple DOM elements.
  this.pointsLabel = document.getElementById("points-label");

  // Initialize some public variables.
  this.animateMoveRotate;
  this.cubeMat = CUBMAT;
  this.cameraRot = 0;
  this.dropThreshold = 1;
  this.dropCounter = 0;
  this.keepPlaying = false;
  this.paused = true;
  this.boardType = DEFAULT_BOARD;
  this.boom = []

  // Initialize some flags.
  this.initialized = false;
  this.keysAreBound = false;
  this.playMusic = true;

  // We want to keep track of the score and level. The level
  // counter increases every time a line is cleared, and the
  // level increases every time the counter reaches 3. The
  // speed modifier is changed to 70% of its current value
  // for every two levels that have been reached.
  this.score = 0;
  this.speedModifier = 1;
  this.animateCounter = this.animateStep = 10;
  this.go;

  // Canadian mode.
  this.canadianMode = true;

  // Debug mode.
  this.debugMode = false;
};

/* Prototype functions.
 */
Game.prototype = {
  constructor: Game,

  // Initialize the game.
  init: function () {
    // Set the flag.
    this.initialized = true;
    if (mix) {
      userGeometry = COLLECTION_GEOMETRY[Math.floor(Math.random() * COLLECTION_GEOMETRY.length)];
      game.cubeMat = Math.floor(Math.random() * 5);
    }
    // Create the main scene for the 3D drawing
    this.scene = new THREE.Scene();

    /////////////////// СФЕРА ДЛЯ ПАНОРАМЫ
    if (userGeometry == "portalBox") this.scene.background = texture317.portalFonCube;
    else this.scene.background = texture317.fon2;
    //else this.scene.background = new THREE.Color(0x103044);
    // The renderer renders the scene using the objects, lights and camera.
    this.renderer = new THREE.WebGLRenderer();
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.shadowMap.type = THREE.PCFShadowMap;
    this.renderer.shadowMap.enabled = true;
    // Every scene needs a camera
    this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 1, 10000);
    this.camera.position.y = CAMERA_Y;
    this.camera.position.x = Math.sin(this.cameraRot) * CAMERA_X;
    this.camera.position.z = Math.cos(this.cameraRot) * CAMERA_Z;
    this.camera.lookAt(new THREE.Vector3(CAMERA_POINT_X, CAMERA_POINT_Y, CAMERA_POINT_Z));

    window.addEventListener('resize', onWindowResize, false);
    // самера вращалка
    this.orbit = new THREE.OrbitControls(this.camera, document.body)

    this.orbit.enablePan = false
    this.orbit.enableKeys = false
    this.orbit.minDistance = 50
    this.orbit.maxDistance = 1000
    this.orbit.target.y = CAMERA_POINT_Y
    this.orbit.update()
    // Add light to the scene.
    var ambientLight = new THREE.AmbientLight(0x454545);
    this.scene.add(ambientLight);
    // TODO: Add point lights.


    this.dirLight = new THREE.DirectionalLight(0xffffff, 1);
    this.dirLight.position.set(0, 700, 0)

    this.dirLight.castShadow = true;
    this.dirLight.shadow.camera.near = 1;
    this.dirLight.shadow.camera.far = 1000;
    this.dirLight.shadow.camera.right = 500;
    this.dirLight.shadow.camera.left = - 500;
    this.dirLight.shadow.camera.top = 500;
    this.dirLight.shadow.camera.bottom = - 500;
    this.dirLight.shadow.mapSize.set(1024, 1024)
    this.scene.add(this.dirLight)


    var spotLight = new THREE.PointLight(0xffffff, 0.5);
    spotLight.castShadow = true;
    spotLight.position.set(800, 800, 800)
    spotLight.shadow.camera.near = 1;
    spotLight.penumbra = 1;
    spotLight.shadow.camera.far = 5000;
    spotLight.shadow.mapSize.set(2048, 2048)

    this.scene.add(spotLight)
    // Add sky box to the scene.


    // Initialize board, then add it to the scene. We'll use the first
    // board by default.
    this.board = new Board(BOARD_SIZE, BOARD_HEIGHT);
    this.board = Object.defineProperty(this.board, "parent", { value: this });
    this.board.setBoard(DEFAULT_BOARD);
    this.board.addFloor();

    // Load external resources for the game, such as audio and textures.
    this.loadExternalResources();

    // Add grid helper to the scene.
    if (ADD_GRID_HELPER) {
      var gridSize = BOARD_SIZE * CUBE_SIZE;
      var gridDivisions = BOARD_SIZE;
      var gridHelper = new THREE.GridHelper(gridSize, gridDivisions, 0x000000, 0x000000);
      this.scene.add(gridHelper);
    }

    // Add axis helper to the scene.
    if (ADD_AXIS_HELPER) {
      var axisLength = (BOARD_SIZE * CUBE_SIZE) / 2;
      var axisHelper = new THREE.AxisHelper(axisLength);
      this.scene.add(axisHelper);
    }

    // Add key listener.
    if (!this.keysAreBound) {
      // Set flag.
      this.keysAreBound = true;

      // Add key listener.
      var thisGame = this;
      window.onkeydown = thisGame.keyHandler;

      this.keyHandler = function (e) {
        console.log("keydown:", e.key);
        if (e.key == "ArrowUp" || e.key == "w") {
          if (!thisGame.paused) {
            thisGame.moveAndRotate("up")
          }
        }
        if (e.key == "ArrowDown" || e.key == "s") {
          if (!thisGame.paused) {
            thisGame.moveAndRotate("back")
          }
        }
        if (e.key == "ArrowLeft" || e.key == "a") {
          if (!thisGame.paused) {
            thisGame.moveAndRotate("left")
          }
        }
        if (e.key == "ArrowRight" || e.key == "d") {
          if (!thisGame.paused) {
            thisGame.moveAndRotate("right")
          }
        }
        if (e.key == " ") {
          if (!thisGame.paused) {
            thisGame.go = "down";
            game.board.advance();
          }
        }
        if (e.key == "q" || e.key == "1") {
          if (!thisGame.paused) {
            thisGame.moveAndRotate("rotateX")
          }
        }
        if (e.key == "f" || e.key == "3") {
          if (!thisGame.paused) {
            thisGame.go = "rotateBlockY";
            thisGame.board.rotateBlockY();
          }
        }
        if (e.key == "e" || e.key == "2") {
          if (!thisGame.paused) {
            thisGame.moveAndRotate("rotateZ")
          }
        }
        if (e.key == "Enter") {
          thisGame.togglePause();
        }
        if (e.key == "m") {
          thisGame.toggleMusic();
        }

        if (e.key == "Escape") {
          thisGame.togglePause()
        }
        if (e.key == "c" ) {
          thisGame.toggleCanadianMode();
        }
        if (e.key == "z") {
          thisGame.cubeMat++;
          if (thisGame.cubeMat >= material317.length) thisGame.cubeMat = 0;
          console.log(thisGame.cubeMat);
        }
      }
    }

    // Attach the threeJS renderer to the HTML page
    document.body.append(this.renderer.domElement);

  },


  moveAndRotate: function (e) {

    var k = 0;
    var x = Math.abs(this.camera.position.x);
    var z = Math.abs(this.camera.position.z);
    var p = this.camera.position.x - this.camera.position.z
    if (p < 0 && x < z) k = 3
    if (p < 0 && x > z) k = 4
    if (p > 0 && x > z) k = 2
    if (p > 0 && x < z) k = 1
    console.log(k);

    if (e == "left" && k == 3 || e == "up" && k == 2 || e == "right" && k == 1 || e == "back" && k == 4) { this.go = "xMinus"; this.board.shiftBlockX(-1) }
    if (e == "left" && k == 1 || e == "up" && k == 4 || e == "right" && k == 3 || e == "back" && k == 2) { this.go = "xPlus"; this.board.shiftBlockX(1) }
    if (e == "left" && k == 4 || e == "up" && k == 3 || e == "right" && k == 2 || e == "back" && k == 1) { this.go = "zMinus"; this.board.shiftBlockZ(-1) }
    if (e == "left" && k == 2 || e == "up" && k == 1 || e == "right" && k == 4 || e == "back" && k == 3) { this.go = "zPlus"; this.board.shiftBlockZ(1) }

    if (e == "rotateX" && k == 3 || e == "rotateX" && k == 1 || e == "rotateZ" && k == 2 || e == "rotateZ" && k == 4) { this.go = "rotateBlockX"; this.board.rotateBlockX() }
    if (e == "rotateX" && k == 2 || e == "rotateX" && k == 4 || e == "rotateZ" && k == 3 || e == "rotateZ" && k == 1) { this.go = "rotateBlockZ"; this.board.rotateBlockZ() }
  },


  // Drop block one level.
  dropBlock: function () {
    this.dropCounter = this.dropThreshold;
  },


  // Rotate the camera. We want to keep the angle at a value from 0
  // to 2Pi.

  // Load external resources.
  loadExternalResources: function () {
    // We need a reference to this game for the loader callback
    // functions.
    var thisGame = this;

    // Attempt to load music. To do this, we need to create a listener
    // and add it to the camera, then we need to create a global audio
    // source.
    if (userGeometry == "portalBox") {
      this.sound = new Audio("audio/portal.mp3")
      this.sound.play()
      this.boom[0] = new Audio("audio/p1.mp3")
      this.boom[1] = new Audio("audio/p2.mp3")
      this.boom[2] = new Audio("audio/p3.mp3")
    }
    else {
      this.sound = new Audio("audio/theme.mp3")
      this.sound.play();
      this.boom[0] = new Audio("audio/d1.wav")
      this.boom[1] = new Audio("audio/d2.wav")
      this.boom[2] = new Audio("audio/d3.mp3")
    }
    this.sound.volume = this.boom[0].volume = this.boom[1].volume = this.boom[2].volume = 0.5
    this.sound.loop = true
    // Attempt to load a texture for the floor.
    this.board.ADD_FLOOR_TEXTURE = false;
    this.board.floorLoader = new THREE.TextureLoader();
    this.board.floorLoader.load(
      // Path to texture.
      FLOOR_TEXTURE_PATH,

      // Function to run upon load completion.
      function (texture) {
        // Set flags and texture.
        thisGame.board.ADD_FLOOR_TEXTURE = true;
        thisGame.board.floorTexture = texture;
        texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
        texture.repeat.set(BOARD_SIZE / 4, BOARD_SIZE / 4);
        // If the board has a floor, we want to update its material
        // with the new texture if we're in Canadian mode.
        if (thisGame.board.hasFloor && thisGame.canadianMode) {
          texture317.lava.wrapT = texture317.lava.wrapS = THREE.RepeatWrapping;
          texture317.lava.repeat.set(BOARD_SIZE / 4, BOARD_SIZE / 4);
          texture317.floorNormal.wrapT = texture317.floorNormal.wrapS = THREE.RepeatWrapping;
          texture317.floorNormal.repeat.set(BOARD_SIZE / 4, BOARD_SIZE / 4);
          var floormaterial = new THREE.MeshPhongMaterial({
            map: thisGame.board.floorTexture,
            specularMap: texture317.lava,
            shininess: 150,
            specular: 0x333333,
            normalMap: texture317.floorNormal,
            normalScale: { x: 0.1, y: 0.1 }
          });
          thisGame.board.floor.material = floormaterial;
        }
      }
    );

    // Attempt to load a texture for the cubes.
    this.board.ADD_CUBE_TEXTURE = false;
    this.board.cubeLoader = new THREE.TextureLoader();
    this.board.cubeLoader.load(
      // Path to texture.
      CUBE_TEXTURE_PATH,

      // Function to run upon load completion.
      function (texture) {
        // Set flags and texture.
        thisGame.board.ADD_CUBE_TEXTURE = true;
        thisGame.board.cubeTexture = texture;
      }
    );
  },

  // Show DOM node.
  showNode: function (node = null) {
    if (node != null) {
      // If it's hidden, unhide it.
      if (node.className.indexOf("hidden") >= 0) {
        node.className = node.className.replace("hidden", "").trim();
      }
    }
  },

  // Hide DOM node.
  hideNode: function (node = null) {
    if (node != null) {
      // If it's showing, hide it.
      if (node.className.indexOf("hidden") < 0) {
        node.className = node.className + " hidden";
        node.className = node.className.trim();
      }
    }
  },

  // Show start game title.
  showStartGameOverlay: function () {
    // Get element and display it.
    var node = document.getElementById("overlay-start-game");
    this.showNode(node);
  },

  // Hide start game title.
  hideStartGameOverlay: function () {
    // Get element and hide it.
    var node = document.getElementById("overlay-start-game");
    this.hideNode(node);
  },

  // Show paused title.
  showPausedOverlay: function () {
    // Get element and display it.
    var node = document.getElementById("overlay-paused");
    this.showNode(node);

    var contr = document.getElementById("controls");
    this.showNode(contr);
  },

  // Hide paused title.
  hidePausedOverlay: function () {
    // Get element and hide it.
    var node = document.getElementById("overlay-paused");
    this.hideNode(node);

    var contr = document.getElementById("controls");
    this.hideNode(contr);
  },

  // Show game over title.
  showGameOverOverlay: function () {
    // Get element and display it.
    var node = document.getElementById("overlay-game-over");
    this.showNode(node);
  },

  // Hide game over title.
  hideGameOverOverlay: function () {
    // Get element and hide it.
    var node = document.getElementById("overlay-game-over");
    this.hideNode(node);
  },

  // Show board selector.
  showBoardSelectorOverlay: function () {
    // Get element and display it.
    var node = document.getElementById("overlay-board-selector");
    this.showNode(node);
  },

  // Hide board selector.
  hideBoardSelectorOverlay: function () {
    // Get element and hide it.
    var node = document.getElementById("overlay-board-selector");
    this.hideNode(node);
  },

  // Show menu/message overlay.
  showOverlay: function () {
    // Get the overlay and display it.
    var overlay = document.getElementById("overlay");
    this.showNode(overlay);

    // Hide the child elements.
    this.hideStartGameOverlay();
    // this.hidePausedOverlay();
    this.hideGameOverOverlay();
    this.hideBoardSelectorOverlay();
  },

  // Hide menu/message overlay.
  hideOverlay: function () {
    // Get the overlay and display it.
    var overlay = document.getElementById("overlay");
    this.hideNode(overlay);
    var contr = document.getElementById("controls");
    this.hideNode(contr);
  },

  // Show the start game sceen.
  showStartGameMenu: function () {
    this.showOverlay();
    this.showStartGameOverlay();
    this.showBoardSelectorOverlay();
  },

  // Show the pause screen.
  showPauseMenu: function () {
    this.showOverlay();
    this.showPausedOverlay();
  },

  // Show the game over screen.
  showGameOverMenu: function () {
    this.showOverlay();
    this.showGameOverOverlay();
    //this.showBoardSelectorOverlay();
  },


  // Start the game.
  startGame: function () {
    this.keepPlaying = true;
    this.paused = false;

    this.hideOverlay();

  },

  // End the game.
  endGame: function () {
    // This will get called multiple times if multiple cubes collide
    // when adding a new block, so we will only od this stuff for the
    // first collision.
    if (this.keepPlaying) {
      // Set flag.
      this.keepPlaying = false;
      this.paused = true;

      // Stop the music.
      this.sound.pause();

      // Let us know the game has ended.
      this.showGameOverMenu();
    }
  },

  // Set the board type.
  setBoard: function (boardType = 0) {
    this.boardType = boardType;
    if (!this.debugMode) {
      this.board.setBoard(this.boardType);
    } else {
      this.board.setBoard(3);
    }
  },

  // Pause or unpause the game.
  togglePause: function () {
    // Pause shouldn't function unless the game is actually running.
    if (this.keepPlaying) {
      // Play or pause the game based on the paused flag.
      if (this.paused) {
        // Toggle the flag.
        this.paused = false;

        // If the music is supposed to be playing, play it.
        if (this.playMusic) {
          this.sound.play();
        }

        // Remove the overlay.
        this.hideOverlay();
      } else {
        // Toggle the flag.
        this.paused = true;

        // Pause the music.
        this.sound.pause();

        // Let us know the game is paused.
        this.showPauseMenu();
      }
    }
  },

  // Play or pause the music.
  toggleMusic: function () {
    // Play or pause the music based on the playMusic flag.
    if (this.playMusic) {
      // Toggle the flag.
      this.playMusic = false;

      // Pause the music.
      this.sound.pause();
    } else {
      // Toggle the flag.
      this.playMusic = true;

      // Play the music if the game isn't paused.
      if (!this.paused) {
        this.sound.play();
      }
    }
  },

  // Toggle Canadian mode.
  toggleCanadianMode: function () {
    if (this.canadianMode) {
      // Toggle the flag.
      this.canadianMode = false;

      // Unset Canadian mode on the board.
      this.board.unsetCanadianMode();
    } else {
      // Toggle the flag.
      this.canadianMode = true;

      // Set Canadian mode on the board.
      this.board.setCanadianMode();
    }
  },


  // Increment the level counter. If the counter reaches 3,
  // we will reset it, increase the level and score. The speed
  // of the game is increased every two levels.

  incrementLevelCounter: function () {
    // Increase score.
    this.score += 1;
    this.boom[Math.floor(Math.random() * this.boom.length)].play();

    this.pointsLabel.innerHTML="score: "+ this.score;
  },

  // This is the game/animation loop
  animate: function () {
    // Get an animation frame to render.
    var thisGame = this;
    requestAnimationFrame(function () {
      thisGame.animate();
    });
    ////////
    if (thisGame.animateMoveRotate && thisGame.board.block.orbitObj) {
      window.onkeydown = "";
      if (thisGame.go == "rotateBlockX") thisGame.board.block.orbitObj.rotateX(-Math.PI / 2 / thisGame.animateStep)
      if (thisGame.go == "rotateBlockZ") thisGame.board.block.orbitObj.rotateZ(-Math.PI / 2 / thisGame.animateStep)
      if (thisGame.go == "rotateBlockY") thisGame.board.block.orbitObj.rotateY(-Math.PI / 2 / thisGame.animateStep)

      if (thisGame.go == "xMinus") thisGame.board.block.orbitObj.position.x -=( CUBE_SIZE / thisGame.animateStep)
      if (thisGame.go == "xPlus") thisGame.board.block.orbitObj.position.x +=( CUBE_SIZE / thisGame.animateStep)
      if (thisGame.go == "zMinus") thisGame.board.block.orbitObj.position.z -=( CUBE_SIZE / thisGame.animateStep)
      if (thisGame.go == "zPlus") thisGame.board.block.orbitObj.position.z +=( CUBE_SIZE / thisGame.animateStep)
      if (thisGame.go == "down") thisGame.board.block.orbitObj.position.y -=( CUBE_SIZE / thisGame.animateStep)


      thisGame.animateCounter--;
      if (thisGame.animateCounter <= 0) {
        thisGame.animateCounter = thisGame.animateStep;
        thisGame.animateMoveRotate = false;
        thisGame.scene.remove(thisGame.board.block.orbitObj)
        thisGame.board.block.removeFromBoard();
        thisGame.board.block.addToBoard();

        window.onkeydown = thisGame.keyHandler;
        gridInofUpdate();
      }
    }
    // Render the scene.
    this.renderer.render(this.scene, this.camera);
  }

};

function onWindowResize() {

  game.camera.aspect = window.innerWidth / window.innerHeight;
  game.camera.updateProjectionMatrix();

  game.renderer.setSize(window.innerWidth, window.innerHeight);

}
