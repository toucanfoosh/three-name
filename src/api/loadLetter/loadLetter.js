const DEFAULT_SCALE = {
    x: 0.05,
    y: 0.05,
    z: 0.05,
}

const loadLetter = async (
    gltfLoader,
    world,
    letter,
    setLOADED_LETTERS,
    scale = DEFAULT_SCALE,
    ) => {

    let letterObj

    gltfLoader.load(letter.dir, (GLTF) => {

        letterObj = GLTF

        GLTF.scene.traverse((node) => {
            if (!node.isMesh) return
            node.castShadow = true;
            node.receiveShadow = true;
        })

        letterObj.scene.position.y = letter.pos.y;
        letterObj.scene.position.x = letter.pos.x;
        letterObj.scene.scale.set(scale.x, scale.y, scale.z);
        world.scene.add(letterObj.scene);

        return letterObj;
    })
}

export default loadLetter