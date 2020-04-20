var material317 = new Material317();

function Material317() {
    this.length = 0;
    //////////////////////////////////////////////////
    this.sponge = (color = 0xffffff) => {
        return new THREE.MeshPhongMaterial({
            map: texture317.sponge,
            bumpMap: texture317.sponge,
            color: color,
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
    this.metal2 = () => {
        return new THREE.MeshPhongMaterial({
            shininess: 150,
            specular: 0x222222,
            // map: texture317.metal2,
            bumpMap: texture317.metal2Bump,
            envMap: texture317.portalFonCube,
            bumpScale: 0.5
        });
    }
    this.length++;
    //////////////////////////////////////////////////
    this.loose = (color = 0xffffff) => {
        return new THREE.MeshPhongMaterial({
            bumpMap: texture317.looseBump,
            alphaMap: texture317.looseAlfa,
            alphaTest: 0.5,
            side: THREE.DoubleSide,
            shininess: 150,
            specular: 0x222222,
            color: color,
        });
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
    this.portalCube = (color=0) => {
        return new THREE.MeshPhongMaterial({
            shininess: 30,
            specular: 0x222222,
            map: texture317.portalCubeD,
            emissiveMap: texture317.portalCubeL,
            emissiveIntensity:2,
            emissive: color,
        })
    }

}