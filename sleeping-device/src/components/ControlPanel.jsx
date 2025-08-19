import { useState, useEffect, useRef } from "react";
import { useGlobalAudio } from "./audioContext";

export default function ControlPanel({ sounds }) {
  const { isOn, setIsOn, isPaused, setIsPaused, setStopAll } = useGlobalAudio();
  const [timer, setTimer] = useState(0);
  const [remaining, setRemaining] = useState(0);
  const [volumes, setVolumes] = useState({});
  const audioRefs = useRef({});
  

  // Initialize audio elements
useEffect(() => {
  const newVolumes = {};
  sounds.forEach((s) => {
    if (!audioRefs.current[s.name]) {
      audioRefs.current[s.name] = new Audio(s.file);
      audioRefs.current[s.name].loop = true;
      audioRefs.current[s.name].volume = 0.0; // Set to 0 at start
    } else {
      audioRefs.current[s.name].volume = 0.0; // Reset volume to 0 on update
    }
    newVolumes[s.name] = 0.0; // Set initial slider value to 0%
  });
  setVolumes(newVolumes);
}, [sounds]);


  // Handle play/pause/stop based on control states
  useEffect(() => {
    Object.values(audioRefs.current).forEach((audio) => {
      if (isOn && !isPaused) {
        audio.play().catch(() => {}); // prevent autoplay error
      } else {
        audio.pause();
      }
    });
  }, [isOn, isPaused]);

  // Stop all sounds
  useEffect(() => {
    setStopAll(false);
  }, [setStopAll]);

  // Timer countdown
  useEffect(() => {
    let interval;
    if (remaining > 0 && isOn && !isPaused) {
      interval = setInterval(() => {
        setRemaining((prev) => Math.max(prev - 1, 0));
      }, 1000);
    } else if (remaining === 0 && timer > 0) {
      setIsOn(false);
    }
    return () => clearInterval(interval);
  }, [remaining, isOn, isPaused]);

  const startTimer = () => {
    if (timer > 0) setRemaining(timer * 60);
  };

  // const resetTimer = () => {
  //   setRemaining(0);
  //   setTimer(0);
  // };

    const resetTimer = () => {
    window.location.reload(); // Simply refresh the page
  };


  const stopAllSounds = () => {
    Object.values(audioRefs.current).forEach((audio) => {
      audio.pause();
      audio.currentTime = 0;
    });
    setIsOn(false);
  };

  const changeVolume = (name, value) => {
    const floatVal = parseFloat(value);
    if (audioRefs.current[name]) {
      audioRefs.current[name].volume = floatVal;
    }
    setVolumes((prev) => ({ ...prev, [name]: floatVal }));
  };
  
  const togglePlay = () => {
  if (audioRefs.current.paused) {
    audioRefs.current.play().catch(err => console.log("Playback failed:", err));
  } else {
    audioRefs.current.pause();
  }
};


  return (
    <div className="p-6 bg-gray-700 rounded-xl w-full max-w-2xl mx-auto text-center">
      <h2 className="text-xl font-bold mb-4">⚙ Control Panel</h2>

      {/* Power Button */}
      <button
        onClick={() => setIsOn(!isOn)}
        className={`px-6 py-2 rounded-lg mb-4 ${
          isOn ? "bg-green-600" : "bg-red-600"
        }`}
      >
        {isOn ? "Power Off" : "Power On"}
      </button>

      {/* Control Buttons */}
      <div className="flex flex-wrap justify-center gap-2 mb-4">
        <button
          onClick={() => setIsPaused(!isPaused)}
          className="px-4 py-2 bg-yellow-500 rounded-lg"
          disabled={!isOn}
        >
          {isPaused ? "Resume" : "Pause"}
        </button>

        <button onClick={stopAllSounds} className="px-4 py-2 bg-red-500 rounded-lg">
          Stop
        </button>

        <button onClick={resetTimer} className="px-4 py-2 bg-blue-500 rounded-lg">
          Reset
        </button>
      </div>

      {/* Alarm */}
      <div className="mt-4 mb-6">
        <label className="block mb-2">⏰ Set Alarm (minutes)</label>
        <input
          type="number"
          value={timer}
          onChange={(e) => setTimer(Math.max(0, e.target.value))}
          className="w-20 p-2 rounded text-black"
        />
        <button
          onClick={startTimer}
          className="ml-2 px-4 py-2 bg-green-500 rounded-lg"
        >
          Start
        </button>
        {remaining > 0 && (
          <p className="mt-2">
            ⏳ Remaining: {Math.floor(remaining / 60)}:
            {String(remaining % 60).padStart(2, "0")}
          </p>
        )}
      </div>

      {/* All Volume Sliders (Horizontal with %) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {sounds.map((s, idx) => (
          <div key={idx} className="flex flex-col items-center bg-gray-600 p-4 rounded-lg">
            <label className="mb-2 font-semibold">{s.name}</label>
            <div className="flex items-center w-full">
              <input
                type="range"
                min="0"
                max="1"
                step="0.01"
                value={volumes[s.name] || 0.0}
                onChange={(e) => changeVolume(s.name, e.target.value)}
                className="w-full accent-blue-500"
              />
              <span className="ml-3 w-12 text-right">
                {Math.round((volumes[s.name] || 0.0) * 100)}%
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
