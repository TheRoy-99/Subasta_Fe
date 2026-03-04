// src/components/control/ActionButtons.tsx
import { CheckCircle, XCircle } from 'lucide-react';

interface ActionButtonsProps {
    onCorrect: () => void;
    onIncorrect: () => void;
}

export default function ActionButtons({ onCorrect, onIncorrect }: ActionButtonsProps) {
    return (
        <div className="bg-slate-900 rounded-2xl p-6 border border-slate-800 shadow-xl">
            <h3 className="text-lg font-bold mb-6 text-center text-slate-300">
                ¿La respuesta del equipo es correcta?
            </h3>

            <div className="grid grid-cols-2 gap-6">
                <button
                    onClick={onCorrect}
                    className="group bg-green-600 hover:bg-green-500 active:bg-green-700 text-white p-6 rounded-2xl transition-all flex flex-col items-center gap-3 border-b-4 border-green-800 hover:border-green-700 active:border-green-900 active:translate-y-1"
                >
                    <CheckCircle size={48} className="group-hover:scale-110 transition-transform" />
                    <span className="text-xl font-bold">CORRECTA</span>
                </button>

                <button
                    onClick={onIncorrect}
                    className="group bg-red-600 hover:bg-red-500 active:bg-red-700 text-white p-6 rounded-2xl transition-all flex flex-col items-center gap-3 border-b-4 border-red-800 hover:border-red-700 active:border-red-900 active:translate-y-1"
                >
                    <XCircle size={48} className="group-hover:scale-110 transition-transform" />
                    <span className="text-xl font-bold">INCORRECTA</span>
                </button>
            </div>
            
            <p className="text-center text-slate-500 text-sm mt-6">
                Esta acción es irreversible y asignará los puntos automáticamente.
            </p>
        </div>
    );
}