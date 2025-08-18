import Home from "./pages/Home";
import { AudioProvider } from "./components/audioContext";

function App() {
  return (
    <AudioProvider>
      <Home />
    </AudioProvider>
  );
}

export default App;
