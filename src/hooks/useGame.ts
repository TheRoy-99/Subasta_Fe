// src/hooks/useGame.ts
import { useReducer, useEffect, useMemo, useCallback, useRef } from 'react';
import { gameReducer, initialState } from './gameReducer';
import { StorageService } from '../services/StorageService';
import { RetoRepository } from '../data/repositories/RetoRepository';
import { PowerupType, Dificultad, Reto } from '../models/types';
import { STORAGE_KEYS } from '../utils/constants';

export function useGame(retosData: Reto[]) {
    const repo = useMemo(() => new RetoRepository(retosData), [retosData]);
    const [gameState, dispatch] = useReducer(gameReducer, initialState);
    const isRemoteUpdate = useRef(false);

    // ── Persistencia ──────────────────────────────────────────────────────────
    useEffect(() => {
        if (isRemoteUpdate.current) { isRemoteUpdate.current = false; return; }
        if (gameState.phase !== 'CONFIG') StorageService.saveGameState(gameState);
    }, [gameState]);

    useEffect(() => {
        const handleStorageChange = (e: StorageEvent) => {
            if (e.key !== STORAGE_KEYS.GAME_STATE) return;
            isRemoteUpdate.current = true;
            if (e.newValue) dispatch({ type: 'RESTORE_STATE', payload: JSON.parse(e.newValue) });
            else dispatch({ type: 'RESET_GAME' });
        };
        window.addEventListener('storage', handleStorageChange);
        return () => window.removeEventListener('storage', handleStorageChange);
    }, []);

    // ── Acciones ──────────────────────────────────────────────────────────────
    const initializeTeams = useCallback((nombres: string[]) => {
        dispatch({ type: 'INIT_TEAMS', payload: nombres });
    }, []);

    const startNextRound = useCallback(() => {
        const nextReto = repo.getNextReto();
        if (nextReto) dispatch({ type: 'NEXT_ROUND', payload: nextReto });
        else console.warn('Juego terminado: no quedan retos');
    }, [repo]);

    const startGame = useCallback(() => {
        dispatch({ type: 'START_GAME' });
        startNextRound();
    }, [startNextRound]);

    const startRoundWithDifficulty = useCallback((dificultad: Dificultad) => {
        const nextReto = repo.getRetoByDifficulty(dificultad);
        if (nextReto) dispatch({ type: 'NEXT_ROUND', payload: nextReto });
    }, [repo]);

    const registerBid = useCallback(
        (equipoId: string, cantidad: number, powerup?: PowerupType) => {
            if (gameState.equipoVetadoId === equipoId) {
                console.warn(`Equipo ${equipoId} está vetado y no puede pujar.`);
                return;
            }
            dispatch({ type: 'REGISTER_BID', payload: { equipoId, cantidad, powerup } });
        },
        [gameState.equipoVetadoId]
    );

    const processAnswer = useCallback((correcto: boolean) => {
        dispatch({ type: 'PROCESS_ANSWER', payload: { correcto } });
    }, []);

    const applyVeto = useCallback((equipoOrigenId: string, equipoDestinoId: string) => {
        dispatch({ type: 'APPLY_VETO', payload: { equipoOrigenId, equipoDestinoId } });
    }, []);

    // ── NUEVA ACCIÓN: Saltar pregunta ─────────────────────────────────────────
    const skipQuestion = useCallback(() => {
        dispatch({ type: 'SKIP_QUESTION' });
        // Auto-avanza a la siguiente ronda igual que processAnswer
        setTimeout(() => startNextRound(), 2500);
    }, [startNextRound]);

    const clearStorage = useCallback(() => StorageService.clearGameState(), []);

    const reset = useCallback(() => {
        clearStorage();
        repo.reset();
        dispatch({ type: 'RESET_GAME' });
    }, [repo, clearStorage]);

    const restoreFromStorage = useCallback((): boolean => {
        const saved = StorageService.loadGameState();
        if (saved) { dispatch({ type: 'RESTORE_STATE', payload: saved }); return true; }
        return false;
    }, []);

    // ── Queries ───────────────────────────────────────────────────────────────
    const getStats = useCallback(() => ({
        rondasJugadas: gameState.ronda,
        retosRestantes: repo.getRemaining(),
        retosTotales: repo.getTotalRetos(),
        estadisticasRetos: repo.getStatsByDifficulty(),
    }), [gameState.ronda, repo]);

    const isGameOver = useCallback(() => !repo.hasRetosRemaining(), [repo]);

    return {
        gameState,
        isLoading: false,
        error: null,
        actions: {
            initializeTeams,
            startGame,
            startNextRound,
            startRoundWithDifficulty,
            registerBid,
            processAnswer,
            applyVeto,
            skipQuestion,   // ← expuesto
            reset,
            restoreFromStorage,
            clearStorage,
        },
        queries: {
            getStats,
            isGameOver,
        },
    };
}