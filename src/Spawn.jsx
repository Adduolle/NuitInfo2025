import React, { useEffect } from 'react';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { useNavigate } from 'react-router-dom';
import { Gamepad2, LogIn } from 'lucide-react';

const Scene3D = ({ playButtonRef, setDebugName }) => {
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
    let hoveredObject = null;
    let isMouseDownOnObject = false;


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
          // Only add the door meshes
          if (child.name === 'Cube004_0' || child.name === 'Plane012_0') {
             console.log("Adding interactable object:", child.name);
             child.userData.parentGroup = maisonRight; // Link back to parent
             interactableObjects.push(child);
          }
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
        const object = intersects[0].object;
        
        // Highlight logic
        if (hoveredObject !== object) {
          // Reset previous highlight
          if (hoveredObject && hoveredObject.material) {
             hoveredObject.material.emissive.setHex(hoveredObject.currentHex);
          }
          
          // Apply new highlight
          hoveredObject = object;
          if (hoveredObject.material) {
            hoveredObject.currentHex = hoveredObject.material.emissive.getHex();
            hoveredObject.material.emissive.setHex(0x555555); // Grayish glow
          }
        }
      } else {
        document.body.style.cursor = 'default';
        if (hoveredObject) {
          if (hoveredObject.material) {
             hoveredObject.material.emissive.setHex(hoveredObject.currentHex);
          }
          hoveredObject = null;
        }
      }
    };

    animate();

    const onMouseMove = (event) => {
      mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
      mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
    };

    const onMouseDown = () => {
      raycaster.setFromCamera(mouse, camera);
      const intersects = raycaster.intersectObjects(interactableObjects);
      if (intersects.length > 0) {
        isMouseDownOnObject = true;
      } else {
        isMouseDownOnObject = false;
      }
    };

    const onMouseUp = () => {
      if (isMouseDownOnObject) {
        raycaster.setFromCamera(mouse, camera);
        const intersects = raycaster.intersectObjects(interactableObjects);
        
        if (intersects.length > 0) {
          console.log("3D Click detected on:", intersects[0].object.name);
          // Trigger navigation
          if (playButtonRef.current) {
             console.log("Clicking hidden button...");
             playButtonRef.current.click(); 
          } else {
             console.error("playButtonRef.current is null!");
          }
        }
      }
      isMouseDownOnObject = false;
    };

    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mouseup', onMouseUp);

    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('mouseup', onMouseUp);
      renderer.dispose();
    };
  }, []);

  return null;
};

export default function Spawn() {
  const navigate = useNavigate();
  const playButtonRef = React.useRef(null);
  const [showGuestModal, setShowGuestModal] = React.useState(false);

  const handlePlayClick = () => {
    console.log("handlePlayClick triggered");
    const token = localStorage.getItem('token');
    if (token) {
      console.log("Token found, navigating to quiz");
      navigate('/quiz-click-trap');
    } else {
      console.log("No token, showing guest modal");
      setShowGuestModal(true);
    }
  };
  const [debugName, setDebugName] = React.useState("");

  return (
    <>
      <canvas id="three-canvas" style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', zIndex: 0 }}></canvas>
      <Scene3D playButtonRef={playButtonRef} setDebugName={setDebugName} />
      
      {/* UI Overlay */}
      <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', pointerEvents: 'none', zIndex: 10 }}>


        {/* Hidden Logic Button (triggered by 3D click) */}

        <button 
          ref={playButtonRef}
          onClick={handlePlayClick} 
          style={{ display: 'none' }}
        />

        {/* Guest Warning Modal */}
        {showGuestModal && (
          <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(5px)', zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem', pointerEvents: 'auto' }}>
            <div className="glass-panel animate-fade-in" style={{ width: '100%', maxWidth: '500px', padding: '2rem', textAlign: 'center', background: 'rgba(15, 23, 42, 0.9)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '16px' }}>
              <h2 style={{ color: 'white', marginBottom: '1rem' }}>Mode Invité</h2>
              <p style={{ color: '#ccc', marginBottom: '2rem' }}>
                Vous n'êtes pas connecté. Votre score ne sera pas enregistré.
                Voulez-vous continuer ou vous connecter ?
              </p>
              <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
                <button 
                  onClick={() => navigate('/login', { state: { from: '/quiz-click-trap' } })}
                  className="btn"
                  style={{ background: '#3b82f6' }}
                >
                  <LogIn size={18} style={{ marginRight: '8px' }} /> Se connecter
                </button>
                <button 
                  onClick={() => navigate('/quiz-click-trap')}
                  className="btn"
                  style={{ background: 'transparent', border: '1px solid rgba(255,255,255,0.3)' }}
                >
                  <Gamepad2 size={18} style={{ marginRight: '8px' }} /> Jouer sans sauvegarder
                </button>
              </div>
              <button 
                onClick={() => setShowGuestModal(false)}
                style={{ marginTop: '1.5rem', background: 'none', border: 'none', color: '#666', cursor: 'pointer', textDecoration: 'underline' }}
              >
                Annuler
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
