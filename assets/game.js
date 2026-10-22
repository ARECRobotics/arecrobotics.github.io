/* AREC, 2027 season game piece viewer.
 *
 * Loads assets/game-element.stl and renders it in the browser:
 *   - orbit and zoom, with an auto-spin toggle
 *   - hover tilt and accent glow
 *   - click to spin, pulse, and send a ring across the floor
 *   - a grid arena floor with real time shadows
 *
 * If the STL is missing it falls back to a generated placeholder block so the
 * page never renders empty.
 */

import * as THREE from 'three';
import { STLLoader } from 'three/addons/loaders/STLLoader.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';

const STL_PATH = 'assets/game-element.stl';
const ACCENT = 0xc8372a;

const stage = document.getElementById('viewerStage');
const statusEl = document.getElementById('viewerStatus');
const statusText = document.getElementById('viewerStatusText');
const fallbackNote = document.getElementById('viewerFallbackNote');
const spinBtn = document.getElementById('viewerSpin');
const resetBtn = document.getElementById('viewerReset');

if (!stage) {
  console.warn('[game.js] #viewerStage not found. Viewer not started.');
} else {
  init();
}

function init() {
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- renderer / scene / camera ---------- */
  let renderer;
  try {
    renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  } catch (err) {
    fail('WebGL is not available in this browser.');
    return;
  }
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.15;
  stage.appendChild(renderer.domElement);

  const scene = new THREE.Scene();
  scene.fog = new THREE.Fog(0xf8f6f0, 5.5, 12);

  // studio environment so the metal/plastic reads properly
  const pmrem = new THREE.PMREMGenerator(renderer);
  const envRT = pmrem.fromScene(new RoomEnvironment(), 0.04);
  scene.environment = envRT.texture;
  scene.environmentIntensity = 0.85;
  pmrem.dispose();

  const camera = new THREE.PerspectiveCamera(42, 1, 0.1, 100);
  camera.position.set(2.1, 1.55, 2.75);

  const controls = new OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;
  controls.dampingFactor = 0.07;
  controls.enablePan = false;
  controls.minDistance = 1.4;
  controls.maxDistance = 7;
  controls.minPolarAngle = 0.12;
  controls.maxPolarAngle = Math.PI * 0.52;
  controls.autoRotate = !reduceMotion;
  controls.autoRotateSpeed = 1.7;

  /* ---------- lighting ---------- */
  scene.add(new THREE.HemisphereLight(0xffffff, 0xb0aca2, 0.6));

  const key = new THREE.DirectionalLight(0xfff6ec, 2.4);
  key.position.set(3.2, 5.2, 3.4);
  key.castShadow = true;
  key.shadow.mapSize.set(2048, 2048);
  key.shadow.camera.near = 2;
  key.shadow.camera.far = 14;
  key.shadow.camera.left = -3;
  key.shadow.camera.right = 3;
  key.shadow.camera.top = 3;
  key.shadow.camera.bottom = -3;
  key.shadow.bias = -0.0004;
  key.shadow.normalBias = 0.015;
  key.shadow.radius = 3;
  scene.add(key);

  const rim = new THREE.DirectionalLight(0xe63946, 1.1);
  rim.position.set(-3.4, 1.6, -2.6);
  scene.add(rim);

  const fill = new THREE.DirectionalLight(0xd8e6ff, 0.5);
  fill.position.set(-1.5, 0.6, 3.2);
  scene.add(fill);

  /* ---------- arena floor ---------- */
  const FLOOR_Y = -0.62;

  const shadowPlane = new THREE.Mesh(
    new THREE.PlaneGeometry(14, 14),
    new THREE.ShadowMaterial({ opacity: 0.16 })
  );
  shadowPlane.rotation.x = -Math.PI / 2;
  shadowPlane.position.y = FLOOR_Y;
  shadowPlane.receiveShadow = true;
  scene.add(shadowPlane);

  const grid = new THREE.Mesh(
    new THREE.PlaneGeometry(24, 24),
    new THREE.ShaderMaterial({
      transparent: true,
      depthWrite: false,
      uniforms: {
        uFine: { value: 0.25 },
        uMajor: { value: 1.0 },
        uColor: { value: new THREE.Color(0x8f897a) },
        uColorMajor: { value: new THREE.Color(0x60594a) }
      },
      vertexShader: `
        varying vec3 vWorld;
        void main(){
          vec4 wp = modelMatrix * vec4(position, 1.0);
          vWorld = wp.xyz;
          gl_Position = projectionMatrix * viewMatrix * wp;
        }
      `,
      fragmentShader: `
        precision highp float;
        varying vec3 vWorld;
        uniform float uFine;
        uniform float uMajor;
        uniform vec3 uColor;
        uniform vec3 uColorMajor;

        float gridMask(vec2 p, float step){
          vec2 c = p / step;
          vec2 d = fwidth(c);
          vec2 g = abs(fract(c - 0.5) - 0.5) / max(d, vec2(1e-5));
          return 1.0 - min(min(g.x, g.y), 1.0);
        }

        void main(){
          vec2 p = vWorld.xz;
          float fine = gridMask(p, uFine);
          float major = gridMask(p, uMajor);
          float fade = 1.0 - smoothstep(2.3, 5.0, length(p));
          float a = max(fine * 0.42, major * 0.85) * fade;
          if(a < 0.003) discard;
          vec3 col = mix(uColor, uColorMajor, major);
          gl_FragColor = vec4(col, a);
        }
      `
    })
  );
  grid.rotation.x = -Math.PI / 2;
  grid.position.y = FLOOR_Y + 0.002;
  grid.renderOrder = 1;
  scene.add(grid);

  // accent circle marking the arena centre, sized to the piece once loaded
  const arenaRing = new THREE.Mesh(
    new THREE.RingGeometry(1.05, 1.11, 96),
    new THREE.MeshBasicMaterial({
      color: ACCENT, transparent: true, opacity: 0.5,
      side: THREE.DoubleSide, fog: true
    })
  );
  arenaRing.rotation.x = -Math.PI / 2;
  arenaRing.position.y = FLOOR_Y + 0.004;
  scene.add(arenaRing);

  // expanding shockwave ring used by the click animation
  const wave = new THREE.Mesh(
    new THREE.RingGeometry(0.5, 0.62, 96),
    new THREE.MeshBasicMaterial({
      color: ACCENT, transparent: true, opacity: 0,
      side: THREE.DoubleSide, depthWrite: false, fog: false
    })
  );
  wave.rotation.x = -Math.PI / 2;
  wave.position.y = FLOOR_Y + 0.006;
  wave.visible = false;
  scene.add(wave);

  /* ---------- game piece ---------- */
  const pieceMaterial = new THREE.MeshStandardMaterial({
    color: 0xe9e5dc,
    metalness: 0.22,
    roughness: 0.3,
    emissive: new THREE.Color(ACCENT),
    emissiveIntensity: 0
  });

  let piece = null;
  let pieceHeight = 0.6;

  const loader = new STLLoader();

  // Fetched manually with the cache disabled so swapping in the real
  // game-element.stl is picked up immediately, without a hard refresh.
  fetch(STL_PATH, { cache: 'no-store' })
    .then((res) => {
      if (!res.ok) throw new Error('HTTP ' + res.status);
      return res.arrayBuffer();
    })
    .then((buffer) => {
      const geometry = loader.parse(buffer);
      geometry.computeVertexNormals();
      addPiece(geometry);
      ready();
    })
    .catch(() => {
      addPiece(placeholderGeometry());
      fallbackNote.classList.add('show');
      statusEl.classList.remove('ready');
      statusEl.classList.add('error');
      statusText.textContent = 'Placeholder model. Add assets/game-element.stl';
    });

  function addPiece(geometry) {
    geometry.computeBoundingBox();
    const size = geometry.boundingBox.getSize(new THREE.Vector3());
    const maxDim = Math.max(size.x, size.y, size.z) || 1;

    // normalise to a consistent on-screen size regardless of the source units
    const scale = 1.45 / maxDim;
    geometry.scale(scale, scale, scale);
    geometry.center();

    const scaled = new THREE.Box3().setFromBufferAttribute(geometry.attributes.position);
    const sSize = scaled.getSize(new THREE.Vector3());
    pieceHeight = sSize.y;

    piece = new THREE.Mesh(geometry, pieceMaterial);
    piece.castShadow = true;
    piece.receiveShadow = true;
    piece.position.y = FLOOR_Y + pieceHeight / 2;
    scene.add(piece);

    // size the arena ring to the piece footprint so it frames rather than clips
    const foot = Math.hypot(sSize.x, sSize.z) / 2;
    arenaRing.scale.setScalar(Math.max(0.9, foot * 1.55));

    controls.target.set(0, piece.position.y, 0);

    // settle the camera at a flattering three-quarter angle
    const dist = 3.0 + pieceHeight * 0.45;
    camera.position.set(dist * 0.62, FLOOR_Y + pieceHeight + dist * 0.44, dist * 0.74);
    controls.update();
  }

  function placeholderGeometry() {
    const w = 60, d = 60, h = 40, r = 9;
    const shape = new THREE.Shape();
    const hw = w / 2 - r, hd = d / 2 - r;
    shape.moveTo(-hw - r, -hd);
    shape.lineTo(-hw - r, hd);
    shape.quadraticCurveTo(-hw - r, hd + r, -hw, hd + r);
    shape.lineTo(hw, hd + r);
    shape.quadraticCurveTo(hw + r, hd + r, hw + r, hd);
    shape.lineTo(hw + r, -hd);
    shape.quadraticCurveTo(hw + r, -hd - r, hw, -hd - r);
    shape.lineTo(-hw, -hd - r);
    shape.quadraticCurveTo(-hw - r, -hd - r, -hw - r, -hd);

    const geo = new THREE.ExtrudeGeometry(shape, {
      depth: h, bevelEnabled: true, bevelThickness: 5, bevelSize: 5, bevelSegments: 3, curveSegments: 12
    });
    geo.rotateX(-Math.PI / 2);
    geo.center();
    return geo;
  }

  /* ---------- interaction ---------- */
  const raycaster = new THREE.Raycaster();
  const pointer = new THREE.Vector2();
  const clock = new THREE.Clock();

  let hovered = false;
  let tiltTargetX = 0, tiltTargetZ = 0;
  let spinOffset = 0;
  let action = null;          // { start, dur, dir }
  let pointerDown = null;

  function updatePointer(e) {
    const rect = renderer.domElement.getBoundingClientRect();
    pointer.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
    pointer.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
  }

  function hitTest() {
    if (!piece) return false;
    raycaster.setFromCamera(pointer, camera);
    return raycaster.intersectObject(piece, false).length > 0;
  }

  renderer.domElement.addEventListener('pointermove', (e) => {
    updatePointer(e);
    if (action) return;
    const over = hitTest();
    if (over !== hovered) {
      hovered = over;
      renderer.domElement.style.cursor = over ? 'pointer' : 'grab';
    }
    if (over) {
      // subtle parallax tilt toward the pointer
      tiltTargetX = pointer.y * 0.13;
      tiltTargetZ = -pointer.x * 0.13;
    }
  });

  renderer.domElement.addEventListener('pointerleave', () => {
    hovered = false;
    tiltTargetX = 0;
    tiltTargetZ = 0;
  });

  renderer.domElement.addEventListener('pointerdown', (e) => {
    pointerDown = { x: e.clientX, y: e.clientY };
  });

  renderer.domElement.addEventListener('pointerup', (e) => {
    if (!pointerDown) return;
    const moved = Math.hypot(e.clientX - pointerDown.x, e.clientY - pointerDown.y);
    pointerDown = null;
    if (moved > 6) return;          // it was a drag, not a click
    updatePointer(e);
    if (!hitTest()) return;
    triggerAction();
  });

  function triggerAction() {
    if (reduceMotion) {
      // no spinning or shockwave, just a short glow pulse
      action = { start: performance.now(), dur: 420, dir: 0 };
      return;
    }
    const dir = Math.random() < 0.5 ? 1 : -1;
    action = { start: performance.now(), dur: 1100, dir };
    wave.visible = true;
    wave.scale.setScalar(0.3);
    wave.material.opacity = 0.85;
  }

  /* ---------- toolbar ---------- */
  function setSpin(on) {
    controls.autoRotate = on;
    if (spinBtn) {
      spinBtn.setAttribute('aria-pressed', String(on));
      const label = spinBtn.querySelector('[data-label]');
      if (label) label.textContent = on ? 'Pause spin' : 'Auto spin';
    }
  }
  setSpin(controls.autoRotate);

  if (spinBtn) spinBtn.addEventListener('click', () => setSpin(!controls.autoRotate));

  function resetView() {
    const dist = 3.0 + pieceHeight * 0.45;
    camera.position.set(dist * 0.62, FLOOR_Y + pieceHeight + dist * 0.44, dist * 0.74);
    controls.target.set(0, piece ? piece.position.y : 0, 0);
    controls.update();
  }
  if (resetBtn) resetBtn.addEventListener('click', resetView);

  /* ---------- resize ---------- */
  function resize() {
    const w = stage.clientWidth;
    const h = stage.clientHeight;
    if (!w || !h) return;
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    renderer.setSize(w, h, false);
  }
  if (typeof ResizeObserver !== 'undefined') {
    new ResizeObserver(resize).observe(stage);
  }
  window.addEventListener('resize', resize);
  resize();

  /* ---------- loop ---------- */
  function animate() {
    requestAnimationFrame(animate);
    const dt = Math.min(clock.getDelta(), 0.05);
    const now = performance.now();

    if (piece) {
      // tilt easing
      const ease = 1 - Math.pow(0.001, dt);
      piece.rotation.x += (tiltTargetX - piece.rotation.x) * ease;
      piece.rotation.z += (tiltTargetZ - piece.rotation.z) * ease;

      let glowTarget = hovered ? 0.42 : 0;
      let scaleTarget = hovered ? 1.035 : 1;

      if (action) {
        const p = Math.min(1, (now - action.start) / action.dur);
        const e = 1 - Math.pow(1 - p, 3);
        if (action.dir !== 0) {
          piece.rotation.y = spinOffset + e * Math.PI * 2 * action.dir;
          scaleTarget = 1 + Math.sin(p * Math.PI) * 0.09;
          glowTarget = 0.42 + (1 - p) * 0.75;
          wave.scale.setScalar(0.35 + e * 2.9);
          wave.material.opacity = (1 - p) * 0.85;
        } else {
          glowTarget = 0.9 * (1 - p);
        }
        if (p >= 1) {
          if (action.dir !== 0) {
            spinOffset = piece.rotation.y;
            piece.rotation.y = spinOffset;
          }
          wave.visible = false;
          wave.material.opacity = 0;
          action = null;
        }
      }

      const glowEase = 1 - Math.pow(0.002, dt);
      pieceMaterial.emissiveIntensity += (glowTarget - pieceMaterial.emissiveIntensity) * glowEase;

      const s = piece.scale.x + (scaleTarget - piece.scale.x) * glowEase;
      piece.scale.setScalar(s);
    }

    // gentle idle pulse on the arena ring
    arenaRing.material.opacity = 0.36 + Math.sin(now * 0.0016) * 0.14;

    controls.update();
    renderer.render(scene, camera);
  }
  animate();

  /* ---------- status helpers ---------- */
  function ready() {
    statusEl.classList.add('ready');
    statusEl.classList.remove('error');
    statusText.textContent = 'Game piece loaded. Drag to orbit';
  }
  function fail(msg) {
    statusEl.classList.remove('ready');
    statusEl.classList.add('error');
    statusText.textContent = msg;
  }
}
