import { useState, useEffect } from "react";
import "./css/InclusionGame.css";

export default function Inclusion() {
  const [playerX, setPlayerX] = useState(50);
  const [obstacles, setObstacles] = useState([]);
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);

  const obstacleTypes = [
    { label: "Matériel limité", color: "red" },
    { label: "Compétences insuffisantes", color: "orange" },
    { label: "Accessibilité réduite", color: "yellow" },
    { label: "Sécurité / Confiance", color: "green" },
    { label: "Barrières administratives", color: "blue" },
  ];

  // Générer un obstacle toutes les 1.5 secondes
  useEffect(() => {
    if (gameOver) return;

    const interval = setInterval(() => {
      const type = obstacleTypes[Math.floor(Math.random() * obstacleTypes.length)];
      setObstacles((prev) => [
        ...prev,
        { id: Date.now(), y: -10, x: Math.random() * 80 + 10, type }
      ]);
    }, 800);

    return () => clearInterval(interval);
  }, [gameOver]);

  // Déplacement vertical des obstacles
  useEffect(() => {
    if (gameOver) return;

    const interval = setInterval(() => {
      setObstacles((prev) =>
        prev
          .map((o) => ({ ...o, y: o.y + 1.5 })) // déplacement plus lent et fluide
          .filter((o) => o.y < 110) // obstacles hors de la zone sont retirés
      );
      setScore((s) => s + 1);
    }, 50);

    return () => clearInterval(interval);
  }, [gameOver]);

  // Détection collision
  useEffect(() => {
    obstacles.forEach((o) => {
      if (Math.abs(o.x - playerX) < 7 && o.y > 80 && o.y < 85) {
        setGameOver(true);
      }
    });
  }, [obstacles, playerX]);

  const restart = () => {
    setPlayerX(50);
    setObstacles([]);
    setScore(0);
    setGameOver(false);
  };

  return (
    <div className="inclusion-container">
      <h1>Inclusion Numérique & Citoyenne</h1>

      <p className="intro">
        Ce mini-jeu illustre les obstacles numériques.
        Déplace le personnage de gauche à droite pour les éviter !
      </p>

      <div className="game-area">
        <div className="player" style={{ left: `${playerX}%` }}></div>

        {obstacles.map((o) => (
          <div
            key={o.id}
            className="obstacle"
            style={{
              top: `${o.y}%`,
              left: `${o.x}%`,
              background: o.type.color,
              width: "120px",
              height: "40px",
              fontSize: "14px",
            }}
            title={o.type.label}
          >
            <span className="obstacle-text">{o.type.label}</span>
          </div>
        ))}
      </div>

      <div className="controls">
        <button onClick={() => setPlayerX((x) => Math.max(0, x - 5))}>⬅️</button>
        <button onClick={() => setPlayerX((x) => Math.min(90, x + 5))}>➡️</button>
      </div>

      <h2>Score : {score}</h2>

      {gameOver && (
        <div className="game-over">
          <h2>Game Over 😭</h2>
          <p>Un obstacle numérique t’a stoppé…</p>
          <button onClick={restart}>Rejouer</button>
        </div>
      )}
    </div>
  );
}
