import * as THREE from 'three';
import { Vector2 } from "three"

import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import Stats from 'three/examples/jsm/libs/stats.module';

import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer'
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass'
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass'

import RenderPixelatedPass from "./../api/pixelShader/RenderPixelatedPass"
import PixelatePass from "./../api/pixelShader/PixelatePass"

export default class SceneInit {
  constructor(canvasId) {
    // NOTE: Core components to initialize Three.js app.
    this.scene = undefined;
    this.camera = undefined;
    this.renderer = undefined;
    this.composer = undefined;

    // NOTE: Camera params;
    this.fov = 90;
    this.nearPlane = 1;
    this.farPlane = 200;
    this.canvasId = canvasId;

    // NOTE: Additional components.
    this.clock = undefined;
    this.stats = undefined;
    this.controls = undefined;

    // NOTE: Lighting is basically required.
    this.spotLight = undefined;
    this.ambientLight = undefined;
  }

  initialize() {
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0x66b3ff)
    this.camera = new THREE.PerspectiveCamera(
      this.fov,
      window.innerWidth / window.innerHeight,
      1,
      1000
    );
    this.camera.position.z = 10;
    this.camera.position.y = 3;
    this.camera.position.x = 1;

    // NOTE: Specify a canvas which is already created in the HTML.
    const canvas = document.getElementById(this.canvasId);
    this.renderer = new THREE.WebGLRenderer({
      canvas,
      // NOTE: Anti-aliasing smooths out the edges.
      antialias: true,
    });
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    document.body.appendChild(this.renderer.domElement);

    let screenResolution = new Vector2(window.innerWidth, window.innerHeight)
    let renderResolution = screenResolution.clone().divideScalar(6)
    renderResolution.x |= 0
    renderResolution.y |= 0

    this.composer = new EffectComposer(this.renderer);

    var renderPass = new RenderPass(this.scene, this.camera);
    renderPass.clearColor = new THREE.Color(105, 177, 245);
    renderPass.clearAlpha = 0;

    var renderPixelatedPass = new RenderPixelatedPass(renderResolution, this.scene, this.camera);
    var bloomPass = new UnrealBloomPass(screenResolution, .4, .1, .9);
    var pixelatePass = new PixelatePass(renderResolution);

    this.composer.addPass(renderPass);

    // NOTE: Enable this for pixel shader
    this.composer.addPass(renderPixelatedPass);
    this.composer.addPass(bloomPass);
    this.composer.addPass(pixelatePass);

    this.clock = new THREE.Clock();
    this.controls = new OrbitControls(this.camera, this.renderer.domElement);

    // this.controls.enableZoom = false;
    // this.controls.enableRotate = false;
    // this.controls.enablePan = false;

    this.controls.screenSpacePanning = false;
    
    this.controls.maxPolarAngle = Math.PI / 2;
    this.controls.minDistance = 0.9;
    this.controls.maxDistance = 1100;
    this.controls.autoRotate = true;
    this.controls.autoRotateSpeed = .5;

    this.stats = Stats();

    // NOTE: show stats counter
    // document.body.appendChild(this.stats.dom);

    // if window resizes
    window.addEventListener('resize', () => this.onWindowResize(), false);

  }

  animate() {
    // NOTE: Window is implied.
    // requestAnimationFrame(this.animate.bind(this));
    window.requestAnimationFrame(this.animate.bind(this));
    this.composer.render();
    this.stats.update();
    this.controls.update();

  }

  render() {
    // NOTE: Update uniform data on each render.
    // this.uniforms.u_time.value += this.clock.getDelta();
    this.composer.render(this.scene, this.camera);
  }

  onWindowResize() {
    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(window.innerWidth, window.innerHeight);
  }
}
