import { useState } from "react";

// Detectar si es dispositivo táctil SIN useEffect
function detectTouchDevice(): boolean {
  if (typeof window === "undefined") return false;
  return "ontouchstart" in window || navigator.maxTouchPoints > 0;
}

export function useIsTouchDevice(): boolean {
  // Calcular el valor inicial directamente, no en useEffect
  const [isTouchDevice] = useState(() => detectTouchDevice());

  return isTouchDevice;
}
