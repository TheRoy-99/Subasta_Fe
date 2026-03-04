// src/components/game/VetoOverlay.tsx

import { useEffect, useReducer } from 'react';
import { Ban } from 'lucide-react';
import { Team } from '../../models/types';

interface VetoOverlayProps {
    vetadoId: string | null;
    teams: Team[];
}

type OverlayState =
    | { visible: false }
    | { visible: true; teamName: string; phase: 'enter' | 'hold' | 'exit' };

type OverlayAction =
    | { type: 'SHOW'; teamName: string }
    | { type: 'HOLD' }
    | { type: 'EXIT' }
    | { type: 'HIDE' };

function overlayReducer(state: OverlayState, action: OverlayAction): OverlayState {
    switch (action.type) {
        case 'SHOW': return { visible: true, teamName: action.teamName, phase: 'enter' };
        case 'HOLD': return state.visible ? { ...state, phase: 'hold' } : state;
        case 'EXIT': return state.visible ? { ...state, phase: 'exit' } : state;
        case 'HIDE': return { visible: false };
        default:     return state;
    }
}

export default function VetoOverlay({ vetadoId, teams }: VetoOverlayProps) {
    const [state, dispatch] = useReducer(overlayReducer, { visible: false });

    useEffect(() => {
        if (!vetadoId) { dispatch({ type: 'HIDE' }); return; }
        const team = teams.find(t => t.id === vetadoId);
        if (!team) return;

        dispatch({ type: 'SHOW', teamName: team.nombre });

        const t1 = setTimeout(() => dispatch({ type: 'HOLD' }), 400);
        const t2 = setTimeout(() => dispatch({ type: 'EXIT' }), 3600);
        const t3 = setTimeout(() => dispatch({ type: 'HIDE' }), 4200);
        return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); };
    }, [vetadoId, teams]);

    if (!state.visible) return null;

    const { teamName, phase } = state;
    const exiting = phase === 'exit';

    return (
        <>
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');

                @keyframes veto-bg-in   { from { opacity:0 } to { opacity:1 } }
                @keyframes veto-bg-out  { from { opacity:1 } to { opacity:0 } }
                @keyframes veto-icon-in {
                    0%   { opacity:0; transform: scale(1.6); filter: blur(24px); }
                    60%  { transform: scale(0.92); filter: blur(0); }
                    80%  { transform: scale(1.04); }
                    100% { opacity:1; transform: scale(1); }
                }
                @keyframes veto-title-in {
                    from { opacity:0; transform: scale(1.3); filter: blur(16px); }
                    to   { opacity:1; transform: scale(1); filter: blur(0); }
                }
                @keyframes veto-card-in {
                    from { opacity:0; transform: translateY(32px) scale(0.94); }
                    to   { opacity:1; transform: translateY(0) scale(1); }
                }
                @keyframes veto-slash {
                    0%   { width: 0; opacity: 0; }
                    20%  { opacity: 1; }
                    100% { width: 240px; opacity: 1; }
                }
                @keyframes veto-scan {
                    0%   { top: -5%; }
                    100% { top: 105%; }
                }

                .veto-wrap-in  { animation: veto-bg-in  0.35s ease forwards; }
                .veto-wrap-out { animation: veto-bg-out 0.5s ease forwards; }
                .veto-icon     { animation: veto-icon-in  0.65s cubic-bezier(0.16,1,0.3,1) 0.1s both; }
                .veto-title    { animation: veto-title-in 0.55s cubic-bezier(0.16,1,0.3,1) 0.2s both; }
                .veto-slash    { animation: veto-slash    0.45s ease 0.28s both; }
                .veto-card     { animation: veto-card-in  0.55s cubic-bezier(0.16,1,0.3,1) 0.38s both; }
                .veto-scan     {
                    position: absolute; left: 0; right: 0; height: 2px;
                    background: linear-gradient(90deg, transparent, rgba(239,68,68,0.5), transparent);
                    animation: veto-scan 1.8s linear 0.5s infinite;
                }
            `}</style>

            <div
                className={exiting ? 'veto-wrap-out' : 'veto-wrap-in'}
                style={{
                    position: 'fixed', inset: 0, zIndex: 50,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    background: 'rgba(0,0,0,0.93)', backdropFilter: 'blur(10px)',
                    fontFamily: "'Plus Jakarta Sans', sans-serif",
                }}
            >
                {/* Scanline */}
                <div className="veto-scan" />

                {/* Glow radial */}
                <div style={{
                    position: 'absolute', inset: 0, pointerEvents: 'none',
                    background: 'radial-gradient(ellipse 55% 45% at 50% 50%, rgba(239,68,68,0.1) 0%, transparent 70%)',
                }} />

                {/* Corner lines HUD */}
                <CornerLines />

                {/* Contenido */}
                <div style={{ position: 'relative', textAlign: 'center', padding: '0 32px' }}>

                    {/* Ícono */}
                    <div className="veto-icon" style={{ display: 'flex', justifyContent: 'center', marginBottom: '28px' }}>
                        <div style={{ position: 'relative' }}>
                            <div style={{
                                position: 'absolute', inset: 0, borderRadius: '50%',
                                background: 'rgba(239,68,68,0.35)', filter: 'blur(32px)',
                                transform: 'scale(1.8)',
                            }} />
                            <div style={{
                                position: 'relative', padding: '28px', borderRadius: '50%',
                                background: 'rgba(239,68,68,0.08)',
                                border: '2px solid rgba(239,68,68,0.4)',
                            }}>
                                <Ban size={72} color="#f87171" />
                            </div>
                        </div>
                    </div>

                    {/* Título */}
                    <div className="veto-title" style={{ marginBottom: '20px' }}>
                        <h2 style={{
                            margin: 0, fontWeight: 800, lineHeight: 1,
                            fontSize: 'clamp(4rem, 12vw, 8rem)',
                            color: '#ef4444',
                            letterSpacing: '-0.02em',
                            textShadow: '0 0 60px rgba(239,68,68,0.4)',
                        }}>
                            VETO
                        </h2>
                    </div>

                    {/* Línea roja */}
                    <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '24px' }}>
                        <div className="veto-slash" style={{
                            height: '3px', width: 0,
                            background: 'linear-gradient(90deg, transparent, #ef4444, #fca5a5, #ef4444, transparent)',
                            borderRadius: '2px',
                        }} />
                    </div>

                    {/* Card equipo */}
                    <div className="veto-card">
                        <div style={{
                            display: 'inline-block', padding: '20px 40px', borderRadius: '16px',
                            background: 'rgba(239,68,68,0.07)', border: '1px solid rgba(239,68,68,0.25)',
                        }}>
                            <p style={{
                                margin: '0 0 6px', fontSize: '10px', fontWeight: 700, color: 'rgba(239,68,68,0.5)',
                                letterSpacing: '0.2em', textTransform: 'uppercase',
                            }}>
                                Equipo bloqueado
                            </p>
                            <p style={{
                                margin: 0, fontWeight: 800, color: 'white',
                                fontSize: 'clamp(1.4rem, 4vw, 2.8rem)',
                                letterSpacing: '-0.01em',
                            }}>
                                {teamName}
                            </p>
                        </div>
                        <p style={{
                            marginTop: '20px', fontSize: '10px', fontWeight: 600,
                            color: 'rgba(239,68,68,0.4)', letterSpacing: '0.2em', textTransform: 'uppercase',
                        }}>
                            No podrá pujar esta ronda
                        </p>
                    </div>
                </div>
            </div>
        </>
    );
}

function CornerLines() {
    const corners = [
        { top: '20px', left: '20px', borderTop: '2px solid rgba(239,68,68,0.35)', borderLeft: '2px solid rgba(239,68,68,0.35)', borderTopLeftRadius: '4px' },
        { top: '20px', right: '20px', borderTop: '2px solid rgba(239,68,68,0.35)', borderRight: '2px solid rgba(239,68,68,0.35)', borderTopRightRadius: '4px' },
        { bottom: '20px', left: '20px', borderBottom: '2px solid rgba(239,68,68,0.35)', borderLeft: '2px solid rgba(239,68,68,0.35)', borderBottomLeftRadius: '4px' },
        { bottom: '20px', right: '20px', borderBottom: '2px solid rgba(239,68,68,0.35)', borderRight: '2px solid rgba(239,68,68,0.35)', borderBottomRightRadius: '4px' },
    ];
    return (
        <>
            {corners.map((style, i) => (
                <div key={i} style={{ position: 'absolute', width: '44px', height: '44px', ...style }} />
            ))}
        </>
    );
}