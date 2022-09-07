import * as THREE from 'three';
import { Vector2 } from "three"

import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import Stats from 'three/examples/jsm/libs/stats.module';

import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer'
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass'
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass'

import RenderPixelatedPass from "./../api/pixelShader/RenderPixelatedPass"
import PixelatePass from "./../api/pixelShader/PixelatePass"

import { spiral, integral } from './Math';


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

    this.pixels = true;

    this.introSpinCheck = true;
    this.introPanCheck = false;
    this.introZoomCheck = false;

    // introSpin() params
    this.spinT = 0;
    this.spinSpiralWidth = 2;
    this.spinScale = 5;
    this.spinLimit = 2.5 * Math.PI;
    this.spinInc = .05;

    // introPan() params
    this.panCur = 0;
    this.panC = 0.5;
    this.panInc = 0.025;
    this.panYTrans = -2;
    this.panXTrans = Math.sqrt((-this.panYTrans) / this.panC);
    this.panCoefficients = [
      -(this.panYTrans) + (this.panC * (this.panXTrans ** 2)),
      this.panXTrans * 2 * this.panC,
      this.panC
    ];
    this.panEnd = this.panXTrans * 2;
    this.panGoalZ = 1;
    this.panGoalY = 50;
    this.panStartZ = undefined;
    this.panStartY = undefined;
    this.panDiffZ = undefined;
    this.panDiffY = undefined;
    this.panPercent = 0;
    this.panPercentTotal = integral(0, this.panEnd, this.panCoefficients);

    this.renderPixelatedPass = undefined;
    this.bloomPass = undefined;
    this.pixelatePass = undefined;
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
    this.camera.position.z = 0;
    this.camera.position.y = 3;
    this.camera.position.x = 0;

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

    // NOTE: Higher renderMultiplier = more pixels on screen = clearer picture
    let renderMultiplier = 1.7

    let screenResolution = new Vector2(window.innerWidth * renderMultiplier, window.innerHeight * renderMultiplier)
    let renderResolution = screenResolution.clone().divideScalar(6)
    renderResolution.x |= 0
    renderResolution.y |= 0

    this.composer = new EffectComposer(this.renderer);

    var renderPass = new RenderPass(this.scene, this.camera);
    renderPass.clearColor = new THREE.Color(105, 177, 245);
    renderPass.clearAlpha = 0;

    this.composer.addPass(renderPass);

    this.renderPixelatedPass = new RenderPixelatedPass(renderResolution, this.scene, this.camera);
    this.bloomPass = new UnrealBloomPass(screenResolution, .4, .1, .9);
    this.pixelatePass = new PixelatePass(renderResolution);

    // NOTE: Enable this for pixel shader
    this.composer.addPass(this.renderPixelatedPass);
    this.composer.addPass(this.bloomPass);
    this.composer.addPass(this.pixelatePass);

    this.clock = new THREE.Clock();
    this.controls = new OrbitControls(this.camera, this.renderer.domElement);

    this.controls.screenSpacePanning = false;

    this.controls.enableZoom = false;
    this.controls.enableRotate = false;
    this.controls.enablePan = false;

    this.controls.maxPolarAngle = Math.PI / 2;
    this.controls.minDistance = 0.9;
    this.controls.maxDistance = 1100;
    this.controls.autoRotate = true;
    this.controls.autoRotateSpeed = 0;

    this.stats = Stats();

    // NOTE: show stats counter
    // document.body.appendChild(this.stats.dom);

    // if window resizes
    window.addEventListener('resize', () => this.onWindowResize(), false);
    window.addEventListener('keydown',  this.onDocumentKeyDown.bind(this), false);

  }
  animate() {
    // NOTE: Window is implied.
    // requestAnimationFrame(this.animate.bind(this));
    window.requestAnimationFrame(this.animate.bind(this));
    this.composer.render();
    this.stats.update();
    this.controls.update();
    if (this.introSpinCheck == true) {
      this.introSpin();
    }
    if (this.introPanCheck == true) {
      this.introPan();
    }
  }

  introSpin() {
    if (this.spinT < this.spinLimit) {
      let coord = spiral(this.spinT, this.spinSpiralWidth);
      this.camera.position.x = coord[0] * this.spinScale;
      this.camera.position.z = coord[1] * this.spinScale;
      this.spinT += this.spinInc;
      this.spinInc = this.spinInc * .994;

    } else {
      this.introSpinCheck = false;
      this.introPanCheck = true;
      this.panStartZ = this.camera.position.z;
      this.panStartY = this.camera.position.y;
      this.panDiffZ = this.panGoalZ - this.camera.position.z;
      this.panDiffY = this.panGoalY - this.camera.position.y;
    }
  }

  introPan() {
    if (this.panCur < this.panEnd) {
      this.panPercent = integral(0, this.panCur, this.panCoefficients) / this.panPercentTotal;
      this.camera.position.z = (this.panStartZ + (this.panPercent * this.panDiffZ));
      this.camera.position.y = (this.panStartY + (this.panPercent * this.panDiffY));
      this.panCur += this.panInc;
    } else {
      this.introPanCheck = false;
      this.controls.enablePan = true;
      this.controls.enableZoom = true;
      this.controls.enableRotate = true;
      this.controls.autoRotateSpeed = 0.5;
    }
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
    this.composer.setSize(window.innerWidth, window.innerHeight);
  }
  onDocumentKeyDown(event) {
    var keyCode = event.which;
    if (keyCode == 32) {
      if (this.pixels){
        this.composer.removePass(this.renderPixelatedPass);
        this.composer.removePass(this.bloomPass);
        this.composer.removePass(this.pixelatePass);
        this.pixels = false;

      } else {
        this.composer.addPass(this.renderPixelatedPass);
        this.composer.addPass(this.bloomPass);
        this.composer.addPass(this.pixelatePass);
        this.pixels = true;

      }
    }
  };

  worldSetup() {

    // main group
    const mainGroup = new THREE.Group();
    mainGroup.position.y = 0.5;
    this.scene.add(mainGroup);

    // set up ground

    const groundSize = 5000

    const groundGeometry = new THREE.BoxGeometry(groundSize, 1, groundSize);

    const grassMaterial = new THREE.TextureLoader().load('./assets/grass_top.jpeg');
    grassMaterial.wrapS = grassMaterial.wrapT = THREE.RepeatWrapping;
    grassMaterial.repeat.set(groundSize, groundSize);

    const groundMaterial = new THREE.MeshStandardMaterial({ map: grassMaterial });

    // const groundMaterial = new THREE.MeshStandardMaterial({ color: 0xffa700 });
    const groundMesh = new THREE.Mesh(groundGeometry, groundMaterial);
    groundMesh.receiveShadow = true;
    groundMesh.position.y = -2;
    mainGroup.add(groundMesh);

    // set up ambient light
    const al = new THREE.AmbientLight(0xffffff, .5);
    mainGroup.add(al);

    // setup directional light
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
    mainGroup.add(dl);
  }

}
