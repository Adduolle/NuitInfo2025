import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

export default function MentionsLegales() {
    const navigate = useNavigate();

    return (
        <div style={{
            minHeight: '100vh',
            padding: '2rem',
            backgroundColor: '#0f172a',
            color: '#fff',
            fontFamily: 'Arial, sans-serif'
        }}>
            <button
                onClick={() => navigate(-1)}
                style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    marginBottom: '2rem',
                    background: 'transparent',
                    border: '1px solid #fff',
                    borderRadius: '8px',
                    padding: '0.5rem 1rem',
                    color: '#fff',
                    cursor: 'pointer'
                }}
            >
                <ArrowLeft size={18} /> Retour
            </button>

            <h1 style={{ marginBottom: '1rem' }}>Mentions légales</h1>

            <p style={{ marginBottom: '1rem', lineHeight: '1.6' }}>
                Site réalisé par Lucas Lamisse, Bastien Teisseire, Titouan Hinschberger, Adrien Duollé et Gabriel Beltzer.
            </p>

            <p style={{ marginBottom: '1rem', lineHeight: '1.6' }}>
                Éléments 3D utilisés :
                <ul>
                    <li><strong>Mairie :</strong> https://sketchfab.com/3d-models/tupelo-city-hall-building-3055cb421cd8484bac2dba00cabbb978</li>
                    <li><strong>Maison :</strong> https://sketchfab.com/3d-models/house-8046ccf8808d48aabd2e7c4ce2522e23</li>
                    <li><strong>Panneau :</strong> https://sketchfab.com/3d-models/low-poly-sign-board-stylized-wooden-sign-47606ca864584360aa594ccbf7b668b7</li>
                    <li><strong>Maxwell le chat :</strong> https://sketchfab.com/3d-models/maxwell-the-cat-with-bones-animation-4175776146ba4550a8dd643363b7b0aa</li>
                    <li><strong>Plaque d'égouts :</strong> https://sketchfab.com/3d-models/sewer-manhole-17153a05f0c7488eb2e9344ce7d75445</li>
                    <li><strong>Buste d'Alan Turing :</strong> https://sketchfab.com/3d-models/alan-turing-bust-8f96712c8299416eb9f5cebe331830a6</li>
                </ul>
            </p>

            <p style={{ marginTop: '2rem', fontSize: '0.9rem', color: '#aaa' }}>
                &copy; {new Date().getFullYear()} Les DEV-ISA-geurs. Tous droits réservés.
            </p>
        </div>
    );
}
