import React, { useState, useEffect, useRef } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera, Sparkles } from '@react-three/drei';
import * as THREE from 'three';

const numSparkles = 15; // Number of sparkles in the tail
function MeshGeo(){
  const meshRef = useRef()
  return(
    <mesh ref={meshRef}>
      <cylinderGeometry args={[1,1,1]}></cylinderGeometry>
      <meshLambertMaterial color={'#FFECA1'} emissive={'#FFECA1'} />
    </mesh>
  )
}

function MouseFollower() {
  const meshRef = useRef();
  const { camera } = useThree();
  const [mousePosition, setMousePosition] = useState(new THREE.Vector2());
  const [positions, setPositions] = useState(Array(numSparkles).fill(new THREE.Vector3()));

  useEffect(() => {
    const handleMouseMove = (event) => {
      const mouseX = (event.clientX / window.innerWidth) * 2 - 1;
      const mouseY = -(event.clientY / window.innerHeight) * 2 + 1;
      setMousePosition(new THREE.Vector2(mouseX, mouseY));
    };

    window.addEventListener('mousemove', handleMouseMove);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  useFrame(() => {
    const raycaster = new THREE.Raycaster();
    const plane = new THREE.Plane(new THREE.Vector3(0, 1, 1), 0); 

    raycaster.setFromCamera(mousePosition, camera);
    const intersection = new THREE.Vector3();
    raycaster.ray.intersectPlane(plane, intersection);

    setPositions((prevPositions) => {
      const newPositions = [intersection, ...prevPositions.slice(0, -1)];
      return newPositions;
    });

    if(meshRef.current){
      meshRef.current.rotation.x  += 0.001;
      meshRef.current.rotation.y  += 0.001;
    }
    
  });

  return (
    <>
      {positions.map((pos, idx) => (
        <mesh ref={meshRef} key={idx} position={pos}>
          <Sparkles color={'#FFECA1'} count={100} scale={3} size={8} />
          
        </mesh>
      ))}
    </>
  );
}

function App() {
  return (
    <Canvas style={{ height: '100vh', width: '100vw', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <OrbitControls enableDamping enableRotate enableZoom></OrbitControls>
      <MeshGeo />
      <MouseFollower />
      <PerspectiveCamera makeDefault position={[0, 5, 10]} />
      <ambientLight />
      <pointLight position={[10, 10, 10]} />
    </Canvas>
  );
}

export default App;
