import { useEffect, useState } from 'react';

import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { loadLetter } from './api';
import { letters } from './gltf_config';

import SceneInit from './lib/SceneInit';

function App() {
  // load 3D letters
  const [LOADED_LETTERS, setLOADED_LETTERS] = useState({})

  useEffect(() => {
    // set up 3d scene
    const world = new SceneInit('mainCanvas');
    world.initialize();
    world.animate();
    world.worldSetup();

    // set up letters
    const gltfLoader = new GLTFLoader();

    letters.forEach(async (letter, index) => {
      const letterObj = await loadLetter(gltfLoader, world, letter, setLOADED_LETTERS)
      LOADED_LETTERS[letter.name] = letterObj
    })

  }, []);

  return (
    <div>
      <canvas id="mainCanvas" />
    </div>
  );
}

export default App;