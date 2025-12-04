import React, { useEffect, useState } from "react";
import { Search, User, LogOut, Image as ImageIcon, Sparkles, ArrowRight, X } from "lucide-react";
import "./index.css"; // Ensure styles are applied

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

  return (
    <div className="app-container animate-fade-in" style={{ width: '100%', maxWidth: '1000px', padding: '2rem' }}>
      <div className="glass-panel" style={{ display: 'grid', gridTemplateColumns: loggedIn ? '1fr' : '1fr 1fr', gap: '2rem', padding: '2rem', minHeight: '600px', transition: 'all 0.5s ease' }}>
        
        {/* Left Side: Login Form / User Profile */}
        <div className="login-section" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          <div style={{ marginBottom: '2rem' }}>
            <h1 style={{ fontSize: '2.5rem', margin: '0 0 0.5rem 0', background: 'linear-gradient(to right, #fff, #94a3b8)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              {loggedIn ? `Welcome back!` : (isRegistering ? 'Claim your GIF' : 'Identify Yourself')}
            </h1>
            <p style={{ color: 'var(--text-muted)' }}>
              {loggedIn ? 'You are authenticated with style.' : 'Your GIF is your username. Choose wisely.'}
            </p>
          </div>

          {!loggedIn ? (
            <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              
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

              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', color: 'var(--text-muted)' }}>Password</label>
                <div style={{ position: 'relative' }}>
                  <div style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }}>🔒</div>
                  <input
                    type="password"
                    className="input-field"
                    style={{ paddingLeft: '40px' }}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your secret code"
                    required
                  />
                </div>
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
          ) : (
            <div className="profile-view animate-fade-in">
              <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', marginBottom: '2rem' }}>
                <div style={{ width: '120px', height: '120px', borderRadius: '20px', overflow: 'hidden', border: '2px solid var(--primary)', boxShadow: '0 0 20px rgba(99, 102, 241, 0.3)' }}>
                  {selectedGif && <img src={selectedGif.url} alt="Avatar" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />}
                </div>
                <div>
                  <h2 style={{ margin: 0, fontSize: '1.8rem' }}>Gif Master</h2>
                  <span style={{ display: 'inline-block', padding: '4px 12px', borderRadius: '20px', background: 'rgba(16, 185, 129, 0.2)', color: '#10b981', fontSize: '0.85rem', marginTop: '0.5rem' }}>
                    ● Online
                  </span>
                </div>
              </div>
              <button onClick={handleLogout} className="btn btn-secondary">
                <LogOut size={18} /> Sign Out
              </button>
            </div>
          )}
        </div>

        {/* Right Side: Decorative or Picker (Desktop) */}
        {!loggedIn && (
          <div className="picker-section" style={{ borderLeft: '1px solid var(--glass-border)', paddingLeft: '2rem', display: 'flex', flexDirection: 'column' }}>
            <div style={{ marginBottom: '1.5rem' }}>
              <h3 style={{ margin: '0 0 0.5rem 0', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Sparkles size={18} color="var(--accent)" /> GIF Gallery
              </h3>
              <div style={{ position: 'relative' }}>
                <Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                <input
                  className="input-field"
                  style={{ paddingLeft: '36px', fontSize: '0.9rem', paddingTop: '8px', paddingBottom: '8px' }}
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search vibes..."
                  onKeyDown={(e) => e.key === 'Enter' && e.preventDefault()}
                />
              </div>
              <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem' }}>
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
            </div>

            <div className="gif-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(100px, 1fr))', gap: '10px', overflowY: 'auto', flex: 1, paddingRight: '8px' }}>
              {loading ? (
                <div style={{ gridColumn: '1/-1', textAlign: 'center', padding: '2rem', color: 'var(--text-muted)' }}>Loading visuals...</div>
              ) : (
                gifs.map((g) => (
                  <div 
                    key={g.id} 
                    onClick={() => { setSelectedGif(g); setShowPicker(false); }}
                    style={{ 
                      borderRadius: '8px', 
                      overflow: 'hidden', 
                      cursor: 'pointer', 
                      height: '100px', 
                      border: selectedGif?.id === g.id ? '2px solid var(--primary)' : '2px solid transparent',
                      transition: 'transform 0.2s'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
                    onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
                  >
                    <img src={g.preview || g.url} alt="gif" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  </div>
                ))
              )}
            </div>
          </div>
        )}
      </div>

      {/* Mobile Picker Modal */}
      {showPicker && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(5px)', zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
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
              />
              <button 
                onClick={() => searchGifs(query)}
                style={{ position: 'absolute', right: '8px', top: '50%', transform: 'translateY(-50%)', background: 'var(--primary)', border: 'none', borderRadius: '8px', padding: '4px 12px', color: 'white', cursor: 'pointer' }}
              >
                Go
              </button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px', overflowY: 'auto', flex: 1 }}>
              {gifs.map((g) => (
                <div key={g.id} onClick={() => { setSelectedGif(g); setShowPicker(false); }} style={{ borderRadius: '8px', overflow: 'hidden', height: '100px' }}>
                  <img src={g.preview || g.url} alt="gif" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
