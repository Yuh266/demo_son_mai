"use client";

import React, { useEffect, useRef } from "react";
import Image from "next/image";
import { ArrowRight } from "lucide-react";

interface ScreenHookProps {
  onPrev?: () => void;
  onExplore?: () => void;
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

export const ScreenHook: React.FC<ScreenHookProps> = ({ onExplore, isActive = true }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Hiệu ứng bụi vàng quỳ lơ lửng nhẹ nhàng quanh chiếc hộp
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

    const particles: Particle[] = Array.from({ length: 30 }, () => ({
      x: width * 0.4 + Math.random() * (width * 0.6),
      y: Math.random() * height,
      size: Math.random() * 2.2 + 0.6,
      speedY: -(Math.random() * 0.3 + 0.1),
      speedX: (Math.random() - 0.5) * 0.2,
      opacity: Math.random() * 0.6 + 0.2,
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
          p.x = width * 0.4 + Math.random() * (width * 0.6);
        }
        if (p.x < width * 0.35) p.x = width;
        if (p.x > width + 10) p.x = width * 0.35;

        const currentOpacity = p.opacity * (0.6 + 0.4 * Math.sin(p.pulse));

        ctx.save();
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);

        const gradient = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.size * 2);
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
    <section className="relative w-full h-screen overflow-hidden flex items-center justify-start bg-black select-none">
      {/* 1. Nền hình ảnh chiếc hộp sơn mài với hiệu ứng zoom nhẹ khi xuất hiện */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/images/box_bg.png"
          alt="Chiếc hộp sơn mài nhiều lớp sắc"
          fill
          priority
          className={`object-cover object-[75%_25%] md:object-right transition-all duration-1200 ease-out ${
            isActive ? "scale-100 opacity-100" : "scale-105 opacity-80"
          }`}
        />
        {/* Lớp gradient thích ứng: trên mobile phủ tối mềm phần dưới để lộ rõ chiếc hộp tuyệt đẹp phía trên */}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent md:bg-gradient-to-r md:from-black/90 md:via-black/55 md:to-transparent pointer-events-none" />
      </div>

      {/* 2. Hiệu ứng hạt bụi vàng lơ lửng */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 z-10 pointer-events-none"
      />

      {/* 3. Khối nội dung bên trái đa thiết bị */}
      <div className="relative z-20 w-full md:w-[65%] lg:w-[58%] xl:w-[52%] 2xl:w-[48%] h-full flex flex-col justify-end md:justify-center px-6 sm:px-10 md:px-12 lg:pl-16 xl:pl-26 2xl:pl-36 lg:pr-6 pt-12 pb-16 sm:pb-12">
        <div className="w-full max-w-xl 2xl:max-w-2xl space-y-5 sm:space-y-7 lg:space-y-10">
          {/* Tiêu đề chính 4 dòng co giãn linh hoạt */}
          <div className="space-y-1 sm:space-y-2">
            <h2
              className={`text-3xl sm:text-4xl md:text-5xl lg:text-[3.2rem] xl:text-[4rem] 2xl:text-[4.6rem] font-serif tracking-[0.08em] sm:tracking-[0.11em] lg:tracking-[0.14em] text-[#EDE6DC] font-normal uppercase leading-[1.08] transition-all duration-1000 ease-[cubic-bezier(0.16,1,0.3,1)] delay-100 ${
                isActive ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
              }`}
            >
              MỘT CHIẾC
            </h2>
            <h2
              className={`text-3xl sm:text-4xl md:text-5xl lg:text-[3.2rem] xl:text-[4rem] 2xl:text-[4.6rem] font-serif tracking-[0.08em] sm:tracking-[0.11em] lg:tracking-[0.14em] text-[#EDE6DC] font-normal uppercase leading-[1.08] transition-all duration-1000 ease-[cubic-bezier(0.16,1,0.3,1)] delay-250 ${
                isActive ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
              }`}
            >
              HỘP.
            </h2>
            <h2
              className={`text-3xl sm:text-4xl md:text-5xl lg:text-[3.2rem] xl:text-[4rem] 2xl:text-[4.6rem] font-serif tracking-[0.08em] sm:tracking-[0.11em] lg:tracking-[0.14em] text-[#EDE6DC] font-normal uppercase leading-[1.08] transition-all duration-1000 ease-[cubic-bezier(0.16,1,0.3,1)] delay-400 ${
                isActive ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
              }`}
            >
              NHIỀU LỚP
            </h2>
            <h2
              className={`text-3xl sm:text-4xl md:text-5xl lg:text-[3.2rem] xl:text-[4rem] 2xl:text-[4.6rem] font-serif tracking-[0.08em] sm:tracking-[0.11em] lg:tracking-[0.14em] text-[#EDE6DC] font-normal uppercase leading-[1.08] transition-all duration-1000 ease-[cubic-bezier(0.16,1,0.3,1)] delay-550 ${
                isActive ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
              }`}
            >
              SẮC.
            </h2>
          </div>

          {/* Câu hỏi gợi mở phóng to thanh tao */}
          <div
            className={`space-y-1 pt-1 sm:pt-2 transition-all duration-1000 ease-[cubic-bezier(0.16,1,0.3,1)] delay-700 ${
              isActive ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
            }`}
          >
            <p className="text-base sm:text-lg md:text-xl lg:text-2xl xl:text-[1.65rem] 2xl:text-[1.85rem] font-serif text-[#EDE6DC] font-light leading-snug">
              Nhưng để có được bề mặt này,
              <br />
              nó đã đi qua những gì?
            </p>
          </div>

          {/* Nút KHÁM PHÁ dạng outline viền mảnh xuất hiện mượt mà */}
          <div
            className={`pt-4 sm:pt-6 transition-all duration-1000 ease-[cubic-bezier(0.16,1,0.3,1)] delay-900 ${
              isActive ? "opacity-100 translate-y-0 scale-100" : "opacity-0 translate-y-4 scale-95"
            }`}
          >
            <button
              onClick={onExplore}
              className="inline-flex items-center gap-3 px-5 sm:px-7 py-2.5 sm:py-3 rounded-sm border border-white/30 hover:border-[#D4AF37] bg-black/45 hover:bg-[#1A1208]/80 backdrop-blur-md text-[#EDE6DC] hover:text-[#F3E5AB] transition-all duration-300 group cursor-pointer shadow-lg hover:shadow-[#D4AF37]/15"
            >
              <span className="text-xs sm:text-sm font-serif tracking-[0.25em] sm:tracking-[0.28em] uppercase font-light">
                KHÁM PHÁ
              </span>
              <ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#C8BFB2] group-hover:text-[#F3E5AB] group-hover:translate-x-1.5 transition-transform" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};
