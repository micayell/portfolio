"use client";

import { useState, useEffect, Suspense, useRef } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Text, Environment, Box } from "@react-three/drei";
import { useDrag } from "@use-gesture/react";
import { Project } from "@/features/projects/types/project";
import { easing } from "maath";
import { Pause, Play } from "lucide-react";
import * as THREE from "three";

// @ts-expect-error: troika-three-text 모듈의 타입 정의 파일 누락 해결
import { preloadFont } from "troika-three-text";

const fontRegular = "/fonts/NotoSansKR-400.woff";
const fontBold = "/fonts/NotoSansKR-700.woff";

if (typeof window !== "undefined") {
  preloadFont({ font: fontRegular }, () => {});
  preloadFont({ font: fontBold }, () => {});
}

interface GallerySceneProps {
  projects: Project[];
  onSelectProject: (project: Project) => void;
}

const GAP = 10; // 데스크톱 기준 간격

// 드래그 중 R3F 캔버스 내부의 hover 이벤트(커서 포인터)가 덮어씌워지는 것을 방지하기 위한 전역 상태
let isGlobalDragging = false;

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

  // 모바일/PC 통용 드래그 이벤트 (드래그 종료 시 1회만 변경되도록 수정)
  const bind = useDrag(({ active, movement: [mx], last }) => {
    isGlobalDragging = active; 

    if (active) {
      document.body.style.cursor = ''; 
      setAutoPlay(false);
    }

    if (last) {
      if (Math.abs(mx) > 50) {
        if (mx > 0) {
          handlePrev();
        } else {
          handleNext();
        }
      }
    }
  }, { 
    axis: 'x', 
    filterTaps: true
  });

  return (
    <div 
      {...bind()} 
      className="w-full h-[500px] md:h-[800px] bg-[#e0e0e0] relative group overflow-hidden cursor-grab active:cursor-grabbing"
      style={{ touchAction: 'pan-y' }}
    >
      <Canvas 
        dpr={[1, 1.5]} 
        shadows 
        camera={{ position: [0, 0, 6.5], fov: 40 }}
      >
        <Suspense fallback={null}>
          <Scene
            projects={projects}
            currentIndex={index}
            onSelectProject={onSelectProject}
          />
        </Suspense>
      </Canvas>

      <div className="absolute bottom-4 right-4 md:bottom-6 md:right-6 flex items-center gap-3 z-10">
        <button
          onClick={(e) => { e.stopPropagation(); setAutoPlay(!autoPlay); }}
          className="p-2 md:p-3 rounded-full bg-white/80 hover:bg-white shadow-lg text-gray-800 transition-all pointer-events-auto"
        >
          {autoPlay ? <Pause className="w-4 h-4 md:w-5 md:h-5" /> : <Play className="w-4 h-4 md:w-5 md:h-5" />}
        </button>
      </div>
    </div>
  );
}

interface SceneProps {
  projects: Project[];
  currentIndex: number;
  onSelectProject: (p: Project) => void;
}

function Scene({ projects, currentIndex, onSelectProject }: SceneProps) {
  const { size } = useThree();
  
  // 카메라의 회전(오작동 원인)과 무관하게 고정된 기준 3D 뷰포트 크기를 계산하여 절대적으로 안정된 모바일 분기를 생성
  const distance = 6.5;
  const vFov = (40 * Math.PI) / 180;
  const stableVHeight = 2 * Math.tan(vFov / 2) * distance;
  const stableVWidth = stableVHeight * (size.width / size.height);

  const isMobile = stableVWidth < 5; 
  const gap = isMobile ? Math.max(stableVWidth * 1.2, 4) : GAP;
  
  const lightGroupRef = useRef<THREE.Group>(null);

  useFrame((state, delta) => {
    const targetX = currentIndex * gap;
    easing.damp3(state.camera.position, [targetX, 0, 6.5], 0.4, delta);
    if (lightGroupRef.current) {
      easing.damp(lightGroupRef.current.position, 'x', targetX, 0.4, delta);
    }
    state.camera.lookAt(targetX, 0, 0);
  });

  return (
    <group>
      <ambientLight intensity={0.4} />
      <group ref={lightGroupRef}>
        <spotLight position={[0, 4, 3]} angle={0.6} penumbra={0.5} intensity={2.5} castShadow color="#fffaeb" />
        <spotLight position={[1.5, 3, 2]} angle={0.5} penumbra={0.7} intensity={1.0} castShadow color="#f0f5ff" />
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
          <FrameErrorBoundary key={project.id}>
            <Frame
              project={project}
              position={[i * gap, 0.2, 0]}
              onSelect={onSelectProject}
              isMobile={isMobile}
            />
          </FrameErrorBoundary>
        ))}
      </group>
      <Environment preset="city" blur={1} />
    </group>
  );
}

// Custom hook to safely load textures even if the URL (like an S3 presigned URL) has expired
function useSafeTexture(url: string) {
  const [texture, setTexture] = useState<THREE.Texture | null>(null);

  useEffect(() => {
    if (!url) return;
    const loader = new THREE.TextureLoader();
    
    const proxyUrl = '/api/notion-image-proxy?url=' + encodeURIComponent(url);
    loader.load(
      proxyUrl,
      (loadedTex) => setTexture(loadedTex),
      undefined,
      (error) => {
        console.error(`S3 Image URL Expired or load failed for: ${url}`, error);
        const canvas = document.createElement("canvas");
        canvas.width = 1;
        canvas.height = 1;
        const ctx = canvas.getContext("2d");
        if (ctx) {
          ctx.fillStyle = "#cccccc";
          ctx.fillRect(0, 0, 1, 1);
        }
        const fallbackTex = new THREE.CanvasTexture(canvas);
        setTexture(fallbackTex);
      }
    );
  }, [url]);

  return texture;
}

import React from "react";
class FrameErrorBoundary extends React.Component<{ children: React.ReactNode }, { hasError: boolean }> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }
  static getDerivedStateFromError() {
    return { hasError: true };
  }
  render() {
    if (this.state.hasError) {
      return null;
    }
    return this.props.children;
  }
}

function Frame({ project, position, onSelect, isMobile }: { project: Project, position: [number, number, number], onSelect: (p: Project) => void, isMobile: boolean }) {
  const { size } = useThree();
  const safeTexture = useSafeTexture(project.thumbnailUrl || "");
  
  // 카메라 회전 중 크기가 폭주하지 않도록 안정된 뷰포트 크기를 계산
  const distance = 6.5;
  const vFov = (40 * Math.PI) / 180;
  const stableVHeight = 2 * Math.tan(vFov / 2) * distance;
  const stableVWidth = stableVHeight * (size.width / size.height);

  const MAX_WIDTH = isMobile ? stableVWidth * 0.8 : 3.8;
  const BASE_HEIGHT = isMobile ? stableVHeight * 0.42 : 2.8;

  const imageObj = safeTexture?.image as HTMLImageElement | undefined;
  const aspect = imageObj && imageObj.width && imageObj.height ? imageObj.width / imageObj.height : 1.5;

  let contentWidth = BASE_HEIGHT * aspect;
  let contentHeight = BASE_HEIGHT;

  if (contentWidth > MAX_WIDTH) {
    contentWidth = MAX_WIDTH;
    contentHeight = MAX_WIDTH / aspect;
  }
  
  const matSize = isMobile ? 0.08 : 0.18; 
  const frameSize = isMobile ? 0.02 : 0.035; 

  const matW = contentWidth + matSize * 2;
  const matH = contentHeight + matSize * 2;
  const outerW = matW + frameSize * 2;
  const outerH = matH + frameSize * 2;

  const maxMatW = MAX_WIDTH + matSize * 2;
  const maxMatH = BASE_HEIGHT + matSize * 2;
  const maxOuterW = maxMatW + frameSize * 2;
  const maxOuterH = maxMatH + frameSize * 2;

  const frameThickness = 0.08;

  const sizes = {
    title: isMobile ? 0.10 : 0.08,
    period: isMobile ? 0.045 : 0.04,
    tags: isMobile ? 0.038 : 0.035,
    desc: isMobile ? 0.045 : 0.04,
  };

  const captionWidth = isMobile ? maxOuterW : 1.4;
  const captionHeight = isMobile ? 1.05 : 0.9; 
  const captionX = isMobile ? 0 : (maxOuterW / 2) + (captionWidth / 2) + 0.3;
  const captionY = isMobile ? -(maxOuterH / 2) - (captionHeight / 2) - 0.2 : -0.2;

  const groupYOffset = isMobile ? 0.35 : 0;
  
  const posTitleY = 0;
  const posPeriodY = isMobile ? -0.17 : -0.14;
  const posTagsY = isMobile ? -0.25 : -0.21;
  const posDividerY = isMobile ? -0.37 : -0.32;
  const posDescY = isMobile ? -0.45 : -0.39;

  const fontRegular = "/fonts/NotoSansKR-400.woff";
  const fontBold = "/fonts/NotoSansKR-700.woff";

  return (
    <group position={[position[0], position[1] + groupYOffset, position[2]]}>
      
      {/* 🚀 성능 최적화: 초기 렌더링을 엄청나게 지연시키는 복잡한 연산인 RoundedBox(ExtrudeGeometry)를 Box로 교체하여 수십 배 빠르게 렌더링되게 만듭니다. */}
      <Box args={[outerW, outerH, frameThickness]} position={[0, 0, 0]} castShadow receiveShadow>
        <meshStandardMaterial color="#171717" roughness={0.6} metalness={0.4} />
      </Box>

      <Box args={[matW, matH, 0.01]} position={[0, 0, frameThickness / 2 + 0.01]} receiveShadow>
        <meshStandardMaterial color="#fcfcfc" roughness={0.9} metalness={0.05} />
      </Box>

      <Box args={[contentWidth, contentHeight, 0.006]} position={[0, 0, frameThickness / 2 + 0.02]}>
        <meshStandardMaterial color="#e0e0e0" />
      </Box>

      {safeTexture && (
        <mesh 
          position={[0, 0, frameThickness / 2 + 0.03]}
          onClick={(e) => {
            e.stopPropagation();
            if (!isGlobalDragging) onSelect(project);
          }}
          onPointerOver={(e) => {
            e.stopPropagation();
            if (!isGlobalDragging) document.body.style.cursor = 'pointer';
          }}
          onPointerOut={(e) => {
            e.stopPropagation();
            document.body.style.cursor = '';
          }}
        >
          <planeGeometry args={[contentWidth, contentHeight]} />
          <meshBasicMaterial map={safeTexture} toneMapped={false} />
        </mesh>
      )}
      
      <group 
        position={[captionX, captionY, 0.015]}
        onClick={(e) => {
          e.stopPropagation();
          if (!isGlobalDragging) onSelect(project); 
        }}
        onPointerOver={(e) => {
          e.stopPropagation();
          if (!isGlobalDragging) document.body.style.cursor = 'pointer';
        }}
        onPointerOut={(e) => {
          e.stopPropagation();
          document.body.style.cursor = '';
        }}
      > 
        <mesh castShadow receiveShadow>
          <boxGeometry args={[captionWidth, captionHeight, 0.02]} /> 
          <meshStandardMaterial color="#ffffff" roughness={0.7} metalness={0.05} /> 
        </mesh>

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