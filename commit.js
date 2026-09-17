const cp = require('child_process');

try {
  console.log('Adding files...');
  cp.execSync('git add .', { stdio: 'inherit' });
  
  console.log('Committing...');
  const commitMsg = `Refactor & Fix: 포트폴리오 전반적인 최적화 및 UI/UX 버그 수정

[Notion 연동 & RAG 챗봇]
- Notion API 429 Rate Limit 이슈 해결 (Promise.all -> 순차 처리 및 자동 재시도 로직 추가)
- 실무 경력 파싱 시 무조건 "경력" 뱃지가 매핑되도록 처리 로직 고정
- AI 시스템 프롬프트 완화 (단호한 톤 -> 부드러운 우회 유도)

[UI/UX 개선 및 버그 수정]
- Skills 탭: 커스텀 정렬 기능(PREFERRED_ORDER) 추가 및 하단 컨텐츠 정렬 동기화
- Skills 탭: 탭 전환 시 카드가 겹치고 날아다니는 애니메이션 버그(layout overlap) 수정 
- 모바일 스크롤 경고 우회 (@use-gesture 이슈 해결을 위해 touchAction: 'pan-y' 적용)
- GalleryScene 3D 그림자 처리 및 프리로딩 등 렌더링 성능 최적화

[코드베이스 정리 (Dead Code Cleanup)]
- 안 쓰이는 더미 데이터, 미사용 훅(hooks), 잉여 UI 컴포넌트들 일괄 정리
- 미사용 npm 라이브러리 제거 (package.json 최적화)
- 면접 대비용 아키텍처 문서화 (TROUBLESHOOTING.md, TECH.md)`;

  // Write message to a temp file to avoid quoting issues
  const fs = require('fs');
  fs.writeFileSync('temp_msg.txt', commitMsg);
  
  cp.execSync('git commit -F temp_msg.txt', { stdio: 'inherit' });
  fs.unlinkSync('temp_msg.txt');

  console.log('Pushing...');
  cp.execSync('git push', { stdio: 'inherit' });
  
  console.log('Done!');
} catch (e) {
  console.error(e.message);
}