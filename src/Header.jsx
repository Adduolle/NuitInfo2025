import React, { useEffect, useState } from "react";
import { Sparkles, LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function Header() {
  const navigate = useNavigate();
  const [loggedIn, setLoggedIn] = useState(false);
  const [userGif, setUserGif] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      fetch("http://localhost:3001/verify", {
        headers: { Authorization: `Bearer ${token}` }
      })
      .then(res => res.json())
      .then(data => {
        if (data.gifUrl) {
          setLoggedIn(true);
          setUserGif(data.gifUrl);
        } else {
          localStorage.removeItem("token");
        }
      })
      .catch(() => localStorage.removeItem("token"));
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    setLoggedIn(false);
    setUserGif(null);
    navigate('/');
  };

  return (
    <header style={{ 
      position: 'fixed', 
      top: 0, 
      left: 0, 
      right: 0, 
      height: '80px', 
      background: 'rgba(15, 23, 42, 0.8)', 
      backdropFilter: 'blur(12px)', 
      borderBottom: '1px solid var(--glass-border)', 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'space-between', 
      padding: '0 2rem', 
      zIndex: 50 
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', cursor: 'pointer' }} onClick={() => navigate('/')}>
        <Sparkles size={24} color="var(--primary)" />
        <h1 style={{ fontSize: '1.5rem', margin: 0, background: 'linear-gradient(to right, #fff, #94a3b8)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
          GifLogin
        </h1>
      </div>

      <div>
        {loggedIn ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div style={{ textAlign: 'right', display: 'none', md: 'block' }}>
              <div style={{ fontWeight: 'bold', fontSize: '0.9rem' }}>Gif Master</div>
              <div style={{ fontSize: '0.8rem', color: 'var(--success)' }}>● Online</div>
            </div>
            <div style={{ width: '40px', height: '40px', borderRadius: '10px', overflow: 'hidden', border: '2px solid var(--primary)' }}>
              {userGif && <img src={userGif} alt="Avatar" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />}
            </div>
            <button onClick={handleLogout} className="btn btn-secondary" style={{ padding: '8px', borderRadius: '8px' }}>
              <LogOut size={18} />
            </button>
          </div>
        ) : (
          <button onClick={() => navigate('/login')} className="btn">
            Login
          </button>
        )}
      </div>
    </header>
  );
}
