const world = new SceneInit('mainCanvas');
world.initialize();
world.animate();

// initialize gui
const gui = new GUI();

// main group
const mainGroup = new THREE.Group();
mainGroup.position.y = 0.5;
world.scene.add(mainGroup);

// set up ground
const groundGeometry = new THREE.BoxGeometry(5000, 1, 5000);
const groundMaterial = new THREE.MeshStandardMaterial({ color: 0xffa700 });
const groundMesh = new THREE.Mesh(groundGeometry, groundMaterial);
groundMesh.receiveShadow = true;
groundMesh.position.y = -2;
mainGroup.add(groundMesh);

// -----letters-----
const gltfLoader = new GLTFLoader();
// ---rock---
let rockD, rockA, rockN, rockI, rockE, rockL;
// texture
const rockTexture = new THREE.TextureLoader().load('./assets/rock/rockTexture.jpg');
// D

gltfLoader.load('./assets/rock/D.glb', function (letterD) {
    rockD = letterD;

    letterD.scene.traverse(function (node) {

        if (node.isMesh) {
            node.castShadow = true;
            node.receiveShadow = true;
        }

    });
    letterD.scene.position.y = 0;
    letterD.scene.position.x = -11;
    letterD.scene.scale.set(.05, .05, .05);
    world.scene.add(letterD.scene);
});


// A
gltfLoader.load('./assets/rock/A.glb', function (letterA) {
    rockA = letterA;

    letterA.scene.traverse(function (node) {

        if (node.isMesh) {
            node.castShadow = true;
            node.receiveShadow = true;
        }

    });
    letterA.scene.position.y = 0;
    letterA.scene.position.x = -7.5;
    letterA.scene.scale.set(.05, .05, .05);
    world.scene.add(letterA.scene);
});

// N
gltfLoader.load('./assets/rock/N.glb', function (letterN) {
    rockN = letterN;

    letterN.scene.traverse(function (node) {

        if (node.isMesh) {
            node.castShadow = true;
            node.receiveShadow = true;
        }

    });
    letterN.scene.position.y = 0;
    letterN.scene.position.x = -4;
    letterN.scene.scale.set(.05, .05, .05);
    world.scene.add(letterN.scene);
});

// I
gltfLoader.load('./assets/rock/I.glb', function (letterI) {
    rockI = letterI;

    letterI.scene.traverse(function (node) {

        if (node.isMesh) {
            node.castShadow = true;
            node.receiveShadow = true;
        }

    });
    letterI.scene.position.y = 0;
    letterI.scene.position.x = 0;
    letterI.scene.scale.set(.05, .05, .05);
    world.scene.add(letterI.scene);
});

// E
gltfLoader.load('./assets/rock/E.glb', function (letterE) {
    rockE = letterE;

    letterE.scene.traverse(function (node) {

        if (node.isMesh) {
            node.castShadow = true;
            node.receiveShadow = true;
        }

    });
    letterE.scene.position.y = 0;
    letterE.scene.position.x = 1.5;
    letterE.scene.scale.set(.05, .05, .05);
    world.scene.add(letterE.scene);
});

// L
gltfLoader.load('./assets/rock/L.glb', function (letterL) {
    rockL = letterL;

    letterL.scene.traverse(function (node) {

        if (node.isMesh) {
            node.castShadow = true;
            node.receiveShadow = true;
        }

    });
    letterL.scene.position.y = 0;
    letterL.scene.position.x = 4.5;
    letterL.scene.scale.set(.05, .05, .05);
    world.scene.add(letterL.scene);
});

// set up ambient light
const al = new THREE.AmbientLight(0xffffff, 0.5);
mainGroup.add(al);

// set up ambient light gui
const alFolder = gui.addFolder('ambient light');
const alSettings = { color: al.color.getHex() };
alFolder.add(al, 'visible');
alFolder.add(al, 'intensity', 0, 1, 0.1);
alFolder
    .addColor(alSettings, 'color')
    .onChange((value) => al.color.set(value));
alFolder.open();

// setup directional light + helper
const dl = new THREE.DirectionalLight(0xffffff, 1.5);
dl.position.set(1.5, 1, 5);
const side = 50;
dl.shadow.camera.top = -side;
dl.shadow.camera.right = side;
dl.shadow.camera.left = -side;
dl.shadow.camera.bottom = side;
dl.shadow.mapSize.x = 8192;
dl.shadow.mapSize.y = 8192;


// dl.position.set(0, 2, 0);
dl.castShadow = true;
const dlHelper = new THREE.DirectionalLightHelper(dl, 3);
mainGroup.add(dl);
// mainGroup.add(dlHelper);

// set up directional light gui
const dlSettings = {
    visible: true,
    color: dl.color.getHex(),
};
const dlFolder = gui.addFolder('directional light');
dlFolder.add(dlSettings, 'visible').onChange((value) => {
    dl.visible = value;
    dlHelper.visible = value;
});
dlFolder.add(dl, 'intensity', 0, 5, 0.25);
dlFolder.add(dl.position, 'y', 1, 4, 0.5);
dlFolder.add(dl.position, 'x', 0, 10, 0.5);
dlFolder.add(dl.position, 'z', 0, 10, 0.5);
dlFolder.add(dl, 'castShadow');
dlFolder
    .addColor(dlSettings, 'color')
    .onChange((value) => dl.color.set(value));
dlFolder.open();

export default gltfLoader