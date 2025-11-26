import { useState, useEffect } from "react";

export function useMediaQuery(query: string) {
  const [matches, setMatches] = useState(() => {
    // SSR 환경(서버)에서는 window가 없으므로 false 반환
    if (typeof window !== 'undefined') {
      return window.matchMedia(query).matches;
    }
    return false;
  });

  useEffect(() => {
    const media = window.matchMedia(query);
    const listener = (e: MediaQueryListEvent) => setMatches(e.matches);
    
    media.addEventListener("change", listener);
    return () => media.removeEventListener("change", listener);
  }, [query, matches]); // matches 의존성 추가

  return matches;
}