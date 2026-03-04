// src/hooks/useScoring.ts
import { useState } from 'react';
import { ScoringService } from '../services/ScoringService';
import { PowerupType } from '../models/types';

export function useScoring() {
    const [service] = useState(() => new ScoringService());

    const calculatePoints = (puja: number, correcto: boolean, powerup?: PowerupType) =>
        service.calculatePoints(puja, correcto, powerup);

    const calculatePreview = (puja: number, powerup?: PowerupType) =>
        service.calculatePreview(puja, powerup);

    return { calculatePoints, calculatePreview };
}