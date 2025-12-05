import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import Spawn from './Spawn.jsx'

const App = () => {
  return (
    <>
      <canvas id="three-canvas"></canvas>
    </>
  );
};

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Spawn />
    <App />
  </StrictMode>
);
