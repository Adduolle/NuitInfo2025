import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AlertTriangle, CheckCircle, Clock, Mail, Bell, Share2 } from 'lucide-react';
import Header from './Header';

const SCENARIOS = [
  {
    id: 1,
    type: 'email',
    sender: 'Service Sécurité <security@goggle-support-verify.com>',
    subject: 'Alerte : Connexion suspecte',
    content: 'Une connexion a été détectée depuis la Russie. Cliquez ici pour vérifier votre compte immédiatement.',
    isTrap: true,
    explanation: "L'adresse de l'expéditeur 'goggle-support-verify.com' est fausse (typosquatting). L'urgence est typique du phishing."
  },
  {
    id: 2,
    type: 'notification',
    app: 'Banque Populaire',
    content: 'Votre virement de 500€ a été effectué. Si ce n\'est pas vous, contactez votre conseiller via l\'application officielle.',
    isTrap: false,
    explanation: "Cette notification est informative et vous invite à utiliser le canal officiel (l'application) sans lien direct suspect."
  },
  {
    id: 3,
    type: 'social',
    user: 'Elon Musk Official Giveaways',
    content: 'Je double tous les Bitcoins envoyés à cette adresse ! Offre limitée à 10 minutes ! 🚀',
    isTrap: true,
    explanation: "Les promesses de gains d'argent facile (doubler des cryptos) sont toujours des arnaques."
  },
  {
    id: 4,
    type: 'email',
    sender: 'RH Entreprise <rh@votre-entreprise.com>',
    subject: 'Mise à jour mutuelle',
    content: 'Bonjour, merci de prendre connaissance des nouveaux tarifs de la mutuelle en pièce jointe (PDF).',
    isTrap: false,
    explanation: "L'adresse semble légitime et le contexte (RH) est cohérent. Attention tout de même aux pièces jointes, mais ici c'est plausible."
  },
  {
    id: 5,
    type: 'notification',
    app: 'Colissimo',
    content: 'Votre colis est bloqué au terminal. Payez 2.99€ de frais de douane pour le débloquer : http://bit.ly/colis-douane',
    isTrap: true,
    explanation: "Les liens raccourcis (bit.ly) et les demandes de paiement pour 'débloquer' un colis sont des classiques du smishing (phishing par SMS)."
  }
];

export default function ClickTrapQuiz() {
  const navigate = useNavigate();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(10);
  const [gameState, setGameState] = useState('playing'); // playing, feedback, finished
  const [lastChoiceCorrect, setLastChoiceCorrect] = useState(null);
  const [bestScore, setBestScore] = useState(null);
  const [isGuest, setIsGuest] = useState(false);

  // Auth Check & Fetch Best Score
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      setIsGuest(true);
      return;
    }

    // Fetch best score
    fetch('http://localhost:3001/verify', {
      headers: { 'Authorization': `Bearer ${token}` }
    })
    .then(res => res.json())
    .then(data => {
      if (data.scores && data.scores.clickTrap) {
        setBestScore(data.scores.clickTrap);
      }
    })
    .catch(err => console.error("Failed to fetch best score", err));
  }, []); // Removed navigate from dependencies as it's not used for navigation here anymore

  // Timer
  useEffect(() => {
    if (gameState !== 'playing') return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          handleAnswer(null); // Time's up
          return 10;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [gameState, currentQuestion]);

  const handleAnswer = (userThinksItIsSafe) => {
    const scenario = SCENARIOS[currentQuestion];
    let isCorrect = false;

    if (userThinksItIsSafe === null) {
      // Time out - considered wrong
      isCorrect = false;
    } else {
      // User clicked "Safe" -> Correct if it is NOT a trap
      // User clicked "Trap" -> Correct if it IS a trap
      isCorrect = (userThinksItIsSafe && !scenario.isTrap) || (!userThinksItIsSafe && scenario.isTrap);
    }

    if (isCorrect) {
      setScore(s => s + 1);
      setLastChoiceCorrect(true);
      setGameState('feedback');
    } else {
      setLastChoiceCorrect(false);
      setGameState('game_over');
      saveScore(score);
    }
  };

  const saveScore = async (finalScore) => {
    if (isGuest) return; // Don't save for guests

    const token = localStorage.getItem('token');
    if (!token) return;

    try {
      const res = await fetch('http://localhost:3001/score', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          gameId: 'clickTrap',
          score: finalScore
        })
      });
      
      const data = await res.json();
      if (data.success && data.bestScore) {
        setBestScore(data.bestScore);
      }
    } catch (error) {
      console.error('Error saving score:', error);
    }
  };

  const restartGame = () => {
    setScore(0);
    setCurrentQuestion(0);
    setTimeLeft(10);
    setGameState('playing');
    setLastChoiceCorrect(null);
  };

  const nextQuestion = () => {
    if (currentQuestion + 1 < SCENARIOS.length) {
      setCurrentQuestion(q => q + 1);
      setTimeLeft(10);
      setGameState('playing');
    } else {
      setGameState('finished');
      saveScore(score);
    }
  };

  if (gameState === 'finished') {
    return (
      <div style={{ padding: '2rem', maxWidth: '600px', margin: '0 auto', textAlign: 'center', color: 'white' }}>
        <h1>Quiz Terminé !</h1>
        <div style={{ fontSize: '4rem', margin: '2rem 0' }}>
          🏆
        </div>
        <h2>Score Final : {score}</h2>
        <p>Vous êtes un expert en cybersécurité !</p>
        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', marginTop: '2rem' }}>
          <button onClick={restartGame} className="btn" style={{ padding: '10px 20px', fontSize: '1.2rem', cursor: 'pointer', background: '#3b82f6', color: 'white', border: 'none', borderRadius: '8px' }}>
            Recommencer
          </button>
          <button onClick={() => navigate('/')} className="btn" style={{ padding: '10px 20px', fontSize: '1.2rem', cursor: 'pointer' }}>
            Retour au Spawn
          </button>
        </div>
      </div>
    );
  }

  if (gameState === 'game_over') {
    return (
      <div style={{ padding: '2rem', maxWidth: '600px', margin: '0 auto', textAlign: 'center', color: 'white' }}>
        <h1>Game Over !</h1>
        <div style={{ fontSize: '4rem', margin: '2rem 0' }}>
          💀
        </div>
        <h2>Score Final : {score}</h2>
        <p>Une erreur fatale... Les pirates vous ont eu !</p>
        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', marginTop: '2rem' }}>
          <button onClick={restartGame} className="btn" style={{ padding: '10px 20px', fontSize: '1.2rem', cursor: 'pointer', background: '#3b82f6', color: 'white', border: 'none', borderRadius: '8px' }}>
            Recommencer
          </button>
          <button onClick={() => navigate('/')} className="btn" style={{ padding: '10px 20px', fontSize: '1.2rem', cursor: 'pointer' }}>
            Retour au Spawn
          </button>
        </div>
      </div>
    );
  }

  const scenario = SCENARIOS[currentQuestion];

  return (
    <>
      <Header />
      <div style={{ padding: '2rem', paddingTop: '100px', maxWidth: '600px', margin: '0 auto', color: 'white', fontFamily: 'sans-serif' }}>
        {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h2 style={{ margin: 0 }}>Piège à Clics</h2>
        <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        marginBottom: '2rem',
        background: 'rgba(0,0,0,0.5)',
        padding: '1rem',
        borderRadius: '8px'
      }}>
        <div style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>Score: {score}</div>
        {bestScore !== null && (
          <div style={{ background: '#ffd700', color: 'black', padding: '5px 10px', borderRadius: '15px', fontWeight: 'bold', fontSize: '0.9rem' }}>
            Meilleur: {bestScore}
          </div>
        )}
        {isGuest && (
          <div style={{ background: '#666', color: 'white', padding: '5px 10px', borderRadius: '15px', fontWeight: 'bold', fontSize: '0.9rem' }}>
            Mode Invité
          </div>
        )}
        <div style={{ fontSize: '1.5rem', color: timeLeft < 5 ? '#ff4444' : 'white' }}>⏳ {timeLeft}s</div>
      </div>
      </div>

      {/* Game Area */}
      {gameState === 'playing' && (
        <div className="glass-panel" style={{ background: 'rgba(30, 41, 59, 0.9)', padding: '2rem', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.1)', minHeight: '300px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          
          {/* Scenario Content */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '1rem', color: '#94a3b8' }}>
              {scenario.type === 'email' && <Mail size={20} />}
              {scenario.type === 'notification' && <Bell size={20} />}
              {scenario.type === 'social' && <Share2 size={20} />}
              <span style={{ textTransform: 'uppercase', fontSize: '0.8rem', letterSpacing: '1px' }}>{scenario.type}</span>
            </div>

            <div style={{ marginBottom: '1.5rem' }}>
              {scenario.sender && <div style={{ fontSize: '0.9rem', color: '#cbd5e1', marginBottom: '5px' }}>De: {scenario.sender}</div>}
              {scenario.app && <div style={{ fontSize: '0.9rem', color: '#cbd5e1', marginBottom: '5px' }}>App: {scenario.app}</div>}
              {scenario.user && <div style={{ fontSize: '0.9rem', color: '#cbd5e1', marginBottom: '5px' }}>User: {scenario.user}</div>}
              
              {scenario.subject && <h3 style={{ margin: '0 0 10px 0', color: 'white' }}>{scenario.subject}</h3>}
              
              <div style={{ background: 'rgba(0,0,0,0.3)', padding: '1rem', borderRadius: '8px', borderLeft: '4px solid #3b82f6' }}>
                "{scenario.content}"
              </div>
            </div>
          </div>

          {/* Actions */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <button 
              onClick={() => handleAnswer(true)}
              style={{ padding: '1rem', borderRadius: '8px', border: 'none', background: '#10b981', color: 'white', fontSize: '1.1rem', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}
            >
              <CheckCircle /> Fiable
            </button>
            <button 
              onClick={() => handleAnswer(false)}
              style={{ padding: '1rem', borderRadius: '8px', border: 'none', background: '#ef4444', color: 'white', fontSize: '1.1rem', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}
            >
              <AlertTriangle /> Arnaque
            </button>
          </div>
        </div>
      )}

      {/* Feedback Area */}
      {gameState === 'feedback' && (
        <div className="glass-panel animate-fade-in" style={{ background: lastChoiceCorrect ? 'rgba(16, 185, 129, 0.2)' : 'rgba(239, 68, 68, 0.2)', padding: '2rem', borderRadius: '16px', border: `1px solid ${lastChoiceCorrect ? '#10b981' : '#ef4444'}`, textAlign: 'center' }}>
          <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>
            {lastChoiceCorrect ? '✅' : '❌'}
          </div>
          <h3 style={{ margin: '0 0 1rem 0' }}>
            {lastChoiceCorrect ? 'Bien joué !' : 'Aïe... Tombé dans le piège.'}
          </h3>
          <p style={{ fontSize: '1.1rem', lineHeight: '1.6', marginBottom: '2rem' }}>
            {scenario.explanation}
          </p>
          <button 
            onClick={nextQuestion}
            style={{ padding: '10px 30px', borderRadius: '8px', border: 'none', background: 'white', color: '#1e293b', fontSize: '1.1rem', fontWeight: 'bold', cursor: 'pointer' }}
          >
            Suivant <span style={{ marginLeft: '5px' }}>→</span>
          </button>
        </div>
      )}
    </div>
    </>
  );
}
