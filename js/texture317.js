
var texture317 = new Texture317();

function Texture317() {

    new THREE.TextureLoader().load("img/SPONGE.JPG",
        (texture) => {
            this.sponge = texture;
        }
    );
    //////////////
    new THREE.TextureLoader().load("img/wood.jpg",
        (texture) => {
            this.wood = texture;
        }
    );
    ///////////////
    new THREE.TextureLoader().load("img/MtlPlat2.jpg",
        (texture) => {
            this.metal2 = texture;
        }
    );
    new THREE.TextureLoader().load("img/MtlPlat2_Bump.jpg",
        (texture) => {
            this.metal2Bump = texture;
        }
    );
    //////////////
    new THREE.TextureLoader().load("img/Loose.jpg",
        (texture) => {
            this.loose = texture;
        }
    );
    new THREE.TextureLoader().load("img/Loose.Bump.jpg",
        (texture) => {
            this.looseBump = texture;
        }
    );
    new THREE.TextureLoader().load("/img/Loose.Mask.jpg",
        (texture) => {
            this.looseAlfa = texture;
            console.log('Loose.Mask.jpg');

        });
    //////////////////
    new THREE.TextureLoader().load("/img/stone.jpg",
        (texture) => {
            this.stone = texture;
        }
    );
    ////////////////////////////
    new THREE.TextureLoader().load("/img/lavatile.jpg",
        (texture) => {
            this.lava = texture;
        }
    );
    ////////////////////////////
    new THREE.TextureLoader().load("/img/FloorsNormal.jpg",
        (texture) => {
            this.floorNormal = texture;
        }
    );
    ////////////////////////////
    new THREE.TextureLoader().load("/img/portal_360.jpg",
        (texture) => {
            texture.mapping = THREE.EquirectangularReflectionMapping;

            // texture.mapping = THREE.EquirectangularRefractionMapping
            this.portal360 = texture;
        }
    );
    ////////////////////////////
    new THREE.TextureLoader().load("/model/cube_heart.jpg",
        (texture) => {
            this.portalCubeD = texture;
        }
    );
    new THREE.TextureLoader().load("/model/cube_heart_light.jpg",
    (texture) => {
        this.portalCubeL = texture;
    }
);

}