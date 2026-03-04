// src/components/game/DifficultyBadge.tsx

import { Star, Target, Zap } from 'lucide-react';
import type { Dificultad } from '../../models/types';
import { DIFICULTAD_LABELS } from '../../utils/constants';

interface DifficultyBadgeProps {
    dificultad: Dificultad;
    size?: 'sm' | 'md' | 'lg';
}

export default function DifficultyBadge({ dificultad, size = 'md' }: DifficultyBadgeProps) {
    const configs = {
        FACIL: {
            bg: 'bg-green-500',
            icon: Star,
            label: DIFICULTAD_LABELS.FACIL
        },
        MEDIO: {
            bg: 'bg-yellow-500',
            icon: Target,
            label: DIFICULTAD_LABELS.MEDIO
        },
        AVANZADO: {
            bg: 'bg-red-500',
            icon: Zap,
            label: DIFICULTAD_LABELS.AVANZADO
        }
    };

    const sizes = {
        sm: 'px-3 py-1 text-sm gap-1',
        md: 'px-4 py-2 text-base gap-2',
        lg: 'px-6 py-3 text-xl gap-2'
    };

    const iconSizes = {
        sm: 16,
        md: 20,
        lg: 24
    };

    const config = configs[dificultad];
    const Icon = config.icon;

    return (
        <div
            className={`inline-flex items-center ${config.bg} text-white rounded-full font-bold ${sizes[size]}`}
        >
            <Icon size={iconSizes[size]} />
            <span>{config.label}</span>
        </div>
    );
}