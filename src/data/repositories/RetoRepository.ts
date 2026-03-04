// src/data/repositories/RetoRepository.ts

// src/data/repositories/RetoRepository.ts
import type { Reto, Dificultad } from '../../models/types';

/**
 * Repositorio para gestionar los retos del juego
 * Implementa el patrón Repository
 */
export class RetoRepository {
    private retos: Reto[];
    private usedIds: Set<number> = new Set();
    private currentIndex: number = 0;

    constructor(retosData: Reto[]) {
        if (!retosData || retosData.length === 0) {
            throw new Error('RetoRepository: No hay retos disponibles');
        }

        // Validar estructura de retos
        this.validateRetos(retosData);
        this.retos = [...retosData]; // Copia defensiva
    }

    /**
     * Obtiene el siguiente reto disponible de forma aleatoria
     * @returns Reto o null si no quedan más
     */
    getNextReto(): Reto | null {
        const available = this.getAvailableRetos();

        if (available.length === 0) {
            return null; // No quedan retos
        }

        // Selección aleatoria
        const randomIndex = Math.floor(Math.random() * available.length);
        const reto = available[randomIndex];

        this.markAsUsed(reto.id);
        return reto;
    }

    /**
     * Obtiene un reto por dificultad específica
     * @param dificultad - Nivel de dificultad deseado
     * @returns Reto o null si no hay disponibles de esa dificultad
     */
    getRetoByDifficulty(dificultad: Dificultad): Reto | null {
        const available = this.getAvailableRetos().filter(
            r => r.dificultad === dificultad
        );

        if (available.length === 0) {
            return null;
        }

        const randomIndex = Math.floor(Math.random() * available.length);
        const reto = available[randomIndex];

        this.markAsUsed(reto.id);
        return reto;
    }

    /**
     * Obtiene un reto específico por ID
     * @param id - ID del reto
     * @returns Reto o null si no existe
     */
    getRetoById(id: number): Reto | null {
        return this.retos.find(r => r.id === id) ?? null;
    }

    /**
     * Obtiene retos por categoría
     * @param categoria - Categoría a filtrar
     * @returns Array de retos disponibles de esa categoría
     */
    getRetosByCategory(categoria: string): Reto[] {
        return this.getAvailableRetos().filter(
            r => r.categoria?.toLowerCase() === categoria.toLowerCase()
        );
    }

    /**
     * Obtiene todos los retos disponibles (no usados)
     * @returns Array de retos disponibles
     */
    getAvailableRetos(): Reto[] {
        return this.retos.filter(r => !this.usedIds.has(r.id));
    }

    /**
     * Marca un reto como usado
     * @param id - ID del reto
     */
    private markAsUsed(id: number): void {
        this.usedIds.add(id);
    }

    /**
     * Reinicia el repositorio para poder reutilizar todos los retos
     */
    reset(): void {
        this.usedIds.clear();
        this.currentIndex = 0;
    }

    /**
     * Obtiene el número total de retos
     */
    getTotalRetos(): number {
        return this.retos.length;
    }

    /**
     * Obtiene el número de retos restantes
     */
    getRemaining(): number {
        return this.retos.length - this.usedIds.size;
    }

    /**
     * Obtiene estadísticas de retos por dificultad
     */
    getStatsByDifficulty(): Record<Dificultad, { total: number; remaining: number }> {
        const stats: Record<Dificultad, { total: number; remaining: number }> = {
            FACIL: { total: 0, remaining: 0 },
            MEDIO: { total: 0, remaining: 0 },
            AVANZADO: { total: 0, remaining: 0 }
        };

        this.retos.forEach(reto => {
            stats[reto.dificultad].total++;
            if (!this.usedIds.has(reto.id)) {
                stats[reto.dificultad].remaining++;
            }
        });

        return stats;
    }

    /**
     * Verifica si quedan retos disponibles
     */
    hasRetosRemaining(): boolean {
        return this.getRemaining() > 0;
    }

    /**
     * Obtiene todas las categorías únicas disponibles
     */
    getCategories(): string[] {
        const categories = new Set<string>();
        this.retos.forEach(reto => {
            if (reto.categoria) {
                categories.add(reto.categoria);
            }
        });
        return Array.from(categories);
    }

    /**
     * Valida la estructura de los retos
     */
    private validateRetos(retos: Reto[]): void {
        retos.forEach((reto, index) => {
            if (!reto.id || !reto.pregunta || !reto.dificultad || !reto.puntosBase) {
                throw new Error(
                    `Reto inválido en índice ${index}: faltan campos requeridos`
                );
            }

            if (!['FACIL', 'MEDIO', 'AVANZADO'].includes(reto.dificultad)) {
                throw new Error(
                    `Reto ${reto.id}: dificultad inválida "${reto.dificultad}"`
                );
            }

            if (reto.puntosBase <= 0) {
                throw new Error(
                    `Reto ${reto.id}: puntosBase debe ser mayor a 0`
                );
            }
        });

        // Verificar IDs únicos
        const ids = new Set(retos.map(r => r.id));
        if (ids.size !== retos.length) {
            throw new Error('Hay IDs de retos duplicados');
        }
    }
}