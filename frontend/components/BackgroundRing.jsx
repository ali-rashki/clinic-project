// components/BackgroundRing.jsx

"use client";

import { useEffect, useState } from "react";

export default function BackgroundRing({
  size = 300,
  thickness = 55,
  opacity = 0.06,
  mouseStrength = 20,
  scrollStrength = 0.08,
  centerX = false,
  className = "",
}) {
  const [offset, setOffset] = useState({ x: 0, y: 0 });

  useEffect(() => {
    let mouseX = 0;
    let mouseY = 0;
    let scrollY = 0;

    const updatePosition = () => {
      setOffset({
        x: mouseX * mouseStrength,
        y: mouseY * mouseStrength + scrollY * scrollStrength,
      });
    };

    const handleMouseMove = (e) => {
      mouseX = (e.clientX / window.innerWidth - 0.5) * 2;
      mouseY = (e.clientY / window.innerHeight - 0.5) * 2;
      updatePosition();
    };

    const handleScroll = () => {
      scrollY = window.scrollY;
      updatePosition();
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("scroll", handleScroll);
    };
  }, [mouseStrength, scrollStrength]);

  const transformValue = centerX
    ? `translate(calc(-50% + ${offset.x}px), ${offset.y}px)`
    : `translate(${offset.x}px, ${offset.y}px)`;

  return (
    <div
      className={`absolute rounded-full pointer-events-none transition-transform duration-300 ease-out ${className}`}
      style={{
        width: size,
        height: size,
        border: `${thickness}px solid #E9E9FF`,
        transform: transformValue,
        opacity,
      }}
    />
  );
}