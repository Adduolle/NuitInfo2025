import { StrictMode, useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

const Scene3D = () => {
  useEffect(() => {
    const scene = new THREE.Scene();
    const skyGeometry = new THREE.SphereGeometry(100, 128, 128);
    const textureLoader = new THREE.TextureLoader();
    const skyTexture = textureLoader.load('/textures/sky.jpg');
    const skyMaterial = new THREE.MeshBasicMaterial({
      map: skyTexture,
      side: THREE.BackSide
    });
    const skyMesh = new THREE.Mesh(skyGeometry, skyMaterial);

    skyMesh.rotation.y = Math.PI / 4;
    skyMesh.rotation.x = Math.PI / 2.5;
    scene.add(skyMesh);


    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.set(0, 5, 0);

    const renderer = new THREE.WebGLRenderer({ antialias: true, canvas: document.getElementById('three-canvas') });
    renderer.setSize(window.innerWidth, window.innerHeight);

    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(10, 10, 10);
    scene.add(directionalLight);

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.enableZoom = false;
    controls.enablePan = false;
    controls.target.set(0, 5, 0);
    controls.update();

    const loader = new GLTFLoader();

    // Maison derrière la caméra (face caméra = 180°)
    loader.load(`/modeles/maison.glb`, gltf => {
      const maisonBack = gltf.scene;
      maisonBack.scale.set(3, 3, 3);
      maisonBack.position.set(-6, 0, 15);
      maisonBack.rotation.y = Math.PI;
      scene.add(maisonBack);
    }, undefined, error => console.error('Erreur maison derrière :', error));

    // Maison à gauche de la caméra (tournée -90°)
    loader.load(`/modeles/maison.glb`, gltf => {
      const maisonLeft = gltf.scene;
      maisonLeft.scale.set(3, 3, 3);
      maisonLeft.position.set(-1.6, 0, 6);
      maisonLeft.rotation.y = -Math.PI / 2;
      scene.add(maisonLeft);
    }, undefined, error => console.error('Erreur maison gauche :', error));

    // Maison à droite de la caméra (tournée 90°)
    loader.load(`/modeles/maison.glb`, gltf => {
      const maisonRight = gltf.scene;
      maisonRight.scale.set(3, 3, 3);
      maisonRight.position.set(1.6, 0, -6);
      maisonRight.rotation.y = Math.PI / 2;
      scene.add(maisonRight);
    }, undefined, error => console.error('Erreur maison droite :', error));

    // City hall plus loin devant (face caméra)
    loader.load(`/modeles/city_hall.glb`, gltf => {
      const cityHall = gltf.scene;
      cityHall.position.set(0, 0, -26);
      scene.add(cityHall);
    }, undefined, error => console.error('Erreur city hall :', error));

    // Devant la maison derrière la caméra
    loader.load('/modeles/sign.glb', gltf => {
      const signBack = gltf.scene;
      signBack.scale.set(1, 1, 1);
      signBack.position.set(-2, 1, 5);
      scene.add(signBack);
    }, undefined, error => console.error('Erreur panneau derrière :', error));

    // Devant la maison gauche
    loader.load('/modeles/sign.glb', gltf => {
      const signLeft = gltf.scene;
      signLeft.scale.set(1, 1, 1);
      signLeft.position.set(-4, 1, -2.5);
      signLeft.rotation.y = -Math.PI / 2;
      scene.add(signLeft);
    }, undefined, error => console.error('Erreur panneau gauche :', error));

    // Devant la maison droite
    loader.load('/modeles/sign.glb', gltf => {
      const signRight = gltf.scene;
      signRight.scale.set(1, 1, 1);
      signRight.position.set(4, 1, 2.5);
      signRight.rotation.y = Math.PI / 2;
      scene.add(signRight);
    }, undefined, error => console.error('Erreur panneau droite :', error));

    // Devant le city hall
    loader.load('/modeles/sign.glb', gltf => {
      const signCity = gltf.scene;
      signCity.scale.set(1, 1, 1);
      signCity.position.set(2, 1, -4.5);
      signCity.rotation.y = Math.PI;
      scene.add(signCity);
    }, undefined, error => console.error('Erreur panneau city hall :', error));

    const animate = () => {
      requestAnimationFrame(animate);
      skyMesh.position.copy(camera.position);
      controls.update();
      renderer.render(scene, camera);
    };

    animate();

    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      renderer.dispose();
    };
  }, []);

  return null;
};

const App = () => {
  return (
    <>
      <canvas id="three-canvas"></canvas>
      <Scene3D />
    </>
  );
};

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>
);