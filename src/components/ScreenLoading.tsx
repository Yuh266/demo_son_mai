"use client";

import React, { useEffect, useState, useRef } from "react";
import Image from "next/image";

interface ScreenLoadingProps {
  onComplete?: () => void;
}

interface Particle {
  x: number;
  y: number;
  size: number;
  speedY: number;
  speedX: number;
  opacity: number;
  pulse: number;
  pulseSpeed: number;
}

export const ScreenLoading: React.FC<ScreenLoadingProps> = ({ onComplete }) => {
  const [progress, setProgress] = useState(15);
  const [isFadingOut, setIsFadingOut] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Loading progress counter
  useEffect(() => {
    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(timer);
          // Bắt đầu hiệu ứng tan biến mượt mà (Fade-out)
          setTimeout(() => {
            setIsFadingOut(true);
            setTimeout(() => {
              if (onComplete) onComplete();
            }, 900);
          }, 350);
          return 100;
        }
        const step = Math.floor(Math.random() * 5) + 3;
        return Math.min(prev + step, 100);
      });
    }, 60);

    return () => clearInterval(timer);
  }, [onComplete]);

  // Hiệu ứng hạt vàng quỳ 24K chuyển động lơ lửng
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener("resize", handleResize);

    const particles: Particle[] = Array.from({ length: 45 }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      size: Math.random() * 2.8 + 0.8,
      speedY: -(Math.random() * 0.45 + 0.15),
      speedX: (Math.random() - 0.5) * 0.35,
      opacity: Math.random() * 0.75 + 0.25,
      pulse: Math.random() * Math.PI,
      pulseSpeed: Math.random() * 0.03 + 0.015,
    }));

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      particles.forEach((p) => {
        p.y += p.speedY;
        p.x += p.speedX;
        p.pulse += p.pulseSpeed;

        if (p.y < -10) {
          p.y = height + 10;
          p.x = Math.random() * width;
        }
        if (p.x < -10) p.x = width + 10;
        if (p.x > width + 10) p.x = -10;

        const currentOpacity =
          p.opacity * (0.6 + 0.4 * Math.sin(p.pulse));

        ctx.save();
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);

        const gradient = ctx.createRadialGradient(
          p.x,
          p.y,
          0,
          p.x,
          p.y,
          p.size * 2.5
        );
        gradient.addColorStop(0, `rgba(255, 248, 220, ${currentOpacity})`);
        gradient.addColorStop(0.4, `rgba(224, 185, 75, ${currentOpacity * 0.85})`);
        gradient.addColorStop(1, `rgba(138, 98, 14, 0)`);

        ctx.fillStyle = gradient;
        ctx.fill();
        ctx.restore();
      });

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener("resize", handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <div
      className={`absolute inset-0 z-30 flex items-center justify-center bg-[#070504] select-none transition-all duration-1000 ease-out ${
        isFadingOut
          ? "opacity-0 pointer-events-none scale-105 filter blur-xs"
          : "opacity-100 scale-100"
      }`}
    >
      {/* 1. Nền sơn mài dòng chảy */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <Image
          src="/images/loading_bg.jpg"
          alt="Sơn Son Mài Sắc"
          fill
          priority
          className="object-cover object-center scale-105 animate-fluid-breath"
        />
        <div className="absolute inset-0 bg-black/40 backdrop-blur-[0.5px]" />
      </div>

      {/* 2. Canvas hạt vàng quỳ chuyển động */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 z-10 pointer-events-none"
      />

      {/* 3. Đúng chuẩn 3 dòng tối giản sang trọng */}
      <div
        className={`relative z-20 flex flex-col items-center text-center space-y-3 px-4 transition-all duration-700 ease-out ${
          isFadingOut
            ? "-translate-y-6 opacity-0"
            : "translate-y-0 opacity-100"
        }`}
      >
        {/* Dòng 1: Tên tác phẩm */}
        <h1 className="text-3xl sm:text-5xl md:text-6xl font-serif tracking-[0.18em] text-gold-bright font-normal uppercase drop-shadow-[0_8px_25px_rgba(0,0,0,0.85)]">
          SƠN SON MÀI SẮC
        </h1>

        {/* Dòng 2: Phụ đề */}
        <p className="text-xs sm:text-sm md:text-base font-serif tracking-[0.38em] text-[#E7DCB9] uppercase font-light drop-shadow">
          BƯỚC QUA LỚP SẮC
        </p>

        {/* Dòng 3: Thanh loading mảnh và chỉ số % */}
        <div className="pt-8 flex flex-col items-center space-y-2">
          <div className="w-56 sm:w-72 md:w-80 h-[1.5px] bg-white/20 overflow-hidden rounded-full">
            <div
              className="h-full bg-gradient-to-r from-[#D4AF37] via-[#FFF2CC] to-[#D4AF37] transition-all duration-150 ease-out shadow-[0_0_8px_rgba(212,175,55,0.8)]"
              style={{ width: `${progress}%` }}
            />
          </div>

          <span className="text-[10px] sm:text-xs font-serif tracking-widest text-[#E0CE9A]">
            {progress}%
          </span>
        </div>
      </div>
    </div>
  );
};
