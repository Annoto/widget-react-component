import './App.css';
import VideoJS from './video/VideoJS.jsx';

function App() {
  const options = {
    width: 600,
    height: 400,
    controls: true,
    autoplay: false,
    preload: "none"
  };

  return (
    <div className="App">
      <VideoJS options={options} />
    </div>
  );
}

export default App;
