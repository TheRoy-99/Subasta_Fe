// src/components/control/NavigationPanel.tsx

import { ChevronRight, Trophy } from 'lucide-react';

interface NavigationPanelProps {
    onNextRound: () => void;
    disabled?: boolean;
    isGameOver: boolean;
}

export default function NavigationPanel({
    onNextRound,
    disabled = false,
    isGameOver
}: NavigationPanelProps) {

    if (isGameOver) {
        return (
            <div className="bg-gradient-to-r from-amber-500 to-orange-500 rounded-xl p-8 text-center">
                <Trophy size={64} className="mx-auto mb-4 text-white" />
                <h2 className="text-3xl font-bold text-white mb-2">
                    ¡Juego Terminado!
                </h2>
                <p className="text-white text-lg">
                    No quedan más retos disponibles
                </p>
            </div>
        );
    }

    return (
        <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
            <button
                onClick={onNextRound}
                disabled={disabled}
                className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-slate-600 disabled:cursor-not-allowed text-white font-bold py-4 px-6 rounded-xl text-lg transition-all transform hover:scale-105 disabled:transform-none flex items-center justify-center gap-3"
            >
                <ChevronRight size={28} />
                Siguiente Reto
            </button>

            {disabled && (
                <p className="mt-3 text-center text-slate-400 text-sm">
                    Debes procesar la respuesta actual antes de continuar
                </p>
            )}
        </div>
    );
}