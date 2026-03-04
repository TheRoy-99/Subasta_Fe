// src/features/presentation/PresentationView.tsx

import { Zap, CheckCircle, XCircle, ShieldCheck } from 'lucide-react';
import RetoCard from '../../components/game/RetoCard';
import ScoreBoard from '../../components/game/ScoreBoard';
import VetoOverlay from '../../components/game/VetoOverlay';
import type { Team, GameHistory, Puja } from '../../models/types';
import { useGame } from '../../hooks/useGame';

type GameInstance = ReturnType<typeof useGame>;

interface PresentationViewProps {
    game: GameInstance;
}

const FONT = "'Plus Jakarta Sans', sans-serif";

export default function PresentationView({ game }: PresentationViewProps) {
    const { gameState } = game;

    if (!gameState) {
        return (
            <div style={{
                minHeight: '100vh', background: '#020617',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontFamily: FONT,
            }}>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px' }}>
                    <Zap size={40} color="#f59e0b" style={{ animation: 'pulse 1.5s ease-in-out infinite' }} />
                    <p style={{ color: '#475569', fontWeight: 600, letterSpacing: '0.15em', fontSize: '11px', textTransform: 'uppercase' }}>
                        Cargando...
                    </p>
                </div>
            </div>
        );
    }

    const { retoActual, ronda, equipos, pujaActual, phase, historial, equipoVetadoId } = gameState;
    const ultimoResultado: GameHistory | null = historial.length > 0 ? historial[historial.length - 1] : null;
    const mostrandoResultado = phase === 'SHOWING_RESULT';
    const esperandoPujas = phase === 'SHOWING_QUESTION' && !pujaActual;
    const respondiendo = phase === 'ANSWERING' && !!pujaActual;

    return (
        <div style={{
            minHeight: '100vh', color: 'white', position: 'relative',
            overflow: 'hidden', fontFamily: FONT,
            background: 'linear-gradient(160deg, #020617 0%, #0f172a 40%, #020617 100%)',
        }}>
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');

                @keyframes pv-float {
                    0%, 100% { transform: translateY(0px); }
                    50% { transform: translateY(-20px); }
                }
                @keyframes pv-shimmer {
                    0% { background-position: -200% center; }
                    100% { background-position: 200% center; }
                }
                @keyframes pv-reveal {
                    from { opacity: 0; transform: translateY(20px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                @keyframes pv-scale {
                    from { opacity: 0; transform: scale(0.92); }
                    to { opacity: 1; transform: scale(1); }
                }
                @keyframes pv-dot {
                    0%, 100% { opacity: 0.2; }
                    50% { opacity: 1; }
                }
                @keyframes pv-glow {
                    0%, 100% { box-shadow: 0 0 30px rgba(245,158,11,0.15); }
                    50% { box-shadow: 0 0 60px rgba(245,158,11,0.3); }
                }

                .pv-shimmer {
                    background: linear-gradient(90deg, #fbbf24, #f97316, #fbbf24, #f59e0b);
                    background-size: 200% auto;
                    -webkit-background-clip: text;
                    background-clip: text;
                    -webkit-text-fill-color: transparent;
                    animation: pv-shimmer 3s linear infinite;
                }
                .pv-reveal { animation: pv-reveal 0.6s cubic-bezier(0.16,1,0.3,1) both; }
                .pv-reveal-1 { animation: pv-reveal 0.6s cubic-bezier(0.16,1,0.3,1) 0.1s both; }
                .pv-reveal-2 { animation: pv-reveal 0.6s cubic-bezier(0.16,1,0.3,1) 0.22s both; }
                .pv-scale { animation: pv-scale 0.5s cubic-bezier(0.16,1,0.3,1) both; }
                .pv-answering-glow { animation: pv-glow 2s ease-in-out infinite; }
            `}</style>

            {/* ── Fondo atmosférico ── */}
            <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', overflow: 'hidden' }}>
                <div style={{
                    position: 'absolute', width: '600px', height: '600px',
                    top: '-200px', left: '-120px', borderRadius: '50%',
                    background: 'radial-gradient(circle, rgba(245,158,11,0.12), transparent)',
                    filter: 'blur(80px)',
                    animation: 'pv-float 14s ease-in-out infinite',
                }} />
                <div style={{
                    position: 'absolute', width: '450px', height: '450px',
                    bottom: '-150px', right: '-80px', borderRadius: '50%',
                    background: 'radial-gradient(circle, rgba(59,130,246,0.07), transparent)',
                    filter: 'blur(80px)',
                    animation: 'pv-float 18s ease-in-out infinite reverse',
                }} />
                <div style={{
                    position: 'absolute', inset: 0, opacity: 0.02,
                    backgroundImage: 'linear-gradient(rgba(245,158,11,1) 1px, transparent 1px), linear-gradient(90deg, rgba(245,158,11,1) 1px, transparent 1px)',
                    backgroundSize: '56px 56px',
                }} />
            </div>

            {/* ── Header ── */}
            <header style={{
                position: 'relative', zIndex: 10,
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                padding: 'clamp(14px, 2.5vw, 24px) clamp(16px, 3vw, 36px)',
            }}>
                {/* Logo */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <div style={{
                        padding: '8px', borderRadius: '12px',
                        background: 'rgba(245,158,11,0.1)', border: '1px solid rgba(245,158,11,0.22)',
                    }}>
                        <Zap size={24} color="#f59e0b" fill="rgba(245,158,11,0.25)" />
                    </div>
                    <div>
                        <h1 className="pv-shimmer" style={{
                            margin: 0, fontWeight: 800, lineHeight: 1,
                            fontSize: 'clamp(1.1rem, 2.5vw, 1.7rem)',
                            letterSpacing: '-0.02em',
                        }}>
                            Subasta de Fe
                        </h1>
                        <p style={{
                            margin: 0, fontSize: '9px', color: '#475569',
                            fontWeight: 600, letterSpacing: '0.18em', textTransform: 'uppercase',
                        }}>
                            Trivia Bíblica
                        </p>
                    </div>
                </div>

                {/* Ronda */}
                <div style={{
                    padding: 'clamp(6px,1vw,10px) clamp(14px,2vw,22px)',
                    borderRadius: '14px', textAlign: 'center',
                    background: 'rgba(245,158,11,0.07)', border: '1px solid rgba(245,158,11,0.18)',
                }}>
                    <div style={{
                        fontSize: '8px', fontWeight: 700, color: 'rgba(245,158,11,0.5)',
                        letterSpacing: '0.2em', textTransform: 'uppercase',
                    }}>
                        Ronda
                    </div>
                    <div style={{
                        fontWeight: 800, color: '#f59e0b', lineHeight: 1,
                        fontSize: 'clamp(1.6rem, 3.5vw, 2.4rem)',
                        letterSpacing: '-0.02em',
                    }}>
                        {ronda}
                    </div>
                </div>
            </header>

            {/* ── Contenido ── */}
            <main style={{
                position: 'relative', zIndex: 10,
                padding: '0 clamp(12px, 2.5vw, 32px) clamp(16px, 3vw, 28px)',
            }}>

                {/* Banner de fase */}
                {mostrandoResultado && ultimoResultado && (
                    <ResultBanner result={ultimoResultado} teams={equipos} />
                )}
                {respondiendo && (
                    <AnsweringBanner puja={pujaActual!} teams={equipos} />
                )}
                {esperandoPujas && (
                    <WaitingBanner vetadoId={equipoVetadoId} teams={equipos} />
                )}

                {/* Reto Card */}
                <div className="pv-reveal-1" style={{ maxWidth: '900px', margin: '0 auto 20px' }}>
                    {retoActual ? (
                        <RetoCard reto={retoActual} ronda={ronda} />
                    ) : (
                        <div style={{
                            borderRadius: '20px', padding: 'clamp(32px,5vw,56px)', textAlign: 'center',
                            background: 'rgba(15,23,42,0.8)',
                            border: '2px dashed rgba(245,158,11,0.15)',
                        }}>
                            <Zap size={36} color="rgba(245,158,11,0.2)" style={{ marginBottom: '12px' }} />
                            <p style={{ color: '#475569', fontSize: '1rem', fontWeight: 600 }}>
                                Esperando siguiente reto...
                            </p>
                        </div>
                    )}
                </div>

                {/* ScoreBoard */}
                <div className="pv-reveal-2" style={{ maxWidth: '1100px', margin: '0 auto' }}>
                    <ScoreBoard
                        teams={equipos}
                        highlightTeamId={pujaActual?.equipoId}
                        vetadoId={equipoVetadoId}
                    />
                </div>
            </main>

            {/* Veto overlay */}
            <VetoOverlay vetadoId={equipoVetadoId} teams={equipos} />
        </div>
    );
}

// ─────────────────────────────────────
// Banners contextuales
// ─────────────────────────────────────

function ResultBanner({ result, teams }: { result: GameHistory; teams: Team[] }) {
    const team = teams.find(t => t.id === result.puja.equipoId);
    const ok = result.correcto;
    const saved = !ok && result.puja.powerupUsado === 'SALVA';
    const pts = result.puntosGanados;

    const cfg = ok
        ? { Icon: CheckCircle, color: '#22c55e', bg: 'rgba(21,128,61,0.1)', border: 'rgba(34,197,94,0.25)', label: '¡Correcto!', ptLabel: `+${pts}` }
        : saved
        ? { Icon: ShieldCheck, color: '#60a5fa', bg: 'rgba(29,78,216,0.1)', border: 'rgba(96,165,250,0.25)', label: '¡Salvado!', ptLabel: '0' }
        : { Icon: XCircle, color: '#ef4444', bg: 'rgba(153,27,27,0.1)', border: 'rgba(239,68,68,0.25)', label: 'Incorrecto', ptLabel: `${pts}` };

    return (
        <div className="pv-scale" style={{ maxWidth: '900px', margin: '0 auto 14px' }}>
            <div style={{
                borderRadius: '14px', padding: 'clamp(12px,1.5vw,16px) clamp(16px,2vw,24px)',
                background: cfg.bg, border: `1px solid ${cfg.border}`,
                display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px',
            }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <cfg.Icon size={28} color={cfg.color} />
                    <div>
                        <p style={{ margin: 0, fontWeight: 800, fontSize: 'clamp(1rem,2vw,1.25rem)', color: cfg.color, letterSpacing: '-0.01em' }}>
                            {cfg.label}
                        </p>
                        <p style={{ margin: 0, fontSize: '12px', color: '#64748b', fontWeight: 600 }}>{team?.nombre}</p>
                    </div>
                </div>
                <div style={{ fontWeight: 800, fontSize: 'clamp(1.4rem,3vw,2rem)', color: cfg.color, letterSpacing: '-0.02em', flexShrink: 0 }}>
                    {cfg.ptLabel} <span style={{ fontSize: '12px', opacity: 0.5, fontWeight: 600 }}>pts</span>
                </div>
            </div>
        </div>
    );
}

function AnsweringBanner({ puja, teams }: { puja: Puja; teams: Team[] }) {
    const team = teams.find(t => t.id === puja.equipoId);
    return (
        <div className="pv-scale pv-answering-glow" style={{ maxWidth: '900px', margin: '0 auto 14px' }}>
            <div style={{
                borderRadius: '14px', padding: 'clamp(10px,1.5vw,14px) clamp(16px,2vw,24px)',
                background: 'rgba(245,158,11,0.07)', border: '1px solid rgba(245,158,11,0.22)',
                display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px',
            }}>
                <div>
                    <p style={{ margin: 0, fontSize: '9px', fontWeight: 700, color: 'rgba(245,158,11,0.5)', letterSpacing: '0.15em', textTransform: 'uppercase' }}>
                        Respondiendo
                    </p>
                    <p style={{ margin: 0, fontWeight: 800, fontSize: 'clamp(1rem,2.2vw,1.3rem)', color: '#fbbf24', letterSpacing: '-0.01em' }}>
                        {team?.nombre}
                    </p>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                    {puja.powerupUsado && (
                        <div style={{
                            padding: '5px 12px', borderRadius: '8px', fontSize: '12px', fontWeight: 700,
                            background: puja.powerupUsado === 'DOBLE' ? 'rgba(96,165,250,0.12)' : 'rgba(52,211,153,0.12)',
                            color: puja.powerupUsado === 'DOBLE' ? '#60a5fa' : '#34d399',
                            border: `1px solid ${puja.powerupUsado === 'DOBLE' ? 'rgba(96,165,250,0.25)' : 'rgba(52,211,153,0.25)'}`,
                        }}>
                            {puja.powerupUsado === 'DOBLE' ? '🎯 Doble' : '🛡️ Salva'}
                        </div>
                    )}
                    <div style={{ textAlign: 'right' }}>
                        <p style={{ margin: 0, fontSize: '9px', fontWeight: 700, color: 'rgba(245,158,11,0.5)', letterSpacing: '0.15em', textTransform: 'uppercase' }}>
                            Puja
                        </p>
                        <p style={{ margin: 0, fontWeight: 800, fontSize: 'clamp(1.2rem,2.5vw,1.7rem)', color: '#f59e0b', letterSpacing: '-0.02em' }}>
                            {puja.cantidad} <span style={{ fontSize: '11px', opacity: 0.5, fontWeight: 600 }}>pts</span>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}

function WaitingBanner({ vetadoId, teams }: { vetadoId: string | null; teams: Team[] }) {
    const vetadoNombre = vetadoId ? teams.find(t => t.id === vetadoId)?.nombre : null;
    return (
        <div style={{ maxWidth: '900px', margin: '0 auto 10px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', padding: '8px 0' }}>
            <div style={{ display: 'flex', gap: '5px' }}>
                {[0, 1, 2].map(i => (
                    <div key={i} style={{
                        width: '5px', height: '5px', borderRadius: '50%', background: '#f59e0b',
                        animation: `pv-dot 1.4s ease-in-out ${i * 0.2}s infinite`,
                    }} />
                ))}
            </div>
            <span style={{ fontSize: '11px', fontWeight: 600, color: '#475569', letterSpacing: '0.12em', textTransform: 'uppercase' }}>
                Esperando pujas
            </span>
            {vetadoNombre && (
                <span style={{
                    padding: '3px 10px', borderRadius: '20px', fontSize: '11px', fontWeight: 700,
                    background: 'rgba(239,68,68,0.1)', color: '#f87171',
                    border: '1px solid rgba(239,68,68,0.2)',
                }}>
                    🚫 {vetadoNombre} bloqueado
                </span>
            )}
        </div>
    );
}