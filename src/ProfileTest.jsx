import React, { useState } from "react";

export default function Profile() {
  const [userData] = useState({
    gifUrl: "https://media.giphy.com/media/3oEjI6SIIHBdRxXI40/giphy.gif",
    username: "Toto123",
    description: "Lorem ipsum dolor sit amet",
    score: 42
  });

  // Talents
  const [skills, setSkills] = useState(["Python", "React"]);
  const [softSkills, setSoftSkills] = useState(["Communication"]);
  const [projects, setProjects] = useState(["Portfolio"]);
  const [passions, setPassions] = useState(["Musique"]);

  const [newSkill, setNewSkill] = useState("");
  const [newSoft, setNewSoft] = useState("");
  const [newProject, setNewProject] = useState("");
  const [newPassion, setNewPassion] = useState("");

  const removeItem = (list, setList, index) => {
    const newList = [...list];
    newList.splice(index, 1);
    setList(newList);
  };

  return (
    <div className="min-h-screen" style={{ padding: "2rem" }}>

        <div style={{ display: "flex", flexDirection: "row", gap: "2rem", justifyContent: "center" }}>

            {/* === Bloc de gauche : Profil === */}
            <div
            className="glass-panel animate-fade-in"
            style={{
                backgroundColor: "rgba(15,23,42,0.55)",
                padding: "3rem",
                borderRadius: "20px",
                width: "450px"
            }}
            >
                {/* Titre */}
                <h1 style={{ fontSize: "1.75rem", textAlign: "center", marginBottom: "2rem" }}>Mon Profil (Test)</h1>

                {/* GIF + Username */}
                <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "1rem", marginBottom: "2rem" }}>
                <img src={userData.gifUrl} alt="Mon identité" style={{ width: "110px", height: "110px", borderRadius: "12px", flexShrink: 0 }} />
                <h2 style={{ fontSize: "1.5rem", fontWeight: 600, margin: 0 }}>{userData.username}</h2>
                </div>

                {/* Info box */}
                <div className="glass-panel mb-8" style={{ backgroundColor: "rgba(15,23,42,0.45)", padding: "2rem", borderRadius: "20px" }}>
                <p style={{ marginBottom: "1rem" }}><strong>Score :</strong> {userData.score}</p>
                <p><strong>Description :</strong> {userData.description}</p>
                </div>

                {/* Champ de modification */}
                <div
                    style={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        justifyContent: "center",
                    }}
                >
                <h3 style={{ marginBottom: "0.5rem" }}>Modifier la description :</h3>
                <input
                    type="text"
                    value={userData.description}
                    readOnly
                    className="input-field mb-3"
                    style={{ padding: "0.5rem", width: "100%" }}
                />
                <button className="btn btn-secondary" disabled
                    style={{ margin : "0.5em" }}
                >
                    Mettre à jour
                </button>
                <p style={{ fontSize: "0.9rem", color: "#94a3b8", marginTop: "0.5rem" }}>
                    (Mode test : modification inactive)
                </p>
                </div>

                {/* Stats des mini-jeu */}
                <div
                    style={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        justifyContent: "center",
                    }}
                >
                <h3 style={{ marginBottom: "0.5rem" }}>Statistique de vos mini-jeux :</h3>
                <span style={{ flexDirection: "row", display: "flex", gap: "2rem", marginBottom: "1rem" }}>
                    <p>
                        <strong>Mairie : </strong> 1/1
                    </p>
                    <p>
                        <strong>Ecole : </strong> 1/1
                    </p>
                </span>
                <span style={{ flexDirection: "row", display: "flex", gap: "2rem", marginBottom: "1rem" }}>
                    <p>
                        <strong>Magasin  : </strong> 1/1
                    </p>
                    <p>
                        <strong>Bureau : </strong> 1/1
                    </p>
                </span>
                </div>
            </div>

            {/* === Bloc de droite : Talents === */}
            <div
            className="glass-panel"
            style={{
                backgroundColor: "rgba(15,23,42,0.35)",
                padding: "2rem",
                borderRadius: "20px",
                width: "450px",
                maxHeight: "90vh",
                overflowY: "auto"
            }}
            >
            <h2 style={{ fontSize: "1.5rem", marginBottom: "1rem", textAlign: "center" }}>
                Talents interactifs
            </h2>

            {/* Talents interactifs */}
                <div
                style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    gap: "0.7rem",     // avant : 1.5rem
                    marginBottom: "1rem" // avant : 2rem
                }}
                >
                {/* Skills */}
                <div>
                    <h3>Compétences :</h3>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
                    {skills.map((s, i) => (
                        <span key={i} style={{ backgroundColor: "#6366f1", color: "white", padding: "0.3rem 0.6rem", borderRadius: "8px", display: "flex", alignItems: "center", gap: "0.3rem" }}>
                        {s}
                        <button onClick={() => removeItem(skills, setSkills, i)} style={{ background: "transparent", border: "none", color: "white", cursor: "pointer" }}>✕</button>
                        </span>
                    ))}
                    </div>
                    <input type="text" value={newSkill} onChange={(e) => setNewSkill(e.target.value)} placeholder="Ajouter une compétence" style={{ marginTop: "0.5rem", padding: "0.3rem 0.5rem" }} />
                    <button onClick={() => { if(newSkill.trim()!==""){ setSkills([...skills,newSkill.trim()]); setNewSkill(""); }}} style={{ marginLeft:"0.3rem", padding:"0.3rem 0.6rem" }}>Ajouter</button>
                </div>

                {/* Soft Skills */}
                <div>
                    <h3>Soft Skills :</h3>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
                    {softSkills.map((s,i)=>(
                        <span key={i} style={{ backgroundColor:"#8b5cf6", color:"white", padding:"0.3rem 0.6rem", borderRadius:"8px", display:"flex", alignItems:"center", gap:"0.3rem" }}>
                        {s}
                        <button onClick={()=>removeItem(softSkills,setSoftSkills,i)} style={{ background:"transparent", border:"none", color:"white", cursor:"pointer" }}>✕</button>
                        </span>
                    ))}
                    </div>
                    <input type="text" value={newSoft} onChange={(e)=>setNewSoft(e.target.value)} placeholder="Ajouter un soft skill" style={{ marginTop:"0.5rem", padding:"0.3rem 0.5rem" }} />
                    <button onClick={()=>{ if(newSoft.trim()!==""){ setSoftSkills([...softSkills,newSoft.trim()]); setNewSoft(""); }}} style={{ marginLeft:"0.3rem", padding:"0.3rem 0.6rem" }}>Ajouter</button>
                </div>

                {/* Projects */}
                <div>
                    <h3>Projets :</h3>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
                    {projects.map((p,i)=>(
                        <span key={i} style={{ backgroundColor:"#10b981", color:"white", padding:"0.3rem 0.6rem", borderRadius:"8px", display:"flex", alignItems:"center", gap:"0.3rem" }}>
                        {p}
                        <button onClick={()=>removeItem(projects,setProjects,i)} style={{ background:"transparent", border:"none", color:"white", cursor:"pointer" }}>✕</button>
                        </span>
                    ))}
                    </div>
                    <input type="text" value={newProject} onChange={(e)=>setNewProject(e.target.value)} placeholder="Ajouter un projet" style={{ marginTop:"0.5rem", padding:"0.3rem 0.5rem" }} />
                    <button onClick={()=>{ if(newProject.trim()!==""){ setProjects([...projects,newProject.trim()]); setNewProject(""); }}} style={{ marginLeft:"0.3rem", padding:"0.3rem 0.6rem" }}>Ajouter</button>
                </div>

                {/* Passions */}
                <div>
                    <h3>Passions :</h3>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
                    {passions.map((p,i)=>(
                        <span key={i} style={{ backgroundColor:"#f59e0b", color:"white", padding:"0.3rem 0.6rem", borderRadius:"8px", display:"flex", alignItems:"center", gap:"0.3rem" }}>
                        {p}
                        <button onClick={()=>removeItem(passions,setPassions,i)} style={{ background:"transparent", border:"none", color:"white", cursor:"pointer" }}>✕</button>
                        </span>
                    ))}
                    </div>
                    <input type="text" value={newPassion} onChange={(e)=>setNewPassion(e.target.value)} placeholder="Ajouter une passion" style={{ marginTop:"0.5rem", padding:"0.3rem 0.5rem" }} />
                    <button onClick={()=>{ if(newPassion.trim()!==""){ setPassions([...passions,newPassion.trim()]); setNewPassion(""); }}} style={{ marginLeft:"0.3rem", padding:"0.3rem 0.6rem" }}>Ajouter</button>
                </div>
                </div>
            </div>
        </div>
    </div>
  );
}
