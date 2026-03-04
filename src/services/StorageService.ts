// src/services/StorageService.ts

import { GameState } from '../models/types';
import { STORAGE_KEYS } from '../utils/constants';

/**
 * Servicio para manejar la persistencia del juego en localStorage
 */
export class StorageService {
    /**
     * Guarda el estado del juego en localStorage
     */
    static saveGameState(state: GameState): void {
        try {
            const serialized = JSON.stringify({
                ...state,
                timestamp: new Date().toISOString()
            });
            localStorage.setItem(STORAGE_KEYS.GAME_STATE, serialized);
            console.log('💾 Estado guardado en localStorage');
        } catch (error) {
            console.error('Error al guardar estado:', error);
        }
    }

    /**
     * Carga el estado del juego desde localStorage
     */
    static loadGameState(): GameState | null {
        try {
            const serialized = localStorage.getItem(STORAGE_KEYS.GAME_STATE);

            if (!serialized) {
                return null;
            }

            const data = JSON.parse(serialized);
            console.log('📂 Estado cargado desde localStorage');

            // Verificar que no sea muy antiguo (más de 24 horas)
            if (data.timestamp) {
                const saved = new Date(data.timestamp);
                const now = new Date();
                const hoursDiff = (now.getTime() - saved.getTime()) / (1000 * 60 * 60);

                if (hoursDiff > 24) {
                    console.log('⏰ Estado guardado es muy antiguo, descartando...');
                    StorageService.clearGameState();
                    return null;
                }
            }

            return data as GameState;
        } catch (error) {
            console.error('Error al cargar estado:', error);
            return null;
        }
    }

    /**
     * Elimina el estado guardado
     */
    static clearGameState(): void {
        try {
            localStorage.removeItem(STORAGE_KEYS.GAME_STATE);
            console.log('🗑️ Estado eliminado de localStorage');
        } catch (error) {
            console.error('Error al eliminar estado:', error);
        }
    }

    /**
     * Verifica si hay un juego guardado
     */
    static hasGameState(): boolean {
        return localStorage.getItem(STORAGE_KEYS.GAME_STATE) !== null;
    }

    /**
     * Guarda la configuración del juego
     */
    static saveConfig(config: any): void {
        try {
            localStorage.setItem(STORAGE_KEYS.CONFIG, JSON.stringify(config));
        } catch (error) {
            console.error('Error al guardar configuración:', error);
        }
    }

    /**
     * Carga la configuración del juego
     */
    static loadConfig(): any | null {
        try {
            const serialized = localStorage.getItem(STORAGE_KEYS.CONFIG);
            return serialized ? JSON.parse(serialized) : null;
        } catch (error) {
            console.error('Error al cargar configuración:', error);
            return null;
        }
    }
}