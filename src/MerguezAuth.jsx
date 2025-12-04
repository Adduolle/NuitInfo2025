import React, { useState, useRef, useEffect } from 'react';

export default function MerguezAuth({ onUpdate }) {
  const [times, setTimes] = useState([0, 0, 0, 0, 0]);
  
  // Notify parent whenever times change
  useEffect(() => {
    onUpdate(times);
  }, [times, onUpdate]);

  return (
    <div style={{ width: '100%', padding: '1rem', background: '#222', borderRadius: '12px', color: '#eee' }}>
      <div id="barbecue" style={{
        width: '100%',
        height: '200px',
        borderRadius: '6px',
        position: 'relative',
        background: 'linear-gradient(180deg,#0f0f0f 0,#161616 100%)',
        boxShadow: 'inset 0 6px 20px rgba(0,0,0,.7)',
        padding: '20px',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: '1rem'
      }}>
        <div className="rails" style={{
          position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', justifyContent: 'space-around', padding: '20px 0', zIndex: 1
        }}>
          {[...Array(5)].map((_, i) => (
            <div key={i} className="rail" style={{
              height: '6px', borderRadius: '999px', background: 'linear-gradient(90deg,#555,#777,#555)', boxShadow: '0 2px 8px rgba(0,0,0,.6) inset', margin: '0 20px'
            }} />
          ))}
        </div>
        
        <div style={{ display: 'flex', justifyContent: 'space-around', width: '100%', zIndex: 2, height: '100%' }}>
          {times.map((time, index) => (
            <Merguez key={index} id={index} onStop={(t) => {
              const newTimes = [...times];
              newTimes[index] = t;
              setTimes(newTimes);
            }} />
          ))}
        </div>
      </div>
      
      <div style={{ textAlign: 'center', fontSize: '0.8rem', color: '#aaa', marginTop: '10px' }}>
        ⚠️ Retenez bien la cuisson de vos merguez pour vous reconnecter !
      </div>
    </div>
  );
}

function Merguez({ id, onStop }) {
  const [grilling, setGrilling] = useState(false);
  const [elapsed, setElapsed] = useState(0);
  const requestRef = useRef();
  const startTimeRef = useRef();

  const animate = time => {
    if (!startTimeRef.current) startTimeRef.current = time;
    const deltaTime = (time - startTimeRef.current) / 1000;
    
    // Cap at 10 seconds
    const currentElapsed = Math.min(deltaTime, 10);
    setElapsed(currentElapsed);

    if (currentElapsed < 10) {
      requestRef.current = requestAnimationFrame(animate);
    } else {
      setGrilling(false);
      onStop(10);
    }
  };

  const startGrilling = () => {
    setGrilling(true);
    setElapsed(0);
    startTimeRef.current = null;
    requestRef.current = requestAnimationFrame(animate);
  };

  const stopGrilling = () => {
    setGrilling(false);
    cancelAnimationFrame(requestRef.current);
    onStop(Math.floor(elapsed));
  };

  // Calculate color
  const t = Math.min(elapsed / 10, 1);
  const r = Math.floor(255 * (1 - t));
  const g = Math.floor(122 * (1 - t));
  const b = Math.floor(77 * (1 - t));
  const color = `rgb(${r},${g},${b})`;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', height: '100%', justifyContent: 'space-between' }}>
      <div style={{
        width: '34px',
        height: '100%',
        borderRadius: '17px',
        backgroundColor: color,
        backgroundImage: `
          linear-gradient(90deg, rgba(255,255,255,0.4) 0%, transparent 40%, rgba(0,0,0,0.3) 100%),
          repeating-linear-gradient(180deg, transparent, transparent 30px, rgba(0,0,0,0.2) 32px, rgba(0,0,0,0.3) 35px),
          radial-gradient(circle at 30% 20%, rgba(255,255,255,0.3) 1px, transparent 2px),
          radial-gradient(circle at 70% 60%, rgba(255,255,255,0.3) 1px, transparent 2px)
        `,
        transition: 'background-color 0.1s linear',
        boxShadow: 'inset -2px -2px 6px rgba(0,0,0,0.3), 2px 4px 8px rgba(0,0,0,0.4)',
        transform: `rotate(${id % 2 === 0 ? '1deg' : '-1deg'}) scaleY(0.98)`,
        border: '1px solid rgba(0,0,0,0.1)'
      }} />
      
      <div style={{ marginTop: '10px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '5px' }}>
        <span style={{ fontSize: '0.7rem', fontWeight: 'bold' }}>#{id + 1}</span>
        <div style={{ fontSize: '0.9rem', fontFamily: 'monospace' }}>{Math.floor(elapsed)}s</div>
        {!grilling ? (
          <button 
            type="button"
            onClick={startGrilling}
            style={{ background: '#ff7a4d', border: 'none', borderRadius: '4px', padding: '4px 8px', cursor: 'pointer', fontSize: '0.7rem', color: 'white' }}
          >
            Grill
          </button>
        ) : (
          <button 
            type="button"
            onClick={stopGrilling}
            style={{ background: '#555', border: 'none', borderRadius: '4px', padding: '4px 8px', cursor: 'pointer', fontSize: '0.7rem', color: 'white' }}
          >
            Stop
          </button>
        )}
      </div>
    </div>
  );
}
