// src/features/control/ControlView.tsx

import { useState } from 'react';
import { Gamepad2, RotateCcw, XCircle, ChevronRight, AlertTriangle, ShieldAlert, SkipForward } from 'lucide-react';
import Swal from 'sweetalert2';
import BiddingPanel from '../../components/control/BiddingPanel';
import ActionButtons from '../../components/control/ActionButtons';
import VetoPanel from '../../components/control/VetoPanel';

interface ControlViewProps {
    game: any;
    onReset: () => void;
}

export default function ControlView({ game, onReset }: ControlViewProps) {
    const { gameState, actions, queries } = game;
    const [showVeto, setShowVeto] = useState(false);

    if (!gameState) {
        return (
            <div style={{ minHeight: '100vh', background: '#020617', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white' }}>
                Cargando...
            </div>
        );
    }

    const { retoActual, equipos, pujaActual, ronda, phase, equipoVetadoId } = gameState;
    const stats = queries.getStats();

    // ── Handlers ──────────────────────────────────────────────────────────────

    const handleExit = () => {
        Swal.fire({
            title: '¿Cerrar Panel?',
            text: '¿Estás seguro que deseas cerrar este panel de control?',
            icon: 'question',
            background: '#1e293b', color: '#fff',
            showCancelButton: true,
            confirmButtonColor: '#3b82f6', cancelButtonColor: '#ef4444',
            confirmButtonText: 'Sí, cerrar', cancelButtonText: 'No',
        }).then(result => { if (result.isConfirmed) window.close(); });
    };

    const handleCorrect = () => {
        actions.processAnswer(true);
        setTimeout(() => actions.startNextRound(), 2500);
    };

    const handleIncorrect = () => {
        actions.processAnswer(false);
        setTimeout(() => actions.startNextRound(), 2500);
    };

    // ── NUEVA FUNCIÓN: Saltar pregunta ────────────────────────────────────────
    const handleSkip = () => {
        Swal.fire({
            title: '¿Saltar esta pregunta?',
            html: `
                <p style="color:#94a3b8;margin:0">Nadie responde esta ronda.</p>
                <p style="color:#f87171;font-size:13px;margin-top:8px">No se asignan ni restan puntos.</p>
            `,
            icon: 'warning',
            background: '#1e293b', color: '#fff',
            showCancelButton: true,
            confirmButtonColor: '#f59e0b', cancelButtonColor: '#475569',
            confirmButtonText: '⏭ Sí, saltar', cancelButtonText: 'Cancelar',
            reverseButtons: true,
        }).then(result => {
            if (result.isConfirmed) {
                actions.skipQuestion();
                Swal.fire({
                    title: 'Pregunta saltada',
                    text: 'Avanzando a la siguiente ronda...',
                    icon: 'info',
                    timer: 1400, showConfirmButton: false,
                    background: '#1e293b', color: '#fff',
                });
            }
        });
    };

    // ── Renderizado por fase ──────────────────────────────────────────────────

    const renderMainContent = () => {
        switch (phase) {
            case 'SHOWING_QUESTION':
                if (pujaActual) {
                    return (
                        <div style={{
                            textAlign: 'center', padding: '40px',
                            background: '#1e293b', borderRadius: '16px', border: '1px solid #334155',
                        }}>
                            <p style={{ color: '#475569', margin: 0 }}>Sincronizando puja...</p>
                        </div>
                    );
                }

                if (showVeto) {
                    return (
                        <VetoPanel
                            teams={equipos}
                            onApplyVeto={actions.applyVeto}
                            onClose={() => setShowVeto(false)}
                        />
                    );
                }

                return (
                    <div>
                        {/* Botón veto */}
                        {!equipoVetadoId && (
                            <button
                                onClick={() => setShowVeto(true)}
                                style={{
                                    width: '100%', marginBottom: '12px', padding: '12px',
                                    background: 'transparent',
                                    border: '2px dashed rgba(239,68,68,0.3)',
                                    borderRadius: '12px', color: '#f87171',
                                    fontSize: '13px', fontWeight: 700, cursor: 'pointer',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                                    letterSpacing: '0.05em', textTransform: 'uppercase',
                                    transition: 'all 0.2s',
                                }}
                                onMouseEnter={e => { e.currentTarget.style.background = 'rgba(239,68,68,0.06)'; e.currentTarget.style.borderColor = 'rgba(239,68,68,0.5)'; }}
                                onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.borderColor = 'rgba(239,68,68,0.3)'; }}
                            >
                                <ShieldAlert size={16} />
                                Usar Poder de Veto (Bloquear Equipo)
                            </button>
                        )}

                        {/* Botón saltar — disponible siempre en fase SHOWING_QUESTION */}
                        <button
                            onClick={handleSkip}
                            style={{
                                width: '100%', marginBottom: '12px', padding: '12px',
                                background: 'transparent',
                                border: '2px dashed rgba(245,158,11,0.25)',
                                borderRadius: '12px', color: '#f59e0b',
                                fontSize: '13px', fontWeight: 700, cursor: 'pointer',
                                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                                letterSpacing: '0.05em', textTransform: 'uppercase',
                                transition: 'all 0.2s',
                            }}
                            onMouseEnter={e => { e.currentTarget.style.background = 'rgba(245,158,11,0.06)'; e.currentTarget.style.borderColor = 'rgba(245,158,11,0.45)'; }}
                            onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.borderColor = 'rgba(245,158,11,0.25)'; }}
                        >
                            <SkipForward size={16} />
                            Saltar Pregunta (nadie respondió)
                        </button>

                        <BiddingPanel
                            teams={equipos}
                            onSubmit={actions.registerBid}
                            minBid={retoActual?.puntosBase || 10}
                            vetadoId={equipoVetadoId}
                        />
                    </div>
                );

            case 'ANSWERING':
                return (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                        {pujaActual && (
                            <div style={{
                                background: '#1e293b', borderLeft: '4px solid #f59e0b',
                                borderRadius: '12px', padding: '20px',
                            }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '14px' }}>
                                    <Gamepad2 size={22} color="#f59e0b" />
                                    <div>
                                        <p style={{ margin: 0, fontSize: '11px', color: '#64748b', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em' }}>Turno de</p>
                                        <p style={{ margin: 0, fontSize: '20px', fontWeight: 800, color: 'white' }}>
                                            {equipos.find((e: any) => e.id === pujaActual.equipoId)?.nombre}
                                        </p>
                                    </div>
                                </div>
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                                    <StatBox label="Apuesta" value={`${pujaActual.cantidad} pts`} color="#f59e0b" />
                                    <StatBox
                                        label="Comodín"
                                        value={
                                            pujaActual.powerupUsado === 'DOBLE' ? '🎯 Doble' :
                                            pujaActual.powerupUsado === 'SALVA' ? '🛡️ Salva' : '—'
                                        }
                                        color={
                                            pujaActual.powerupUsado === 'DOBLE' ? '#60a5fa' :
                                            pujaActual.powerupUsado === 'SALVA' ? '#34d399' : '#475569'
                                        }
                                    />
                                </div>
                            </div>
                        )}
                        <ActionButtons onCorrect={handleCorrect} onIncorrect={handleIncorrect} />
                    </div>
                );

            case 'SHOWING_RESULT':
                return (
                    <div style={{
                        background: 'rgba(34,197,94,0.08)', border: '1px solid rgba(34,197,94,0.25)',
                        borderRadius: '20px', padding: '40px', textAlign: 'center',
                    }}>
                        <ChevronRight size={36} color="#22c55e" style={{ marginBottom: '12px' }} />
                        <h3 style={{ margin: '0 0 8px', color: 'white', fontWeight: 800, fontSize: '20px' }}>¡Resultado Guardado!</h3>
                        <p style={{ margin: 0, color: 'rgba(34,197,94,0.7)', fontSize: '14px' }}>Avanzando automáticamente...</p>
                    </div>
                );

            default:
                return <div style={{ color: 'white' }}>Fase desconocida: {phase}</div>;
        }
    };

    return (
        <div style={{ minHeight: '100vh', background: '#020617', color: 'white', padding: '20px', fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
            <style>{`@import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');`}</style>

            <div style={{ maxWidth: '1100px', margin: '0 auto' }}>

                {/* Header */}
                <div style={{
                    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                    marginBottom: '24px', background: 'rgba(15,23,42,0.8)',
                    padding: '14px 20px', borderRadius: '16px',
                    border: '1px solid #1e293b', backdropFilter: 'blur(10px)',
                    position: 'sticky', top: '16px', zIndex: 50,
                }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <div style={{ background: '#3b82f6', padding: '8px', borderRadius: '10px' }}>
                            <Gamepad2 size={22} color="white" />
                        </div>
                        <span style={{ fontWeight: 800, fontSize: '18px' }}>Panel de Control</span>
                    </div>
                    <div style={{ display: 'flex', gap: '8px' }}>
                        <IconBtn onClick={onReset} title="Reiniciar" color="#64748b">
                            <RotateCcw size={18} />
                        </IconBtn>
                        <IconBtn onClick={handleExit} title="Salir" color="#ef4444">
                            <XCircle size={18} />
                        </IconBtn>
                    </div>
                </div>

                {/* Grid */}
                <div style={{ display: 'grid', gridTemplateColumns: '340px 1fr', gap: '20px' }}>

                    {/* Columna izquierda */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                            <StatCard label="RONDA" value={ronda} />
                            <StatCard label="PENDIENTES" value={stats.retosRestantes} valueColor="#3b82f6" />
                        </div>

                        {retoActual && (
                            <div style={{
                                background: '#0f172a', borderRadius: '16px', padding: '18px',
                                border: '1px solid #1e293b',
                            }}>
                                <div style={{
                                    display: 'inline-block', marginBottom: '12px',
                                    fontSize: '11px', fontWeight: 700, color: '#475569',
                                    background: '#1e293b', padding: '3px 10px', borderRadius: '6px',
                                }}>
                                    ID: {retoActual.id} · {retoActual.dificultad}
                                </div>
                                <p style={{ margin: '0 0 16px', fontSize: '15px', fontWeight: 600, color: '#f1f5f9', lineHeight: 1.5 }}>
                                    {retoActual.pregunta}
                                </p>
                                {retoActual.respuesta && (
                                    <div style={{
                                        background: 'rgba(34,197,94,0.08)', border: '1px solid rgba(34,197,94,0.3)',
                                        borderRadius: '10px', padding: '14px',
                                    }}>
                                        <p style={{ margin: '0 0 4px', fontSize: '10px', fontWeight: 700, color: '#22c55e', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
                                            Respuesta Correcta
                                        </p>
                                        <p style={{ margin: '0 0 8px', fontSize: '16px', fontWeight: 800, color: 'white' }}>
                                            {retoActual.respuesta}
                                        </p>
                                        <p style={{ margin: 0, fontSize: '11px', color: '#475569', display: 'flex', alignItems: 'center', gap: '4px' }}>
                                            <AlertTriangle size={11} /> Solo para el host
                                        </p>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>

                    {/* Columna derecha */}
                    <div>
                        {/* Badge de fase */}
                        <div style={{
                            marginBottom: '14px', padding: '10px 16px',
                            borderRadius: '10px', textAlign: 'center',
                            fontWeight: 700, fontSize: '13px', letterSpacing: '0.08em', textTransform: 'uppercase',
                            ...(phase === 'SHOWING_QUESTION'
                                ? { background: 'rgba(59,130,246,0.1)', border: '1px solid rgba(59,130,246,0.25)', color: '#93c5fd' }
                                : phase === 'ANSWERING'
                                ? { background: 'rgba(245,158,11,0.1)', border: '1px solid rgba(245,158,11,0.25)', color: '#fbbf24' }
                                : { background: 'rgba(34,197,94,0.1)', border: '1px solid rgba(34,197,94,0.25)', color: '#86efac' }),
                        }}>
                            {phase === 'SHOWING_QUESTION' && 'Esperando Pujas'}
                            {phase === 'ANSWERING' && 'Equipo Respondiendo'}
                            {phase === 'SHOWING_RESULT' && 'Procesando Puntos'}
                        </div>

                        <div key={phase}>{renderMainContent()}</div>
                    </div>
                </div>
            </div>
        </div>
    );
}

// ── Sub-componentes ──────────────────────────────────────────────────────────

function StatCard({ label, value, valueColor = 'white' }: { label: string; value: any; valueColor?: string }) {
    return (
        <div style={{ background: '#0f172a', padding: '14px 16px', borderRadius: '12px', border: '1px solid #1e293b' }}>
            <p style={{ margin: '0 0 4px', fontSize: '10px', fontWeight: 700, color: '#475569', letterSpacing: '0.1em', textTransform: 'uppercase' }}>{label}</p>
            <p style={{ margin: 0, fontSize: '28px', fontWeight: 800, color: valueColor, lineHeight: 1 }}>{value}</p>
        </div>
    );
}

function StatBox({ label, value, color }: { label: string; value: string; color: string }) {
    return (
        <div style={{ background: 'rgba(0,0,0,0.3)', borderRadius: '8px', padding: '10px 12px', border: '1px solid #1e293b' }}>
            <p style={{ margin: '0 0 2px', fontSize: '10px', color: '#475569', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em' }}>{label}</p>
            <p style={{ margin: 0, fontSize: '16px', fontWeight: 800, color }}>{value}</p>
        </div>
    );
}

function IconBtn({ onClick, title, color, children }: { onClick: () => void; title: string; color: string; children: React.ReactNode }) {
    return (
        <button
            onClick={onClick}
            title={title}
            style={{
                padding: '8px', borderRadius: '8px', border: 'none', cursor: 'pointer',
                background: 'transparent', color, transition: 'background 0.15s',
                display: 'flex', alignItems: 'center',
            }}
            onMouseEnter={e => { e.currentTarget.style.background = `${color}20`; }}
            onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; }}
        >
            {children}
        </button>
    );
}