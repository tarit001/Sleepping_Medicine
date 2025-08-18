import { createContext, useContext, useState } from "react";

const AudioContext = createContext();

export function AudioProvider({ children }) {
  const [isOn, setIsOn] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [stopAll, setStopAll] = useState(false);

  return (
    <AudioContext.Provider value={{
      isOn, setIsOn,
      isPaused, setIsPaused,
      stopAll, setStopAll
    }}>
      {children}
    </AudioContext.Provider>
  );
}

export function useGlobalAudio() {
  return useContext(AudioContext);
}
