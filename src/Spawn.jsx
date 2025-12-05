import React, { useEffect } from 'react';
import './index.css';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

const Scene3D = () => {
  const clock = new THREE.Clock();
  let mixer = null;
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
    loader.load(`/modeles/house.glb`, gltf => {
      const maisonBack = gltf.scene;
      maisonBack.scale.set(3, 3, 3);
      maisonBack.position.set(-6, 0, 15);
      maisonBack.rotation.y = Math.PI;
      scene.add(maisonBack);
    }, undefined, error => console.error('Erreur maison derrière :', error));

    // Maison à gauche de la caméra (tournée -90°)
    loader.load(`/modeles/house.glb`, gltf => {
      const maisonLeft = gltf.scene;
      maisonLeft.scale.set(3, 3, 3);
      maisonLeft.position.set(-1.6, 0, 6);
      maisonLeft.rotation.y = -Math.PI / 2;
      scene.add(maisonLeft);
    }, undefined, error => console.error('Erreur maison gauche :', error));

    // Maison à droite de la caméra (tournée 90°)
    loader.load(`/modeles/house.glb`, gltf => {
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

    // Maxwell the cat
    loader.load('/modeles/maxwell.glb', gltf => {
      const maxwell = gltf.scene;
      maxwell.scale.set(3, 3, 3);
      maxwell.position.set(-2, 1.2, -3);
      maxwell.rotation.y = Math.PI / 2;
      scene.add(maxwell);
      mixer = new THREE.AnimationMixer(maxwell);
      const action = mixer.clipAction(gltf.animations[0]);
      action.play();
    }, undefined, error => console.error('Erreur maxwell le chat :', error));

    // Fonction pour créer du texte plat avec CanvasTexture
    const createFlatText = (txt, width = 1, height = 0.3, fontSize = 64, color = 'black') => {
      // Créer le canvas
      const canvas = document.createElement('canvas');
      canvas.width = 512;
      canvas.height = 128;
      const ctx = canvas.getContext('2d');

      // Dessiner le texte
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.font = `${fontSize}px Arial`;
      ctx.fillStyle = color;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(txt, canvas.width / 2, canvas.height / 2);

      // Créer la texture
      const texture = new THREE.CanvasTexture(canvas);
      texture.flipY = false;
      texture.needsUpdate = true;

      // Matériau et plan
      const material = new THREE.MeshBasicMaterial({ map: texture, transparent: true });
      const geometry = new THREE.PlaneGeometry(width, height);
      const mesh = new THREE.Mesh(geometry, material);

      return mesh;
    };

    // --- Texte devant les panneaux ---
    const textBack = createFlatText("Quiz 1", 1, 0.3);
    textBack.position.set(-2, 3, 4.3);
    textBack.rotation.y = Math.PI;
    scene.add(textBack);

    const textLeft = createFlatText("Quiz 2", 1, 0.3);
    textLeft.position.set(-4, 1.8, -1.7);
    textLeft.rotation.y = -Math.PI / 2;
    scene.add(textLeft);

    const textRight = createFlatText("Quiz 3", 1, 0.3);
    textRight.position.set(4, 1.8, 1.7);
    textRight.rotation.y = Math.PI / 2;
    scene.add(textRight);

    const textCity = createFlatText("Grand Quiz", 1.2, 0.3);
    textCity.position.set(2, 1.8, -5);
    textCity.rotation.y = Math.PI;
    scene.add(textCity);

    const animate = () => {
      requestAnimationFrame(animate);
      const delta = clock.getDelta();
      if (mixer) mixer.update(delta);
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

export default Scene3D;