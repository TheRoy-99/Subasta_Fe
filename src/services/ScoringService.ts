// src/services/ScoringService.ts
import { GAME_CONSTANTS } from '../utils/constants';
import type { PowerupType, ScoreCalculation } from '../models/types';

export const ScoringService = {
    calculatePoints(basePts: number, puja: number, correcto: boolean, powerup?: PowerupType): number {
        
        // --- ESCENARIO: RESPUESTA INCORRECTA ---
        if (!correcto) {
            // Si tiene SALVA, no pierde nada
            if (powerup === 'SALVA') return 0;

            // Lógica "Doble Suicida": Si usó DOBLE y falló, pierde el doble
            if (powerup === 'DOBLE') {
                return -(puja * GAME_CONSTANTS.POWERUP_DOBLE_MULTIPLIER);
            }

            // Pérdida normal
            return -puja;
        }

        // --- ESCENARIO: RESPUESTA CORRECTA ---
        let puntos = puja;

        // Multiplicador de DOBLE
        if (powerup === 'DOBLE') {
            puntos *= GAME_CONSTANTS.POWERUP_DOBLE_MULTIPLIER;
        }

        return puntos;
    },

    calculatePreview(basePts: number, puja: number, powerup?: PowerupType): ScoreCalculation {
        const ganancia = this.calculatePoints(basePts, puja, true, powerup);
        // Usamos Math.abs para mostrar la pérdida siempre positiva en la UI
        const perdida = Math.abs(this.calculatePoints(basePts, puja, false, powerup));
        
        const multiplier = powerup === 'DOBLE' ? GAME_CONSTANTS.POWERUP_DOBLE_MULTIPLIER : 1;

        return { ganancia, perdida, multiplier };
    }
};