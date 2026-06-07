import { useRef, useEffect } from 'react';

export default function PizzaVideoCanvas() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (!video || !canvas) return;

    const ctx = canvas.getContext('2d', { alpha: false });
    if (!ctx) return;

    let animationId: number;

    const render = () => {
      if (!video || !canvas || !ctx) return;
      
      if (video.readyState >= 2) {
        const vWidth = video.videoWidth;
        const vHeight = video.videoHeight;
        const cWidth = canvas.width;
        const cHeight = canvas.height;
        
        const vRatio = vWidth / vHeight;
        const cRatio = cWidth / cHeight;
        
        let sWidth, sHeight, sx, sy;
        if (vRatio > cRatio) {
          sHeight = vHeight;
          sWidth = vHeight * cRatio;
          sx = (vWidth - sWidth) / 2;
          sy = 0;
        } else {
          sWidth = vWidth;
          sHeight = vWidth / cRatio;
          sx = 0;
          sy = (vHeight - sHeight) / 2;
        }

        ctx.drawImage(video, sx, sy, sWidth, sHeight, 0, 0, cWidth, cHeight);
        ctx.fillStyle = 'rgba(0, 0, 0, 0.2)'; 
        ctx.fillRect(0, 0, cWidth, cHeight);
      }
      animationId = requestAnimationFrame(render);
    };

    // Używamy stabilnego linku do wideo (Pexels lub podobne z bezprawnym dostępem)
    // Jeśli video dalej nie działa, jako fallback damy piękny gradient animowany
    video.play().catch(() => {
      console.log("Autoplay blocked, waiting for interaction");
    });

    animationId = requestAnimationFrame(render);
    
    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    
    window.addEventListener('resize', handleResize);
    handleResize();

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationId);
    };
  }, []);

  return (
    <div className="absolute inset-0 z-0 overflow-hidden bg-gray-900">
      <video
        ref={videoRef}
        src="https://joy1.videvo.net/videvo_files/video/free/2021-04/large_watermarked/210329_06_Pizza_4k_014_preview.mp4"
        loop
        muted
        playsInline
        autoPlay
        crossOrigin="anonymous"
        className="absolute opacity-0 pointer-events-none w-1 h-1" 
      />
      <canvas
        ref={canvasRef}
        className="w-full h-full object-cover opacity-60 transition-opacity duration-1000" 
      />
      
      {/* Fallback Background (Gdyby video znowu zawiodło) */}
      <div className="absolute inset-0 -z-10 bg-gradient-to-br from-gray-900 via-red-950 to-black" />
      
      {/* Overlays */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-black z-10" />
      <div className="absolute inset-0 bg-gradient-to-r from-black via-black/20 to-transparent z-10 hidden md:block" />
    </div>
  );
}
