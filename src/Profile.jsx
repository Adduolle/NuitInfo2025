import { RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, Tooltip, ResponsiveContainer } from 'recharts';
import React, { useState, useEffect } from 'react';


export default function Profile() {
  const [token] = useState(localStorage.getItem("token"));
  const [userData, setUserData] = useState({
    gifUrl: "",
    description: "",
    scores: {},
    skills: [],
    softSkills: [],
    projets: [],
    passions: [],
  });
const [radarCategory, setRadarCategory] = useState(null);
    const getRadarDataMultiple = () => {
    const categories = ["skills", "softSkills", "projets", "passions"];
    const allItemsSet = new Set();
    
  categories.forEach(cat => userData[cat].forEach(item => allItemsSet.add(item)));

  const allItems = Array.from(allItemsSet);
  return allItems.map(item => {
    const entry = { skill: item };
    categories.forEach(cat => {
      entry[cat] = userData[cat].includes(item) ? 1 : 0;
    });
    return entry;
  });
};

  const [newSkill, setNewSkill] = useState("");
  const [newSoft, setNewSoft] = useState("");
  const [newProject, setNewProject] = useState("");
  const [newPassion, setNewPassion] = useState("");

  const removeItem = (listName, index) => {
    const updated = [...userData[listName]];
    updated.splice(index, 1);
    setUserData({ ...userData, [listName]: updated });
  };

  const fetchProfile = async () => {
    if (!token) return;
    try {
      const res = await fetch("http://localhost:3001/profile", {
        headers: { Authorization: "Bearer " + token },
      });
      const data = await res.json();
      setUserData(data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, [token]);

  const updateProfile = async () => {
    if (!token) return;
    try {
      const res = await fetch("http://localhost:3001/profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
        body: JSON.stringify({
          description: userData.description,
          skills: userData.skills,
          softSkills: userData.softSkills,
          projets: userData.projets,
          passions: userData.passions,
        }),
      });
      const data = await res.json();
      setUserData(data);
    } catch (err) {
      console.error(err);
    }
  };

  const addItem = (listName, newValue, setNewValue) => {
    if (!newValue.trim()) return;
    setUserData({ ...userData, [listName]: [...userData[listName], newValue.trim()] });
    setNewValue("");
  };

return (
    <div className="flex justify-center items-start min-h-screen p-8 gap-8">
        {/* === Bloc Profil === */}
        <div className="glass-panel animate-fade-in w-[450px] p-8">
            <h1 className="text-center text-2xl mb-6">Mon Profil</h1>
            <div className="flex justify-center mb-6">
                <img src={userData.gifUrl} alt="Gif" className="w-[110px] h-[110px] rounded-lg" />
            </div>
            <div className="glass-panel mb-6 p-6">
                <p><strong>Score ClickTrap :</strong> {userData.scores?.clickTrap || 0}</p>
                <p><strong>Description :</strong> {userData.description}</p>
            </div>
            <div className="flex flex-col items-center">
                <h3 className="mb-2">Modifier la description :</h3>
                <textarea
                    value={userData.description}
                    onChange={(e) => setUserData({ ...userData, description: e.target.value })}
                    className="input-field w-full mb-3"
                />
                <button onClick={updateProfile} className="btn btn-secondary mb-2">Mettre à jour</button>
                <p className="text-sm text-gray-400">(Mode test : modification active)</p>
            </div>
        </div>

        {/* === Bloc Talents === */}
        <div className="glass-panel w-[450px] p-6 max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl text-center mb-4">Talents interactifs</h2>

            {/* Skills */}
            <div className="mb-4">
                <h3>Compétences :</h3>
                <div className="flex flex-wrap gap-2 mb-2">
                    {userData.skills.map((s, i) => (
                        <span key={i} className="badge skill">
                            {s}
                            <button onClick={() => removeItem("skills", i)}>✕</button>
                        </span>
                    ))}
                </div>
                <div className="flex items-center gap-2">
                    <input
                        type="text"
                        value={newSkill}
                        onChange={(e) => setNewSkill(e.target.value)}
                        className="input-field"
                        placeholder="Ajouter une compétence"
                    />
                    <button
                        className="btn btn-primary"
                        onClick={() => addItem("skills", newSkill, setNewSkill)}
                    >
                        Ajouter
                    </button>
                </div>
            </div>

            {/* Soft Skills */}
            <div className="mb-4">
                <h3>Soft Skills :</h3>
                <div className="flex flex-wrap gap-2 mb-2">
                    {userData.softSkills.map((s, i) => (
                        <span key={i} className="badge soft">
                            {s}
                            <button onClick={() => removeItem("softSkills", i)}>✕</button>
                        </span>
                    ))}
                </div>
                <div className="flex items-center gap-2">
                    <input
                        type="text"
                        value={newSoft}
                        onChange={(e) => setNewSoft(e.target.value)}
                        className="input-field"
                        placeholder="Ajouter un soft skill"
                    />
                    <button
                        className="btn btn-primary"
                        onClick={() => addItem("softSkills", newSoft, setNewSoft)}
                    >
                        Ajouter
                    </button>
                </div>
            </div>

            {/* Projets */}
            <div className="mb-4">
                <h3>Projets :</h3>
                <div className="flex flex-wrap gap-2 mb-2">
                    {userData.projets.map((p, i) => (
                        <span key={i} className="badge project">
                            {p}
                            <button onClick={() => removeItem("projets", i)}>✕</button>
                        </span>
                    ))}
                </div>
                <div className="flex items-center gap-2">
                    <input
                        type="text"
                        value={newProject}
                        onChange={(e) => setNewProject(e.target.value)}
                        className="input-field"
                        placeholder="Ajouter un projet"
                    />
                    <button
                        className="btn btn-primary"
                        onClick={() => addItem("projets", newProject, setNewProject)}
                    >
                        Ajouter
                    </button>
                </div>
            </div>

            {/* Passions */}
            <div className="mb-4">
                <h3>Passions :</h3>
                <div className="flex flex-wrap gap-2 mb-2">
                    {userData.passions.map((p, i) => (
                        <span key={i} className="badge passion">
                            {p}
                            <button onClick={() => removeItem("passions", i)}>✕</button>
                        </span>
                    ))}
                </div>
                <div className="flex items-center gap-2">
                    <input
                        type="text"
                        value={newPassion}
                        onChange={(e) => setNewPassion(e.target.value)}
                        className="input-field"
                        placeholder="Ajouter une passion"
                    />
                    <button
                        className="btn btn-primary"
                        onClick={() => addItem("passions", newPassion, setNewPassion)}
                    >
                        Ajouter
                    </button>
                </div>
            </div>
             {/* --- Bouton Carte des compétences --- */}
            <button className="btn btn-secondary" onClick={() => setRadarCategory("multiple")}>
                Voir la carte des compétences
            </button>


            {radarCategory === "multiple" && (
                <div style={{ width: "100%", height: 400 }}>
                    <ResponsiveContainer>
                    <RadarChart data={getRadarDataMultiple()}>
                        <PolarGrid />
                        <PolarAngleAxis dataKey="skill" />
                        <PolarRadiusAxis angle={30} domain={[0, 1]} />
                        <Radar name="Compétences" dataKey="skills" stroke="#8884d8" fill="#8884d8" fillOpacity={0.6} />
                        <Radar name="Soft Skills" dataKey="softSkills" stroke="#82ca9d" fill="#82ca9d" fillOpacity={0.6} />
                        <Radar name="Projets" dataKey="projets" stroke="#ffc658" fill="#ffc658" fillOpacity={0.6} />
                        <Radar name="Passions" dataKey="passions" stroke="#ff7f50" fill="#ff7f50" fillOpacity={0.6} />
                    </RadarChart>
                    </ResponsiveContainer>
                </div>
            )}
        </div>
    </div>
);
}
