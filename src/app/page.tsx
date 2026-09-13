"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { ScreenLoading } from "@/components/ScreenLoading";
import { ScreenHero } from "@/components/ScreenHero";
import { ScreenHook } from "@/components/ScreenHook";
import { ScreenCaseStudy } from "@/components/ScreenCaseStudy";

export default function Home() {
  const [hasLoaded, setHasLoaded] = useState(false);
  const [currentScreen, setCurrentScreen] = useState(2); // 2: Hero, 3: Box, 4: Case Study
  const lastScrollTime = useRef(0);

  const goToScreen = useCallback((targetScreen: number) => {
    if (targetScreen === currentScreen || targetScreen < 2 || targetScreen > 4) return;
    setCurrentScreen(targetScreen);
  }, [currentScreen]);

  // Lắng nghe thao tác cuộn chuột (Mouse Wheel)
  useEffect(() => {
    const handleWheel = (e: WheelEvent) => {
      if (!hasLoaded) return;
      const now = Date.now();
      if (now - lastScrollTime.current < 700) return;

      if (e.deltaY > 25) {
        // Cuộn xuống
        if (currentScreen < 4) {
          lastScrollTime.current = now;
          goToScreen(currentScreen + 1);
        }
      } else if (e.deltaY < -25) {
        // Cuộn lên
        if (currentScreen > 2) {
          lastScrollTime.current = now;
          goToScreen(currentScreen - 1);
        }
      }
    };

    window.addEventListener("wheel", handleWheel, { passive: true });
    return () => window.removeEventListener("wheel", handleWheel);
  }, [hasLoaded, currentScreen, goToScreen]);

  // Hỗ trợ vuốt ngón tay trên điện thoại / tablet
  useEffect(() => {
    let touchStartY = 0;

    const handleTouchStart = (e: TouchEvent) => {
      touchStartY = e.touches[0].clientY;
    };

    const handleTouchEnd = (e: TouchEvent) => {
      if (!hasLoaded) return;
      const touchEndY = e.changedTouches[0].clientY;
      const diff = touchStartY - touchEndY;

      if (Math.abs(diff) > 40) {
        if (diff > 0 && currentScreen < 4) {
          goToScreen(currentScreen + 1);
        } else if (diff < 0 && currentScreen > 2) {
          goToScreen(currentScreen - 1);
        }
      }
    };

    window.addEventListener("touchstart", handleTouchStart, { passive: true });
    window.addEventListener("touchend", handleTouchEnd, { passive: true });
    return () => {
      window.removeEventListener("touchstart", handleTouchStart);
      window.removeEventListener("touchend", handleTouchEnd);
    };
  }, [hasLoaded, currentScreen, goToScreen]);

  // Phím mũi tên (ArrowDown / ArrowUp)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!hasLoaded) return;
      if (e.key === "ArrowDown" || e.key === "PageDown") {
        if (currentScreen < 4) goToScreen(currentScreen + 1);
      }
      if (e.key === "ArrowUp" || e.key === "PageUp") {
        if (currentScreen > 2) goToScreen(currentScreen - 1);
      }
      if (e.key === "1") goToScreen(2);
      if (e.key === "2") goToScreen(2);
      if (e.key === "3") goToScreen(3);
      if (e.key === "4") goToScreen(4);
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [hasLoaded, currentScreen, goToScreen]);

  return (
    <main className="relative w-screen h-screen bg-black text-[#EDE6DC] overflow-hidden select-none">
      {/* 1. Màn 01 (Loading) xếp trên cùng (z-40), khi tải xong sẽ tan biến mượt mà */}
      {!hasLoaded && (
        <ScreenLoading onComplete={() => setHasLoaded(true)} />
      )}

      {/* 2. Màn 02 (Hero) */}
      <div
        className={`absolute inset-0 z-20 w-full h-full transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] ${
          currentScreen === 2
            ? "translate-y-0"
            : currentScreen > 2
            ? "-translate-y-full"
            : "translate-y-full"
        }`}
      >
        <ScreenHero
          isActive={hasLoaded && currentScreen === 2}
          onNext={() => goToScreen(3)}
        />
      </div>

      {/* 3. Màn 03 (Hook - Chiếc Hộp) */}
      <div
        className={`absolute inset-0 z-20 w-full h-full transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] ${
          currentScreen === 3
            ? "translate-y-0"
            : currentScreen > 3
            ? "-translate-y-full"
            : "translate-y-full"
        }`}
      >
        <ScreenHook
          isActive={hasLoaded && currentScreen === 3}
          onPrev={() => goToScreen(2)}
          onExplore={() => goToScreen(4)}
        />
      </div>

      {/* 4. Màn 04 (Case Study - Hành Trình Chiếc Hộp Bóc Tách 6 Lớp) */}
      <div
        className={`absolute inset-0 z-20 w-full h-full transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] ${
          currentScreen === 4
            ? "translate-y-0"
            : "translate-y-full"
        }`}
      >
        <ScreenCaseStudy
          onPrev={() => goToScreen(3)}
        />
      </div>

      {/* 5. Thanh chỉ số trang tinh tế góc phải khi đã vào trang chính */}
      {hasLoaded && (
        <aside className="fixed right-5 top-1/2 -translate-y-1/2 z-40 hidden sm:flex flex-col items-center gap-2.5">
          {[2, 3, 4].map((screenIdx) => {
            const isActive = currentScreen === screenIdx;
            return (
              <button
                key={screenIdx}
                onClick={() => goToScreen(screenIdx)}
                className={`w-1.5 rounded-full transition-all duration-300 ${
                  isActive
                    ? "h-6 bg-[#EDE6DC] opacity-95 shadow-sm shadow-white/50"
                    : "h-1.5 bg-white/20 hover:bg-white/50"
                }`}
                aria-label={`Màn 0${screenIdx}`}
              />
            );
          })}
        </aside>
      )}
    </main>
  );
}
