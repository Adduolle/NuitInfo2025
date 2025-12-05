import { useState } from "react";
import "./index.css";
import "./css/Explosion.css";

export default function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const [fieldEffect, setFieldEffect] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const [showModal, setShowModal] = useState(false);


  const triggerEffect = (field) => {
    const effects = [
        "invert",      // inversion des couleurs
        "rotate",      // rotation de la page
        "scale",       // zoom in/out
        "shake",       // tremblement
        "bgflash",     // flash du fond
    ];

    const effect = effects[Math.floor(Math.random() * effects.length)];

    setFieldEffect(prev => ({ ...prev, [field]: effect }));

    // Effet temporaire : reset après 500ms
    setTimeout(() => {
        setFieldEffect(prev => ({ ...prev, [field]: "" }));
    }, 10000);
    };

  const [showPopup, setShowPopup] = useState(false);

  const [explosions, setExplosions] = useState([]);


  // Gérer les changements dans les champs
  const handleChange = (e) => {

    let nb = Math.floor(Math.random() * 4);
    
    if (nb === 0) {
        var audio = new Audio("../public/b1.mp3");
        audio.play();
    } else if (nb === 1) {
        var audio = new Audio("../public/b2.mp3");
        audio.play();
    } else if (nb === 2) {
        var audio = new Audio("../public/b3.mp3");
        audio.play();
    } else if (nb === 3) {
        var audio = new Audio("../public/b4.mp3");
        audio.play();
    } else {
        var audio = new Audio("../public/b4.mp3");
        audio.play();
    }

    const x = window.innerWidth / 6;
    const y = window.innerHeight / 4;

    const id = Date.now(); // Identifiant unique
    const particles = [];

    const numParticles = 50;
    const images = ["../public/44ece5832cc7156507f913536b52ef79.jpg", "../public/imageAAAA.jpg", "../public/images.jpg", "../public/{C4E76388-CDF3-4578-876D-36538B8961FF}.png"];
    for (let i = 0; i < numParticles; i++) {
      const angle = (2 * Math.PI * i) / numParticles;
      const radius = Math.random() * 1000;
      const particleX = x + radius * Math.cos(angle);
      const particleY = y + radius * Math.sin(angle);
      const img = images[Math.floor(Math.random() * images.length)];

      particles.push({ x: particleX, y: particleY, img, id: i });
    }

    setExplosions((prev) => [...prev, { id, particles }]);

    setTimeout(() => {
      setExplosions((prev) => prev.filter((exp) => exp.id !== id));
    }, 3000);
    
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubjectChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    e.target.blur();
    

    // Afficher le modal
    setShowModal(true);

    var audio = new Audio("../public/boom.mp3");
    audio.play();

    // Fermer automatiquement après 2 secondes
    setTimeout(() => {
        setShowModal(false);
        e.target.focus();
    }, 1000);
  };


    const handleMessageChange = (e) => {
        let nb = Math.floor(Math.random() * 3);
        if(nb === 1) {
            triggerEffect("message");
        }
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

  // Gérer l'envoi du formulaire
  const handleSubmit = (e) => {
    e.preventDefault();

    // Ici, tu peux envoyer les données au serveur si nécessaire
    console.log("Form submitted:", formData);

    // Afficher le popup
    setShowPopup(true);

    // Réinitialiser le formulaire
    setFormData({ name: "", email: "", subject: "", message: "" });

    // Masquer le popup après 3 secondes
    setTimeout(() => setShowPopup(false), 6000);
  };

  return (
    <div className={`contact-container ${fieldEffect.subject} ${fieldEffect.message}`} style={{ width: "500px", margin: "0 auto", padding: "2rem" }}>
      <h1>Contactez-nous</h1>
      <form onSubmit={handleSubmit} className="contact-form" style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
        <input
          className="inputContact"
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          placeholder="Nom"
          required
          
        />
        {explosions.map((explosion) => (
                <div key={explosion.id} className="explosion">
                {explosion.particles.map((p) => (
                    <img
                        key={p.id}
                        src={p.img}
                        alt="particle"
                        style={{
                        position: "absolute",
                        top: p.y,
                        left: p.x,
                        width: "100px",
                        height: "100px",
                        pointerEvents: "none",
                        animation: "pop 3s forwards"
                        }}
                    />
                    ))}
                </div>
            ))}
        <input
          type="email"
          className="inputContact"
          name="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="Email"
          required
        />
        <input
          type="text"
          className="inputContact"
          name="subject"
          value={formData.subject}
          onChange={handleSubjectChange}
          placeholder="Sujet"
          required
        />
        <textarea
          name="message"
          className="inputContact"
          value={formData.message}
          onChange={handleMessageChange}
          placeholder="Message"
          rows="5"
          required
        />
        <button type="submit" style={{ padding: "0.5rem 1rem", cursor: "pointer" }}>Envoyer</button>
      </form>

      {showModal && (
        <div
            className="modal-overlay"
            style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            backgroundColor: "rgba(0,0,0,0.7)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 1000,
            }}
        >

            
            <div
            className="modal-content"
            style={{
                position: "relative",
                backgroundColor: "#fff",
                padding: "1rem",
                borderRadius: "10px",
                boxShadow: "0 5px 15px rgba(0,0,0,0.3)",
                maxWidth: "400px",
                textAlign: "center",
            }}
            >
            <img
                src="../public/{C4E76388-CDF3-4578-876D-36538B8961FF}.png" // mets ton image ici
                alt="Modal"
                style={{ width: "100%", borderRadius: "10px" }}
            />
            </div>
        </div>
        )}


      {showPopup && (
  <div
    className="popup-tv"
    style={{
      position: "fixed",
      top: 0,
      left: 0,
      width: "100vw",
      height: "100vh",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      background: "rgba(0,0,0,0.8)",
      zIndex: 9999,
      animation: "shake 0.3s infinite",
    }}
  >
    <div
      style={{
        border: "4px solid #ff00ff",
        borderRadius: "10px",
        width: "70vw",
        height: "70vh",
        overflow: "hidden",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        background: "#000",
        boxShadow: "0 0 40px #ff00ff",
      }}
    >
      <img
        src="https://media.giphy.com/media/Ju7l5y9osyymQ/giphy.gif"
        alt="funny gif"
        style={{ width: "100%", height: "100%", objectFit: "cover" }}
      />
    </div>

    <button
      onClick={() => setShowPopup(false)}
      style={{
        position: "absolute",
        bottom: "30px",
        padding: "15px 20px",
        background: "red",
        color: "#fff",
        border: "none",
        borderRadius: "10px",
        cursor: "pointer",
        fontWeight: "bold",
        fontSize: "18px",
      }}
    >
      BBBBBBBBBBBBBBBBBIIIIIIIIIIIEEEEEEEEEEEEEENNNNNNNNNNNNNNNNNN JJJJJJJJJJJJJJJJJJJOOOOOOOOOOOOOOOUUUUUUUUUUUUUUUUUÉÉÉÉÉÉÉÉÉÉÉÉ !!!
    </button>

    <style>{`
      @keyframes shake {
        0% { transform: translate(0px, 0px); }
        20% { transform: translate(-5px, 3px); }
        40% { transform: translate(6px, -4px); }
        60% { transform: translate(-3px, 5px); }
        80% { transform: translate(4px, -3px); }
        100% { transform: translate(0px, 0px); }
      }
    `}</style>
  </div>
)}



      {/* Animation simple pour le popup */}
      <style>{`
        @keyframes popup-animation {
          0% { transform: translateY(-20px); opacity: 0; }
          100% { transform: translateY(0); opacity: 1; }
        } 
      `}</style>

    <footer className="section footer-classic context-dark bg-image">
        <div className="row no-gutters social-container">
          <div className="col"><div className="social-inner" ><span className="icon mdi mdi-facebook"></span><span>Adrien Duolle</span></div></div>
          <div className="col"><div className="social-inner" ><span className="icon mdi mdi-instagram"></span><span>Titouan Hinschberger</span></div></div>
          <div className="col"><div className="social-inner" ><span className="icon mdi mdi-twitter"></span><span>Bastien Teisseire</span></div></div>
          <div className="col"><div className="social-inner" ><span className="icon mdi mdi-youtube-play"></span><span>Lucas Lamisse</span></div></div>
          <div className="col"><div className="social-inner" ><span className="icon mdi mdi-youtube-play"></span><span>Gabriel Beltzer</span></div></div>
        </div>
    </footer>
    </div>
  );
}

function rand(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
