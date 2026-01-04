"use client";

import { useRef, useState, useEffect, Suspense } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { 
  Image, 
  Text, 
  Environment, 
  useCursor
} from "@react-three/drei";
import * as THREE from "three";
import { Project } from "@/types/project";
import { easing } from "maath";
import { ChevronLeft, ChevronRight, Pause, Play } from "lucide-react";

interface GallerySceneProps {
  projects: Project[];
  onSelectProject: (project: Project) => void;
}

export default function GalleryScene({ projects, onSelectProject }: GallerySceneProps) {
  const [index, setIndex] = useState(0);
  const [autoPlay, setAutoPlay] = useState(true);

  // 자동 재생 (5초 간격)
  useEffect(() => {
    if (!autoPlay) return;
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % projects.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [autoPlay, projects.length]);

  const handleNext = () => {
    setIndex((prev) => (prev + 1) % projects.length);
    setAutoPlay(false);
  };

  const handlePrev = () => {
    setIndex((prev) => (prev - 1 + projects.length) % projects.length);
    setAutoPlay(false);
  };

  return (
    <div className="w-full h-[600px] md:h-[800px] bg-[#e0e0e0] relative group overflow-hidden">
      
      {/* shadows prop만 남기고 SoftShadows 컴포넌트는 제거 */}
      <Canvas dpr={[1, 1.5]} shadows camera={{ position: [0, 0, 6.5], fov: 40 }}>
        <Suspense fallback={null}>
          <Scene 
            projects={projects} 
            currentIndex={index} 
            onSelectProject={onSelectProject} 
          />
        </Suspense>
      </Canvas>

      {/* 네비게이션 버튼 */}
      <div className="absolute inset-0 pointer-events-none flex items-center justify-between px-4 md:px-12 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        <button onClick={handlePrev} className="pointer-events-auto p-4 rounded-full bg-black/5 hover:bg-black/10 text-gray-800 transition-all backdrop-blur-sm">
          <ChevronLeft className="w-8 h-8" />
        </button>
        <button onClick={handleNext} className="pointer-events-auto p-4 rounded-full bg-black/5 hover:bg-black/10 text-gray-800 transition-all backdrop-blur-sm">
          <ChevronRight className="w-8 h-8" />
        </button>
      </div>

      {/* 재생 컨트롤러 */}
      <div className="absolute bottom-6 right-6 flex items-center gap-3 z-10">
        <button 
          onClick={() => setAutoPlay(!autoPlay)}
          className="p-3 rounded-full bg-white/80 hover:bg-white shadow-lg text-gray-800 transition-all"
        >
          {autoPlay ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
        </button>
      </div>

    </div>
  );
}

function Scene({ projects, currentIndex, onSelectProject }: { projects: Project[], currentIndex: number, onSelectProject: (p: Project) => void }) {
  const gap = 8; // 작품 간격

  useFrame((state, delta) => {
    const targetX = currentIndex * gap;
    // 카메라 이동
    easing.damp3(state.camera.position, [targetX, 0, 6.5], 0.4, delta);
    easing.damp3(state.camera.lookAt, [targetX, 0, 0], 0.4, delta);
  });

  return (
    <>
      <color attach="background" args={['#e0e0e0']} />
      
      <ambientLight intensity={0.6} />
      
      {/* SpotLight 설정 최적화: mapSize를 키워서 그림자 품질 향상 */}
      <spotLight 
        position={[currentIndex * gap, 5, 5]} 
        angle={0.5} 
        penumbra={0.5} 
        intensity={1.5} 
        castShadow 
        shadow-bias={-0.0001}
        shadow-mapSize={[2048, 2048]} // 고해상도 그림자
      />

      {/* 1. 벽 (Wall) */}
      <mesh position={[currentIndex * gap, 0, -0.5]} receiveShadow>
        <planeGeometry args={[100, 20]} />
        <meshStandardMaterial color="#e8e8e8" roughness={0.5} />
      </mesh>

      {/* 2. 바닥 (Floor) */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[currentIndex * gap, -2.5, 2]}>
        <planeGeometry args={[100, 10]} />
        <meshStandardMaterial color="#8d6e63" roughness={0.8} /> 
      </mesh>

      {/* 3. 걸레받이 (Molding) */}
      <mesh position={[currentIndex * gap, -2.4, -0.4]}>
        <boxGeometry args={[100, 0.2, 0.1]} />
        <meshStandardMaterial color="#ffffff" />
      </mesh>

      <group>
        {projects.map((project, i) => (
          <Frame 
            key={project.id}
            project={project}
            position={[i * gap, 0.2, 0]}
            onSelect={onSelectProject}
          />
        ))}
      </group>
      
      <Environment preset="city" blur={1} />
    </>
  );
}

function Frame({ project, position, onSelect }: { project: Project, position: [number, number, number], onSelect: (p: Project) => void }) {
  const ref = useRef<THREE.Group>(null);
  const [hovered, setHover] = useState(false);
  useCursor(hovered);

  useFrame((state, delta) => {
    if(!ref.current) return;
    const targetScale = hovered ? 1.02 : 1;
    easing.damp3(ref.current.scale, [targetScale, targetScale, targetScale], 0.3, delta);
  });

  return (
    <group 
      ref={ref}
      position={position}
      onClick={(e) => { e.stopPropagation(); onSelect(project); }}
      onPointerOver={() => setHover(true)}
      onPointerOut={() => setHover(false)}
    >
      {/* 액자 프레임 */}
      <mesh position={[0, 0, 0]} castShadow>
        <boxGeometry args={[3.2, 2.4, 0.1]} />
        <meshStandardMaterial color="#1a1a1a" roughness={0.5} />
      </mesh>

      {/* 매트 */}
      <mesh position={[0, 0, 0.06]}>
        <planeGeometry args={[3, 2.2]} />
        <meshStandardMaterial color="#fdfdfd" roughness={0.9} />
      </mesh>

      {/* 그림자용 뒷판 */}
      <mesh position={[0, 0, -0.05]}>
         <planeGeometry args={[3.3, 2.5]} />
         <meshBasicMaterial color="#000" transparent opacity={0.2} />
      </mesh>

      {/* 작품 이미지 */}
      <Image 
        url={project.thumbnailUrl || '/file.svg'}
        scale={[2.6, 1.8, 1]}
        position={[0, 0, 0.07]}
      />

      {/* 캡션 */}
      <group position={[2.2, -0.5, 0]}>
        <mesh castShadow receiveShadow>
          <boxGeometry args={[0.8, 0.5, 0.02]} />
          <meshStandardMaterial color="#ffffff" roughness={0.8} />
        </mesh>
        
        <Text
          position={[0, 0.1, 0.02]}
          fontSize={0.06}
          color="#333"
          anchorX="center"
          anchorY="middle"
          maxWidth={0.7}
          font="https://fonts.gstatic.com/s/inter/v12/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuLyfAZ9hjp-Ek-_EeA.woff"
        >
          {project.title}
        </Text>
        <Text
          position={[0, -0.05, 0.02]}
          fontSize={0.035}
          color="#666"
          anchorX="center"
          anchorY="middle"
          maxWidth={0.7}
          font="https://fonts.gstatic.com/s/inter/v12/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuLyfAZ9hjp-Ek-_EeA.woff"
        >
          {project.overview.period}
          {'\n'}
          {project.tags.slice(0, 3).join(" / ")}
        </Text>
      </group>
    </group>
  );
}