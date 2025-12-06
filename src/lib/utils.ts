export function getImagePath(path: string) {
    // GitHub Pages 배포 환경(production)일 때만 '/portfolio'를 붙임
    const isProd = process.env.NODE_ENV === 'production';
    const basePath = isProd ? '/portfolio' : '';
    
    // 이미 http로 시작하거나 basePath가 이미 포함된 경우는 그대로 반환
    if (path.startsWith('http') || path.startsWith(basePath)) {
      return path;
    }
    
    // 맨 앞에 슬래시(/)가 없으면 붙여줌
    const cleanPath = path.startsWith('/') ? path : `/${path}`;
    
    return `${basePath}${cleanPath}`;
  }