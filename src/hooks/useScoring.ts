import { useState } from 'react';
import type { PowerupType } from '../models/types';
import { ScoringService } from '../services/ScoringService';

export function useScoring() {
    const [service] = useState(() => new ScoringService());

    const calculatePreview = (
        basePts: number,
        puja: number,
        powerup?: PowerupType
    ): { ganancia: number; perdida: number } => {
        const ganancia = service.calculatePoints(basePts, puja, true, powerup);
        const perdida = service.calculatePoints(basePts, puja, false, powerup);

        return { ganancia, perdida: Math.abs(perdida) };
    };

    return {
        calculatePreview
    };
}