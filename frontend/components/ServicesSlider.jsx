"use client"
import React, { useEffect, useRef, useState } from 'react';
import Image from "next/image";
import BackgroundRing from './BackgroundRing';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://127.0.0.1:8000';
const CLINICS_API_URL = `${API_BASE_URL}/api/clinics/`;

export default function ServicesSlider() {
  const [clinics, setClinics] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const sliderRef = useRef(null);
  const sectionRef = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const fetchClinics = async () => {
      try {
        const response = await fetch(CLINICS_API_URL);
        if (!response.ok) {
          throw new Error(`API request failed with status ${response.status}`);
        }

        const data = await response.json();
        console.log(data);
        setClinics(Array.isArray(data) ? data : []);
      } catch (fetchError) {
        console.error('Error fetching clinics:', fetchError);
        setError('خطای دریافت اطلاعات کلینیک. لطفاً دوباره تلاش کنید.');
      } finally {
        setLoading(false);
      }
    };

    fetchClinics();
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setVisible(true);
            observer.disconnect();
          }
        });
      },
      { threshold: 0.2 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    } 

    return () => observer.disconnect();
  }, []);

  const scroll = (direction) => {
    if (sliderRef.current) {
      const scrollAmount = direction === 'left' ? -350 : 350;
      sliderRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  const displayClinics = clinics;

  return (
    <section
      ref={sectionRef}
      className={`w-full lg:mt-36 mb-20 py-16 px-4 md:px-8 bg-white overflow-hidden transition-all duration-700 ease-out ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
    >
      <div className="max-w-7xl mx-auto">
        <BackgroundRing
          size={250}
          thickness={40}
          opacity={0.5}
          className="hidden lg:block left-40 top-10 -z-10"
          centerX={true}
        />
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-6">
          <div className="max-w-lg">
            <span className="inline-block px-4 py-1.5 mb-4 text-indigo-600 bg-indigo-50 rounded-full text-sm font-semibold border border-indigo-100">
              کلینیک های ما
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 leading-tight">
              بهترین کلینیک های تهران و اطراف برای خدمات پزشکی
            </h2>
          </div>
          <button className="whitespace-nowrap px-6 py-3 bg-[#5C45FD] text-white font-medium rounded-xl transition-all duration-300 hover:-translate-y-1 shadow-lg ">
            رزرو نوبت
          </button>
        </div>

        {error && (
          <div className="mb-6 rounded-2xl border border-red-100 bg-red-50 p-4 text-sm text-red-700">
            {error}
          </div>
        )}

        {/* Slider Section */}
        <div className="relative">
          
          {/* Left Arrow */}
          <button 
            onClick={() => scroll('left')}
            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1/2 z-10 w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-[0_4px_20px_rgba(0,0,0,0.08)] border border-slate-100 hover:scale-105 transition-transform"
            aria-label="اسکرول به راست"
          >
            <svg className="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
            </svg>
          </button>

          {/* Scroll Container */}
          <div 
            ref={sliderRef}
            className="flex gap-6 overflow-x-auto snap-x snap-mandatory scroll-smooth pb-8 [&::-webkit-scrollbar]:hidden -ms-overflow-style-none"
            style={{ scrollbarWidth: 'none' }}
          >
            {displayClinics.map((clinic) => {
              const title = clinic.name || clinic.title;
              const location = clinic.city ? `${clinic.city}${clinic.neighborhood ? `، ${clinic.neighborhood}` : ''}` : '';
              const description = clinic.description || clinic.address || 'خدمات پزشکی با کیفیت بالا';
              const imageUrl = clinic.image ? (clinic.image.startsWith('/') ? `${API_BASE_URL}${clinic.image}` : clinic.image) : null;

              return (
                <div 
                  key={clinic.id ?? clinic.name} 
                  className="snap-start shrink-0 w-[280px] md:w-[320px] rounded-2xl border border-slate-100 shadow-sm overflow-hidden flex flex-col group"
                >
                  {/* Card Top / Image Area */}
                  <div className="h-40 bg-[#F4F5FF] flex items-center justify-center overflow-hidden transition-colors group-hover:bg-[#ebeeff]">
                    {imageUrl ? (
                      <Image width={100} height={40} src={imageUrl} alt={title} className="w-full h-full object-cover" />
                    ) : (
                      <div className="flex items-center justify-center w-full h-full p-6">
                        <svg className="w-16 h-16 text-[#1E1B4B]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 8v4" />
                        </svg>
                      </div>
                    )}
                  </div>

                  {/* Card Bottom / Text Area */}
                  <div className="p-6 bg-white flex-1 flex flex-col">
                    <h3 className="text-xl font-bold text-slate-900 mb-3">{title}</h3>
                    {location && <p className="text-sm text-indigo-600 font-semibold mb-3">{location}</p>}
                    <p className="text-slate-500 text-sm leading-relaxed mb-6 flex-1">
                      {description}
                    </p>
                    <a href="#" className="text-[#5C45FD] font-semibold text-sm hover:underline flex items-center gap-1">
                      بیشتر بدانید
                    </a>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Right Arrow */}
          <button 
            onClick={() => scroll('right')}
            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 z-10 w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-[0_4px_20px_rgba(0,0,0,0.08)] border border-slate-100 hover:scale-105 transition-transform"
            aria-label="اسکرول به چپ"
          >
            <svg className="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
            </svg>
          </button>

        </div>
      </div>
    </section>
  );
}