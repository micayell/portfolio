export function getImagePath(path: string) {
  // 이미 http로 시작하거나 절대 경로인 경우는 그대로 반환
  if (path.startsWith('http') || path.startsWith('/')) {
    return path;
  }
  
  // 맨 앞에 슬래시(/)가 없으면 붙여줌
  return `/${path}`;
}