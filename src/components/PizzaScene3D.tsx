import { useRef, Suspense } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { 
  PerspectiveCamera, 
  ContactShadows, 
  Float, 
  MeshWobbleMaterial,
  Environment,
  Sparkles
} from '@react-three/drei';
import * as THREE from 'three';
import type { Topping } from '../types';

interface PizzaScene3DProps {
  selectedToppings?: Topping[];
  size?: 'S' | 'M' | 'L';
  crust?: 'THIN' | 'CLASSIC' | 'THICK';
}

function ToppingMesh({ name, index, count = 12 }: { name: string; index: number; count?: number }) {
  // Generate stable positions based on index and topping name hash to avoid overlaps
  const nameHash = name.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  const angle = (index / count) * Math.PI * 2 + (index * 0.23) + (nameHash * 0.05);
  const dist = 0.5 + ((index + nameHash) % 3) * 0.55 + Math.sin(index + nameHash) * 0.12;
  const x = Math.cos(angle) * dist;
  const z = Math.sin(angle) * dist;
  const y = 0.02 + (index % 2) * 0.015 + (nameHash % 5) * 0.005; // Slightly layer to prevent z-fighting
  const rotationY = index * 42.5 + nameHash;

  if (name === 'Pepperoni') {
    return (
      <mesh castShadow position={[x, y, z]} rotation={[0, rotationY, 0]}>
        <cylinderGeometry args={[0.3, 0.3, 0.03, 32]} />
        <meshStandardMaterial color="#b91c1c" roughness={0.35} metalness={0.1} />
      </mesh>
    );
  }
  if (name === 'Pieczarki') {
    return (
      <group position={[x, y, z]} rotation={[0, rotationY, 0]} scale={0.7}>
        {/* Hat of mushroom */}
        <mesh castShadow>
          <sphereGeometry args={[0.2, 10, 10, 0, Math.PI * 2, 0, Math.PI / 2]} />
          <meshStandardMaterial color="#e5e5e0" roughness={0.65} />
        </mesh>
        {/* Stem of mushroom */}
        <mesh position={[0, -0.06, 0]}>
          <cylinderGeometry args={[0.06, 0.06, 0.12, 8]} />
          <meshStandardMaterial color="#dcdcd8" roughness={0.65} />
        </mesh>
      </group>
    );
  }
  if (name === 'Cebula') {
    return (
      <mesh castShadow position={[x, y, z]} rotation={[Math.PI / 2, 0, rotationY]}>
        <torusGeometry args={[0.26, 0.035, 8, 24, Math.PI * 1.4]} />
        <meshStandardMaterial color="#c084fc" roughness={0.5} />
      </mesh>
    );
  }
  if (name === 'Salami') {
    return (
      <mesh castShadow position={[x, y, z]} rotation={[0, rotationY, 0]}>
        <cylinderGeometry args={[0.26, 0.26, 0.02, 32]} />
        <meshStandardMaterial color="#881337" roughness={0.4} />
      </mesh>
    );
  }
  if (name === 'Boczek') {
    return (
      <mesh castShadow position={[x, y, z]} rotation={[0, rotationY, 0]}>
        <boxGeometry args={[0.36, 0.02, 0.14]} />
        <meshStandardMaterial color="#fda4af" roughness={0.65} />
      </mesh>
    );
  }
  if (name === 'Czarne Oliwki') {
    return (
      <mesh castShadow position={[x, y, z]} rotation={[Math.PI / 2, 0, rotationY]}>
        <torusGeometry args={[0.12, 0.04, 8, 16]} />
        <meshStandardMaterial color="#1e1b4b" roughness={0.6} />
      </mesh>
    );
  }
  if (name === 'Zielona Papryka') {
    return (
      <mesh castShadow position={[x, y, z]} rotation={[0.2, rotationY, 0]}>
        <torusGeometry args={[0.18, 0.045, 8, 16, Math.PI / 2.2]} />
        <meshStandardMaterial color="#15803d" roughness={0.45} />
      </mesh>
    );
  }
  if (name === 'Ananas') {
    return (
      <mesh castShadow position={[x, y, z]} rotation={[0.1, rotationY, 0.1]}>
        <boxGeometry args={[0.2, 0.06, 0.16]} />
        <meshStandardMaterial color="#facc15" roughness={0.2} />
      </mesh>
    );
  }
  if (name === 'Szpinak') {
    return (
      <mesh castShadow position={[x, y, z]} rotation={[0, rotationY, 0]} scale={[1.3, 0.15, 0.7]}>
        <sphereGeometry args={[0.16, 8, 8]} />
        <meshStandardMaterial color="#166534" roughness={0.8} />
      </mesh>
    );
  }

  // Generic fallback
  return (
    <mesh castShadow position={[x, y, z]}>
      <sphereGeometry args={[0.1, 8, 8]} />
      <meshStandardMaterial color="#ff4d00" />
    </mesh>
  );
}

function AnimatedToppingGroup({ children, yTarget }: { children: React.ReactNode; yTarget: number }) {
  const ref = useRef<THREE.Group>(null);
  useFrame(() => {
    if (!ref.current) return;
    ref.current.position.y = THREE.MathUtils.lerp(ref.current.position.y, yTarget, 0.15);
  });
  return (
    <group ref={ref} position={[0, yTarget + 3, 0]}>
      {children}
    </group>
  );
}

function MainPizza({ 
  selectedToppings = [], 
  size = 'M', 
  crust = 'CLASSIC' 
}: { 
  selectedToppings: Topping[];
  size?: 'S' | 'M' | 'L';
  crust?: 'THIN' | 'CLASSIC' | 'THICK';
}) {
  const groupRef = useRef<THREE.Group>(null);
  
  useFrame((state) => {
    if (!groupRef.current) return;
    const t = state.clock.getElapsedTime();
    const mouseX = state.mouse.x * 0.5;
    const mouseY = state.mouse.y * 0.3;
    
    // Continuous automatic rotation on Y axis + mouse interaction
    groupRef.current.rotation.y = (t * 0.15) + mouseX;
    // Tilt slightly forward (0.5 rad ≈ 28 deg) for optimal topping visibility + mouse vertical tracking
    groupRef.current.rotation.x = THREE.MathUtils.lerp(groupRef.current.rotation.x, 0.5 - mouseY, 0.1);
  });

  const hasExtraCheese = selectedToppings.some(t => t.name === 'Extra Ser');

  // Crust and size visual mapping
  const sizeScales = { S: 1.15, M: 1.4, L: 1.65 };
  const crustParams = {
    THIN: { thickness: 0.15, torusRadius: 0.11, torusPos: 0.1 },
    CLASSIC: { thickness: 0.25, torusRadius: 0.22, torusPos: 0.15 },
    THICK: { thickness: 0.35, torusRadius: 0.32, torusPos: 0.2 }
  };

  const currentCrust = crustParams[crust];

  return (
    <group ref={groupRef} scale={sizeScales[size]}>
      {/* Ciasto */}
      <mesh receiveShadow castShadow>
        <cylinderGeometry args={[2.5, 2.6, currentCrust.thickness, 64]} />
        <meshStandardMaterial color="#eec38c" roughness={0.7} />
      </mesh>
      
      {/* Brzeg */}
      <mesh position={[0, currentCrust.torusPos, 0]}>
        <torusGeometry args={[2.42, currentCrust.torusRadius, 24, 100]} />
        <meshStandardMaterial color="#d4a373" roughness={0.8} />
      </mesh>

      {/* Ser Mozzarella - Animowany */}
      <mesh position={[0, currentCrust.torusPos, 0]}>
        <cylinderGeometry args={[2.32, 2.32, hasExtraCheese ? 0.1 : 0.05, 64]} />
        <MeshWobbleMaterial factor={0.05} speed={1.2} color={hasExtraCheese ? "#fef08a" : "#fef9c3"} roughness={0.3} metalness={0.05} />
      </mesh>

      {/* Składniki 3D */}
      {selectedToppings.filter(t => t.name !== 'Extra Ser').map((topping) => (
        <AnimatedToppingGroup key={topping.id} yTarget={currentCrust.torusPos}>
          {[...Array(12)].map((_, i) => (
            <ToppingMesh key={i} name={topping.name} index={i} />
          ))}
        </AnimatedToppingGroup>
      ))}
    </group>
  );
}

export default function PizzaScene3D({ 
  selectedToppings = [], 
  size = 'M', 
  crust = 'CLASSIC' 
}: PizzaScene3DProps) {
  return (
    <div className="w-full h-full min-h-[400px] md:min-h-[600px] cursor-grab active:cursor-grabbing">
      <Canvas shadows dpr={[1, 1.5]} gl={{ antialias: true, alpha: true }}>
        <PerspectiveCamera makeDefault position={[0, 4.5, 9.5]} fov={35} />
        
        <ambientLight intensity={0.65} />
        <spotLight position={[10, 15, 10]} angle={0.25} penumbra={1} intensity={1.5} castShadow />
        <directionalLight position={[-10, 10, -5]} intensity={0.5} />
        
        <Suspense fallback={null}>
          <Float speed={2.5} rotationIntensity={0.3} floatIntensity={0.6}>
            <MainPizza selectedToppings={selectedToppings} size={size} crust={crust} />
          </Float>
          <Environment preset="city" />
          <Sparkles count={30} scale={8} size={1.2} speed={0.2} color="#fcd34d" />
          <ContactShadows position={[0, -2, 0]} opacity={0.25} scale={15} blur={3.5} far={5} />
        </Suspense>
      </Canvas>
    </div>
  );
}
