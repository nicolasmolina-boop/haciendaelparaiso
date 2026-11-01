/* Explorador 3D con el terreno real de la hacienda.
   Relieve: DTM del dron + elevación abierta alrededor. Textura: ortomosaico del dron.
   Los datos los genera aeroscan-hacienda/web3d/gen_terreno.py en img/terreno/. */
import * as THREE from './js/three.module.min.js';

const ESCALA = 50;      // metros por unidad de escena
const EXAGERA = 1.35;   // exageración vertical para que se lea el cañón
const NOMBRES = {cultivos: 'los cultivos', jardin: 'el jardín', terraza: 'la casa y la terraza',
  bosque: 'el bosque de pinos', torno: 'el Cañón El Torno'};

export async function createWorld(host, places, onSelect, reducedMotion = false) {
  const probe = document.createElement('canvas');
  if (!probe.getContext('webgl2') && !probe.getContext('webgl')) throw new Error('sin WebGL');

  const [info, crudo, textura] = await Promise.all([
    fetch('img/terreno/terreno.json').then(r => r.json()),
    fetch('img/terreno/alturas.bin').then(r => r.arrayBuffer()),
    new THREE.TextureLoader().loadAsync('img/terreno/orto.webp')
  ]);

  const [L, B, R, T] = info.bounds;
  const [GW, GH] = info.grid;
  const [lo, hi] = info.alt;
  const alturas = new Uint16Array(crudo);
  const ancho = (R - L) / ESCALA, alto = (T - B) / ESCALA;
  const cx = (L + R) / 2, cy = (B + T) / 2;

  // Altura en unidades de escena para un punto UTM (bilineal sobre la rejilla)
  const elev = (x, y) => {
    const fx = THREE.MathUtils.clamp((x - L) / (R - L) * GW - .5, 0, GW - 1);
    const fy = THREE.MathUtils.clamp((T - y) / (T - B) * GH - .5, 0, GH - 1);
    const x0 = Math.floor(fx), y0 = Math.floor(fy), x1 = Math.min(x0 + 1, GW - 1), y1 = Math.min(y0 + 1, GH - 1);
    const a = fx - x0, b = fy - y0, v = (i, j) => alturas[j * GW + i];
    const q = v(x0, y0) * (1 - a) * (1 - b) + v(x1, y0) * a * (1 - b) + v(x0, y1) * (1 - a) * b + v(x1, y1) * a * b;
    return (q / 65535 * (hi - lo)) / ESCALA * EXAGERA;
  };
  const local = (x, y) => new THREE.Vector3((x - cx) / ESCALA, elev(x, y), -(y - cy) / ESCALA);

  const renderer = new THREE.WebGLRenderer({antialias: true, alpha: true, powerPreference: 'low-power'});
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.75));
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.1;
  host.appendChild(renderer.domElement);
  renderer.domElement.setAttribute('aria-hidden', 'true');

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(36, 1, .1, 200);

  // Terreno
  const geo = new THREE.PlaneGeometry(ancho, alto, GW - 1, GH - 1);
  geo.rotateX(-Math.PI / 2);
  const pos = geo.attributes.position;
  for (let i = 0; i < pos.count; i++) pos.setY(i, alturas[i] / 65535 * (hi - lo) / ESCALA * EXAGERA);
  geo.computeVertexNormals();
  textura.colorSpace = THREE.SRGBColorSpace;
  textura.anisotropy = Math.min(8, renderer.capabilities.getMaxAnisotropy());
  const suelo = new THREE.Mesh(geo, new THREE.MeshStandardMaterial({map: textura, roughness: 1, metalness: 0}));
  scene.add(suelo);

  // Base de la maqueta: paredes de tierra alrededor del recorte
  const pared = new THREE.MeshStandardMaterial({color: 0x6b5236, roughness: 1});
  const bordes = [];
  const lado = (pts) => {
    const v = [], idx = [];
    pts.forEach((p, k) => { v.push(p.x, p.y, p.z, p.x, -.6, p.z); if (k) idx.push(2 * k - 2, 2 * k - 1, 2 * k, 2 * k - 1, 2 * k + 1, 2 * k); });
    const g = new THREE.BufferGeometry();
    g.setAttribute('position', new THREE.Float32BufferAttribute(v, 3));
    g.setIndex(idx); g.computeVertexNormals();
    const m = new THREE.Mesh(g, pared); m.material.side = THREE.DoubleSide; bordes.push(m); scene.add(m);
  };
  const filaPts = j => Array.from({length: GW}, (_, i) => pos.getY(j * GW + i)).map((y, i) => new THREE.Vector3(-ancho / 2 + i * ancho / (GW - 1), y, -alto / 2 + j * alto / (GH - 1)));
  const colPts = i => Array.from({length: GH}, (_, j) => new THREE.Vector3(-ancho / 2 + i * ancho / (GW - 1), pos.getY(j * GW + i), -alto / 2 + j * alto / (GH - 1)));
  lado(filaPts(0)); lado(filaPts(GH - 1)); lado(colPts(0)); lado(colPts(GW - 1));

  // Lindero de la finca (17 manzanas), sobre el terreno
  const ruta = new THREE.CurvePath();
  for (let k = 1; k < info.lindero.length; k++) {
    const [ax, ay] = info.lindero[k - 1], [bx, by] = info.lindero[k];
    const tramo = Math.max(2, Math.round(Math.hypot(bx - ax, by - ay) / 12));
    for (let s = 0; s < tramo; s++) {
      const p = local(ax + (bx - ax) * s / tramo, ay + (by - ay) * s / tramo);
      const q = local(ax + (bx - ax) * (s + 1) / tramo, ay + (by - ay) * (s + 1) / tramo);
      p.y += .06; q.y += .06;
      ruta.add(new THREE.LineCurve3(p, q));
    }
  }
  const linea = new THREE.Mesh(new THREE.TubeGeometry(ruta, 600, .035, 6, false),
    new THREE.MeshBasicMaterial({color: 0xdce8a6}));
  scene.add(linea);

  // Luces
  const cielo = new THREE.HemisphereLight(0xfff6e2, 0x3c4a2e, 1.6);
  const sol = new THREE.DirectionalLight(0xffefd2, 2.6);
  sol.position.set(-8, 14, 6);
  scene.add(cielo, sol);

  // Puntos de interés: botones HTML sobre la escena
  const puntos = {};
  Object.entries(info.lugares).forEach(([k, [x, y]]) => { const p = local(x, y); p.y += .12; puntos[k] = p; });
  const hotspots = document.getElementById('world-hotspots');
  const botones = {};
  Object.keys(places).forEach((key, i) => {
    if (!puntos[key]) return;
    const b = document.createElement('button');
    b.type = 'button';
    b.className = 'world-pin';
    b.dataset.worldPlace = key;
    b.setAttribute('aria-label', 'Explorar ' + (NOMBRES[key] || key));
    b.setAttribute('aria-pressed', 'false');
    b.innerHTML = `<span>${String(i + 1).padStart(2, '0')}</span>`;
    hotspots.appendChild(b);
    botones[key] = b;
  });

  // Cámara orbital alrededor de un objetivo que se mueve al lugar elegido
  // Vista inicial: desde el suroeste, con la casa, el lindero y El Torno a la vista
  const centro = local((info.lugares.terraza[0] + info.lugares.torno[0] + 498900) / 3, (info.lugares.terraza[1] + info.lugares.torno[1] + 1559150) / 3);
  const inicio = {angle: -.5, elevation: .95, distance: 38, target: centro};
  let angle = inicio.angle, elevation = inicio.elevation, distance = inicio.distance;
  let goalAngle = angle, goalElevation = elevation, goalDistance = distance;
  const target = inicio.target.clone(), goalTarget = target.clone();
  let visible = true, drag = null, dirty = true, lastTime = 0;
  const minDistance = 6, maxDistance = 55;

  function resize() {
    const r = host.getBoundingClientRect();
    if (r.width < 1 || r.height < 1) return;
    renderer.setSize(r.width, r.height);
    camera.aspect = r.width / r.height;
    camera.zoom = Math.min(1, camera.aspect / 1.2);
    camera.updateProjectionMatrix();
    dirty = true;
  }
  new ResizeObserver(resize).observe(host);
  resize();

  function render(time = 0) {
    if (!visible || document.hidden || time - lastTime < 28) return;
    lastTime = time;
    const moving = Math.abs(goalAngle - angle) + Math.abs(goalElevation - elevation) + Math.abs(goalDistance - distance) + goalTarget.distanceTo(target) > .002;
    if (!moving && !dirty) return;
    const mix = reducedMotion ? 1 : .08;
    angle += (goalAngle - angle) * mix;
    elevation += (goalElevation - elevation) * mix;
    distance += (goalDistance - distance) * mix;
    target.lerp(goalTarget, mix);
    camera.position.set(target.x + Math.sin(angle) * Math.cos(elevation) * distance,
      target.y + Math.sin(elevation) * distance,
      target.z + Math.cos(angle) * Math.cos(elevation) * distance);
    camera.lookAt(target);
    camera.updateMatrixWorld();
    for (const [key, b] of Object.entries(botones)) {
      const v = puntos[key].clone().project(camera);
      b.style.left = `${(v.x * .5 + .5) * host.clientWidth}px`;
      b.style.top = `${(-v.y * .5 + .5) * host.clientHeight}px`;
      b.style.visibility = (v.z < 1 && Math.abs(v.x) < .95 && Math.abs(v.y) < .93) ? 'visible' : 'hidden';
    }
    renderer.render(scene, camera);
    dirty = false;
  }
  renderer.setAnimationLoop(render);

  new IntersectionObserver(e => { visible = e[0].isIntersecting; dirty = true; renderer.setAnimationLoop(visible ? render : null); }, {threshold: .02}).observe(host);
  document.addEventListener('visibilitychange', () => { dirty = true; renderer.setAnimationLoop(!document.hidden && visible ? render : null); });

  host.addEventListener('pointerdown', e => {
    if (e.button !== 0 || e.target.closest('.world-pin')) return;
    drag = {x: e.clientX, y: e.clientY};
    host.setPointerCapture(e.pointerId);
    host.classList.add('dragging');
  });
  host.addEventListener('pointermove', e => {
    if (!drag) return;
    goalAngle -= (e.clientX - drag.x) * .008;
    goalElevation = THREE.MathUtils.clamp(goalElevation + (e.clientY - drag.y) * .004, .25, 1.35);
    drag = {x: e.clientX, y: e.clientY};
    dirty = true;
  });
  const end = () => { drag = null; host.classList.remove('dragging'); };
  host.addEventListener('pointerup', end);
  host.addEventListener('pointercancel', end);
  host.addEventListener('wheel', e => {
    e.preventDefault();
    goalDistance = THREE.MathUtils.clamp(goalDistance * (e.deltaY > 0 ? 1.1 : .9), minDistance, maxDistance);
    dirty = true;
  }, {passive: false});

  const control = kind => {
    if (kind === 'left') goalAngle -= .45;
    if (kind === 'right') goalAngle += .45;
    if (kind === 'in') goalDistance = Math.max(minDistance, goalDistance * .82);
    if (kind === 'out') goalDistance = Math.min(maxDistance, goalDistance * 1.2);
    if (kind === 'reset') {
      goalAngle = inicio.angle; goalElevation = inicio.elevation; goalDistance = inicio.distance;
      goalTarget.copy(inicio.target);
    }
    dirty = true;
  };
  host.addEventListener('keydown', e => {
    const keys = {ArrowLeft: 'left', ArrowRight: 'right', '+': 'in', '=': 'in', '-': 'out', Home: 'reset'};
    if (keys[e.key]) { e.preventDefault(); control(keys[e.key]); }
    if (e.key === 'ArrowUp' || e.key === 'ArrowDown') {
      e.preventDefault();
      goalElevation = THREE.MathUtils.clamp(goalElevation + (e.key === 'ArrowUp' ? .12 : -.12), .25, 1.35);
      dirty = true;
    }
  });

  renderer.domElement.addEventListener('webglcontextlost', e => {
    e.preventDefault();
    renderer.setAnimationLoop(null);
    document.getElementById('world-fallback').hidden = false;
    hotspots.hidden = true;
    document.querySelectorAll('[data-world-control]').forEach(b => { b.disabled = true; });
  });

  return {
    control,
    focus(key) {
      if (!puntos[key]) return;
      goalTarget.copy(puntos[key]);
      goalDistance = key === 'bosque' ? 20 : key === 'torno' ? 15 : 11;
      goalElevation = key === 'torno' ? .8 : .7;
      Object.entries(botones).forEach(([k, b]) => b.classList.toggle('active', k === key));
      dirty = true;
    },
    light(night) {
      cielo.intensity = night ? .9 : 1.6;
      cielo.color.set(night ? 0xb5c1d1 : 0xfff6e2);
      sol.color.set(night ? 0xffa86d : 0xffefd2);
      sol.intensity = night ? 1.8 : 2.6;
      sol.position.set(night ? -14 : -8, night ? 5 : 14, 6);
      renderer.toneMappingExposure = night ? .95 : 1.1;
      dirty = true;
    }
  };
}
