// src/views/ConfigView.tsx

import { useState } from 'react';
import { Zap, Users, Play } from 'lucide-react';
import { GAME_CONSTANTS } from '../utils/constants';

interface ConfigViewProps {
    onStart: (nombresEquipos: string[]) => void;
}

const FONT = "'Plus Jakarta Sans', sans-serif";
const EQUIPOS_DEFAULT = ['Alfa', 'Beta', 'Gamma', 'Delta', 'Épsilon', 'Zeta', 'Eta', 'Theta'];

export default function ConfigView({ onStart }: ConfigViewProps) {
    const [numeroEquipos, setNumeroEquipos] = useState(4);
    const [nombresEquipos, setNombresEquipos] = useState<string[]>(['Alfa', 'Beta', 'Gamma', 'Delta']);

    const handleNumeroEquiposChange = (num: number) => {
        setNumeroEquipos(num);
        const nombres = [...nombresEquipos];
        while (nombres.length < num) nombres.push(EQUIPOS_DEFAULT[nombres.length] ?? `Equipo ${nombres.length + 1}`);
        setNombresEquipos(nombres.slice(0, num));
    };

    const handleNombreChange = (index: number, nombre: string) => {
        const nuevos = [...nombresEquipos];
        nuevos[index] = nombre;
        setNombresEquipos(nuevos);
    };

    const handleStart = () => {
        const validos = nombresEquipos.filter(n => n.trim().length > 0);
        if (validos.length < 2) {
            alert('Debe haber al menos 2 equipos con nombres válidos');
            return;
        }
        onStart(validos);
    };

    const { doble, salva, veto } = GAME_CONSTANTS.COMODINES_INICIALES;

    return (
        <div style={{
            minHeight: '100vh', color: 'white', position: 'relative', overflow: 'hidden',
            background: 'linear-gradient(160deg, #020617 0%, #0f172a 50%, #020617 100%)',
            fontFamily: FONT,
        }}>
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');

                @keyframes cfg-float-a {
                    0%,100% { transform: translateY(0); }
                    50%     { transform: translateY(-30px); }
                }
                @keyframes cfg-float-b {
                    0%,100% { transform: translateY(0); }
                    50%     { transform: translateY(20px); }
                }
                @keyframes cfg-in {
                    from { opacity:0; transform: translateY(16px); }
                    to   { opacity:1; transform: translateY(0); }
                }
                @keyframes cfg-shimmer {
                    0%   { background-position: -200% center; }
                    100% { background-position: 200% center; }
                }

                .cfg-stagger > * { opacity:0; animation: cfg-in 0.5s cubic-bezier(0.16,1,0.3,1) both; }
                .cfg-stagger > *:nth-child(1) { animation-delay: 0.05s; }
                .cfg-stagger > *:nth-child(2) { animation-delay: 0.15s; }
                .cfg-stagger > *:nth-child(3) { animation-delay: 0.25s; }
                .cfg-stagger > *:nth-child(4) { animation-delay: 0.35s; }

                .cfg-shimmer {
                    background: linear-gradient(90deg, #fbbf24, #f97316, #fbbf24, #f59e0b);
                    background-size: 200% auto;
                    -webkit-background-clip: text; background-clip: text;
                    -webkit-text-fill-color: transparent;
                    animation: cfg-shimmer 3s linear infinite;
                }

                .cfg-num-btn {
                    width: 48px; height: 48px; border-radius: 12px;
                    font-weight: 800; font-size: 15px; cursor: pointer;
                    transition: all 0.15s ease; border: none;
                    font-family: 'Plus Jakarta Sans', sans-serif;
                }
                .cfg-num-btn:hover { transform: translateY(-2px); }

                .cfg-input {
                    width: 100%; border-radius: 11px; font-size: 15px; font-weight: 600;
                    padding: 13px 16px 13px 32px; outline: none;
                    background: rgba(15,23,42,0.7);
                    border: 1px solid rgba(255,255,255,0.07);
                    color: #f1f5f9;
                    transition: border-color 0.2s, background 0.2s;
                    font-family: 'Plus Jakarta Sans', sans-serif;
                }
                .cfg-input:focus {
                    border-color: rgba(245,158,11,0.5);
                    background: rgba(245,158,11,0.03);
                }
                .cfg-input::placeholder { color: #334155; }

                .cfg-start-btn {
                    cursor: pointer; border: none; transition: all 0.2s ease;
                    font-family: 'Plus Jakarta Sans', sans-serif;
                }
                .cfg-start-btn:hover { transform: translateY(-2px); box-shadow: 0 16px 48px rgba(245,158,11,0.28) !important; }
                .cfg-start-btn:active { transform: translateY(0); }
            `}</style>

            {/* Fondo atmosférico */}
            <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', overflow: 'hidden' }}>
                <div style={{
                    position: 'absolute', width: '600px', height: '600px',
                    top: '-220px', left: '-130px', borderRadius: '50%',
                    background: 'radial-gradient(circle, rgba(245,158,11,0.1), transparent)',
                    filter: 'blur(80px)', animation: 'cfg-float-a 14s ease-in-out infinite',
                }} />
                <div style={{
                    position: 'absolute', width: '450px', height: '450px',
                    bottom: '-180px', right: '-100px', borderRadius: '50%',
                    background: 'radial-gradient(circle, rgba(59,130,246,0.07), transparent)',
                    filter: 'blur(80px)', animation: 'cfg-float-b 18s ease-in-out infinite',
                }} />
                <div style={{
                    position: 'absolute', inset: 0, opacity: 0.02,
                    backgroundImage: 'radial-gradient(circle at 1px 1px, white 1px, transparent 0)',
                    backgroundSize: '36px 36px',
                }} />
            </div>

            {/* Contenido */}
            <div className="cfg-stagger" style={{
                position: 'relative', zIndex: 10,
                maxWidth: '680px', margin: '0 auto',
                padding: 'clamp(40px,8vh,80px) clamp(16px,4vw,32px)',
            }}>

                {/* Header */}
                <div style={{ textAlign: 'center', marginBottom: '40px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px', marginBottom: '10px' }}>
                        <div style={{
                            padding: '10px', borderRadius: '14px',
                            background: 'rgba(245,158,11,0.1)', border: '1px solid rgba(245,158,11,0.2)',
                        }}>
                            <Zap size={32} color="#f59e0b" fill="rgba(245,158,11,0.2)" />
                        </div>
                        <h1 className="cfg-shimmer" style={{
                            margin: 0, fontWeight: 800,
                            fontSize: 'clamp(2rem, 6vw, 3.5rem)', letterSpacing: '-0.02em',
                        }}>
                            Subasta de Fe
                        </h1>
                    </div>
                    <p style={{ margin: 0, fontSize: '12px', color: '#475569', fontWeight: 600, letterSpacing: '0.15em', textTransform: 'uppercase' }}>
                        Trivia Bíblica Interactiva
                    </p>
                </div>

                {/* Card principal */}
                <div style={{
                    borderRadius: '24px', padding: 'clamp(24px,4vw,40px)',
                    background: 'rgba(15,23,42,0.65)', backdropFilter: 'blur(20px)',
                    border: '1px solid rgba(255,255,255,0.06)',
                    boxShadow: '0 32px 80px rgba(0,0,0,0.4)',
                }}>

                    {/* Número de equipos */}
                    <section style={{ marginBottom: '28px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '14px' }}>
                            <Users size={16} color="#f59e0b" />
                            <h2 style={{ margin: 0, fontSize: '12px', fontWeight: 700, color: '#64748b', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
                                Número de equipos
                            </h2>
                        </div>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                            {[2, 3, 4, 5, 6, 7, 8].map(num => (
                                <button
                                    key={num}
                                    onClick={() => handleNumeroEquiposChange(num)}
                                    className="cfg-num-btn"
                                    style={{
                                        background: numeroEquipos === num
                                            ? 'linear-gradient(135deg, #f59e0b, #f97316)'
                                            : 'rgba(30,41,59,0.7)',
                                        color: numeroEquipos === num ? '#000' : '#475569',
                                        boxShadow: numeroEquipos === num ? '0 6px 20px rgba(245,158,11,0.3)' : 'none',
                                    }}
                                >
                                    {num}
                                </button>
                            ))}
                        </div>
                    </section>

                    {/* Separador */}
                    <div style={{ height: '1px', background: 'rgba(255,255,255,0.05)', marginBottom: '28px' }} />

                    {/* Nombres */}
                    <section style={{ marginBottom: '28px' }}>
                        <h2 style={{ margin: '0 0 14px', fontSize: '12px', fontWeight: 700, color: '#64748b', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
                            Nombres de los equipos
                        </h2>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '10px' }}>
                            {nombresEquipos.map((nombre, i) => (
                                <div key={i} style={{ position: 'relative' }}>
                                    <span style={{
                                        position: 'absolute', left: '13px', top: '50%', transform: 'translateY(-50%)',
                                        fontSize: '11px', fontWeight: 800, color: '#1e293b', userSelect: 'none',
                                    }}>
                                        {i + 1}
                                    </span>
                                    <input
                                        type="text"
                                        value={nombre}
                                        onChange={e => handleNombreChange(i, e.target.value)}
                                        placeholder={`Equipo ${i + 1}`}
                                        maxLength={20}
                                        className="cfg-input"
                                    />
                                </div>
                            ))}
                        </div>
                    </section>

                    {/* Separador */}
                    <div style={{ height: '1px', background: 'rgba(255,255,255,0.05)', marginBottom: '28px' }} />

                    {/* Reglas */}
                    <section style={{ marginBottom: '28px' }}>
                        <h2 style={{ margin: '0 0 14px', fontSize: '12px', fontWeight: 700, color: '#64748b', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
                            Comodines por equipo
                        </h2>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px' }}>
                            <RuleCard emoji="🎯" title="Doble" desc="×2 si aciertas, ×2 si fallas" count={doble} color="#60a5fa" />
                            <RuleCard emoji="🛡️" title="Salva" desc="Sin pérdida al fallar" count={salva} color="#34d399" />
                            <RuleCard emoji="🚫" title="Veto" desc="Bloquea rival por ronda" count={veto} color="#f87171" />
                        </div>
                    </section>

                    {/* Botón */}
                    <button
                        onClick={handleStart}
                        className="cfg-start-btn"
                        style={{
                            width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px',
                            padding: '16px', borderRadius: '14px', fontWeight: 800, fontSize: '16px',
                            background: 'linear-gradient(135deg, #f59e0b, #f97316)',
                            color: '#000', letterSpacing: '-0.01em',
                            boxShadow: '0 8px 28px rgba(245,158,11,0.2)',
                        }}
                    >
                        <Play size={20} fill="#000" />
                        Iniciar Juego
                    </button>
                </div>
            </div>
        </div>
    );
}

function RuleCard({ emoji, title, count, desc, color }: {
    emoji: string; title: string; count: number; desc: string; color: string;
}) {
    return (
        <div style={{
            borderRadius: '12px', padding: '14px',
            background: `${color}0a`, border: `1px solid ${color}1e`,
        }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <span style={{ fontSize: '14px' }}>{emoji}</span>
                    <span style={{ fontWeight: 800, fontSize: '12px', color, letterSpacing: '0.04em' }}>{title}</span>
                </div>
                <span style={{
                    padding: '2px 8px', borderRadius: '20px', fontSize: '11px', fontWeight: 800,
                    background: `${color}18`, color,
                }}>
                    ×{count}
                </span>
            </div>
            <p style={{ margin: 0, fontSize: '11px', color: '#475569', fontWeight: 500, lineHeight: 1.4 }}>{desc}</p>
        </div>
    );
}