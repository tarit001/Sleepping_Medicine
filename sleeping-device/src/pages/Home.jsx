"use client";
import { useEffect } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";
import ControlPanel from "../components/ControlPanel";

export default function Home() {
  const sounds = [
    { name: "🌧️", file: "/sounds/rain.wav" },
    { name: "⛈️", file: "/sounds/storm.wav" },
    { name: "🕊️", file: "/sounds/bird.wav" },
    { name: "🌬️", file: "/sounds/wind.wav" },
    { name: "🌊", file: "/sounds/water.wav" },
    { name: "🔥", file: "/sounds/fire.wav" },
    { name: "🕉️", file: "/sounds/om.mp3" },
    { name: "🚂", file: "/sounds/train.wav" },
    { name: "🦗", file: "/sounds/insects.wav" },
    { name: "🎶", file: "/sounds/whistle.mp3" },
  ];

  // motion values
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // smooth spring animation
  const smoothX = useSpring(mouseX, { stiffness: 80, damping: 20 });
  const smoothY = useSpring(mouseY, { stiffness: 80, damping: 20 });

  useEffect(() => {
    const handleMouseMove = (e) => {
      mouseX.set(e.clientX - 30); // offset for moon size
      mouseY.set(e.clientY - 30);
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [mouseX, mouseY]);

  return (
    <div className="relative min-h-screen bg-gradient-to-b from-gray-900 via-black to-gray-800 text-white overflow-hidden">
      {/* 🌌 Stars */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="stars"></div>
        <div className="stars2"></div>
        <div className="stars3"></div>
      </div>

      {/* 🌙 Moon follows cursor */}
      <motion.div
        className="absolute text-6xl drop-shadow-[0_0_25px_rgba(255,255,200,0.9)] pointer-events-none"
        style={{ x: smoothX, y: smoothY }}
      >
        🌙
      </motion.div>

      {/* ✨ Glow effect */}
      <motion.div
        className="absolute rounded-full bg-yellow-400 opacity-20 blur-3xl pointer-events-none"
        style={{
          x: smoothX,
          y: smoothY,
          width: 200,
          height: 200,
          marginLeft: -100,
          marginTop: -100,
        }}
      ></motion.div>

      {/* Main Content */}
      <div className="relative z-10 flex flex-col items-center p-6">
        <h1 className="text-4xl md:text-5xl font-bold text-center mb-6 bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent drop-shadow-lg">
          🌘 Sleeping Medicine 🌒
        </h1>
        <ControlPanel sounds={sounds} />
      </div>

      {/* Twinkling stars animation */}

    </div>
  );
}
