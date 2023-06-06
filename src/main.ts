import * as THREE from "three";
// ts ignore while the d.ts is not available
// @ts-ignore
import {
  createParticleSystem,
  // @ts-ignore
  updateParticleSystems,
} from "@newkrok/three-particles/src/js/effects/three-particles.js";
import { sampleEffectConfig } from "./effect-config";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";

const clock = new THREE.Clock();
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
camera.position.set(0, 0, 6);

const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const controls = new OrbitControls(camera, renderer.domElement);
controls.enablePan = true;
controls.enableZoom = true;
controls.target.set(0, 0, 0);
controls.update();

let isPaused = false;
const cycleData = {
  now: 0,
  pauseStartTime: 0,
  totalPauseTime: 0,
  elapsed: 0,
  delta: 0,
};

// @ts-ignore
sampleEffectConfig.map = new THREE.TextureLoader().load(
  "assets/textures/flame.webp"
);
// @ts-ignore
const walkEffect = createParticleSystem(sampleEffectConfig);

scene.add(walkEffect.instance);

const resumeTime = () => {
  if (isPaused) {
    isPaused = false;
    cycleData.totalPauseTime += Date.now() - cycleData.pauseStartTime;
  }
};

const pauseTime = () => {
  if (!isPaused) {
    isPaused = true;
    cycleData.pauseStartTime = Date.now();
  }
};

document.addEventListener("visibilitychange", () => {
  if (document.hidden) pauseTime();
  else resumeTime();
});

const animate = () => {
  if (!isPaused) {
    const rawDelta = clock.getDelta();
    cycleData.now = Date.now() - cycleData.totalPauseTime;
    cycleData.delta = rawDelta > 0.1 ? 0.1 : rawDelta;
    cycleData.elapsed = clock.getElapsedTime();

    updateParticleSystems(cycleData);
  }

  renderer.render(scene, camera);

  requestAnimationFrame(animate);
};
animate();
