// src/services/ScoringService.ts
import { PowerupType } from '../models/types';

export interface ScoreCalculation {
    base: number;
    final: number;
    multiplier: number;
    description: string;
}

export class ScoringService {
    calculatePoints(puja: number, correcto: boolean, powerup?: PowerupType): number {
        if (!correcto && powerup === 'SALVA') return 0;
        const pts = correcto ? puja : -puja;
        if (powerup === 'DOBLE') return pts * 2;
        return pts;
    }

    calculatePreview(puja: number, powerup?: PowerupType): ScoreCalculation {
        const multiplier = powerup === 'DOBLE' ? 2 : 1;
        const final = puja * multiplier;
        return {
            base: puja,
            final,
            multiplier,
            description: powerup === 'DOBLE'
                ? `±${final} pts (×2)`
                : powerup === 'SALVA'
                ? `+${puja} si acierta, 0 si falla`
                : `±${puja} pts`,
        };
    }

    // Método estático para usarlo sin instancia (compatibilidad con gameReducer)
    static calculatePoints(puja: number, correcto: boolean, powerup?: PowerupType): number {
        if (!correcto && powerup === 'SALVA') return 0;
        const pts = correcto ? puja : -puja;
        if (powerup === 'DOBLE') return pts * 2;
        return pts;
    }
}