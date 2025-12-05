import React, { useEffect } from 'react';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { useNavigate } from 'react-router-dom';
import { Gamepad2, LogIn } from 'lucide-react';

const Scene3D = ({ playButtonRef }) => {
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

    // Raycaster setup
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();
    const interactableObjects = []; // Store objects we want to interact with

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
      
      // Make it interactable
      maisonRight.traverse((child) => {
        if (child.isMesh) {
          child.userData.parentGroup = maisonRight; // Link back to parent
          interactableObjects.push(child);
        }
      });
      
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

    const animate = () => {
      requestAnimationFrame(animate);
      const delta = clock.getDelta();
      if (mixer) mixer.update(delta);
      skyMesh.position.copy(camera.position);
      controls.update();
      renderer.render(scene, camera);

      // Raycasting
      raycaster.setFromCamera(mouse, camera);
      const intersects = raycaster.intersectObjects(interactableObjects);

      if (intersects.length > 0) {
        document.body.style.cursor = 'pointer';
        // Highlight effect (optional: scale up slightly or change emission)
        const object = intersects[0].object;
        // Simple highlight: scale up the parent group slightly
        if (object.userData.parentGroup) {
           // We could add a sophisticated highlight here, but for now cursor change is good feedback
           // object.userData.parentGroup.scale.set(3.1, 3.1, 3.1); 
        }
      } else {
        document.body.style.cursor = 'default';
        // Reset scale if we were scaling
      }
    };

    animate();

    const onMouseMove = (event) => {
      mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
      mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
    };

    const onClick = () => {
      raycaster.setFromCamera(mouse, camera);
      const intersects = raycaster.intersectObjects(interactableObjects);
      
      if (intersects.length > 0) {
        // Trigger navigation
        if (playButtonRef.current) {
           playButtonRef.current.click(); // Simulate click on the hidden button logic
        }
      }
    };

    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('click', onClick);

    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('click', onClick);
      renderer.dispose();
    };
  }, []);

  return null;
};

export default function Spawn() {
  const navigate = useNavigate();
  const playButtonRef = React.useRef(null);

  return (
    <>
      <canvas id="three-canvas" style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', zIndex: 0 }}></canvas>
      <Scene3D playButtonRef={playButtonRef} />
      
      {/* UI Overlay */}
      <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', pointerEvents: 'none', zIndex: 10 }}>
        <div style={{ padding: '2rem', display: 'flex', justifyContent: 'space-between' }}>
          <h1 style={{ color: 'white', textShadow: '0 2px 4px rgba(0,0,0,0.5)' }}>Cyber City Spawn</h1>
          
          <div style={{ pointerEvents: 'auto', display: 'flex', gap: '1rem' }}>
            <button onClick={() => navigate('/login')} className="btn" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <LogIn size={20} /> Login / Profile
            </button>
          </div>
        </div>

        {/* Hidden Logic Button (triggered by 3D click) */}
        <button 
          ref={playButtonRef}
          onClick={() => {
            const token = localStorage.getItem('token');
            if (token) {
              navigate('/quiz-click-trap');
            } else {
              navigate('/login', { state: { from: '/quiz-click-trap' } });
            }
          }} 
          style={{ display: 'none' }}
        />
      </div>
    </>
  );
}
