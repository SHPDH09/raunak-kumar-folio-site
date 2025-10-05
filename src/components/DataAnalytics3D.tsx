import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Sphere, MeshDistortMaterial, Float } from '@react-three/drei';
import { useRef, useMemo } from 'react';
import * as THREE from 'three';

function DataParticles() {
  const particlesRef = useRef<THREE.Points>(null);
  const particleCount = 1000;

  const positions = useMemo(() => {
    const pos = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount * 3; i += 3) {
      pos[i] = (Math.random() - 0.5) * 20;
      pos[i + 1] = (Math.random() - 0.5) * 20;
      pos[i + 2] = (Math.random() - 0.5) * 20;
    }
    return pos;
  }, []);

  useFrame((state) => {
    if (particlesRef.current) {
      particlesRef.current.rotation.y = state.clock.getElapsedTime() * 0.05;
      particlesRef.current.rotation.x = state.clock.getElapsedTime() * 0.02;
    }
  });

  return (
    <points ref={particlesRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={particleCount}
          array={positions}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.05}
        color="#3b82f6"
        transparent
        opacity={0.6}
        sizeAttenuation
      />
    </points>
  );
}

function AnimatedSphere({ position }: { position: [number, number, number] }) {
  return (
    <Float speed={2} rotationIntensity={1} floatIntensity={2}>
      <Sphere args={[0.5, 32, 32]} position={position}>
        <MeshDistortMaterial
          color="#3b82f6"
          attach="material"
          distort={0.3}
          speed={2}
          roughness={0.2}
          metalness={0.8}
        />
      </Sphere>
    </Float>
  );
}

function DataCube({ position }: { position: [number, number, number] }) {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.x = state.clock.getElapsedTime() * 0.3;
      meshRef.current.rotation.y = state.clock.getElapsedTime() * 0.5;
    }
  });

  return (
    <mesh ref={meshRef} position={position}>
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial
        color="#8b5cf6"
        wireframe
        transparent
        opacity={0.3}
      />
    </mesh>
  );
}

function Scene() {
  return (
    <>
      <ambientLight intensity={0.5} />
      <directionalLight position={[10, 10, 5]} intensity={1} />
      <pointLight position={[-10, -10, -5]} intensity={0.5} color="#3b82f6" />
      
      <DataParticles />
      
      <AnimatedSphere position={[-3, 2, -2]} />
      <AnimatedSphere position={[3, -2, -3]} />
      <AnimatedSphere position={[0, 0, -5]} />
      
      <DataCube position={[-4, -2, -4]} />
      <DataCube position={[4, 2, -4]} />
      
      <Float speed={1.5} rotationIntensity={0.5} floatIntensity={1}>
        <mesh position={[0, 0, -8]}>
          <torusGeometry args={[3, 0.3, 16, 100]} />
          <meshStandardMaterial
            color="#06b6d4"
            wireframe
            transparent
            opacity={0.2}
          />
        </mesh>
      </Float>
      
      <OrbitControls
        enableZoom={false}
        enablePan={false}
        autoRotate
        autoRotateSpeed={0.5}
        maxPolarAngle={Math.PI / 2}
        minPolarAngle={Math.PI / 2}
      />
    </>
  );
}

export default function DataAnalytics3D() {
  return (
    <div className="absolute inset-0 w-full h-full">
      <Canvas
        camera={{ position: [0, 0, 10], fov: 75 }}
        className="w-full h-full"
      >
        <Scene />
      </Canvas>
    </div>
  );
}
