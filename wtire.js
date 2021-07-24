window.focus();

let camera, scene, renderer;
let stack = [];
let gameStarted = false;
const boxHeight = 1;
const originalBoxSize = 3;

const scoreElement = document.getElementById('score');
const instructionsElement = document.getElementById('instructions');
const resultsElement = document.getElementById('results');

init();

function init() {
  scene = new THREE.Scene();

  //Foundation
  addLayer(0, 0, originalBoxSize, originalBoxSize);

  //First Layer
  addLayer(-10, 0, originalBoxSize, originalBoxSize, 'x');

  const ambientLight = new THREE.AmbientLight(0xffffff, 0.7);
  scene.add(ambientLight);

  const directionLight = new THREE.DirectionalLight(0xffffff, 0.6);
  directionLight.position.set(10, 20, 0);
  scene.add(directionLight);

  const width = 10;
  const height = width * (window.innerHeight / window.innerWidth);
  camera = new THREE.OrthographicCamera(
    width / -2,
    width / 2,
    height / 2,
    height / -2,
    1,
    100
  );

  camera.position.set(4, 4, 4);
  camera.lookAt(0, 0, 0);

  renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.render(scene, camera);

  document.body.appendChild(renderer.domElement);
}

window.addEventListener('click', () => {
  if (!gameStarted) {
    renderer.setAnimationLoop(animation);
    if (instructionsElement) instructionsElement.style.display = 'none';
    if (resultsElement) resultsElement.style.display = 'none';
    if (scoreElement) scoreElement.innerText = 0;
    gameStarted = true;
  } else {
    const topLayer = stack[stack.length - 1];
    const direction = topLayer.direction;

    const nextX = direction == 'x' ? 0 : -10;
    const nextZ = direction == 'z' ? 0 : -10;
    const newWidth = originalBoxSize;
    const newDepth = originalBoxSize;
    const nextDirection = direction == 'x' ? 'z' : 'x';
    addLayer(nextX, nextZ, newWidth, newDepth, nextDirection);
  }
});

function animation() {
  const speed = 0.15;

  const topLayer = stack[stack.length - 1];
  topLayer.threejs.position[topLayer.direction] += speed;

  if (camera.position.y < boxHeight * (stack.length - 2) + 4) {
    camera.position.y += speed;
  }
  renderer.render(scene, camera);
}

function addLayer(x, z, width, depth, direction) {
  const y = boxHeight * stack.length;

  const layer = generateBox(x, y, z, width, depth);
  layer.direction = direction;
  stack.push(layer);
}

function generateBox(x, y, z, width, depth) {
  const geometry = new THREE.BoxGeometry(width, boxHeight, depth);

  const color = new THREE.Color(`hsl(${30 + stack.length * 4},100%,50%)`);
  const material = new THREE.MeshLambertMaterial({ color });

  const mesh = new THREE.Mesh(geometry, material);
  mesh.position.set(x, y, z);
  scene.add(mesh);

  return {
    threejs: mesh,
    width,
    depth,
  };
}
