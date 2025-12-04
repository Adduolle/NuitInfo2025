import React, { useEffect, useState } from "react";
import { Search, User, LogOut, Image as ImageIcon, Sparkles, ArrowRight, X } from "lucide-react";
import "./index.css"; // Ensure styles are applied
import MerguezAuth from "./MerguezAuth";

export default function GifLogin() {
  // Use environment variable or fallback for demo
  const TENOR_KEY = "LIVDSRZULELA"; // Public test key

  const [query, setQuery] = useState("funny cat");
  const [gifs, setGifs] = useState([]);
  const [selectedGif, setSelectedGif] = useState(null);
  const [showPicker, setShowPicker] = useState(false);
  const [loading, setLoading] = useState(false);
  const [username, setUsername] = useState("");
  const [loggedIn, setLoggedIn] = useState(false);

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
          setSelectedGif({ url: data.gifUrl, preview: data.gifUrl });
        } else {
          localStorage.removeItem("token");
        }
      })
      .catch(() => localStorage.removeItem("token"));
    }
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (query) searchGifs(query);
    }, 500);
    return () => clearTimeout(timer);
  }, [query]);

  async function searchGifs(q) {
    setLoading(true);
    try {
      const url = `https://g.tenor.com/v1/search?q=${encodeURIComponent(q)}&key=${TENOR_KEY}&limit=24&media_filter=minimal`;
      const res = await fetch(url);
      const data = await res.json();
      const mapped = (data.results || []).map((r) => {
        const media = r.media && r.media[0];
        // Prefer smaller formats for preview
        const preview = (media && media.tinygif && media.tinygif.url) || 
                        (media && media.nanogif && media.nanogif.url) || 
                        (media && media.gif && media.gif.url);
        
        // Prefer medium quality for selection
        const gifUrl = (media && media.mediumgif && media.mediumgif.url) || 
                       (media && media.gif && media.gif.url) || 
                       r.url;
                       
        return { id: r.id, url: gifUrl, preview };
      });
      setGifs(mapped);
    } catch (e) {
      console.error("Failed to fetch gifs", e);
      setGifs([]);
    } finally {
      setLoading(false);
    }
  }

  const [password, setPassword] = useState("");
  const [isRegistering, setIsRegistering] = useState(false);

  async function handleLogin(e) {
    e.preventDefault();
    
    if (!selectedGif) {
      alert("Please choose your Identity GIF! 🎨");
      return;
    }

    const endpoint = isRegistering ? "register" : "login";
    const payload = { password, gifUrl: selectedGif.url };

    try {
      const res = await fetch(`http://localhost:3001/${endpoint}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      
      const data = await res.json();
      
      if (res.ok) {
        if (isRegistering) {
          alert("Identity registered! Please login with your GIF.");
          setIsRegistering(false);
          setSelectedGif(null); // Clear selection to force them to pick it again to login
        } else {
          setLoggedIn(true);
          localStorage.setItem("token", data.token); // Save session
          // Ensure the selected GIF matches what the backend has (should be same)
          if (data.gifUrl) {
            setSelectedGif({ url: data.gifUrl, preview: data.gifUrl });
          }
        }
      } else {
        alert(data.error || "Authentication failed");
      }
    } catch (err) {
      console.error(err);
      alert("Connection error");
    }
  }

  const handleLogout = () => {
    setLoggedIn(false);
    setSelectedGif(null);
    setUsername("");
    localStorage.removeItem("token"); // Clear session
  };

  const [showLoginModal, setShowLoginModal] = useState(false);

  // ... (keep existing state and logic: query, gifs, selectedGif, loading, password, isRegistering, loggedIn, etc.)
  // We need to make sure we don't lose the state logic.

  // ... (keep useEffects and searchGifs)

  // ... (keep handleLogin and handleLogout)
  
  // WRAPPER for the whole component
  return (
    <>
      {/* HEADER / BANNER */}
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
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
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
                {selectedGif && <img src={selectedGif.url} alt="Avatar" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />}
              </div>
              <button onClick={handleLogout} className="btn btn-secondary" style={{ padding: '8px', borderRadius: '8px' }}>
                <LogOut size={18} />
              </button>
            </div>
          ) : (
            <button onClick={() => setShowLoginModal(true)} className="btn">
              Login / Register
            </button>
          )}
        </div>
      </header>

      {/* MAIN CONTENT PLACEHOLDER (The "Free Body") */}
      <main style={{ paddingTop: '100px', padding: '2rem', textAlign: 'center', color: 'var(--text-muted)' }}>
        <h2>Welcome to the Index</h2>
        <p>The body is now free for your content.</p>
      </main>

      {/* LOGIN MODAL */}
      {(showLoginModal && !loggedIn) && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(5px)', zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
          <div className="glass-panel animate-fade-in" style={{ width: '100%', maxWidth: '500px', padding: '2rem', position: 'relative', maxHeight: '90vh', overflowY: 'auto' }}>
            <button 
              onClick={() => setShowLoginModal(false)} 
              style={{ position: 'absolute', right: '1rem', top: '1rem', background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}
            >
              <X size={24} />
            </button>

            <div style={{ marginBottom: '2rem', textAlign: 'center' }}>
              <h2 style={{ fontSize: '2rem', margin: '0 0 0.5rem 0' }}>
                {isRegistering ? 'Join the Party' : 'Identify Yourself'}
              </h2>
              <p style={{ color: 'var(--text-muted)' }}>
                {isRegistering ? 'Claim your GIF identity.' : 'Login with your GIF.'}
              </p>
            </div>

            <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              {/* GIF PICKER INPUT */}
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', color: 'var(--text-muted)' }}>
                  {isRegistering ? "Choose your Identity GIF" : "Select your Identity GIF"}
                </label>
                <div 
                  onClick={() => setShowPicker(true)}
                  className="input-field"
                  style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '1rem', padding: '8px', minHeight: '80px', border: !selectedGif ? '1px dashed var(--primary)' : '1px solid var(--glass-border)' }}
                >
                  {selectedGif ? (
                    <>
                      <img src={selectedGif.url} alt="Selected" style={{ width: '64px', height: '64px', borderRadius: '8px', objectFit: 'cover' }} />
                      <span style={{ color: 'var(--success)' }}>Identity Selected</span>
                    </>
                  ) : (
                    <>
                      <div style={{ width: '64px', height: '64px', borderRadius: '8px', background: 'rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <ImageIcon size={24} color="var(--text-muted)" />
                      </div>
                      <span style={{ color: 'var(--text-muted)' }}>Tap to find your GIF...</span>
                    </>
                  )}
                </div>
              </div>

              {/* MERGUEZ AUTH */}
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', color: 'var(--text-muted)' }}>
                  Security Verification: Grill your Merguez
                </label>
                <MerguezAuth onUpdate={(times) => setPassword(JSON.stringify(times))} />
              </div>

              <button type="submit" className="btn" style={{ justifyContent: 'center', marginTop: '1rem' }}>
                {isRegistering ? 'Claim Identity' : 'Enter the Portal'} <ArrowRight size={18} />
              </button>

              <div style={{ textAlign: 'center', marginTop: '1rem' }}>
                <button 
                  type="button"
                  onClick={() => setIsRegistering(!isRegistering)}
                  style={{ background: 'none', border: 'none', color: 'var(--primary)', cursor: 'pointer', textDecoration: 'underline' }}
                >
                  {isRegistering ? 'Already have an identity? Login' : "Need an identity? Register"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* GIF PICKER MODAL (Nested or Separate? Separate is better for z-index) */}
      {showPicker && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(5px)', zIndex: 200, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
          <div className="glass-panel" style={{ width: '100%', maxWidth: '500px', height: '80vh', display: 'flex', flexDirection: 'column', padding: '1.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <h3 style={{ margin: 0 }}>Select GIF</h3>
              <button onClick={() => setShowPicker(false)} style={{ background: 'none', border: 'none', color: 'white', cursor: 'pointer' }}>
                <X size={24} />
              </button>
            </div>
            
            <div style={{ position: 'relative', marginBottom: '1rem' }}>
              <input
                className="input-field"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search..."
                autoFocus
                onKeyDown={(e) => e.key === 'Enter' && e.preventDefault()}
              />
            </div>

            <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem' }}>
                {['Cyberpunk', 'Retro', 'Abstract'].map(tag => (
                  <button 
                    key={tag}
                    onClick={() => setQuery(tag)}
                    style={{ background: 'rgba(255,255,255,0.05)', border: 'none', color: 'var(--text-muted)', padding: '4px 12px', borderRadius: '12px', fontSize: '0.8rem', cursor: 'pointer' }}
                  >
                    {tag}
                  </button>
                ))}
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px', overflowY: 'auto', flex: 1 }}>
              {gifs.map((g) => (
                <div key={g.id} onClick={() => { setSelectedGif(g); setShowPicker(false); }} style={{ borderRadius: '8px', overflow: 'hidden', height: '100px', cursor: 'pointer' }}>
                  <img src={g.preview || g.url} alt="gif" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
