// src/views/GameView.tsx

import { useEffect, useRef } from 'react';
import { Monitor, Gamepad2, ExternalLink, RotateCcw } from 'lucide-react';
import PresentationView from '../features/presentation/PresentationView';
import { useGame } from '../hooks/useGame';

type GameInstance = ReturnType<typeof useGame>;

interface GameViewProps {
    game: GameInstance;
    onReset: () => void;
}

export default function GameView({ game, onReset }: GameViewProps) {
    const controlWindowRef = useRef<Window | null>(null);

    const openControlPanel = () => {
        if (controlWindowRef.current && !controlWindowRef.current.closed) {
            controlWindowRef.current.focus();
            return;
        }
        const w = window.open(
            '/control',
            'subasta-control',
            'width=1200,height=820,menubar=no,toolbar=no,location=no,status=no'
        );
        controlWindowRef.current = w;
    };

    useEffect(() => {
        const interval = setInterval(() => {
            if (controlWindowRef.current?.closed) {
                controlWindowRef.current = null;
            }
        }, 1000);
        return () => clearInterval(interval);
    }, []);

    return (
        <div style={{ position: 'relative' }}>
            {/* Toolbar flotante */}
            <div style={{
                position: 'fixed', bottom: '20px', right: '20px', zIndex: 100,
                display: 'flex', gap: '8px', alignItems: 'center',
                fontFamily: "'Plus Jakarta Sans', sans-serif",
            }}>
                {/* Panel de control */}
                <button
                    onClick={openControlPanel}
                    style={{
                        display: 'flex', alignItems: 'center', gap: '7px',
                        padding: '10px 16px', borderRadius: '12px', cursor: 'pointer',
                        background: 'rgba(15,23,42,0.92)', backdropFilter: 'blur(14px)',
                        border: '1px solid rgba(245,158,11,0.25)',
                        color: '#f59e0b', fontWeight: 700, fontSize: '13px',
                        fontFamily: "'Plus Jakarta Sans', sans-serif",
                        boxShadow: '0 8px 32px rgba(0,0,0,0.5)',
                        transition: 'all 0.15s ease',
                        outline: 'none',
                    }}
                    onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; }}
                    onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; }}
                    title="Abrir panel de control"
                >
                    <Gamepad2 size={16} />
                    Panel de Control
                    <ExternalLink size={13} style={{ opacity: 0.5 }} />
                </button>

                {/* Reiniciar */}
                <button
                    onClick={onReset}
                    style={{
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        width: '40px', height: '40px', borderRadius: '10px', cursor: 'pointer',
                        background: 'rgba(15,23,42,0.92)', backdropFilter: 'blur(14px)',
                        border: '1px solid rgba(255,255,255,0.06)',
                        color: '#475569',
                        boxShadow: '0 8px 32px rgba(0,0,0,0.5)',
                        transition: 'all 0.15s ease',
                        outline: 'none',
                    }}
                    onMouseEnter={e => {
                        e.currentTarget.style.color = '#f1f5f9';
                        e.currentTarget.style.transform = 'translateY(-2px)';
                    }}
                    onMouseLeave={e => {
                        e.currentTarget.style.color = '#475569';
                        e.currentTarget.style.transform = 'translateY(0)';
                    }}
                    title="Reiniciar juego"
                >
                    <RotateCcw size={16} />
                </button>

                {/* EN VIVO */}
                <div style={{
                    display: 'flex', alignItems: 'center', gap: '7px',
                    padding: '10px 14px', borderRadius: '12px',
                    background: 'rgba(245,158,11,0.07)',
                    border: '1px solid rgba(245,158,11,0.18)',
                    color: '#fbbf24', fontSize: '12px', fontWeight: 700,
                    boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
                }}>
                    <div style={{
                        width: '7px', height: '7px', borderRadius: '50%',
                        background: '#22c55e',
                        boxShadow: '0 0 8px rgba(34,197,94,0.6)',
                    }} />
                    <Monitor size={15} />
                    EN VIVO
                </div>
            </div>

            <PresentationView game={game} />
        </div>
    );
}