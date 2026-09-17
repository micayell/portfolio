"use client";

import { useState, useEffect, Suspense, useRef } from "react";
import { Canvas, useFrame, useLoader, useThree } from "@react-three/fiber";
import { Image, Text, Environment, RoundedBox } from "@react-three/drei";
import { useDrag } from "@use-gesture/react";
import { Project } from "@/types/project";
import { easing } from "maath";
import { ChevronLeft, ChevronRight, Pause, Play } from "lucide-react";
import * as THREE from "three";
import { TextureLoader } from "three";

interface GallerySceneProps {
  projects: Project[];
  onSelectProject: (project: Project) => void;
}

const GAP = 10; // 데스크톱 기준 간격

export default function GalleryScene({ projects, onSelectProject }: GallerySceneProps) {
  const [index, setIndex] = useState(0);
  const [autoPlay, setAutoPlay] = useState(true);

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
    <div className="w-full h-[500px] md:h-[800px] bg-[#e0e0e0] relative group overflow-hidden touch-none">
      <Canvas dpr={[1, 1.5]} shadows camera={{ position: [0, 0, 6.5], fov: 40 }}>
        <Suspense fallback={null}>
          <Scene
            projects={projects}
            currentIndex={index}
            onSelectProject={onSelectProject}
            setIndex={setIndex}
            setAutoPlay={setAutoPlay}
            handlePrev={handlePrev}
            handleNext={handleNext}
          />
        </Suspense>
      </Canvas>

      <div className="absolute inset-0 pointer-events-none flex items-center justify-between px-4 md:px-12 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        <button onClick={handlePrev} className="pointer-events-auto p-2 md:p-4 rounded-full bg-black/5 hover:bg-black/10 text-gray-800 transition-all backdrop-blur-sm">
          <ChevronLeft className="w-6 h-6 md:w-8 md:h-8" />
        </button>
        <button onClick={handleNext} className="pointer-events-auto p-2 md:p-4 rounded-full bg-black/5 hover:bg-black/10 text-gray-800 transition-all backdrop-blur-sm">
          <ChevronRight className="w-6 h-6 md:w-8 md:h-8" />
        </button>
      </div>

      <div className="absolute bottom-4 right-4 md:bottom-6 md:right-6 flex items-center gap-3 z-10">
        <button
          onClick={() => setAutoPlay(!autoPlay)}
          className="p-2 md:p-3 rounded-full bg-white/80 hover:bg-white shadow-lg text-gray-800 transition-all"
        >
          {autoPlay ? <Pause className="w-4 h-4 md:w-5 md:h-5" /> : <Play className="w-4 h-4 md:w-5 md:h-5" />}
        </button>
      </div>
    </div>
  );
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function Scene({ projects, currentIndex, setAutoPlay, onSelectProject, handlePrev, handleNext }: any) {
  const { viewport } = useThree();
  const lightGroupRef = useRef<THREE.Group>(null);
  const isMobile = viewport.width < 4; // 모바일 뷰포트 기준
  const gap = isMobile ? GAP * 0.6 : GAP;

  const bind = useDrag(({ down, movement: [mx], direction: [dx], cancel }) => {
    if (down) {
      setAutoPlay(false);
    }
    if (Math.abs(mx) > viewport.width / 4) {
      cancel();
      if (dx > 0) {
        handlePrev();
      } else {
        handleNext();
      }
    }
  });

  useFrame((state, delta) => {
    const targetX = currentIndex * gap;
    easing.damp3(state.camera.position, [targetX, 0, 6.5], 0.4, delta);
    if (lightGroupRef.current) {
      easing.damp(lightGroupRef.current.position, 'x', targetX, 0.4, delta);
    }
    state.camera.lookAt(targetX, 0, 0);
  });

  return (
    <group {...bind()}>
      <ambientLight intensity={0.4} />
      <group ref={lightGroupRef}>
        </group>
      <mesh position={[currentIndex * gap, 0, -0.5]} receiveShadow>
        <planeGeometry args={[100, 20]} />
        <meshStandardMaterial color="#e8e8e8" roughness={0.5} />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[currentIndex * gap, -2.5, 2]} receiveShadow>
        <planeGeometry args={[100, 10]} />
        <meshStandardMaterial color="#3a2518" roughness={0.6} metalness={0.1} />
      </mesh>
      <mesh position={[currentIndex * gap, -2.4, -0.4]}>
        <boxGeometry args={[100, 0.2, 0.1]} />
        <meshStandardMaterial color="#ffffff" />
      </mesh>
      <group>
        {projects.map((project: Project, i: number) => (
          <Frame
            key={project.id}
            project={project}
            position={[i * gap, 0.2, 0]}
            onSelect={onSelectProject}
            isMobile={isMobile}
          />
        ))}
      </group>
      <Environment preset="city" blur={1} />
    </group>
  );
}

function Frame({ project, position, onSelect, isMobile }: { project: Project, position: [number, number, number], onSelect: (p: Project) => void, isMobile: boolean }) {
  const texture = useLoader(TextureLoader, project.thumbnailUrl || "");
  const aspect = texture.image.width / texture.image.height;
  
  const MAX_WIDTH = isMobile ? 3.0 : 4.3;
  const BASE_HEIGHT = isMobile ? 2.0 : 3.0;

  let contentWidth = BASE_HEIGHT * aspect;
  let contentHeight = BASE_HEIGHT;

  if (contentWidth > MAX_WIDTH) {
    contentWidth = MAX_WIDTH;
    contentHeight = MAX_WIDTH / aspect;
  }
  
  const borderSize = 0.1;
  const frameHeight = contentHeight + (borderSize * 2);
  const frameWidth = contentWidth + (borderSize * 2);
  const frameThickness = 0.1;

  const captionX = isMobile ? 0 : (frameWidth / 2) + 1;
  const captionY = isMobile ? -(frameHeight / 2) - 0.8 : -0.5;

  const fontRegular = "/fonts/NotoSansKR-400.woff";
  const fontBold = "/fonts/NotoSansKR-700.woff";

  return (
    <group position={position}>
      <RoundedBox args={[frameWidth, frameHeight, frameThickness]} radius={0.05} smoothness={4} position={[0, 0, 0]} castShadow receiveShadow>
        <meshStandardMaterial color="#2a3439" roughness={0.2} metalness={0.8} />
      </RoundedBox>
      {/* eslint-disable-next-line jsx-a11y/alt-text */}
      <Image
        url={project.thumbnailUrl || ""}
        scale={[contentWidth, contentHeight]}
        position={[0, 0, frameThickness / 2 + 0.01]}
        onClick={() => onSelect(project)}
        onPointerOver={() => { document.body.style.cursor = 'pointer' }}
        onPointerOut={() => { document.body.style.cursor = 'auto' }}
        toneMapped={false}
      />
      <group position={[captionX, captionY, 0]}> 
        <mesh castShadow receiveShadow>
          <boxGeometry args={[isMobile ? frameWidth : 1.6, 1.2, 0.02]} /> 
          <meshStandardMaterial color="#ffffff" roughness={0.9} metalness={0.0} transparent={true} opacity={0.95} emissive="#ffffff" emissiveIntensity={0.1} /> 
        </mesh>
        <Text position={[-0.7, 0.35, 0.03]} fontSize={isMobile ? 0.12 : 0.15} color="#000000" anchorX="left" anchorY="middle" maxWidth={isMobile ? frameWidth - 0.2 : 1.4} font={fontBold}>
          {project.title}
        </Text>
        <Text position={[-0.7, 0.12, 0.03]} fontSize={isMobile ? 0.05 : 0.06} color="#333333" anchorX="left" anchorY="middle" maxWidth={isMobile ? frameWidth - 0.2 : 1.4} font={fontRegular}>
          {project.overview.period}
        </Text>
        <Text position={[-0.7, -0.15, 0.03]} fontSize={isMobile ? 0.045 : 0.055} color="#222222" anchorX="left" anchorY="top" maxWidth={isMobile ? frameWidth - 0.2 : 1.4} lineHeight={1.6} font={fontRegular}>
          {project.description}
        </Text>
        <Text position={[-0.7, -0.45, 0.03]} fontSize={isMobile ? 0.04 : 0.045} color="#555555" anchorX="left" anchorY="middle" maxWidth={isMobile ? frameWidth - 0.2 : 1.4} font={fontRegular}>
          {project.tags.slice(0, 3).join("  •  ")}
        </Text>
      </group>
    </group>
  );
}