let ddd = new Ddd()
ddd.animate();

function Ddd() {
    let t = this
    t.scene = new THREE.Scene();
    t.scene.background = new THREE.Color(0x151515)

    t.renderer = new THREE.WebGLRenderer();
    t.renderer.setSize(window.innerWidth, window.innerHeight);
    t.renderer.shadowMap.type = THREE.PCFShadowMap;
    t.renderer.shadowMap.enabled = true;

    t.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 1, 10000);
    t.camera.position.set(0, 150, -150);

    t.orbit = new THREE.OrbitControls(t.camera, document.body)

    t.orbit.enableDamping = true
    t.orbit.screenSpacePanning = true
    t.orbit.minDistance = 50
    t.orbit.maxDistance = 1000
    t.orbit.target.y = 100
    t.orbit.update()

    t.ambientLight = new THREE.AmbientLight(0xffffff, 0.3);
    t.scene.add(t.ambientLight);

    t.pointL = new THREE.PointLight(0xffffff, 2);
    t.pointL.castShadow = true;
    t.pointL.position.set(300, 500, 0)
    t.pointL.shadow.camera.near = 1;
    t.pointL.penumbra = 1;
    t.pointL.shadow.camera.far = 5000;
    t.pointL.shadow.mapSize.set(2048, 2048)
    t.scene.add(t.pointL)

    ///////////////////////////////////////////////////////
    t.ax = new THREE.AxesHelper(20)
    t.scene.add(t.ax)

    t.plane = new THREE.Mesh(
        new THREE.PlaneBufferGeometry(1000, 1000),
        new THREE.MeshStandardMaterial({color:0x222222})
        )
    t.plane.rotateX(-Math.PI/2)    
    t.plane.receiveShadow=1  
    t.scene.add(t.plane);

    var onProgress = function (xhr) {

        if (xhr.lengthComputable) {

            var percentComplete = xhr.loaded / xhr.total * 100;
            log.innerHTML = "model= " + Math.round(percentComplete, 2) + '% downloaded';
        }
    };

    var onError = function () { };

    var manager = new THREE.LoadingManager();

    ///////////////////////
    new THREE.MTLLoader(manager)
        .setPath('resuls/')
        .load('scorpion.mtl', function (materials) {

            materials.preload();

            new THREE.OBJLoader(manager)
                .setMaterials(materials)
                .setPath('resuls/')
                .load('scorpion.obj', function (object) {
                    object.children[0].castShadow=1
                    t.scorpion = object
                    t.scene.add(object)
                    log.innerHTML = "texture download ..."
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