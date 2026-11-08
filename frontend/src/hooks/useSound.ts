import { useEffect, useRef } from "react";

export const useSound = (soundUrl: string) => {
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    // Precargar el sonido al montar el hook
    audioRef.current = new Audio(soundUrl);
    audioRef.current.preload = "auto";
  }, [soundUrl]);

  const play = () => {
    if (audioRef.current) {
      audioRef.current.currentTime = 0; // Reiniciar para permitir reproducciones rápidas consecutivas
      audioRef.current.play().catch((e) => {
        // Fallback silencioso si el navegador bloquea el autoplay (aunque al haber clic previo, no debería)
        console.warn("⚠️ No se pudo reproducir el sonido:", e);
      });
    }
  };

  return { play };
};
