import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";

// ----- 주제: MeshStandardMaterial 에 효과 더하기

export default function example() {
  // 로딩 매니저
  const loadingManager = new THREE.LoadingManager();
  loadingManager.onStart = () => {
    console.log("시작");
  };
  loadingManager.onLoad = () => {
    console.log("로드 완료");
  };
  loadingManager.onProgress = (img) => {
    console.log(img + "로드 중");
  };
  loadingManager.onError = () => {
    console.log("로드 에러");
  };

  // 텍스쳐 이미지 로드
  const textureLoader = new THREE.TextureLoader(loadingManager);
  const baseColorTex = textureLoader.load(
    "/textures/brick/Brick_Wall_019_basecolor.jpg"
  );
  const ambientTex = textureLoader.load(
    "/textures/brick/Brick_Wall_019_ambientOcclusion.jpg"
  );
  const normalTex = textureLoader.load(
    "/textures/brick/Brick_Wall_019_normal.jpg"
  );
  const roughnessTex = textureLoader.load(
    "/textures/brick/Brick_Wall_019_roughness.jpg"
  );
  const heightTex = textureLoader.load(
    "/textures/brick/Brick_Wall_019_height.png"
  );

  // Renderer
  const canvas = document.querySelector("#three-canvas");
  const renderer = new THREE.WebGLRenderer({
    canvas,
    antialias: true,
  });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(window.devicePixelRatio > 1 ? 2 : 1);

  // Scene
  const scene = new THREE.Scene();
  scene.background = new THREE.Color("white");

  // Camera
  const camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
  );
  camera.position.y = 1.5;
  camera.position.z = 4;
  scene.add(camera);

  // Light
  const ambientLight = new THREE.AmbientLight("white", 0.5);
  scene.add(ambientLight);

  const directionalLight = new THREE.DirectionalLight("white", 3);
  directionalLight.position.x = 1;
  directionalLight.position.z = 2;
  scene.add(directionalLight);

  // Controls
  const controls = new OrbitControls(camera, renderer.domElement);

  // Mesh
  const geometry = new THREE.BoxGeometry(1, 1, 1);
  const material = new THREE.MeshStandardMaterial({
    map: baseColorTex,
    roughness: 0.3,
    metalness: 0.3,
    normalMap: normalTex, // 재질 입체감
    roughnessMap: roughnessTex, // 빛 반사
    aoMap: ambientTex, // 그림자를 조금 더 어둡게
    aoMapIntensity: 10,
  });
  const mesh = new THREE.Mesh(geometry, material);
  scene.add(mesh);

  // 그리기
  const clock = new THREE.Clock();

  function draw() {
    const delta = clock.getDelta();

    renderer.render(scene, camera);
    renderer.setAnimationLoop(draw);
  }

  function setSize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.render(scene, camera);
  }

  // 이벤트
  window.addEventListener("resize", setSize);

  draw();
}