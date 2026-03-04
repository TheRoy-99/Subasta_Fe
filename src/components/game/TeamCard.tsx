// src/components/game/TeamCard.tsx

import { Target, Shield, Ban } from 'lucide-react';
import type { Team } from '../../models/types';
import { GAME_CONSTANTS } from '../../utils/constants';

interface TeamCardProps {
    team: Team;
    rank?: number;
    isActive?: boolean;
    isVetoed?: boolean;
}

const MAX = GAME_CONSTANTS.COMODINES_INICIALES; // { doble:2, salva:2, veto:2 }

const RANK_CFG: Record<number, { gradient: string; glow: string }> = {
    1: { gradient: 'linear-gradient(135deg,#fbbf24,#f59e0b)', glow: '0 0 0 2px rgba(251,191,36,0.5),0 0 40px rgba(251,191,36,0.2)' },
    2: { gradient: 'linear-gradient(135deg,#cbd5e1,#94a3b8)', glow: '0 0 0 1px rgba(148,163,184,0.3),0 0 24px rgba(148,163,184,0.1)' },
    3: { gradient: 'linear-gradient(135deg,#fb923c,#ea580c)', glow: '0 0 0 1px rgba(234,88,12,0.3),0 0 24px rgba(234,88,12,0.1)' },
};

export default function TeamCard({ team, rank = 0, isActive = false, isVetoed = false }: TeamCardProps) {
    const rankCfg = rank >= 1 && rank <= 3 ? RANK_CFG[rank] : null;

    return (
        <div style={{
            position: 'relative', borderRadius: '16px', overflow: 'hidden',
            transition: 'transform 0.4s cubic-bezier(0.16,1,0.3,1), box-shadow 0.4s ease',
            transform: isActive ? 'scale(1.03)' : 'scale(1)',
            boxShadow: isActive
                ? '0 0 0 2px #F59E0B,0 0 40px rgba(245,158,11,0.2)'
                : isVetoed ? '0 0 0 2px #ef4444,0 0 30px rgba(239,68,68,0.12)'
                : rankCfg ? rankCfg.glow : '0 4px 20px rgba(0,0,0,0.35)',
            fontFamily: "'Plus Jakarta Sans', sans-serif",
        }}>
            {/* Fondo */}
            <div style={{
                position: 'absolute', inset: 0,
                background: isVetoed ? 'linear-gradient(135deg,#1a0a0a,#2d0f0f)'
                    : isActive ? 'linear-gradient(135deg,#1c1507,#2d2008)'
                    : 'linear-gradient(135deg,#0f172a,#1e293b)',
            }} />

            {/* Línea acento superior */}
            <div style={{
                position: 'absolute', top: 0, left: 0, right: 0, height: '2px',
                background: isVetoed ? 'linear-gradient(90deg,transparent,#ef4444,transparent)'
                    : isActive ? 'linear-gradient(90deg,transparent,#F59E0B,transparent)'
                    : `linear-gradient(90deg,transparent,${team.color ?? '#475569'},transparent)`,
            }} />

            {/* Dot pattern */}
            <div style={{
                position: 'absolute', inset: 0, opacity: 0.025,
                backgroundImage: 'radial-gradient(circle at 1px 1px,white 1px,transparent 0)',
                backgroundSize: '20px 20px',
            }} />

            <div style={{ position: 'relative', padding: '14px 16px' }}>

                {/* Fila superior: rank + dot */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                    {rankCfg ? (
                        <span style={{
                            fontSize: '11px', fontWeight: 800, letterSpacing: '0.06em',
                            background: rankCfg.gradient,
                            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
                        }}>{rank}°</span>
                    ) : (
                        <span style={{ fontSize: '11px', fontWeight: 700, color: '#334155' }}>#{rank}</span>
                    )}
                    <div style={{
                        width: '8px', height: '8px', borderRadius: '50%',
                        background: team.color ?? '#F59E0B',
                        boxShadow: `0 0 6px ${team.color ?? '#F59E0B'}80`,
                    }} />
                </div>

                {/* Nombre */}
                <div style={{ marginBottom: '2px' }}>
                    {isVetoed && (
                        <div style={{
                            display: 'flex', alignItems: 'center', gap: '4px',
                            fontSize: '9px', fontWeight: 700, color: '#ef4444',
                            letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '3px',
                        }}>
                            <Ban size={9} /> Bloqueado
                        </div>
                    )}
                    <h3 style={{
                        margin: 0, fontWeight: 800, lineHeight: 1.2,
                        fontSize: 'clamp(0.82rem,1.8vw,1rem)',
                        color: isVetoed ? '#fca5a5' : isActive ? '#fbbf24' : '#f1f5f9',
                        letterSpacing: '-0.01em',
                        whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
                    }}>{team.nombre}</h3>
                </div>

                {/* Puntos */}
                <div style={{ margin: '10px 0 12px' }}>
                    <div style={{
                        fontWeight: 800, lineHeight: 1,
                        fontSize: 'clamp(1.5rem,3vw,2.1rem)',
                        letterSpacing: '-0.02em',
                        color: isVetoed ? '#ef4444' : isActive ? '#F59E0B' : rank === 1 ? '#fbbf24' : '#e2e8f0',
                    }}>
                        {team.puntos.toLocaleString()}
                    </div>
                    <div style={{
                        fontSize: '9px', fontWeight: 600, color: '#475569',
                        letterSpacing: '0.12em', textTransform: 'uppercase', marginTop: '2px',
                    }}>puntos</div>
                </div>

                {/* Separador */}
                <div style={{ height: '1px', background: 'rgba(255,255,255,0.06)', marginBottom: '10px' }} />

                {/* ── Comodines con indicador de usos restantes ── */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                    <PowerupRow
                        icon={<Target size={11} />}
                        label="Doble"
                        used={MAX.doble - team.comodines.doble}
                        max={MAX.doble}
                        color="#60a5fa"
                    />
                    <PowerupRow
                        icon={<Shield size={11} />}
                        label="Salva"
                        used={MAX.salva - team.comodines.salva}
                        max={MAX.salva}
                        color="#34d399"
                    />
                    <PowerupRow
                        icon={<Ban size={11} />}
                        label="Veto"
                        used={MAX.veto - team.comodines.veto}
                        max={MAX.veto}
                        color="#f87171"
                    />
                </div>
            </div>

            {/* Glow activo */}
            {isActive && (
                <div style={{
                    position: 'absolute', inset: 0, pointerEvents: 'none',
                    background: 'radial-gradient(ellipse at 50% 0%,rgba(245,158,11,0.07) 0%,transparent 70%)',
                }} />
            )}
        </div>
    );
}

// ─────────────────────────────────────────────────────────────
// PowerupRow: fila con ícono + label + puntos de usos restantes
// ─────────────────────────────────────────────────────────────

interface PowerupRowProps {
    icon: React.ReactNode;
    label: string;
    used: number;      // cuántos ya se usaron
    max: number;       // total inicial
    color: string;
}

function PowerupRow({ icon, label, used, max, color }: PowerupRowProps) {
    const remaining = max - used;
    const agotado = remaining <= 0;

    return (
        <div style={{
            display: 'flex', alignItems: 'center', gap: '7px',
            opacity: agotado ? 0.35 : 1,
            transition: 'opacity 0.3s',
        }}>
            {/* Ícono */}
            <span style={{ color: agotado ? '#334155' : color, display: 'flex', flexShrink: 0 }}>
                {icon}
            </span>

            {/* Label */}
            <span style={{
                fontSize: '10px', fontWeight: 700,
                color: agotado ? '#334155' : '#64748b',
                letterSpacing: '0.04em', flexShrink: 0,
                minWidth: '34px',
            }}>
                {label}
            </span>

            {/* Círculos de usos */}
            <div style={{ display: 'flex', gap: '4px', alignItems: 'center' }}>
                {Array.from({ length: max }).map((_, i) => {
                    const isUsed = i >= remaining; // los últimos están "usados"
                    return (
                        <div
                            key={i}
                            style={{
                                width: '10px', height: '10px', borderRadius: '50%',
                                transition: 'all 0.25s ease',
                                background: isUsed
                                    ? 'transparent'
                                    : color,
                                border: `1.5px solid ${isUsed ? '#1e293b' : color}`,
                                boxShadow: isUsed ? 'none' : `0 0 5px ${color}60`,
                            }}
                        />
                    );
                })}
            </div>

            {/* Número restante */}
            <span style={{
                marginLeft: 'auto',
                fontSize: '11px', fontWeight: 800,
                color: agotado ? '#1e293b' : color,
                letterSpacing: '0.02em',
            }}>
                {agotado ? '—' : `${remaining}/${max}`}
            </span>
        </div>
    );
}