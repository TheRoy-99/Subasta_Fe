// src/utils/constants.ts
import { Dificultad, Powerups } from '../models/types';

/**
 * Constantes generales del juego
 */
export const GAME_CONSTANTS = {
    // Configuración inicial
    PUNTOS_INICIALES: 0, 

    // Aquí agregamos el nuevo comodín VETO
    COMODINES_INICIALES: {
        doble: 2,
        salva: 2,
        veto: 2  // <--- NUEVO: Cada equipo empieza con 1 Veto
    } as Powerups,

    // Límites de equipos
    MIN_EQUIPOS: 2,
    MAX_EQUIPOS: 8,

    // Sistema de pujas
    MIN_PUJA: 10,           // Puja mínima absoluta
    MAX_PUJA: 1000,         // Puja máxima
    PUJA_INCREMENT: 10,     // Incremento estándar

    // Puja inicial sugerida según dificultad (opcional para UI)
    PUJA_INICIAL_FACIL: 10,
    PUJA_INICIAL_MEDIO: 20,
    PUJA_INICIAL_AVANZADO: 30,

    // Multiplicadores
    POWERUP_DOBLE_MULTIPLIER: 2,

    // Duración de animaciones (ms)
    ANIMATION_DURATION: 300,
    RESULT_DISPLAY_TIME: 2000,
} as const;

/**
 * Colores por dificultad
 */
export const DIFICULTAD_COLORES: Record<Dificultad, string> = {
    FACIL: '#10B981',      // Green
    MEDIO: '#F59E0B',      // Amber
    AVANZADO: '#EF4444'    // Red
};

/**
 * Labels de dificultad
 */
export const DIFICULTAD_LABELS: Record<Dificultad, string> = {
    FACIL: 'Fácil',
    MEDIO: 'Medio',
    AVANZADO: 'Avanzado'
};

/**
 * Colores para los equipos
 */
export const TEAM_COLORS = [
    '#F59E0B', // Amber
    '#3B82F6', // Blue
    '#10B981', // Green
    '#EF4444', // Red
    '#8B5CF6', // Purple
    '#EC4899', // Pink
    '#14B8A6', // Teal
    '#F97316'  // Orange
] as const;

/**
 * Mensajes del sistema
 */
export const MESSAGES = {
    GAME_OVER: '¡Juego terminado! No quedan más retos.',
    NO_POWERUPS: 'No tienes ese comodín disponible.',
    INVALID_BID: 'La puja debe ser un múltiplo de 10.',
    INSUFFICIENT_POINTS: 'No tienes suficientes puntos para esta puja.',
    TEAM_NOT_FOUND: 'Equipo no encontrado.',
    NO_ACTIVE_BID: 'No hay una puja activa.',
    INVALID_TRANSITION: 'Transición de estado inválida.',
    VETO_APPLIED: '¡Equipo vetado para esta ronda!',
} as const;

/**
 * Claves para localStorage
 */
export const STORAGE_KEYS = {
    GAME_STATE: 'subasta_fe_game_state',
    CONFIG: 'subasta_fe_config',
    HISTORY: 'subasta_fe_history',
} as const;

/**
 * Reglas del juego en texto
 */
export const GAME_RULES = {
    title: 'Reglas del juego:',
    rules: [
        'Cada equipo inicia con 0 puntos.',
        'Las pujas inician con la base de la pregunta.',
        '🎯 DOBLE: Si aciertas ganas x2. ¡Si fallas pierdes x2!',
        '🛡️ SALVA: Te protege de perder puntos si fallas.',
        '🚫 Bloqueo: Bloquea a un equipo rival para que no pueda pujar en esa ronda.',
        'Gana el equipo con más puntos al final de los retos.'
    ]
} as const;