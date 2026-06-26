import React from 'react';
import Image from 'next/image';
import DentalInfoBar from './DentalInfo';
import BackgroundRing from './BackgroundRing';

const HeroSection = () => {
  return (

    <div className="relative pb-12 md:pb-24">

      {/* ── Hero ── */}
      <div className="relative flex flex-col md:flex-row md:min-h-screen overflow-hidden bg-white">
        <BackgroundRing
          size={300}
          thickness={55}
          opacity={1}
          className="hidden lg:block left-1/2 -top-20"
          centerX={true}
        />
        <BackgroundRing
          size={300}
          thickness={55}
          opacity={1}
          className="hidden lg:block right-0 bottom-20"
        />

        {/* Left Side */}
        <div className="relative flex-1 lg:w-1/2 gap-2 flex flex-col justify-center px-8 py-12 md:px-16 lg:px-24 bg-white/10 backdrop-blur-sm border border-white/20 shadow-[0_20px_60px_-40px_rgba(15,23,42,0.18)]">
          <div className="pointer-events-none absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-white/40 to-transparent" />
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-6 leading-tight">
            یک <span className='text-primary font-black'> کلینیک حرفه ای</span> <br />
            به ما اعتماد کنید
          </h1>

          <p className="text-muted text-lg mb-8 max-w-md">
            ارائه بهترین خدمات پزشکی، دندان پزشکی، اضطراری و زیبایی
          </p>

          <div className="flex flex-col sm:flex-row gap-4 mb-12">
            <button className="bg-primary text-primary-foreground shadow px-8 py-3 rounded-2xl text-lg font-medium transition-all duration-300 hover:-translate-y-1">
              رزرو نوبت
            </button>
            <button className="shadow text-primary text-lg px-8 py-3 rounded-2xl font-medium transition-all duration-300 hover:-translate-y-1">
              جستجوی خدمات
            </button>
          </div>
        </div>

        {/* Right Side - Image */}
        <div className="relative lg:w-1/2">
          <div className="w-full h-full flex items-center justify-center">
            <Image
              alt='clinic-photo'
              src={'/clinic_photo.jpg'}
              className='w-full h-full object-cover'
              height={1000}
              width={800}
              priority
            />
          </div>
        </div>
      </div>

      {/* ── DentalInfoBar — floating on lg, static on mobile ── */}
      <div className="relative lg:absolute lg:left-1/2 lg:-translate-x-1/2 lg:bottom-24 w-[95%] sm:w-[90%] mx-auto lg:mx-0 max-w-6xl z-20 mt-8 lg:mt-0 lg:translate-y-1/2">
        <DentalInfoBar />
      </div>

    </div>
  );
};

export default HeroSection;
