"use client";

import { useState, useEffect, Suspense } from "react";
import { Canvas, useFrame, useLoader } from "@react-three/fiber";
import {
  Image,
  Text,
  Environment,
  RoundedBox,
} from "@react-three/drei";
import { EffectComposer, Bloom, Vignette } from "@react-three/postprocessing";
import { Project } from "@/types/project";
import { easing } from "maath";
import { ChevronLeft, ChevronRight, Pause, Play } from "lucide-react";
import { TextureLoader } from "three";

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
  const gap = 10; 

  useFrame((state, delta) => {
    const targetX = currentIndex * gap;
    // 1. 카메라 위치 부드럽게 이동
    easing.damp3(state.camera.position, [targetX, 0, 6.5], 0.4, delta);

    // 2. 카메라가 항상 현재 작품(targetX)을 바라보도록 설정
    state.camera.lookAt(targetX, 0, 0);
  });

  return (
    <>
      <ambientLight intensity={0.4} />

      {/* 1. 벽 (Wall) */}
      <mesh position={[currentIndex * gap, 0, -0.5]} receiveShadow>
        <planeGeometry args={[100, 20]} />
        <meshStandardMaterial color="#e8e8e8" roughness={0.5} />
      </mesh>

      {/* 2. 바닥 (Floor) - 은은한 광택이 도는 월넛 우드 */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[currentIndex * gap, -2.5, 2]} receiveShadow>
        <planeGeometry args={[100, 10]} />
        <meshStandardMaterial 
          color="#3a2518" 
          roughness={0.6} // 0.9 -> 0.6 (살짝 코팅된 느낌)
          metalness={0.1} // 약간의 광택
        />
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
  // 텍스처 로드해서 원본 비율 계산
  const texture = useLoader(TextureLoader, project.thumbnailUrl || "");
  const aspect = texture.image.width / texture.image.height;
  
  // [수정] 스마트 사이징: 최대 너비를 제한하여 캡션 공간 확보
  const MAX_WIDTH = 4.3; // 액자가 차지할 수 있는 최대 너비
  const BASE_HEIGHT = 3.0; // 기본 높이

  let contentWidth = BASE_HEIGHT * aspect;
  let contentHeight = BASE_HEIGHT;

  // 너비가 너무 길면(와이드 이미지), 너비를 고정하고 높이를 줄임
  if (contentWidth > MAX_WIDTH) {
    contentWidth = MAX_WIDTH;
    contentHeight = MAX_WIDTH / aspect;
  }
  
  const borderSize = 0.1; // 프레임 테두리 두께
  const frameHeight = contentHeight + (borderSize * 2);
  const frameWidth = contentWidth + (borderSize * 2);
  const frameThickness = 0.1;

  // 캡션 위치 자동 계산: 액자 너비의 절반 + 여백(1.2) - 간격 더 넓게 수정
  const captionX = (frameWidth / 2) + 1;

  /** Troika(drei Text)는 woff2 미지원 — public 동일 출처 woff(v1)만 사용 */
  const fontRegular = "/fonts/NotoSansKR-400.woff";
  const fontBold = "/fonts/NotoSansKR-700.woff";

  return (
    <group position={position}>
      {/* 개별 조명: 작품을 비추는 SpotLight */}
      <spotLight
        position={[0, 4, 3]}
        angle={0.6}
        penumbra={0.5}
        intensity={2.5}
        castShadow
        shadow-bias={-0.0001}
      />

      {/* 1. 액자 프레임 (동적 크기 적용) */}
      <RoundedBox 
        args={[frameWidth, frameHeight, frameThickness]} 
        radius={0.05} 
        smoothness={4}
        position={[0, 0, 0]} 
        castShadow 
        receiveShadow
      >
        <meshStandardMaterial color="#2a3439" roughness={0.2} metalness={0.8} />
      </RoundedBox>

      {/* 2. 이미지 (동적 크기 적용) */}
      <Image
        url={project.thumbnailUrl || ""}
        scale={[contentWidth, contentHeight]} // 계산된 너비/높이 적용 (scale 비율 = 이미지 비율)
        position={[0, 0, frameThickness / 2 + 0.01]}
        onClick={() => onSelect(project)}
        onPointerOver={() => { document.body.style.cursor = 'pointer' }}
        onPointerOut={() => { document.body.style.cursor = 'auto' }}
        toneMapped={false}
      />

      {/* 3. 캡션 (동적 위치) */}
      <group position={[captionX, -0.5, 0]}> 
        {/* 그림자 메쉬 */}
        <mesh position={[0.05, -0.05, -0.02]} receiveShadow>
          <boxGeometry args={[1.6, 1.2, 0.01]} />
          <meshBasicMaterial color="#000" opacity={0.1} transparent />
        </mesh>

        {/* 캡션 본체 */}
        <mesh castShadow receiveShadow>
          <boxGeometry args={[1.6, 1.2, 0.02]} /> 
          <meshStandardMaterial 
            color="#ffffff" 
            roughness={0.9} 
            metalness={0.0}
            transparent={true}
            opacity={0.95}
            emissive="#ffffff"
            emissiveIntensity={0.1} 
          /> 
        </mesh>
        
        {/* 텍스트 */}
        <Text
          position={[-0.7, 0.35, 0.03]}
          fontSize={0.15}
          color="#000000"
          anchorX="left"
          anchorY="middle"
          maxWidth={1.4}
          font={fontBold}
        >
          {project.title}
        </Text>
        
        <Text
          position={[-0.7, 0.12, 0.03]} 
          fontSize={0.06}
          color="#333333"
          anchorX="left"
          anchorY="middle"
          maxWidth={1.4}
          font={fontRegular}
        >
          {project.overview.period}
        </Text>

        <Text
          position={[-0.7, -0.15, 0.03]} 
          fontSize={0.055}
          color="#222222"
          anchorX="left"
          anchorY="top"
          maxWidth={1.4}
          lineHeight={1.6}
          font={fontRegular}
        >
          {project.description}
        </Text>

        <Text
          position={[-0.7, -0.45, 0.03]} 
          fontSize={0.045}
          color="#555555"
          anchorX="left"
          anchorY="middle"
          maxWidth={1.4}
          font={fontRegular}
        >
          {project.tags.slice(0, 3).join("  •  ")}
        </Text>
      </group>
    </group>
  );
}
