"use client";

import React from "react";
import Image from "next/image";

interface ScreenCaseStudyProps {
  onPrev?: () => void;
  onNext?: () => void;
}

const steps = [
  { id: "01", title: "NỀN / VÓC" },
  { id: "02", title: "XỬ LÝ" },
  { id: "03", title: "SƠN" },
  { id: "04", title: "TRANG TRÍ / VẬT LIỆU" },
  { id: "05", title: "MÀI" },
  { id: "06", title: "HOÀN THIỆN" },
];

export const ScreenCaseStudy: React.FC<ScreenCaseStudyProps> = () => {
  return (
    <section className="relative w-full h-screen overflow-hidden bg-black select-none flex flex-col justify-between">
      {/* 1. Full-Bleed 3D Exploded Lacquer Box Master Artwork */}
      <div className="absolute inset-0 w-full h-full pointer-events-none translate-y-8 sm:translate-y-12 lg:translate-y-16">
        <Image
          src="/images/exploded_box_master.jpg"
          alt="Hành trình tạo tác chiếc hộp sơn mài"
          fill
          priority
          className="object-cover object-left md:object-center"
        />

        {/* Soft edge darkening for seamless blend into infinite black */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/50 via-transparent to-black/80" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-black/70" />
      </div>

      {/* 2. Structured Layout Container across full viewport width - Đa thiết bị */}
      <div className="relative z-20 w-full h-full flex flex-col justify-between px-6 sm:px-10 md:px-14 lg:px-16 xl:px-20 py-6 sm:py-8 lg:py-10 overflow-y-auto lg:overflow-hidden">
        {/* Top Header: Title pushed cleanly to the left */}
        <header className="w-full pt-1">
          <div className="space-y-1 max-w-xl">
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-serif tracking-[0.12em] sm:tracking-[0.16em] text-[#EDE6DC] font-normal uppercase leading-[1.12]">
              HÀNH TRÌNH
            </h2>
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-serif tracking-[0.12em] sm:tracking-[0.16em] text-[#EDE6DC] font-normal uppercase leading-[1.12]">
              CỦA CHIẾC HỘP
            </h2>
          </div>
        </header>

        {/* Main Body Row: Left area open for 3D box, Right column has description & 6 steps */}
        <div className="w-full flex-1 flex items-center justify-between my-auto py-4 sm:py-6">
          {/* Left area open for the 3D artwork on larger screens */}
          <div className="hidden lg:block flex-1" />

          {/* Right Column: Description sitting immediately above the steps */}
          <div className="w-full max-w-md lg:max-w-lg flex flex-col justify-center space-y-5 sm:space-y-6 lg:space-y-8 pr-2 lg:pr-6 xl:pr-12">
            {/* Description placed directly above step 01 */}
            <p className="text-xs sm:text-sm font-sans text-white/60 leading-relaxed text-left font-light max-w-md">
              Đây là hành trình tạo tác của sản phẩm đang được khám phá. Tùy vào sản phẩm và kỹ thuật, các công đoạn có thể khác nhau.
            </p>

            {/* 6 Steps List - Co giãn khoảng cách theo chiều cao màn hình */}
            <div className="flex flex-col space-y-3 sm:space-y-4 md:space-y-4.5 lg:space-y-5 xl:space-y-6">
              {steps.map((step) => (
                <div key={step.id} className="flex items-center gap-3.5 sm:gap-4 lg:gap-5">
                  {/* Circular Badge with number */}
                  <div className="w-8 h-8 sm:w-9 sm:h-9 lg:w-10 lg:h-10 rounded-full border border-white/30 flex items-center justify-center text-[11px] sm:text-xs font-mono tracking-widest text-white/70 shrink-0">
                    {step.id}
                  </div>

                  {/* Title */}
                  <span className="text-xs sm:text-sm lg:text-base font-sans tracking-[0.14em] sm:tracking-[0.18em] uppercase text-white/85 font-light">
                    {step.title}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom Spacer */}
        <div className="h-2 sm:h-4 lg:h-6" />
      </div>
    </section>
  );
};
