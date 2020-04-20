//var fon317 = new Fon317()

function Fon317() {
    // model

    var onProgress = function (xhr) {

        if (xhr.lengthComputable) {

            var percentComplete = xhr.loaded / xhr.total * 100;
            console.log("fon= "+ Math.round(percentComplete, 2) + '% downloaded');

        }
    };

    var onError = function () { };

    var manager = new THREE.LoadingManager();

///////////////////////
    new THREE.MTLLoader(manager)
        .setPath('model/')
        .load('fon.mtl', function (materials) {

            materials.preload();

            new THREE.OBJLoader(manager)
                .setMaterials(materials)
                .setPath('model/')
                .load('fon.obj', function (object) {

                    object.position.y = - 300;
                    object.scale.set(1,1,1)
                    fon317.fon = object

                }, onProgress, onError);

        });
}