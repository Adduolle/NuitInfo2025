# 🌐 Goofy Ahh Website - Nuit de l'Info 2025

Bienvenue sur le **Goofy Ahh Website**, une expérience web immersive et interactive développée pour la Nuit de l'Info 2025. Ce projet combine une navigation en 3D, des mini-jeux éducatifs et un système de profil utilisateur, le tout avec une touche d'humour et d'accessibilité.

![Spawn Preview](/public/maxwell_favicon.png)

## 🚀 Fonctionnalités

- **Spawn 3D Interactif** : Naviguez dans un village 3D, cliquez sur les bâtiments pour accéder aux différentes sections.
- **Authentification GIF** : Connectez-vous de manière unique en choisissant votre GIF préféré.
- **Mini-Jeux Éducatifs** :
  - **Click Trap Quiz** : Un quiz piégeux pour tester votre vigilance.
  - **PC Builder** : Apprenez à monter un PC en choisissant les bons composants.
  - **Inclusion Game** : Un jeu d'obstacles pour sensibiliser aux barrières numériques.
- **Profil Utilisateur** : Suivez vos scores, compétences et badges.
- **Mode Invité** : Testez les jeux sans compte (les scores ne sont pas sauvegardés).

## 🛠️ Prérequis

Avant de commencer, assurez-vous d'avoir installé :

- **Node.js** (v18 ou supérieur)
- **MongoDB Atlas** (Base de données Cloud, déjà configurée dans le projet)
- **Git**

## 📦 Installation

1. **Cloner le projet**

   ```bash
   git clone https://github.com/Adduolle/NuitInfo2025.git
   cd NuitInfo2025
   ```

2. **Installer les dépendances du Frontend**

   ```bash
   npm install
   ```

3. **Installer les dépendances du Backend**
   ```bash
   cd backend
   npm install
   cd ..
   ```

## 🎮 Lancer le projet

Le projet nécessite de lancer le serveur backend (API) et le serveur frontend (React) simultanément.

### 1. Démarrer le Backend (API & Base de données)

Ouvrez un terminal, naviguez dans le dossier `backend` et lancez le serveur :

```bash
cd backend
node server.js
```

> Le serveur tournera sur `http://localhost:3001`. Assurez-vous que MongoDB est bien lancé sur votre machine.

### 2. Démarrer le Frontend (Site Web)

Ouvrez un **nouveau terminal** à la racine du projet et lancez Vite :

```bash
npm run dev
```

> Le site sera accessible sur `http://localhost:5173` (ou un autre port si le 5173 est pris).

## 🧭 Guide de Navigation

Une fois sur le site :

- **Spawn (Accueil)** : Utilisez la souris pour regarder autour de vous. Cliquez sur les portes ou les objets pour naviguer.
  - 🏠 **Maison Gauche** : PC Builder Game
  - 🏠 **Maison Droite** : Click Trap Quiz
  - 🚪 **Porte Arrière** : Jeu d'Inclusion
  - 🐱 **Maxwell le Chat** : Page Contact
  - 🗿 **Buste d'Alan Turing** : Votre Profil
- **Login** : Cliquez sur le bouton "Login" ou essayez d'accéder à une zone restreinte pour vous connecter ou jouer en invité.

## 🤝 Crédits

Développé avec ❤️ (et un peu de fatigue) pour la **Nuit de l'Info 2025**.

---

_Note : Si vous rencontrez des problèmes de textures ou de modèles 3D, vérifiez que votre connexion internet est active pour le chargement des assets._
