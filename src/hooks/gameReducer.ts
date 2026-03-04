// src/hooks/gameReducer.ts
import { GameState, Team, Reto, PowerupType, GameHistory } from '../models/types';
import { GAME_CONSTANTS, TEAM_COLORS } from '../utils/constants';
import { ScoringService } from '../services/ScoringService';

export type GameAction =
    | { type: 'INIT_TEAMS'; payload: string[] }
    | { type: 'START_GAME' }
    | { type: 'NEXT_ROUND'; payload: Reto }
    | { type: 'REGISTER_BID'; payload: { equipoId: string; cantidad: number; powerup?: PowerupType } }
    | { type: 'PROCESS_ANSWER'; payload: { correcto: boolean } }
    | { type: 'APPLY_VETO'; payload: { equipoOrigenId: string; equipoDestinoId: string } }
    | { type: 'SKIP_QUESTION' }
    | { type: 'RESTORE_STATE'; payload: GameState }
    | { type: 'RESET_GAME' };

export const initialState: GameState = {
    phase: 'CONFIG',
    ronda: 0,
    retoActual: null,
    equipos: [],
    pujaActual: null,
    equipoVetadoId: null,
    historial: [],
};

const createTeam = (nombre: string, idx: number): Team => ({
    id: `team-${idx + 1}`,
    nombre,
    puntos: GAME_CONSTANTS.PUNTOS_INICIALES,
    comodines: { ...GAME_CONSTANTS.COMODINES_INICIALES },
    color: TEAM_COLORS[idx % TEAM_COLORS.length],
});

export function gameReducer(state: GameState, action: GameAction): GameState {
    switch (action.type) {

        case 'INIT_TEAMS':
            return { ...state, equipos: action.payload.map(createTeam), phase: 'CONFIG' };

        case 'START_GAME':
            return { ...state, phase: 'SHOWING_QUESTION' };

        case 'NEXT_ROUND':
            return {
                ...state,
                ronda: state.ronda + 1,
                retoActual: action.payload,
                pujaActual: null,
                equipoVetadoId: null,
                phase: 'SHOWING_QUESTION',
            };

        case 'APPLY_VETO': {
            const origen = state.equipos.find(t => t.id === action.payload.equipoOrigenId);
            // Doble validación: rechazar si no tiene comodín
            if (!origen || origen.comodines.veto <= 0) {
                console.warn('APPLY_VETO rechazado: sin comodines de veto');
                return state;
            }
            const nuevosEquipos = state.equipos.map(t =>
                t.id === action.payload.equipoOrigenId
                    ? { ...t, comodines: { ...t.comodines, veto: t.comodines.veto - 1 } }
                    : t
            );
            return { ...state, equipos: nuevosEquipos, equipoVetadoId: action.payload.equipoDestinoId };
        }

        case 'REGISTER_BID': {
            const { equipoId, cantidad, powerup } = action.payload;
            const equipo = state.equipos.find(t => t.id === equipoId);
            if (!equipo) return state;

            // Doble validación en reducer (la UI también bloquea)
            if (powerup === 'DOBLE' && equipo.comodines.doble <= 0) {
                console.warn('REGISTER_BID: DOBLE sin comodines disponibles');
                return state;
            }
            if (powerup === 'SALVA' && equipo.comodines.salva <= 0) {
                console.warn('REGISTER_BID: SALVA sin comodines disponibles');
                return state;
            }

            return {
                ...state,
                pujaActual: { equipoId, cantidad, powerupUsado: powerup },
                phase: 'ANSWERING',
            };
        }

        case 'PROCESS_ANSWER': {
            if (!state.pujaActual || !state.retoActual) return state;

            const { equipoId, cantidad, powerupUsado } = state.pujaActual;
            const puntosGanados = ScoringService.calculatePoints(
                state.retoActual.puntosBase,
                cantidad,
                action.payload.correcto,
                powerupUsado
            );

            const nuevosEquipos = state.equipos.map(team => {
                if (team.id !== equipoId) return team;
                const nuevosComodines = { ...team.comodines };
                if (powerupUsado === 'DOBLE') nuevosComodines.doble = Math.max(0, nuevosComodines.doble - 1);
                if (powerupUsado === 'SALVA') nuevosComodines.salva = Math.max(0, nuevosComodines.salva - 1);
                return {
                    ...team,
                    puntos: Math.max(0, team.puntos + puntosGanados),
                    comodines: nuevosComodines,
                };
            });

            const historialEntry: GameHistory = {
                ronda: state.ronda,
                reto: state.retoActual,
                puja: state.pujaActual,
                correcto: action.payload.correcto,
                puntosGanados,
                timestamp: new Date(),
            };

            return {
                ...state,
                equipos: nuevosEquipos,
                historial: [...state.historial, historialEntry],
                phase: 'SHOWING_RESULT',
            };
        }

        case 'SKIP_QUESTION':
            return {
                ...state,
                pujaActual: null,
                equipoVetadoId: null,
                phase: 'SHOWING_RESULT',
            };

        case 'RESTORE_STATE': return action.payload;
        case 'RESET_GAME':    return initialState;
        default:              return state;
    }
}