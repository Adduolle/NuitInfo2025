import { useEffect, useState } from "react";

export default function Profile() {
  const [userData, setUserData] = useState(null);
  const [newDescription, setNewDescription] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (token) {
      fetch("http://localhost:3001/verify", {
        headers: { Authorization: `Bearer ${token}` }
      })
        .then(res => res.json())
        .then(data => {
          if (data.error) {
            console.log("Token invalide");
          } else {
            setUserData(data.user);       // on prend directement l'objet user
            setNewDescription(data.user.description || "");
          }
        })
        .catch(err => console.error(err));
    }
  }, []);

  if (!userData) return <div>Non connecté</div>;

  const handleDescriptionUpdate = async () => {
    const token = localStorage.getItem("token");

    const res = await fetch("http://localhost:3001/update-description", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({ description: newDescription })
    });

    const data = await res.json();
    if (data.success) {
      setUserData(prev => ({ ...prev, description: newDescription }));
      alert("Description mise à jour !");
    } else {
      alert("Erreur lors de la mise à jour");
    }
  };

  return (
    <div style={{ padding: "2rem", fontFamily: "Arial" }}>
      <h1>Mon Profil</h1>
      <img
        src={userData.gifUrl}
        alt="Mon identité"
        style={{ width: "150px", height: "150px" }}
      />
      <p><strong>Username :</strong> {userData.username}</p>
      <p><strong>Score :</strong> {userData.score}</p>
      <p><strong>Description :</strong> {userData.description}</p>

      <div style={{ marginTop: "1rem" }}>
        <h3>Modifier la description :</h3>
        <input
          type="text"
          value={newDescription}
          onChange={e => setNewDescription(e.target.value)}
          style={{ width: "300px", padding: "0.3rem" }}
        />
        <button
          onClick={handleDescriptionUpdate}
          style={{ marginLeft: "0.5rem", padding: "0.3rem 0.6rem" }}
        >
          Mettre à jour
        </button>
      </div>
    </div>
  );
}
