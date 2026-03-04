import { useState, useEffect } from 'react';
import { Zap, Eye, EyeOff, BookOpen } from 'lucide-react';
import DifficultyBadge from './DifficultyBadge';
import type { Reto } from '../../models/types';

interface RetoCardProps {
    reto: Reto;
    ronda?: number;
}

export default function RetoCard({ reto, ronda }: RetoCardProps) {
    const [showHint, setShowHint] = useState(false);

    //FIX CRÍTICO: Resetear la pista automáticamente cuando cambia el reto
    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setShowHint(false);
    }, [reto.id]);

    return (
        <div className="relative bg-slate-800/90 backdrop-blur-md rounded-3xl p-8 md:p-12 border border-amber-500/50 shadow-[0_0_60px_-15px_rgba(245,158,11,0.25)] max-w-5xl w-full mx-auto transition-all duration-500">
            
            {/* Badge de Ronda */}
            {ronda && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-amber-500 text-slate-900 font-black px-6 py-1 rounded-full text-sm uppercase tracking-widest shadow-lg shadow-amber-500/40 z-10 border-4 border-slate-950">
                    Ronda {ronda}
                </div>
            )}

            {/* Header */}
            <div className="flex flex-col md:flex-row items-center justify-between mb-8 gap-4 relative z-0">
                <DifficultyBadge dificultad={reto.dificultad} />

                <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-900/50 border border-slate-700/50 text-amber-400">
                    <Zap size={20} className="fill-amber-400/20" />
                    <span className="font-bold text-lg md:text-xl">Mínimo: {reto.puntosBase} pts</span>
                </div>
            </div>

            {/* Pregunta - Tamaño dinámico según longitud */}
            <div className="mb-12 relative min-h-[120px] flex items-center justify-center">
                <p className={`text-center font-bold text-white drop-shadow-xl leading-tight ${
                    reto.pregunta.length > 80 ? 'text-3xl md:text-4xl' : 'text-4xl md:text-6xl'
                }`}>
                    {reto.pregunta}
                </p>
            </div>

            {/* ZONA DE PISTA */}
            <div className="flex justify-center mb-8">
                <button
                    onClick={() => setShowHint(!showHint)}
                    className={`
                        group relative overflow-hidden flex items-center gap-3 px-8 py-4 rounded-xl transition-all duration-300 border
                        ${showHint 
                            ? 'bg-amber-950/40 text-amber-200 border-amber-500/40 shadow-inner' 
                            : 'bg-gradient-to-br from-slate-700 to-slate-800 hover:from-slate-600 hover:to-slate-700 text-slate-200 border-slate-600 hover:border-slate-500 shadow-lg hover:-translate-y-1'
                        }
                    `}
                >
                    <div className="relative z-10 flex items-center gap-3">
                        {showHint ? (
                            <>
                                <EyeOff size={24} className="text-amber-500" />
                                <span className="text-xl font-bold flex items-center gap-2 tracking-wide">
                                    <BookOpen size={20} className="text-amber-400/70" />
                                    {reto.referencia}
                                </span>
                            </>
                        ) : (
                            <>
                                <Eye size={24} className="group-hover:text-amber-400 transition-colors" />
                                <span className="text-lg font-semibold tracking-wide">Mostrar Pista Bíblica</span>
                            </>
                        )}
                    </div>
                </button>
            </div>

            {/* Categoría */}
            {reto.categoria && (
                <div className="text-center">
                    <span className="inline-block bg-slate-900/40 border border-slate-700 text-slate-400 px-4 py-1.5 rounded-full text-xs font-bold tracking-[0.2em] uppercase">
                        {reto.categoria}
                    </span>
                </div>
            )}
        </div>
    );
}