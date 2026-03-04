// src/data/repositories/RetoRepository.ts
import { Reto, Dificultad } from '../../models/types';

export class RetoRepository {
    private retos: Reto[];
    private usedIds: Set<number> = new Set();

    constructor(retosData: Reto[]) {
        this.retos = retosData;
    }

    getNextReto(): Reto | null {
        const disponibles = this.retos.filter(r => !this.usedIds.has(r.id));
        if (disponibles.length === 0) return null;
        const reto = disponibles[Math.floor(Math.random() * disponibles.length)];
        this.usedIds.add(reto.id);
        return reto;
    }

    getRetoByDifficulty(dificultad: Dificultad): Reto | null {
        const disponibles = this.retos.filter(r => !this.usedIds.has(r.id) && r.dificultad === dificultad);
        if (disponibles.length === 0) return null;
        const reto = disponibles[Math.floor(Math.random() * disponibles.length)];
        this.usedIds.add(reto.id);
        return reto;
    }

    hasRetosRemaining(): boolean {
        return this.retos.some(r => !this.usedIds.has(r.id));
    }

    getRemaining(): number {
        return this.retos.filter(r => !this.usedIds.has(r.id)).length;
    }

    getTotalRetos(): number {
        return this.retos.length;
    }

    getStatsByDifficulty(): Record<Dificultad, { total: number; used: number }> {
        const dificultades: Dificultad[] = ['FACIL', 'MEDIO', 'AVANZADO'];
        return Object.fromEntries(
            dificultades.map(d => [
                d,
                {
                    total: this.retos.filter(r => r.dificultad === d).length,
                    used: this.retos.filter(r => r.dificultad === d && this.usedIds.has(r.id)).length,
                },
            ])
        ) as Record<Dificultad, { total: number; used: number }>;
    }

    reset(): void {
        this.usedIds.clear();
    }
}