"use client";

import { useState, useEffect, Suspense, useRef } from "react";
import { Canvas, useFrame, useLoader, useThree } from "@react-three/fiber";
import { Image, Text, Environment, RoundedBox, Box } from "@react-three/drei";
import { useDrag } from "@use-gesture/react";
import { Project } from "@/features/projects/types/project";
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
  // 5 이하를 모바일/태블릿 세로 모드로 간주함
  const isMobile = viewport.width < 5; 
  // 모바일 뷰에서는 옆 작품이 살짝 보이도록 뷰포트 너비 기준으로 간격 조정
  const gap = isMobile ? Math.max(viewport.width * 1.2, 4) : GAP;

  const lightGroupRef = useRef<THREE.Group>(null);

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
        <spotLight
          position={[0, 4, 3]}
          angle={0.6}
          penumbra={0.5}
          intensity={2.5}
          castShadow
          color="#fffaeb"
        />
        <spotLight
          position={[1.5, 3, 2]}
          angle={0.5}
          penumbra={0.7}
          intensity={1.0}
          castShadow
          color="#f0f5ff"
        />
      </group>
      <mesh position={[currentIndex * gap, 0, -0.5]} receiveShadow>
        <planeGeometry args={[100, 20]} />
        <meshStandardMaterial color="#afb1b3" roughness={0.9} />
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
  const { viewport } = useThree();
  const texture = useLoader(TextureLoader, project.thumbnailUrl || "");
  const aspect = texture.image.width / texture.image.height;
  
  // 모바일 환경을 고려하여 뷰포트(화면) 크기에 비례하게 최대 크기 설정
  const MAX_WIDTH = isMobile ? viewport.width * 0.8 : 3.8;
  // 세로 콘텐츠가 너무 길어지는 것을 방지
  const BASE_HEIGHT = isMobile ? viewport.height * 0.42 : 2.8;

  let contentWidth = BASE_HEIGHT * aspect;
  let contentHeight = BASE_HEIGHT;

  if (contentWidth > MAX_WIDTH) {
    contentWidth = MAX_WIDTH;
    contentHeight = MAX_WIDTH / aspect;
  }
  
  // --- 고급 미술관 액자 프레임(3중 레이어) 구성 ---
  // 1. 매트보드 (Mat Board) : 작품을 여유롭게 감싸는 따뜻한 보드 여백구간
  const matSize = isMobile ? 0.08 : 0.18; 
  // 2. 외부 베젤 프레임 (Outer Frame) : 가장 밖에서 감싸주는 얇고 단단한 테두리
  const frameSize = isMobile ? 0.02 : 0.035; 

  const matW = contentWidth + matSize * 2;
  const matH = contentHeight + matSize * 2;

  const outerW = matW + frameSize * 2;
  const outerH = matH + frameSize * 2;

  const frameThickness = 0.08;
  // ------------------------------------------------

  // 모바일에서는 글씨를 조금 더 크게 설정하여 가독성 확보
  const sizes = {
    title: isMobile ? 0.10 : 0.08,
    period: isMobile ? 0.045 : 0.04,
    tags: isMobile ? 0.038 : 0.035,
    desc: isMobile ? 0.045 : 0.04,
  };

  // 모바일 캡션 높이를 글자 간격(line-height 및 sizes)에 대응하게 확장
  const captionWidth = isMobile ? outerW : 1.4;
  const captionHeight = isMobile ? 1.05 : 0.9; 
  const captionX = isMobile ? 0 : (outerW / 2) + (captionWidth / 2) + 0.3;
  const captionY = isMobile ? -(outerH / 2) - (captionHeight / 2) - 0.2 : -0.2;

  // 모바일 배치를 위한 Y 위치 상단 마진 (아래로 치우치는 것을 방지)
  const groupYOffset = isMobile ? 0.35 : 0;
  
  // 글자 Y 좌표 (위쪽 기준) - 세로 여백 최적화
  const posTitleY = 0;
  const posPeriodY = isMobile ? -0.17 : -0.14;
  const posTagsY = isMobile ? -0.25 : -0.21;
  const posDividerY = isMobile ? -0.37 : -0.32;
  const posDescY = isMobile ? -0.45 : -0.39;

  const fontRegular = "/fonts/NotoSansKR-400.woff";
  const fontBold = "/fonts/NotoSansKR-700.woff";

  return (
    <group position={[position[0], position[1] + groupYOffset, position[2]]}>
      
      {/* 레이어 1 : 베젤 역할을 하는 가장 바깥 프레임 (오닉스 블랙 메탈 질감) */}
      <RoundedBox args={[outerW, outerH, frameThickness]} radius={0.015} smoothness={4} position={[0, 0, 0]} castShadow receiveShadow>
        <meshStandardMaterial color="#171717" roughness={0.6} metalness={0.4} />
      </RoundedBox>

      {/* 레이어 2 : 매트 보드 (Mat Board) 
          Z-Fighting (깜빡임 현상) 방지를 위해 앞면(Z) 단차를 0.01씩 넉넉히 확보합니다. */}
      <Box args={[matW, matH, 0.01]} position={[0, 0, frameThickness / 2 + 0.01]} receiveShadow>
        <meshStandardMaterial color="#fcfcfc" roughness={0.9} metalness={0.05} />
      </Box>

      {/* 레이어 3 : 사진 인화지 판 
          이전 레이어보다 0.01 더 띄워 겹침을 원천적으로 차단 */}
      <Box args={[contentWidth, contentHeight, 0.006]} position={[0, 0, frameThickness / 2 + 0.02]}>
        <meshStandardMaterial color="#e0e0e0" />
      </Box>

      {/* 레이어 4 : 실제 이미지 작품 
          역시 0.01 더 띄워 깔끔한 렌더링 유지 */}
      {/* eslint-disable-next-line jsx-a11y/alt-text */}
      <Image
        url={project.thumbnailUrl || ""}
        scale={[contentWidth, contentHeight]}
        position={[0, 0, frameThickness / 2 + 0.03]} // 사진 보드 바로 위
        onClick={(e) => {
          e.stopPropagation();
          onSelect(project);
        }}
        onPointerOver={(e) => {
          e.stopPropagation();
          document.body.style.cursor = 'pointer';
        }}
        onPointerOut={(e) => {
          e.stopPropagation();
          document.body.style.cursor = 'auto';
        }}
        toneMapped={false}
      />
      
      {/* 캡션(Description Panel) 영역 클릭 처리 추가 */}
      <group 
        position={[captionX, captionY, 0.015]}
        onClick={(e) => {
          e.stopPropagation();
          onSelect(project); 
        }}
        onPointerOver={(e) => {
          e.stopPropagation();
          document.body.style.cursor = 'pointer';
        }}
        onPointerOut={(e) => {
          e.stopPropagation();
          document.body.style.cursor = 'auto';
        }}
      > 
        <mesh castShadow receiveShadow>
          <boxGeometry args={[captionWidth, captionHeight, 0.02]} /> 
          <meshStandardMaterial 
            color="#ffffff" 
            roughness={0.7} 
            metalness={0.05} 
          /> 
        </mesh>

        {/* 캡션 내 텍스트 정렬 영역 */}
        <group position={[-captionWidth / 2 + (isMobile ? 0.2 : 0.15), captionHeight / 2 - (isMobile ? 0.2 : 0.15), 0.012]}>
          <Text 
            position={[0, posTitleY, 0]} 
            fontSize={sizes.title} 
            color="#111111" 
            anchorX="left" 
            anchorY="top" 
            maxWidth={captionWidth - (isMobile ? 0.4 : 0.3)} 
            font={fontBold}
            letterSpacing={-0.02}
          >
            {project.title}
          </Text>
          
          <Text 
            position={[0, posPeriodY, 0]} 
            fontSize={sizes.period} 
            color="#555555" 
            anchorX="left" 
            anchorY="top" 
            font={fontRegular}
          >
            {project.overview.period}
          </Text>

          <Text 
            position={[0, posTagsY, 0]} 
            fontSize={sizes.tags} 
            color="#777777" 
            anchorX="left" 
            anchorY="top" 
            maxWidth={captionWidth - (isMobile ? 0.4 : 0.3)} 
            font={fontRegular}
          >
            {project.tags.join(" • ")}
          </Text>

          {/* 구분선 */}
          <mesh position={[(captionWidth - (isMobile ? 0.4 : 0.3)) / 2, posDividerY, 0]}>
            <planeGeometry args={[captionWidth - (isMobile ? 0.4 : 0.3), 0.002]} />
            <meshBasicMaterial color="#dcdcdc" />
          </mesh>

          <Text 
            position={[0, posDescY, 0]} 
            fontSize={sizes.desc} 
            color="#333333" 
            anchorX="left" 
            anchorY="top" 
            maxWidth={captionWidth - (isMobile ? 0.4 : 0.3)} 
            lineHeight={1.5} 
            font={fontRegular}
          >
            {project.description}
          </Text>
        </group>
      </group>
    </group>
  );
}