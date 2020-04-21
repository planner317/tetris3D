var box317 = new Box317()

function Box317() {
    // model

    var onProgress = function (xhr) {

        if (xhr.lengthComputable) {

            var percentComplete = xhr.loaded / xhr.total * 100;
            console.log("сглаженый куб= " + Math.round(percentComplete, 2) + '% downloaded');

        }
    };

    var onError = function () { };

    var manager = new THREE.LoadingManager();

    ///////////////////////

    new THREE.OBJLoader(manager)
        .setPath('model/')
        .load('box.obj', function (object) {

            object.position.y = 0;
            object.children[0].scale.set(1, 1, 1)
            box317.box = object

        }, onProgress, onError);

}