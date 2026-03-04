// src/components/game/ScoreBoard.tsx

import TeamCard from './TeamCard';
import type { Team } from '../../models/types';

interface ScoreBoardProps {
    teams: Team[];
    highlightTeamId?: string;
    vetadoId?: string | null;
}

/**
 * Grid responsivo inteligente según cantidad de equipos:
 *  2 equipos → 2 columnas
 *  3 equipos → 3 columnas
 *  4 equipos → 2×2  (legible, no apretado)
 *  5 equipos → 3+2
 *  6 equipos → 3×2
 *  7 equipos → 4+3
 *  8 equipos → 4×2
 *
 * En pantallas pequeñas siempre cae a 2 columnas via CSS.
 */
function getGridCols(n: number): string {
    if (n <= 2) return 'repeat(2, minmax(0, 1fr))';
    if (n === 3) return 'repeat(3, minmax(0, 1fr))';
    if (n === 4) return 'repeat(2, minmax(0, 1fr))';
    if (n === 5) return 'repeat(3, minmax(0, 1fr))';
    if (n === 6) return 'repeat(3, minmax(0, 1fr))';
    if (n <= 8) return 'repeat(4, minmax(0, 1fr))';
    return 'repeat(4, minmax(0, 1fr))';
}

export default function ScoreBoard({ teams, highlightTeamId, vetadoId }: ScoreBoardProps) {
    const sorted = [...teams].sort((a, b) => b.puntos - a.puntos);
    const n = sorted.length;
    const compact = n > 4;

    return (
        <div style={{ width: '100%', fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
            {/* Header */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '14px' }}>
                <div style={{
                    flex: 1, height: '1px',
                    background: 'linear-gradient(90deg, transparent, rgba(245,158,11,0.2), transparent)',
                }} />
                <span style={{
                    fontSize: '10px', fontWeight: 700, letterSpacing: '0.12em',
                    textTransform: 'uppercase', color: '#f59e0b',
                }}>
                    Marcador
                </span>
                <div style={{
                    flex: 1, height: '1px',
                    background: 'linear-gradient(90deg, transparent, rgba(245,158,11,0.2), transparent)',
                }} />
            </div>

            {/* Grid responsivo */}
            <div style={{
                display: 'grid',
                gridTemplateColumns: getGridCols(n),
                gap: compact ? '8px' : '10px',
            }}>
                {sorted.map((team, idx) => (
                    <TeamCard
                        key={team.id}
                        team={team}
                        rank={idx + 1}
                        isActive={team.id === highlightTeamId}
                        isVetoed={team.id === vetadoId}
                    />
                ))}
            </div>
        </div>
    );
}