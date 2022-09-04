import { useEffect, useState } from 'react';

import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { loadLetter } from './api';
import * as THREE from 'three';
import { letters } from './gltf_config';

import SceneInit from './lib/SceneInit';

function App() {
  const [LOADED_LETTERS, setLOADED_LETTERS] = useState({})
  // let LOADED_LETTERS = {};

  useEffect(() => {
    const world = new SceneInit('mainCanvas');
    world.initialize();
    world.animate();

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

    // set up letters
    const gltfLoader = new GLTFLoader();

    letters.forEach( async (letter, index) => {
      const letterObj = await loadLetter(gltfLoader, world, letter, setLOADED_LETTERS)
      LOADED_LETTERS[letter.name] = letterObj
    })

    // set up ambient light
    const al = new THREE.AmbientLight(0xffffff, .5);
    mainGroup.add(al);

    // setup directional light + helper
    const dl = new THREE.DirectionalLight(0xffffff, 1.35);
    dl.position.set(1.5, 1.7, 5);
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
  }, []);

  return (
    <div>
      <canvas id="mainCanvas" />
    </div>
  );
}

export default App;