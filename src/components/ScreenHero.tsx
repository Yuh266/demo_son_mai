"use client";

import React, { useEffect, useRef } from "react";
import Image from "next/image";
import { ArrowDown } from "lucide-react";

interface ScreenHeroProps {
  onNext?: () => void;
  onPrev?: () => void;
  isActive?: boolean;
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

export const ScreenHero: React.FC<ScreenHeroProps> = ({ onNext, isActive = true }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Hiệu ứng bụi vàng quỳ lấp lánh nhẹ nhàng phía vùng tranh bên trái
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

    const particles: Particle[] = Array.from({ length: 40 }, () => ({
      x: Math.random() * (width * 0.55),
      y: Math.random() * height,
      size: Math.random() * 2.5 + 0.8,
      speedY: -(Math.random() * 0.35 + 0.12),
      speedX: (Math.random() - 0.5) * 0.25,
      opacity: Math.random() * 0.7 + 0.2,
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
          p.x = Math.random() * (width * 0.55);
        }
        if (p.x < -10) p.x = width * 0.55;
        if (p.x > width * 0.55 + 10) p.x = -10;

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
          p.size * 2
        );
        gradient.addColorStop(0, `rgba(255, 248, 220, ${currentOpacity})`);
        gradient.addColorStop(0.5, `rgba(224, 185, 75, ${currentOpacity * 0.8})`);
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
    <div className="absolute inset-0 z-10 w-full h-screen overflow-hidden flex items-center justify-end bg-black select-none">
      {/* 1. Hình nền sơn mài tràn màn hình (đã tải sẵn, không chớp giật) */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/images/hero_bg.png"
          alt="Bề mặt sơn mài son đỏ và vàng quỳ"
          fill
          priority
          sizes="100vw"
          className="object-cover object-left sm:object-center"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-transparent to-black/90 lg:to-black/95 pointer-events-none" />
      </div>

      {/* 2. Hiệu ứng hạt bụi vàng quỳ */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 z-10 pointer-events-none"
      />

      {/* 3. Khối Typography bên phải với hiệu ứng xuất hiện mượt mà (Staggered Fade-in) */}
      <div className="relative z-20 w-full lg:w-[43%] xl:w-[41%] h-full flex flex-col justify-center px-6 sm:px-10 lg:pl-4 lg:pr-8 xl:pr-14 py-12 lg:ml-auto">
        <div className="max-w-2xl space-y-8 lg:space-y-10">
          {/* Tiêu đề chính phóng to, quyền quý */}
          <div
            className={`space-y-2 transition-all duration-1000 delay-150 ${
              isActive
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-6"
            }`}
          >
            <h2 className="text-4xl sm:text-5xl md:text-6xl lg:text-[4.4rem] xl:text-[5rem] font-serif tracking-[0.14em] text-[#EDE6DC] font-normal uppercase leading-[1.12] whitespace-nowrap">
              BẠN ĐANG
            </h2>
            <h2 className="text-4xl sm:text-5xl md:text-6xl lg:text-[4.4rem] xl:text-[5rem] font-serif tracking-[0.14em] text-[#EDE6DC] font-normal uppercase leading-[1.12] whitespace-nowrap">
              NHÌN THẤY GÌ?
            </h2>
          </div>

          {/* Các câu hỏi gợi mở phóng to thanh tao */}
          <div
            className={`space-y-5 pt-4 transition-all duration-1000 delay-300 ${
              isActive
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-6"
            }`}
          >
            <p className="text-2xl sm:text-3xl md:text-[2rem] lg:text-[2.25rem] font-serif text-[#DCD4C8] font-normal leading-snug">
              Một mặt sơn?
            </p>
            <p className="text-2xl sm:text-3xl md:text-[2rem] lg:text-[2.25rem] font-serif text-[#DCD4C8] font-normal leading-snug">
              Một lớp màu?
            </p>
            <p className="text-2xl sm:text-3xl md:text-[2rem] lg:text-[2.25rem] font-serif text-[#DCD4C8] font-normal leading-snug">
              Hay nhiều thứ đang nằm
              <br />
              bên dưới?
            </p>
          </div>

          {/* Chỉ dẫn cuộn / kéo (SCROLL / DRAG) */}
          <div
            onClick={onNext}
            className={`pt-8 flex items-center gap-3 text-[#A89F93] hover:text-[#EDE6DC] transition-all duration-1000 delay-500 cursor-pointer group ${
              isActive
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-4"
            }`}
          >
            <ArrowDown className="w-5 h-5 animate-bounce text-[#C8BFB2] group-hover:translate-y-0.5 transition-transform" />
            <span className="text-xs sm:text-sm font-serif tracking-[0.32em] uppercase">
              SCROLL / DRAG
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
