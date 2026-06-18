"use client"

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import BackgroundRing from "./BackgroundRing";

export default function AboutSection() {
  const sectionRef = useRef(null);
  const [visible, setVisible] = useState(false);

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

  return (
    <section
      id="aboutus"
      ref={sectionRef}
      className={`flex flex-col md:flex-row items-center gap-12 px-6 py-16 max-w-6xl mx-auto mt-20 lg:mt-24 transition-all duration-700 ease-out ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
    >
      <BackgroundRing
        size={250}
        thickness={40}
        opacity={0.5}
        className="hidden lg:block fixed -right-32 -top-20 -translate-y-1/2 -z-10"
      />
      <BackgroundRing
        size={300}
        thickness={50}
        opacity={0.5}
        className="hidden lg:block fixed -left-32 bottom-0 -translate-y-1/2 -z-10"
      />
      {/* Left: Stacked images */}
      <div className="relative w-full lg:-mr-12 lg:ml-12 md:w-1/2 flex-shrink-0">
        
        {/* Card containing two photos */}
        <div className="rounded-3xl overflow-hidden shadow-lg bg-[var(--background)]">
          {/* Top photo */}
          <Image
            src="https://cdn.prod.website-files.com/601d7e7320ecf079f58169fd/601dcd99261d9f4a683cc648_image-1-home-about-dentist-template-p-800.jpeg"
            alt="تیم دندان‌پزشکان در حال بررسی تبلت"
            width={720}
            height={320}
            className="w-full h-128 object-cover"
          />
        </div>
      </div>

      {/* Right: Text content */}
      <div className="w-full md:w-1/2 space-y-6">

        {/* Badge */}
        <span className="inline-block border border-[var(--border)] text-[var(--foreground)] text-sm font-semibold px-4 py-1 rounded-full">
          درباره ما
        </span>

        {/* Heading */}
        <h2 className="text-4xl font-extrabold text-[var(--foreground)] leading-tight">
          تیم ما تنها یک هدف دارد: سلامتی شما
        </h2>

        {/* Description */}
        <p className="text-muted leading-relaxed">
          ما با دانش و تجربه در دندان‌پزشکی همراه شما هستیم تا بهترین مراقبت را
          با آرامش کامل دریافت کنید.
        </p>

        {/* Doctor card */}
        <div className="flex items-center gap-4">
          <Image
            src="https://cdn.prod.website-files.com/601d7e7320ecf079f58169fd/601dcd98ebb636bdcc24b2db_image-home-about-dentist-template.jpg"
            alt="دکتر اندرو مور"
            width={56}
            height={56}
            className="w-14 h-14 rounded-xl object-cover"
          />
          <div>
            <p className="font-bold text-[var(--foreground)]">دکتر رامین سیرجانی</p>
            <p className="text-sm text-[var(--muted)]">دندان‌پزشک در کلینیک جهانی</p>
          </div>
        </div>

        {/* CTA button */}
        <button className="bg-[var(--primary)] shadow transition-all duration-300 hover:-translate-y-1 text-primary-foreground font-semibold px-8 py-4 rounded-xl">
          درباره کلینیک ما
        </button>

      </div>
    </section>
  );
}
