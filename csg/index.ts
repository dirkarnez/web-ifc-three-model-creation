import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { CSG } from "three-csg-ts";

let camera: THREE.PerspectiveCamera,
  scene: THREE.Scene,
  renderer: THREE.WebGLRenderer;

const container_depth = 2;
const container_height = 2;
const container_width = 2;

const sub_depth = 1;
const sub_height = 1;
const sub_width = 1;

function extrudeExample() {
  const container = new THREE.Mesh(
    new THREE.BoxGeometry(container_width, container_depth, container_height),
    new THREE.MeshNormalMaterial()
  );
  container.position.set(-container_width, 0, 0);

  const vectors: [number, number][] = [
    [0, 0],
    [0, sub_height],
    [sub_width, sub_height],
    [sub_width, 0]
  ];
  const extrudeSettings: THREE.ExtrudeGeometryOptions = {
    steps: 1,
    depth: sub_depth,
    bevelEnabled: false
  };

  const geometry = new THREE.ExtrudeGeometry(
    new THREE.Shape(vectors.map((v) => new THREE.Vector2(...v))),
    extrudeSettings
  );

  // geometry.computeBoundingBox();
  // geometry.computeBoundingSphere();
  // geometry.computeTangents();
  // geometry.computeVertexNormals();
  // geometry.normalizeNormals();
  // geometry.scale(1.1, 1.1, 1.1);

  const sub = new THREE.Mesh(geometry, new THREE.MeshNormalMaterial());
  sub.position.set(-2, 0, 0);

  container.updateMatrix();
  sub.updateMatrix();

  const result = CSG.subtract(container, sub);
  scene.add(result);
}

function boxExample() {
  const container = new THREE.Mesh(
    new THREE.BoxGeometry(container_width, container_depth, container_height),
    new THREE.MeshNormalMaterial()
  );
  container.position.set(container_width, 0, 0);

  
  const sub = new THREE.Mesh(
    new THREE.BoxGeometry(sub_width, sub_height, sub_depth),
    new THREE.MeshNormalMaterial()
  );
  sub.position.set(2.5, 0.5, 0.5);

  container.updateMatrix();
  sub.updateMatrix();

  const result = CSG.subtract(container, sub);
  const a= extractIndexedFaceSet(result.geometry);
  debugger;

  scene.add(result);
}

function init() {
  renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  document.body.appendChild(renderer.domElement);

  scene = new THREE.Scene();

  camera = new THREE.PerspectiveCamera(
    45,
    window.innerWidth / window.innerHeight,
    1,
    10000
  );
  const controls = new OrbitControls(camera, renderer.domElement);
  camera.position.set(0, 20, 10);
  controls.update();

  extrudeExample();
  boxExample();
}

function animate() {
  requestAnimationFrame(animate);
  renderer.render(scene, camera);
}

init();
animate();

function extractIndexedFaceSet(geometry) {
  const vertices = [];
  const indices = [];

  // Extract vertex positions
  const positionAttribute = geometry.getAttribute('position');
  for (let i = 0; i < positionAttribute.count; i++) {
    const x = positionAttribute.getX(i);
    const y = positionAttribute.getY(i);
    const z = positionAttribute.getZ(i);
    vertices.push(x, y, z);
  }

  // Extract face indices
  const indexAttribute = geometry.getIndex();
  if (indexAttribute) {
    for (let i = 0; i < indexAttribute.count; i += 3) {
      const a = indexAttribute.getX(i);
      const b = indexAttribute.getX(i + 1);
      const c = indexAttribute.getX(i + 2);
      indices.push(a, b, c);
    }
  } else {
    for (let i = 0; i < positionAttribute.count; i += 3) {
      indices.push(i, i + 1, i + 2);
    }
  }

  // Create IndexedFaceSet
  const indexedFaceSet = {
    coord: vertices,
    coordIndex: indices
  };

  return indexedFaceSet;
}

