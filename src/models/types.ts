// src/models/types.ts

export type Dificultad = 'FACIL' | 'MEDIO' | 'AVANZADO';
export type GamePhase = 'CONFIG' | 'SHOWING_QUESTION' | 'BIDDING' | 'ANSWERING' | 'SHOWING_RESULT';

// 1. Agregamos VETO aquí
export type PowerupType = 'DOBLE' | 'SALVA' | 'VETO';

export interface Reto {
    id: number;
    pregunta: string;
    dificultad: Dificultad;
    puntosBase: number;
    referencia: string;
    categoria?: string;
    respuesta?: string;
}

export interface Powerups {
    doble: number;
    salva: number;
    veto: number; // 2. Nuevo contador
}

export interface Team {
    id: string;
    nombre: string;
    puntos: number;
    comodines: Powerups;
    color?: string;
}

export interface Puja {
    equipoId: string;
    cantidad: number;
    powerupUsado?: PowerupType;
}

export interface GameState {
    phase: GamePhase;
    ronda: number;
    retoActual: Reto | null;
    equipos: Team[];
    pujaActual: Puja | null;
    equipoVetadoId: string | null; // 3. Nuevo estado para bloquear equipos
    historial: GameHistory[];
}

export interface GameHistory {
    ronda: number;
    reto: Reto;
    puja: Puja;
    correcto: boolean;
    puntosGanados: number;
    timestamp: Date;
}

export interface GameConfig {
    numeroEquipos: number;
    puntosIniciales: number;
    comodinesIniciales: Powerups;
}

export interface ScoreCalculation {
    ganancia: number;
    perdida: number;
    multiplier: number;
}

export type GameEventCallback = (state: GameState) => void;
export type PhaseChangeCallback = (phase: GamePhase) => void;