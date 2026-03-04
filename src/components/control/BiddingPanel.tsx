// src/components/control/BiddingPanel.tsx

import { useState, useEffect } from 'react';
import { Target, Shield, Ban, AlertCircle } from 'lucide-react';
import { Team, PowerupType } from '../../models/types';
import { GAME_CONSTANTS } from '../../utils/constants';

interface BiddingPanelProps {
    teams: Team[];
    onSubmit: (equipoId: string, puja: number, powerup?: PowerupType) => void;
    disabled?: boolean;
    minBid: number;
    vetadoId: string | null;
}

const MAX = GAME_CONSTANTS.COMODINES_INICIALES;

export default function BiddingPanel({ teams, onSubmit, disabled = false, minBid, vetadoId }: BiddingPanelProps) {
    const [equipoId, setEquipoId] = useState('');
    const [puja, setPuja] = useState(minBid);
    const [powerup, setPowerup] = useState<PowerupType | ''>('');
    const [error, setError] = useState('');

    useEffect(() => {
        setPuja(current => Math.max(current, minBid));
    }, [minBid]);

    // Reset powerup si cambia el equipo (el nuevo puede no tener el comodín)
    useEffect(() => {
        setPowerup('');
    }, [equipoId]);

    const selectedTeam = teams.find(t => t.id === equipoId);

    const handlePujaChange = (val: string) =>
        setPuja(Math.max(minBid, Math.min(GAME_CONSTANTS.MAX_PUJA, parseInt(val) || minBid)));

    const incrementPuja = () => setPuja(p => Math.min(p + 10, GAME_CONSTANTS.MAX_PUJA));
    const decrementPuja = () => setPuja(p => Math.max(p - 10, minBid));

    const handleSubmit = () => {
        setError('');
        if (!equipoId) return setError('Selecciona un equipo');
        if (puja < minBid) return setError(`Mínimo ${minBid} puntos`);
        if (powerup === 'DOBLE' && (selectedTeam?.comodines.doble ?? 0) <= 0)
            return setError('Este equipo no tiene comodines DOBLE');
        if (powerup === 'SALVA' && (selectedTeam?.comodines.salva ?? 0) <= 0)
            return setError('Este equipo no tiene comodines SALVA');
        onSubmit(equipoId, puja, powerup || undefined);
        setPowerup('');
    };

    const dobleDisponible = (selectedTeam?.comodines.doble ?? 0) > 0;
    const salvaDisponible = (selectedTeam?.comodines.salva ?? 0) > 0;

    return (
        <div style={{
            background: '#1e293b', borderRadius: '16px', padding: '24px',
            border: '1px solid #334155',
            opacity: disabled ? 0.5 : 1,
            pointerEvents: disabled ? 'none' : 'auto',
        }}>
            {/* Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <h3 style={{
                    margin: 0, display: 'flex', alignItems: 'center', gap: '8px',
                    color: '#f59e0b', fontWeight: 700, fontSize: '17px',
                    fontFamily: "'Plus Jakarta Sans', sans-serif",
                }}>
                    <Target size={20} /> Registrar Puja
                </h3>
                {vetadoId && (
                    <div style={{
                        display: 'flex', alignItems: 'center', gap: '6px',
                        background: 'rgba(239,68,68,0.15)', color: '#f87171',
                        padding: '4px 12px', borderRadius: '20px', fontSize: '12px', fontWeight: 700,
                        border: '1px solid rgba(239,68,68,0.3)',
                        fontFamily: "'Plus Jakarta Sans', sans-serif",
                    }}>
                        <Ban size={13} />
                        {teams.find(t => t.id === vetadoId)?.nombre} BLOQUEADO
                    </div>
                )}
            </div>

            {/* Error */}
            {error && (
                <div style={{
                    display: 'flex', alignItems: 'center', gap: '8px',
                    background: 'rgba(239,68,68,0.15)', border: '1px solid rgba(239,68,68,0.4)',
                    borderRadius: '10px', padding: '10px 14px', marginBottom: '16px',
                    color: '#fca5a5', fontSize: '14px', fontFamily: "'Plus Jakarta Sans', sans-serif",
                }}>
                    <AlertCircle size={18} /> {error}
                </div>
            )}

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>

                {/* Selector de equipo */}
                <div>
                    <label style={{
                        display: 'block', fontSize: '13px', fontWeight: 600,
                        color: '#94a3b8', marginBottom: '8px',
                        fontFamily: "'Plus Jakarta Sans', sans-serif",
                    }}>
                        Equipo Ganador
                    </label>
                    <select
                        value={equipoId}
                        onChange={e => setEquipoId(e.target.value)}
                        style={{
                            width: '100%', background: '#0f172a', border: '1px solid #334155',
                            borderRadius: '10px', padding: '11px 14px', color: 'white',
                            fontSize: '14px', outline: 'none', cursor: 'pointer',
                            appearance: 'none', fontFamily: "'Plus Jakarta Sans', sans-serif",
                        }}
                    >
                        <option value="">Seleccionar...</option>
                        {teams.map(team => (
                            <option
                                key={team.id} value={team.id}
                                disabled={team.id === vetadoId}
                                style={{ color: team.id === vetadoId ? '#ef4444' : 'white' }}
                            >
                                {team.nombre} ({team.puntos} pts){team.id === vetadoId ? ' — VETADO' : ''}
                            </option>
                        ))}
                    </select>

                    {/* Resumen de comodines del equipo seleccionado */}
                    {selectedTeam && (
                        <div style={{
                            marginTop: '10px', padding: '10px 12px', borderRadius: '10px',
                            background: '#0f172a', border: '1px solid #1e293b',
                        }}>
                            <p style={{
                                margin: '0 0 8px', fontSize: '10px', fontWeight: 700,
                                color: '#475569', letterSpacing: '0.1em', textTransform: 'uppercase',
                                fontFamily: "'Plus Jakarta Sans', sans-serif",
                            }}>
                                Comodines disponibles
                            </p>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                                <MiniPowerupRow
                                    icon={<Target size={10} />}
                                    label="Doble"
                                    remaining={selectedTeam.comodines.doble}
                                    max={MAX.doble}
                                    color="#60a5fa"
                                />
                                <MiniPowerupRow
                                    icon={<Shield size={10} />}
                                    label="Salva"
                                    remaining={selectedTeam.comodines.salva}
                                    max={MAX.salva}
                                    color="#34d399"
                                />
                                <MiniPowerupRow
                                    icon={<Ban size={10} />}
                                    label="Veto"
                                    remaining={selectedTeam.comodines.veto}
                                    max={MAX.veto}
                                    color="#f87171"
                                />
                            </div>
                        </div>
                    )}
                </div>

                {/* Monto pujado */}
                <div>
                    <label style={{
                        display: 'block', fontSize: '13px', fontWeight: 600,
                        color: '#94a3b8', marginBottom: '8px',
                        fontFamily: "'Plus Jakarta Sans', sans-serif",
                    }}>
                        Monto Pujado
                    </label>
                    <div style={{
                        display: 'flex', alignItems: 'center',
                        background: '#0f172a', border: '1px solid #334155',
                        borderRadius: '10px', overflow: 'hidden', height: '44px',
                    }}>
                        <button
                            onClick={decrementPuja}
                            style={{
                                flexShrink: 0, width: '44px', height: '100%',
                                background: 'transparent', border: 'none',
                                borderRight: '1px solid #334155',
                                color: '#94a3b8', fontSize: '20px', cursor: 'pointer',
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                transition: 'background 0.15s, color 0.15s',
                            }}
                            onMouseEnter={e => { e.currentTarget.style.background = '#1e293b'; e.currentTarget.style.color = 'white'; }}
                            onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#94a3b8'; }}
                        >−</button>
                        <input
                            type="number"
                            value={puja}
                            onChange={e => handlePujaChange(e.target.value)}
                            style={{
                                flex: 1, background: 'transparent', border: 'none',
                                color: 'white', fontWeight: 800, fontSize: '20px',
                                textAlign: 'center', outline: 'none',
                                fontFamily: "'Plus Jakarta Sans', sans-serif",
                            }}
                        />
                        <button
                            onClick={incrementPuja}
                            style={{
                                flexShrink: 0, width: '44px', height: '100%',
                                background: 'transparent', border: 'none',
                                borderLeft: '1px solid #334155',
                                color: '#94a3b8', fontSize: '20px', cursor: 'pointer',
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                transition: 'background 0.15s, color 0.15s',
                            }}
                            onMouseEnter={e => { e.currentTarget.style.background = '#1e293b'; e.currentTarget.style.color = 'white'; }}
                            onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#94a3b8'; }}
                        >+</button>
                    </div>
                </div>
            </div>

            {/* Selector de comodín */}
            <div style={{ marginBottom: '20px' }}>
                <label style={{
                    display: 'block', fontSize: '13px', fontWeight: 600,
                    color: '#94a3b8', marginBottom: '10px',
                    fontFamily: "'Plus Jakarta Sans', sans-serif",
                }}>
                    Usar Poder Especial
                </label>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '10px' }}>
                    <PowerupOption
                        label="🎯 DOBLE"
                        sub={dobleDisponible
                            ? `${selectedTeam?.comodines.doble ?? '?'}/${MAX.doble} restantes`
                            : 'Sin comodines'}
                        selected={powerup === 'DOBLE'}
                        disabled={!selectedTeam || !dobleDisponible}
                        activeColor="#3b82f6"
                        onSelect={() => setPowerup(powerup === 'DOBLE' ? '' : 'DOBLE')}
                    />
                    <PowerupOption
                        label="🛡️ SALVA"
                        sub={salvaDisponible
                            ? `${selectedTeam?.comodines.salva ?? '?'}/${MAX.salva} restantes`
                            : 'Sin comodines'}
                        selected={powerup === 'SALVA'}
                        disabled={!selectedTeam || !salvaDisponible}
                        activeColor="#22c55e"
                        onSelect={() => setPowerup(powerup === 'SALVA' ? '' : 'SALVA')}
                    />
                    <PowerupOption
                        label="Normal"
                        sub="Sin comodín"
                        selected={powerup === ''}
                        disabled={false}
                        activeColor="#64748b"
                        onSelect={() => setPowerup('')}
                    />
                </div>
            </div>

            {/* Confirmar */}
            <button
                onClick={handleSubmit}
                disabled={disabled || !equipoId}
                style={{
                    width: '100%', padding: '14px', borderRadius: '12px',
                    border: 'none', cursor: disabled || !equipoId ? 'not-allowed' : 'pointer',
                    background: disabled || !equipoId
                        ? '#1e293b'
                        : 'linear-gradient(135deg,#f59e0b,#f97316)',
                    color: disabled || !equipoId ? '#475569' : '#000',
                    fontWeight: 800, fontSize: '15px',
                    fontFamily: "'Plus Jakarta Sans', sans-serif",
                    transition: 'all 0.2s',
                }}
            >
                Confirmar Puja
            </button>
        </div>
    );
}

// ─────────────────────────────────────────────────────────────
// Sub-componentes
// ─────────────────────────────────────────────────────────────

function MiniPowerupRow({ icon, label, remaining, max, color }: {
    icon: React.ReactNode; label: string;
    remaining: number; max: number; color: string;
}) {
    const agotado = remaining <= 0;
    return (
        <div style={{
            display: 'flex', alignItems: 'center', gap: '6px',
            opacity: agotado ? 0.4 : 1,
        }}>
            <span style={{ color: agotado ? '#334155' : color, display: 'flex' }}>{icon}</span>
            <span style={{ fontSize: '11px', fontWeight: 600, color: '#475569', minWidth: '32px', fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                {label}
            </span>
            {/* Círculos */}
            <div style={{ display: 'flex', gap: '3px' }}>
                {Array.from({ length: max }).map((_, i) => (
                    <div key={i} style={{
                        width: '8px', height: '8px', borderRadius: '50%',
                        background: i < remaining ? color : 'transparent',
                        border: `1.5px solid ${i < remaining ? color : '#334155'}`,
                        boxShadow: i < remaining ? `0 0 4px ${color}60` : 'none',
                        transition: 'all 0.25s',
                    }} />
                ))}
            </div>
            <span style={{
                marginLeft: 'auto', fontSize: '11px', fontWeight: 800,
                color: agotado ? '#334155' : color,
                fontFamily: "'Plus Jakarta Sans', sans-serif",
            }}>
                {agotado ? 'Agotado' : `${remaining}/${max}`}
            </span>
        </div>
    );
}

function PowerupOption({ label, sub, selected, disabled, activeColor, onSelect }: {
    label: string; sub: string; selected: boolean;
    disabled: boolean; activeColor: string; onSelect: () => void;
}) {
    return (
        <button
            onClick={onSelect}
            disabled={disabled}
            style={{
                padding: '12px 8px', borderRadius: '10px', cursor: disabled ? 'not-allowed' : 'pointer',
                background: selected ? `${activeColor}20` : '#0f172a',
                border: `1px solid ${selected ? activeColor + '60' : '#334155'}`,
                opacity: disabled ? 0.35 : 1,
                transition: 'all 0.15s',
                display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px',
                fontFamily: "'Plus Jakarta Sans', sans-serif",
            }}
        >
            <span style={{ fontWeight: 800, fontSize: '13px', color: selected ? activeColor : '#94a3b8' }}>
                {label}
            </span>
            <span style={{ fontSize: '10px', color: selected ? activeColor + 'aa' : '#475569', lineHeight: 1.3, textAlign: 'center' }}>
                {sub}
            </span>
        </button>
    );
}