"use client";
import { useState } from "react";

const navItems = [
  { label: "خانه", href: "#home" },
  { label: "خدمات", href: "#services" },
  { label: "درباره ما", href: "#about" },
  { label: "تماس با ما", href: "#contact" },
];

export default function Header() {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  return (
    <>
      <header className="border-b border-[#5D4FFF]/10 bg-white/95 backdrop-blur sticky top-0 z-50">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          {/* Logo */}
          <a href="#home" className="flex items-center gap-3">
            <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#5D4FFF] text-lg font-bold text-white">
              C
            </span>
            <div>
              <p className="text-2xl font-bold text-slate-900">کلینیک</p>
              <p className="text-sm text-slate-500">مراقب سلامت شما</p>
            </div>
          </a>

          {/* Desktop Navigation */}
          <nav className="hidden items-center gap-8 md:flex">
            {navItems.map((item) => (
              <a
                key={item.label}
                href={item.href}
                className="text-md font-medium text-slate-600 transition hover:text-[#5D4FFF]"
              >
                {item.label}
              </a>
            ))}
          </nav>

          {/* Buttons Container - Both buttons sit next to each other */}
          <div className="hidden md:flex items-center gap-3">
            <a
              href="#contact"
              className="rounded-full bg-[#5D4FFF] px-4 py-2 text-md font-semibold text-white transition hover:bg-[#4b3fe8]"
            >
              رزرو نوبت
            </a>
            <a
              href="tel:1234567"
              className="rounded-2xl bg-white shadow px-6 py-2 text-md font-semibold text-[#181443] transition-all duration-300 hover:-translate-y-1 inline-flex items-center gap-2 border border-gray-200"
            >
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                width="18" 
                height="18" 
                viewBox="0 0 24 24" 
                fill="none"
                stroke="#5D4FFF" 
                strokeWidth="2"
                strokeLinecap="round" 
                strokeLinejoin="round"
                className="shrink-0"
              >
                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
              </svg>
              ۰۲۱-۵۵۷۹۳
            </a>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsDrawerOpen(true)}
            className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="text-slate-700"
            >
              <line x1="3" y1="12" x2="21" y2="12" />
              <line x1="3" y1="6" x2="21" y2="6" />
              <line x1="3" y1="18" x2="21" y2="18" />
            </svg>
          </button>
        </div>
      </header>

      {/* Mobile Drawer Overlay */}
      {isDrawerOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-50 md:hidden"
          onClick={() => setIsDrawerOpen(false)}
        >
          {/* Drawer Content */}
          <div
            className="fixed right-0 top-0 h-full w-80 bg-white shadow-2xl animate-slide-in"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Drawer Header */}
            <div className="flex justify-between items-center p-6 border-b border-gray-200">
              <div className="flex items-center gap-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#5D4FFF] text-lg font-bold text-white">
                  C
                </span>
                <div>
                  <p className="text-xl font-bold text-slate-900">کلینیک</p>
                  <p className="text-xs text-slate-500">مراقب سلامت شما</p>
                </div>
              </div>
              <button
                onClick={() => setIsDrawerOpen(false)}
                className="p-2 rounded-lg hover:bg-gray-100 transition"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>

            {/* Drawer Navigation */}
            <nav className="flex flex-col p-6 gap-4">
              {navItems.map((item) => (
                <a
                  key={item.label}
                  href={item.href}
                  onClick={() => setIsDrawerOpen(false)}
                  className="text-lg font-medium text-slate-600 transition hover:text-[#5D4FFF] py-2 border-b border-gray-100"
                >
                  {item.label}
                </a>
              ))}
            </nav>

            {/* Drawer Buttons */}
            <div className="absolute bottom-0 left-0 right-0 p-6 border-t border-gray-200 bg-white">
              <div className="flex flex-col gap-3">
                <a
                  href="#contact"
                  onClick={() => setIsDrawerOpen(false)}
                  className="rounded-full bg-[#5D4FFF] px-4 py-3 text-center text-md font-semibold text-white transition hover:bg-[#4b3fe8]"
                >
                  رزرو نوبت
                </a>
                <a
                  href="tel:1234567"
                  onClick={() => setIsDrawerOpen(false)}
                  className="rounded-2xl bg-white shadow px-4 py-3 text-md font-semibold text-[#181443] transition-all duration-300 hover:-translate-y-1 inline-flex items-center justify-center gap-2 border border-gray-200"
                >
                  <svg 
                    xmlns="http://www.w3.org/2000/svg" 
                    width="18" 
                    height="18" 
                    viewBox="0 0 24 24" 
                    fill="none"
                    stroke="#5D4FFF" 
                    strokeWidth="2"
                    strokeLinecap="round" 
                    strokeLinejoin="round"
                  >
                    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
                  </svg>
                  ۰۲۱-۵۵۷۹۳
                </a>
              </div>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes slideIn {
          from {
            transform: translateX(100%);
          }
          to {
            transform: translateX(0);
          }
        }
        .animate-slide-in {
          animation: slideIn 0.3s ease-out;
        }
      `}</style>
    </>
  );
}