let ddd = new Ddd()
ddd.animate();
window.onclick=()=>{
    document.documentElement.requestFullscreen()
}

function Ddd() {
    document.documentElement.requestFullscreen()
    let t = this
    t.scene = new THREE.Scene();
    t.scene.background = new THREE.Color(0x0)

    t.renderer = new THREE.WebGLRenderer();
    t.renderer.setSize(window.innerWidth, window.innerHeight);
    t.renderer.shadowMap.type = THREE.PCFShadowMap;
    t.renderer.shadowMap.enabled = true;

    t.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 1, 10000);
    t.camera.position.set(0, 0, 200);

    t.orbit = new THREE.OrbitControls(t.camera, document.body)

    t.orbit.enableDamping = true
    t.orbit.screenSpacePanning = true
    t.orbit.minDistance = 100
    t.orbit.maxDistance = 400
    t.orbit.minPolarAngle=0.8   // ограничение сверху на поворот
    t.orbit.maxPolarAngle=1.8   // ограничение снизу на поворот
    t.orbit.maxAzimuthAngle=0.5   // ограничение справа на поворот
    t.orbit.minAzimuthAngle=-0.5   // ограничение слева на поворот
    t.orbit.enablePan=false

    t.orbit.update()

    var onProgress = function (xhr) {

        if (xhr.lengthComputable) {
            var percentComplete = xhr.loaded / xhr.total * 100;
            console.log("model= " + Math.round(percentComplete, 2) + '% downloaded');

        }
    };

    var onError = function () { };

    var manager = new THREE.LoadingManager();

    ///////////////////////
    new THREE.MTLLoader(manager)
        .setPath('resuls/scorpion2/')
        .load('scorpion2.mtl', function (materials) {

            materials.preload();

            new THREE.OBJLoader(manager)
                .setMaterials(materials)
                .setPath('resuls/scorpion2/')
                .load('scorpion2.obj', function (object) {
                    object.children[0].castShadow=1
                    t.scorpion = object
                    t.scene.add(object)

                }, onProgress, onError);

        });

    document.body.append(t.renderer.domElement);
    t.onWinResize = () => {
        t.camera.aspect = window.innerWidth / window.innerHeight;
        t.camera.updateProjectionMatrix();
        t.renderer.setSize(window.innerWidth, window.innerHeight);
    }
    window.addEventListener('resize', t.onWinResize, false);

    t.animate = () => {

        requestAnimationFrame(() => {
            t.animate();
        });

        t.renderer.render(t.scene, t.camera);
        t.orbit.update()
    }
}