import React, { useState, useRef, useEffect } from 'react';

export default function MerguezAuth({ onUpdate }) {
  const [count, setCount] = useState(5);
  const [times, setTimes] = useState(Array(5).fill(0));
  const [isVeggie, setIsVeggie] = useState(false);
  
  // Update times array when count changes
  useEffect(() => {
    setTimes(prev => {
      if (prev.length === count) return prev;
      const newTimes = Array(count).fill(0);
      // Preserve existing times if possible
      for(let i=0; i<Math.min(prev.length, count); i++) newTimes[i] = prev[i];
      return newTimes;
    });
  }, [count]);

  // Notify parent whenever times change
  useEffect(() => {
    onUpdate(times);
  }, [times, onUpdate]);

  return (
    <div style={{ width: '100%', padding: '1rem', background: '#222', borderRadius: '12px', color: '#eee' }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '1rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h3 style={{ margin: 0, fontSize: '1rem', color: isVeggie ? '#FF9999' : '#ff7a4d' }}>
            {isVeggie ? '🐟 Salmon Grill' : '🌭 Merguez Party'}
          </h3>
          <button 
            type="button"
            onClick={() => setIsVeggie(!isVeggie)}
            style={{ background: 'rgba(255,255,255,0.1)', border: 'none', color: 'white', padding: '4px 8px', borderRadius: '4px', cursor: 'pointer', fontSize: '0.8rem' }}
          >
            {isVeggie ? 'Switch to Merguez' : 'Switch to Salmon'}
          </button>
        </div>

        {/* SLIDER CONTROL */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', background: 'rgba(0,0,0,0.3)', padding: '8px', borderRadius: '8px' }}>
          <span style={{ fontSize: '0.8rem', whiteSpace: 'nowrap' }}>Count: {count}</span>
          <input 
            type="range" 
            min="5" 
            max="50" 
            value={count} 
            onChange={(e) => setCount(parseInt(e.target.value))}
            style={{ width: '100%', accentColor: isVeggie ? '#FF9999' : '#ff7a4d' }}
          />
        </div>
      </div>

      <div id="barbecue" style={{
        width: '100%',
        height: '200px',
        borderRadius: '6px',
        position: 'relative',
        background: 'linear-gradient(180deg,#0f0f0f 0,#161616 100%)',
        boxShadow: 'inset 0 6px 20px rgba(0,0,0,.7)',
        padding: '20px',
        marginBottom: '1rem',
        overflowX: 'auto', // Scroll container
        overflowY: 'hidden'
      }}>
        {/* Inner wrapper that grows with content */}
        <div style={{ position: 'relative', minWidth: 'max-content', height: '100%', padding: '0 20px' }}>
          
          {/* Rails - Absolute to the inner wrapper */}
          <div className="rails" style={{
            position: 'absolute', left: 0, right: 0, top: 0, bottom: 0, display: 'flex', flexDirection: 'column', justifyContent: 'space-around', padding: '20px 0', zIndex: 1
          }}>
            {[...Array(5)].map((_, i) => (
              <div key={i} className="rail" style={{
                height: '6px', borderRadius: '999px', background: 'linear-gradient(90deg,#555,#777,#555)', boxShadow: '0 2px 8px rgba(0,0,0,.6) inset', margin: '0'
              }} />
            ))}
          </div>
          
          {/* Items - On top of rails */}
          <div style={{ display: 'flex', gap: '10px', position: 'relative', zIndex: 2, height: '100%' }}>
            {times.map((time, index) => (
              <Merguez key={index} id={index} isVeggie={isVeggie} onStop={(t) => {
                setTimes(prev => {
                  const newTimes = [...prev];
                  newTimes[index] = t;
                  return newTimes;
                });
              }} />
            ))}
          </div>
        </div>
      </div>
      
      <div style={{ textAlign: 'center', fontSize: '0.8rem', color: '#aaa', marginTop: '10px' }}>
        ⚠️ Retenez bien la cuisson de vos {isVeggie ? 'pavés de saumon' : 'merguez'} pour vous reconnecter !
      </div>
    </div>
  );
}

function Merguez({ id, onStop, isVeggie }) {
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
  
  let r, g, b, texture;
  
  if (isVeggie) {
    // SALMON: Pink (#FF9999) to Cooked Pink/Brown (#D48872) to Burnt (#333)
    // Start: 255, 153, 153
    // End: 50, 30, 30
    r = Math.floor(255 - (205 * t));
    g = Math.floor(153 - (123 * t));
    b = Math.floor(153 - (123 * t));
    
    // Salmon texture: Realistic orange-pink with white fat stripes
    texture = `
      repeating-linear-gradient(-45deg, 
        rgba(255,255,255,0.3) 0px, 
        rgba(255,255,255,0.3) 1px, 
        transparent 2px, 
        transparent 12px
      ),
      linear-gradient(90deg, rgba(255,255,255,0.2) 0%, transparent 40%, rgba(0,0,0,0.2) 100%)
    `;
  } else {
    // MERGUEZ: Orange (#ff7a4d) to Black
    r = Math.floor(255 * (1 - t));
    g = Math.floor(122 * (1 - t));
    b = Math.floor(77 * (1 - t));
    
    texture = `
      linear-gradient(90deg, rgba(255,255,255,0.4) 0%, transparent 40%, rgba(0,0,0,0.3) 100%),
      repeating-linear-gradient(180deg, transparent, transparent 30px, rgba(0,0,0,0.2) 32px, rgba(0,0,0,0.3) 35px),
      radial-gradient(circle at 30% 20%, rgba(255,255,255,0.3) 1px, transparent 2px),
      radial-gradient(circle at 70% 60%, rgba(255,255,255,0.3) 1px, transparent 2px)
    `;
  }

  const color = `rgb(${r},${g},${b})`;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', height: '100%', justifyContent: 'space-between', flexShrink: 0 }}>
      <div style={{
        width: isVeggie ? '45px' : '26px', // Merguez slightly thinner
        height: isVeggie ? '80%' : '130%', // Merguez EVEN LONGER
        marginTop: isVeggie ? '10%' : '-15%', // Center vertically
        borderRadius: isVeggie ? '4px' : '999px',
        backgroundColor: color,
        backgroundImage: texture,
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
            style={{ background: isVeggie ? '#FF9999' : '#ff7a4d', border: 'none', borderRadius: '4px', padding: '4px 8px', cursor: 'pointer', fontSize: '0.7rem', color: isVeggie ? '#333' : 'white' }}
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
