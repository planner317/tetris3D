var material317 = new Material317();

function Material317() {
    this.length = 0;
    //////////////////////////////////////////////////
    this.sponge = (color = 0xffffff) => {
        return new THREE.MeshPhongMaterial({
            map: texture317.sponge,
            bumpMap: texture317.sponge,
            color: color,
            bumpScale:5,
        });
    }
    this.length++;

    //////////////////////////////////////////////////
    this.wood = () => {
        return new THREE.MeshPhongMaterial({
            map: texture317.wood,
            shininess: 150,
            specular: 0x222222,
        });
    }
    this.length++;

    //////////////////////////////////////////////////
    this.metal2 = (color) => {
        return new THREE.MeshPhongMaterial({
            envMap: texture317.portal360,
        });
    }
    this.length++;
    //////////////////////////////////////////////////
    this.glass = (color = 0xffffff) => {
        return new THREE.MeshPhysicalMaterial( {
          //  map: null,
            color: color,
            metalness: 1,
            roughness: 0,
            opacity: 0.8,
            side: THREE.BackSide,
            transparent: true,
            envMapIntensity: 1,
            premultipliedAlpha: true,
            envMap: texture317.fon2,
    })
}
    this.length++;
    //////////////////////////
    this.stone = () => {
        return new THREE.MeshPhongMaterial({
            map: texture317.stone,
            bumpMap: texture317.stone,
            shininess: 150,
            specular: 0x222222,
        });
    }
    this.length++;
    ////////////////////////////////
    this.portalCube = (color = 0) => {
        return new THREE.MeshPhongMaterial({
            shininess: 30,
            specular: 0x222222,
            map: texture317.portalCubeD,
            emissiveMap: texture317.portalCubeL,
            emissiveIntensity: 1,
            emissive: color,
        })
    }
    this.length++;
}