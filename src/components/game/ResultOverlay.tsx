// src/components/game/ResultOverlay.tsx

import { CheckCircle, XCircle, ShieldCheck, Trophy, TrendingDown } from 'lucide-react';
import { GameHistory, Team } from '../../models/types';

interface ResultOverlayProps {
    result: GameHistory;
    teams: Team[];
}

export default function ResultOverlay({ result, teams }: ResultOverlayProps) {
    const team = teams.find(t => t.id === result.puja.equipoId);
    const isCorrect = result.correcto;
    const isSaved = !isCorrect && result.puja.powerupUsado === 'SALVA';
    const points = result.puntosGanados;

    const cfg = isCorrect
        ? {
            Icon: CheckCircle, PtIcon: Trophy,
            color: '#22c55e', dimBg: 'rgba(21,128,61,0.1)', dimBorder: 'rgba(34,197,94,0.25)',
            glow: 'rgba(34,197,94,0.25)',
            label: '¡Correcto!', ptPrefix: '+', ptVal: points,
        }
        : isSaved
        ? {
            Icon: ShieldCheck, PtIcon: ShieldCheck,
            color: '#60a5fa', dimBg: 'rgba(29,78,216,0.1)', dimBorder: 'rgba(96,165,250,0.25)',
            glow: 'rgba(96,165,250,0.25)',
            label: '¡Salvado!', ptPrefix: '', ptVal: 0,
        }
        : {
            Icon: XCircle, PtIcon: TrendingDown,
            color: '#ef4444', dimBg: 'rgba(153,27,27,0.1)', dimBorder: 'rgba(239,68,68,0.25)',
            glow: 'rgba(239,68,68,0.25)',
            label: 'Incorrecto', ptPrefix: '', ptVal: points,
        };

    return (
        <>
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');

                @keyframes ro-bg    { from { opacity:0 } to { opacity:1 } }
                @keyframes ro-icon  {
                    0%   { opacity:0; transform: scale(2) rotate(-12deg); filter: blur(28px); }
                    55%  { transform: scale(0.92) rotate(2deg); }
                    75%  { transform: scale(1.04) rotate(-1deg); }
                    100% { opacity:1; transform: scale(1) rotate(0deg); filter: blur(0); }
                }
                @keyframes ro-title {
                    from { opacity:0; transform: translateY(-24px); }
                    to   { opacity:1; transform: translateY(0); }
                }
                @keyframes ro-card  {
                    from { opacity:0; transform: translateY(36px) scale(0.93); }
                    to   { opacity:1; transform: translateY(0) scale(1); }
                }
                @keyframes ro-glow  {
                    0%,100% { opacity: 0.18; transform: scale(1); }
                    50%     { opacity: 0.32; transform: scale(1.08); }
                }

                .ro-bg    { animation: ro-bg    0.4s ease forwards; }
                .ro-icon  { animation: ro-icon  0.7s cubic-bezier(0.16,1,0.3,1) 0.1s both; }
                .ro-title { animation: ro-title 0.55s cubic-bezier(0.16,1,0.3,1) 0.3s both; }
                .ro-card  { animation: ro-card  0.55s cubic-bezier(0.16,1,0.3,1) 0.45s both; }
                .ro-glow  { animation: ro-glow  2.5s ease-in-out 0.5s infinite; }
            `}</style>

            <div
                className="ro-bg"
                style={{
                    position: 'fixed', inset: 0, zIndex: 50,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    background: 'rgba(0,0,0,0.94)', backdropFilter: 'blur(14px)',
                    fontFamily: "'Plus Jakarta Sans', sans-serif",
                }}
            >
                {/* Glow radial */}
                <div className="ro-glow" style={{
                    position: 'absolute', inset: 0, pointerEvents: 'none',
                    background: `radial-gradient(ellipse 50% 40% at 50% 50%, ${cfg.glow} 0%, transparent 70%)`,
                }} />

                {/* Scanlines sutiles */}
                <div style={{
                    position: 'absolute', inset: 0, pointerEvents: 'none', opacity: 0.025,
                    backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(255,255,255,0.5) 2px, rgba(255,255,255,0.5) 3px)',
                }} />

                {/* Contenido */}
                <div style={{ position: 'relative', textAlign: 'center', padding: '0 24px', maxWidth: '540px', width: '100%' }}>

                    {/* Ícono */}
                    <div className="ro-icon" style={{ display: 'flex', justifyContent: 'center', marginBottom: '24px' }}>
                        <div style={{ position: 'relative' }}>
                            <div style={{
                                position: 'absolute', inset: 0, borderRadius: '50%',
                                background: cfg.glow, filter: 'blur(40px)', transform: 'scale(2.2)',
                            }} />
                            <cfg.Icon
                                size={120}
                                color={cfg.color}
                                style={{ position: 'relative', filter: `drop-shadow(0 0 24px ${cfg.glow})` }}
                            />
                        </div>
                    </div>

                    {/* Título */}
                    <h1 className="ro-title" style={{
                        margin: '0 0 28px', fontWeight: 800, lineHeight: 1,
                        fontSize: 'clamp(2.5rem, 9vw, 6rem)',
                        color: cfg.color, letterSpacing: '-0.02em',
                        textShadow: `0 0 60px ${cfg.glow}`,
                    }}>
                        {cfg.label}
                    </h1>

                    {/* Card */}
                    <div className="ro-card" style={{
                        borderRadius: '20px', padding: 'clamp(20px,3vw,32px)',
                        background: cfg.dimBg, border: `1px solid ${cfg.dimBorder}`,
                        backdropFilter: 'blur(20px)',
                    }}>
                        <p style={{ margin: '0 0 4px', fontSize: '10px', fontWeight: 700, color: '#475569', letterSpacing: '0.15em', textTransform: 'uppercase' }}>
                            Equipo
                        </p>
                        <h2 style={{
                            margin: '0 0 20px', fontWeight: 800, color: 'white',
                            fontSize: 'clamp(1.3rem, 3.5vw, 2rem)', letterSpacing: '-0.01em',
                        }}>
                            {team?.nombre}
                        </h2>

                        {/* Divisor */}
                        <div style={{
                            height: '1px', margin: '0 auto 20px',
                            width: '80px',
                            background: `linear-gradient(90deg, transparent, ${cfg.color}50, transparent)`,
                        }} />

                        {/* Puntos */}
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}>
                            <cfg.PtIcon size={28} color={cfg.color} />
                            <span style={{
                                fontWeight: 800, color: cfg.color,
                                fontSize: 'clamp(2rem, 6vw, 3.5rem)',
                                letterSpacing: '-0.03em', lineHeight: 1,
                            }}>
                                {cfg.ptPrefix}{Math.abs(cfg.ptVal)}
                            </span>
                            <span style={{ fontSize: '13px', color: '#475569', fontWeight: 600, alignSelf: 'flex-end', paddingBottom: '6px' }}>
                                pts
                            </span>
                        </div>

                        {/* Comodín usado */}
                        {result.puja.powerupUsado && (
                            <div style={{ marginTop: '16px' }}>
                                <span style={{
                                    display: 'inline-flex', alignItems: 'center', gap: '6px',
                                    padding: '5px 14px', borderRadius: '20px',
                                    background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)',
                                    fontSize: '12px', fontWeight: 700,
                                    color: result.puja.powerupUsado === 'DOBLE' ? '#60a5fa' : '#34d399',
                                }}>
                                    {result.puja.powerupUsado === 'DOBLE' ? '🎯 Comodín Doble' : '🛡️ Comodín Salva'}
                                </span>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
}