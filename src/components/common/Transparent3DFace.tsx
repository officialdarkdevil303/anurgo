import React, { useEffect, useRef, useState } from 'react';

interface Transparent3DFaceProps {
  src: string;
  alt: string;
  className?: string;
  isCutout?: boolean;
}

export const Transparent3DFace: React.FC<Transparent3DFaceProps> = ({
  src,
  alt,
  className = '',
  isCutout = false,
}) => {
  const [processedSrc, setProcessedSrc] = useState<string>(src);
  const [isLoaded, setIsLoaded] = useState<boolean>(false);

  useEffect(() => {
    if (isCutout || src.endsWith('.png')) {
      setProcessedSrc(src);
      setIsLoaded(true);
      return;
    }

    // Process JPG on an offscreen canvas to remove pitch-black background with soft alpha falloff
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.src = src;

    img.onload = () => {
      try {
        const canvas = document.createElement('canvas');
        canvas.width = img.naturalWidth || img.width;
        canvas.height = img.naturalHeight || img.height;
        const ctx = canvas.getContext('2d');

        if (!ctx) {
          setProcessedSrc(src);
          setIsLoaded(true);
          return;
        }

        ctx.drawImage(img, 0, 0);
        const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const data = imgData.data;

        // Alpha keying with soft edge transition
        for (let i = 0; i < data.length; i += 4) {
          const r = data[i];
          const g = data[i + 1];
          const b = data[i + 2];
          const maxBrightness = Math.max(r, g, b);

          // Threshold for black background removal
          const blackThreshold = 18;
          const softThreshold = 55;

          if (maxBrightness <= blackThreshold) {
            data[i + 3] = 0; // Fully transparent
          } else if (maxBrightness < softThreshold) {
            // Smooth alpha falloff for hair edges and soft rim lights
            const factor = (maxBrightness - blackThreshold) / (softThreshold - blackThreshold);
            data[i + 3] = Math.floor(factor * 255);
          }
        }

        ctx.putImageData(imgData, 0, 0);
        setProcessedSrc(canvas.toDataURL('image/png'));
        setIsLoaded(true);
      } catch {
        // Fallback to original image
        setProcessedSrc(src);
        setIsLoaded(true);
      }
    };

    img.onerror = () => {
      setProcessedSrc(src);
      setIsLoaded(true);
    };
  }, [src, isCutout]);

  return (
    <div className={`relative flex items-center justify-center ${className}`}>
      <img
        src={processedSrc}
        alt={alt}
        className={`w-full h-auto object-contain transition-opacity duration-300 ${
          isLoaded ? 'opacity-100' : 'opacity-0'
        } filter drop-shadow-[0_20px_40px_rgba(0,0,0,0.85)] drop-shadow-[0_0_30px_rgba(255,84,0,0.2)]`}
        draggable={false}
      />
    </div>
  );
};
