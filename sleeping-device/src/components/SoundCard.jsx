import { useRef, useEffect, useState } from "react";
import { useGlobalAudio } from "./audioContext";

export default function SoundCard({ name, file }) {
  const { isOn, isPaused, stopAll } = useGlobalAudio();
  const audioRef = useRef(new Audio(file));
  const [localVolume, setLocalVolume] = useState(0.5);

  useEffect(() => {
    const audio = audioRef.current;
    audio.loop = true;
    audio.volume = localVolume;

    if (isOn && !isPaused && !stopAll) {
      audio.play().catch(() => {}); // Prevent autoplay error
    } else {
      audio.pause();
    }
  }, [isOn, isPaused, stopAll, localVolume]);

  const handleVolume = (e) => {
    const val = e.target.value;
    setLocalVolume(val);
    audioRef.current.volume = val;
  };

  return (
    <div className="bg-gray-800 p-4 rounded-xl shadow-lg flex flex-col items-center">
      <h2 className="text-lg font-semibold mb-2">{name}</h2>
      {/* Vertical Slider */}
      <div className="h-32 flex items-center">
        <input
          type="range"
          min="0"
          max="1"
          step="0.01"
          value={localVolume}
          onChange={handleVolume}
          className="w-24 h-32 rotate-[-90deg] accent-blue-500"
        />
      </div>
      <p className="text-xs text-gray-400 mt-2">{Math.round(localVolume * 100)}%</p>
    </div>
  );
}
