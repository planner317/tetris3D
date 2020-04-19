"use strict";

/* Game Object.
 */
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
  this.levelLabel = document.getElementById("level-label");
  this.pointsLabel = document.getElementById("points-label");

  // Initialize some public variables.
  this.cameraRot = 0;
  this.dropThreshold = 80;
  this.dropCounter = 0;
  this.keepPlaying = false;
  this.paused = true;
  this.boardType = DEFAULT_BOARD;

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
  this.level = 0;
  this.levelCounter = 0;
  this.speedModifier = 1;

  // Canadian mode.
  this.canadianMode = false;

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

    // Show the start menu.
    this.showStartGameMenu();

    // Create the main scene for the 3D drawing
    this.scene = new THREE.Scene();
    this.scene.fog = new THREE.Fog( 0x103044, 1500, 2000 );
    this.scene.background = new THREE.Color( 0x103044 );
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
    // самера вращалка
    this.orbit = new THREE.OrbitControls(this.camera, this.renderer.domElement)

    this.orbit.enablePan = false
    this.orbit.enableKeys = false
    this.orbit.minDistance = 50
    this.orbit.maxDistance = 1000
    this.orbit.target.y = 380

    // Add light to the scene.
    var ambientLight = new THREE.AmbientLight(0x333333);
    this.scene.add(ambientLight);
    // TODO: Add point lights.
    this.dirLight = new THREE.DirectionalLight(0xffffff, 1);
    this.dirLight.position.set(0, 800, 0)

    this.dirLight.castShadow = true;
    this.dirLight.shadow.camera.near = 1;
    this.dirLight.shadow.camera.far = 1000;
    this.dirLight.shadow.camera.right = 500;
    this.dirLight.shadow.camera.left = - 500;
    this.dirLight.shadow.camera.top = 500;
    this.dirLight.shadow.camera.bottom = - 500;
    this.dirLight.shadow.mapSize.width = 512;
    this.dirLight.shadow.mapSize.height = 512;
    this.scene.add(this.dirLight)

    var spotLight = new THREE.SpotLight( 0xffffff, 1 );
    spotLight.castShadow = true;
    spotLight.position.set(0, 900, 0)
    spotLight.shadow.camera.near = 1;
    spotLight.penumbra = 1;
    spotLight.shadow.camera.far = 1200;

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
      document.addEventListener("keydown", function (e) {
        console.log("keydown:", e.key);
        if (e.key == "ArrowUp" || e.key == "w" ) {
          if (!thisGame.paused) {
            thisGame.shiftBlockUp();
          }
        }
        if (e.key == "ArrowDown" || e.key == "s" ) {
          if (!thisGame.paused) {
            thisGame.shiftBlockDown();
          }
        }
        if (e.key == "ArrowLeft" || e.key == "a" ) {
          if (!thisGame.paused) {
            thisGame.shiftBlockLeft();
          }
        }
        if (e.key == "ArrowRight" || e.key == "d" ) {
          if (!thisGame.paused) {
            thisGame.shiftBlockRight();
          }
        }
        if (e.key == " ") {
          if (!thisGame.paused) {
            thisGame.dropBlock();
          }
        }
        if (e.key == "2" || e.key == "5" ) {
          if (!thisGame.paused) {
            thisGame.rotateBlockX();
          }
        }
        if (e.key == "3" || e.key == "1") {
          if (!thisGame.paused) {
            thisGame.rotateBlockY();
          }
        }
        if (e.key == "6" || e.key == "4") {
          if (!thisGame.paused) {
            thisGame.rotateBlockZ();
          }
        }
        if (e.key == "Enter" ) {
          thisGame.togglePause();
        }
        if (e.key == "m" ) {
          thisGame.toggleMusic();
        }
        if (e.key == "q" ) {
          if (!thisGame.paused) {
            thisGame.rotateCamera(-ROTATION_AMOUNT);
          }
        }
        if (e.key == "e" ) {
          if (!thisGame.paused) {
            thisGame.rotateCamera(ROTATION_AMOUNT);
          }
        }
        if (e.key == "Escape") {
          thisGame.endGame();
        }
        if (e.key == "c" || e.key == "C") {
          thisGame.toggleCanadianMode();
        }
      });
    }

    // Attach the threeJS renderer to the HTML page
    document.body.append(this.renderer.domElement);

  },

  // Move block up.
  shiftBlockUp: function () {
    // The block needs to be shifted the correct direction based on
    // the angle.
    if (this.cameraRot >= Math.PI / 4 && this.cameraRot < (3 * Math.PI) / 4) {
      // Pi / 4 <= x < 3Pi / 4
      this.board.shiftBlockX(-1);
    } else if (this.cameraRot >= (3 * Math.PI) / 4 && this.cameraRot < (5 * Math.PI) / 4) {
      // 3Pi / 4 <= x < 5Pi / 4
      this.board.shiftBlockZ(1);
    } else if (this.cameraRot >= (5 * Math.PI) / 4 && this.cameraRot < (7 * Math.PI) / 4) {
      // 5Pi / 4 <= x < 7Pi / 4
      this.board.shiftBlockX(1);
    } else {
      // -Pi / 4 <= x < Pi / 4
      this.board.shiftBlockZ(-1);
    }
  },

  // Move block down.
  shiftBlockDown: function () {
    // The block needs to be shifted the correct direction based on
    // the angle.
    if (this.cameraRot >= Math.PI / 4 && this.cameraRot < (3 * Math.PI) / 4) {
      // Pi / 4 <= x < 3Pi / 4
      this.board.shiftBlockX(1);
    } else if (this.cameraRot >= (3 * Math.PI) / 4 && this.cameraRot < (5 * Math.PI) / 4) {
      // 3Pi / 4 <= x < 5Pi / 4
      this.board.shiftBlockZ(-1);
    } else if (this.cameraRot >= (5 * Math.PI) / 4 && this.cameraRot < (7 * Math.PI) / 4) {
      // 5Pi / 4 <= x < 7Pi / 4
      this.board.shiftBlockX(-1);
    } else {
      // -Pi / 4 <= x < Pi / 4
      this.board.shiftBlockZ(1);
    }
  },

  // Move block left.
  shiftBlockLeft: function () {
    // The block needs to be shifted the correct direction based on
    // the angle.
    if (this.cameraRot >= Math.PI / 4 && this.cameraRot < (3 * Math.PI) / 4) {
      // Pi / 4 <= x < 3Pi / 4
      this.board.shiftBlockZ(1);
    } else if (this.cameraRot >= (3 * Math.PI) / 4 && this.cameraRot < (5 * Math.PI) / 4) {
      // 3Pi / 4 <= x < 5Pi / 4
      this.board.shiftBlockX(1);
    } else if (this.cameraRot >= (5 * Math.PI) / 4 && this.cameraRot < (7 * Math.PI) / 4) {
      // 5Pi / 4 <= x < 7Pi / 4
      this.board.shiftBlockZ(-1);
    } else {
      // -Pi / 4 <= x < Pi / 4
      this.board.shiftBlockX(-1);
    }
  },

  // Move block right.
  shiftBlockRight: function () {
    // The block needs to be shifted the correct direction based on
    // the angle.
    if (this.cameraRot >= Math.PI / 4 && this.cameraRot < (3 * Math.PI) / 4) {
      // Pi / 4 <= x < 3Pi / 4
      this.board.shiftBlockZ(-1);
    } else if (this.cameraRot >= (3 * Math.PI) / 4 && this.cameraRot < (5 * Math.PI) / 4) {
      // 3Pi / 4 <= x < 5Pi / 4
      this.board.shiftBlockX(-1);
    } else if (this.cameraRot >= (5 * Math.PI) / 4 && this.cameraRot < (7 * Math.PI) / 4) {
      // 5Pi / 4 <= x < 7Pi / 4
      this.board.shiftBlockZ(1);
    } else {
      // -Pi / 4 <= x < Pi / 4
      this.board.shiftBlockX(1);
    }
  },

  // Drop block one level.
  dropBlock: function () {
    this.dropCounter = this.dropThreshold;
  },

  // Rotate block about x-axis.
  rotateBlockX: function () {
    this.board.rotateBlockX();
  },

  // Rotate block about y-axis.
  rotateBlockY: function () {
    this.board.rotateBlockY();
  },

  // Rotate block about z-axis.
  rotateBlockZ: function () {
    this.board.rotateBlockZ();
  },

  // Rotate the camera. We want to keep the angle at a value from 0
  // to 2Pi.
  rotateCamera: function (rotationAmount) {
    // Rotate the camera.
    this.cameraRot += rotationAmount;

    // Make sure we're within the range.
    if (this.cameraRot < 0) {
      this.cameraRot += 2 * Math.PI;
    }
    if (this.cameraRot > 2 * Math.PI) {
      this.cameraRot -= 2 * Math.PI;
    }
  },

  // Load external resources.
  loadExternalResources: function () {
    // We need a reference to this game for the loader callback
    // functions.
    var thisGame = this;

    // Attempt to load music. To do this, we need to create a listener
    // and add it to the camera, then we need to create a global audio
    // source.
    var listener = new THREE.AudioListener();
    this.camera.add(listener);
    this.sound = new THREE.Audio(listener);
    this.audioLoader = new THREE.AudioLoader();
    this.audioLoader.load(
      // Path to music.
      "audio/theme.mp3",

      // Function to run upon load completion.
      function (buffer) {
        // Set flags and sound.
        thisGame.ADD_MUSIC = true;
        thisGame.sound.setBuffer(buffer);
        thisGame.sound.setLoop(true);
        thisGame.sound.setVolume(0.5);
      }
    );

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
        texture.wrapS= texture.wrapT = THREE.RepeatWrapping;
        texture.repeat.set( 31, 31 ); 
        // If the board has a floor, we want to update its material
        // with the new texture if we're in Canadian mode.
        if (thisGame.board.hasFloor && thisGame.canadianMode) {
          var floorMaterial = new THREE.MeshPhongMaterial({
            map: thisGame.board.floorTexture,
          });
          thisGame.board.floor.material = floorMaterial;
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
    this.showBoardSelectorOverlay();
  },

  // Update the level label.
  updateLevelLabel: function () {
    this.levelLabel.innerHTML = "Level " + (this.level + 1);
  },

  // Update the points label.
  updatePointsLabel: function () {
    this.pointsLabel.innerHTML = "Points: " + this.score;
  },

  // Run the game.
  run: function () {
    // If the game isn't initialized yet, initialize it.
    if (!this.initialized) {
      this.init();
    }

    // Start the game/animation loop.
    this.animate();
  },

  // Start the game.
  startGame: function () {
    this.keepPlaying = true;
    this.paused = false;

    // Reset everything.
    this.score = 0;
    this.level = 0;
    this.levelCounter = 0;
    this.speedModifier = 1;
    this.sound.setPlaybackRate(1);
    this.board.reset();

    // Update the level and points labels.
    this.updateLevelLabel();
    this.updatePointsLabel();

    // Play the music if it is supposed to be playing.
    if (this.playMusic) {
      this.sound.play();
    }

    // Remove the overlay.
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
      this.sound.stop();

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

  // Toggle debug mode.
  toggleDebugMode: function () {
    if (this.debugMode) {
      this.debugMode = false;

      this.board.setBoard(this.boardType);
    } else {
      this.debugMode = true;

      this.board.setBoard(3);
    }

    // We're starting over, so restart the game.
    if (this.keepPlaying) {
      this.endGame();
      this.startGame();
    }

    // Update the level and points labels.
    this.updateLevelLabel();
    this.updatePointsLabel();
  },

  // Increment the level counter. If the counter reaches 3,
  // we will reset it, increase the level and score. The speed
  // of the game is increased every two levels.
  boom:new Audio("./../audio/boom.wav"),
  incrementLevelCounter: function () {
    // Increase score.
    this.score += 1000;
    this.boom.play();
    // Increase level counter.
    this.levelCounter++;

    // Do we need to increase the level?
    if (this.levelCounter >= 3) {
      // Reset the counter.
      this.levelCounter = 0;

      // Increase the level.
      this.level++;

      // Do we need to increase the speed?
      if (this.level % 2 == 0 && this.speedModifier > MINIMUM_SPEED_MODIFIER) {
        this.speedModifier *= 0.70;

        // Update the speed of the music.
        if (this.speedModifier < 1) {
          this.sound.setPlaybackRate(this.sound.playbackRate + 0.02);
        }
      }

      // Speed modifier should only get as low as the minimum
      // speed modifer threshold.
      if (this.speedModifier < MINIMUM_SPEED_MODIFIER) {
        this.speedModifier = MINIMUM_SPEED_MODIFIER;
      }
    }

    // TODO: Remove this.
    console.log("Score:", this.score);
    console.log("Level:", this.level);
    console.log("Level Counter:", this.levelCounter);
    console.log("Speed Modifier:", this.speedModifier);
    console.log("Sound Playback Rate:", this.sound.playbackRate);

    // Update the level and points labels.
    this.updateLevelLabel();
    this.updatePointsLabel();
  },

  // This is the game/animation loop
  animate: function () {
    // Get an animation frame to render.
    var thisGame = this;
    requestAnimationFrame(function () {
      thisGame.animate();
    });
    if (this.paused) this.orbit.update()
    // We only want to animate things if the game hasn't ended
    // and isn't paused.
    if (this.keepPlaying && !this.paused) {
      // Move the camera
      this.camera.position.y = CAMERA_Y;
      this.camera.position.x = Math.sin(this.cameraRot) * CAMERA_X;
      this.camera.position.z = Math.cos(this.cameraRot) * CAMERA_Z;
      this.camera.lookAt(new THREE.Vector3(CAMERA_POINT_X, CAMERA_POINT_Y, CAMERA_POINT_Z));
      // Move the blocks. To do this, we will incrase the drop
      // counter each frame. When it reaches the threshold, the
      // blocks will drop another level.
      this.dropCounter += 1;
      if (this.dropCounter >= Math.floor(this.dropThreshold * this.speedModifier)) {
        // Reset the counter.
        this.dropCounter = 0;

        // Advance the block.
        this.board.advance();
      }
    }

    // Render the scene.
    this.renderer.render(this.scene, this.camera);
  }

};
window.addEventListener( 'resize', onWindowResize, false );
function onWindowResize() {

  game.camera.aspect = window.innerWidth / window.innerHeight;
  game.camera.updateProjectionMatrix();

  game.renderer.setSize( window.innerWidth, window.innerHeight );

}
