import { useState } from 'react';
import { Ban, ShieldAlert, X } from 'lucide-react';
import Swal from 'sweetalert2';
import { Team } from '../../models/types';

interface VetoPanelProps {
    teams: Team[];
    onApplyVeto: (origenId: string, destinoId: string) => void;
    onClose: () => void;
}

export default function VetoPanel({ teams, onApplyVeto, onClose }: VetoPanelProps) {
    const [origenId, setOrigenId] = useState('');
    const [destinoId, setDestinoId] = useState('');

    const attackers = teams.filter(t => t.comodines.veto > 0);
    const targets = teams.filter(t => t.id !== origenId);

    const handleSubmit = () => {
        if (!origenId || !destinoId) return;

        const attackerName = teams.find(t => t.id === origenId)?.nombre;
        const targetName = teams.find(t => t.id === destinoId)?.nombre;

        // Alerta personalizada con SweetAlert2
        Swal.fire({
            title: '¿Confirmar Bloqueo?',
            html: `
                <div class="text-left">
                    <p class="mb-2 text-lg">⚔️ <strong>Ataca:</strong> ${attackerName}</p>
                    <p class="mb-4 text-lg">🛡️ <strong>Víctima:</strong> ${targetName}</p>
                    <p class="text-sm text-red-400 font-bold">⚠️ Este equipo no podrá pujar en esta ronda.</p>
                </div>
            `,
            icon: 'warning',
            background: '#1e293b', // bg-slate-800
            color: '#fff',
            showCancelButton: true,
            confirmButtonColor: '#ef4444', // red-500
            cancelButtonColor: '#475569', // slate-600
            confirmButtonText: 'Sí, ¡BLOQUEAR!',
            cancelButtonText: 'Cancelar',
            reverseButtons: true,
            customClass: {
                popup: 'border-2 border-red-500/50 rounded-2xl'
            }
        }).then((result) => {
            if (result.isConfirmed) {
                onApplyVeto(origenId, destinoId);
                onClose();
                
                // Feedback de éxito
                Swal.fire({
                    title: '¡Veto Aplicado!',
                    text: `${targetName} ha sido bloqueado exitosamente.`,
                    icon: 'success',
                    timer: 1500,
                    showConfirmButton: false,
                    background: '#1e293b',
                    color: '#fff'
                });
            }
        });
    };

    return (
        <div className="bg-red-900/20 border-2 border-red-500/50 rounded-xl p-6 mb-6 animate-in slide-in-from-top-4 shadow-xl shadow-red-900/10">
            <div className="flex justify-between items-start mb-6">
                <div className="flex items-center gap-3 text-red-400">
                    <div className="bg-red-500/20 p-2 rounded-lg">
                        <ShieldAlert size={28} />
                    </div>
                    <div>
                        <h3 className="text-xl font-bold text-white">Aplicar Veto</h3>
                        <p className="text-xs text-red-300 uppercase tracking-wider font-bold">Acción Estratégica</p>
                    </div>
                </div>
                <button onClick={onClose} className="text-slate-400 hover:text-white p-1 hover:bg-slate-800 rounded-lg transition-colors">
                    <X size={24} />
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* ATACANTE */}
                <div>
                    <label className="block text-xs font-bold text-red-300 uppercase mb-2 ml-1">¿Quién usa el Veto?</label>
                    <div className="relative">
                        <select 
                            value={origenId}
                            onChange={(e) => { setOrigenId(e.target.value); setDestinoId(''); }}
                            className="w-full bg-slate-800 border border-slate-600 rounded-xl p-4 text-white focus:border-red-500 focus:ring-1 focus:ring-red-500 outline-none appearance-none cursor-pointer hover:border-slate-500 transition-colors"
                        >
                            <option value="">Seleccionar equipo...</option>
                            {attackers.map(t => (
                                <option key={t.id} value={t.id}>
                                    {t.nombre} ({t.comodines.veto} disponibles)
                                </option>
                            ))}
                        </select>
                        <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">▼</div>
                    </div>
                </div>

                {/* VÍCTIMA */}
                <div>
                    <label className="block text-xs font-bold text-slate-400 uppercase mb-2 ml-1">¿A quién bloqueamos?</label>
                    <div className="relative">
                        <select 
                            value={destinoId}
                            onChange={(e) => setDestinoId(e.target.value)}
                            disabled={!origenId}
                            className="w-full bg-slate-800 border border-slate-600 rounded-xl p-4 text-white focus:border-red-500 focus:ring-1 focus:ring-red-500 outline-none disabled:opacity-50 disabled:cursor-not-allowed appearance-none cursor-pointer hover:border-slate-500 transition-colors"
                        >
                            <option value="">Seleccionar víctima...</option>
                            {targets.map(t => (
                                <option key={t.id} value={t.id}>{t.nombre}</option>
                            ))}
                        </select>
                        <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">▼</div>
                    </div>
                </div>
            </div>

            <div className="mt-8 flex justify-end gap-3 pt-6 border-t border-red-500/20">
                <button 
                    onClick={onClose}
                    className="px-6 py-3 text-slate-300 hover:text-white transition-colors font-medium"
                >
                    Cancelar
                </button>
                <button
                    onClick={handleSubmit}
                    disabled={!origenId || !destinoId}
                    className="bg-red-600 hover:bg-red-500 disabled:bg-slate-700 disabled:text-slate-500 text-white font-bold py-3 px-8 rounded-xl transition-all flex items-center gap-2 shadow-lg hover:shadow-red-600/20 active:scale-95"
                >
                    <Ban size={20} />
                    Ejecutar Veto
                </button>
            </div>
        </div>
    );
}