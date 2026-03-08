# ⚡ Subasta de Fe

> Sistema de trivia bíblica interactiva con mecánica de pujas, comodines y modo presentación para eventos en vivo.

---

## 📋 Tabla de Contenidos

- [Descripción](#-descripción)
- [Demo](#-demo)
- [Características](#-características)
- [Tecnologías](#-tecnologías)
- [Instalación](#-instalación)
- [Uso](#-uso)
- [Mecánica del Juego](#-mecánica-del-juego)
- [Comodines](#-comodines)
- [Estructura del Proyecto](#-estructura-del-proyecto)
- [Configuración](#-configuración)
- [Scripts Disponibles](#-scripts-disponibles)

---

## 📖 Descripción

**Subasta de Fe** es una aplicación web diseñada para dinamizar eventos, retiros y reuniones con una trivia bíblica competitiva. Los equipos compiten pujando puntos en cada pregunta — cuanto más confías en tu respuesta, más arriesgas.

El sistema está pensado para usarse con **dos dispositivos**:

| Dispositivo | Rol | URL |
|---|---|---|
| Computador del operador | Panel de Control | `/control` |
| Televisor / Proyector | Pantalla Pública | `/presentacion` |

Ambas ventanas se sincronizan automáticamente en tiempo real vía `localStorage`.

---

## ✨ Características

- 🎮 **Panel de Control** para el operador — gestiona pujas, respuestas y comodines
- 📺 **Pantalla Pública** — vista limpia para proyectar al público, sin controles visibles
- ⚡ **Sincronización automática** entre ventanas sin servidor
- 🏆 **Marcador en vivo** ordenado por puntos con indicadores de posición
- 🎭 **Overlays cinematográficos** — animación de veto, resultados y transiciones
- 💾 **Persistencia de sesión** — si recargas, puedes continuar la partida
- 📱 **Responsive** — el panel de control funciona desde el móvil
- 🚫 **Validación en doble capa** — UI + reducer para evitar trampas

---

## 🛠 Tecnologías

| Tecnología | Uso |
|---|---|
| React 18 + TypeScript | Framework principal |
| Vite | Build tool y dev server |
| React Router v6 | Enrutamiento SPA |
| Tailwind CSS | Estilos utilitarios |
| Lucide React | Iconografía |
| SweetAlert2 | Modales de confirmación |
| Plus Jakarta Sans | Tipografía principal |

---

## 🚀 Instalación

### Prerrequisitos

- Node.js `>= 18`
- npm `>= 9`

### Pasos

```bash
# 1. Clonar el repositorio
git clone https://github.com/tu-usuario/subasta-de-fe.git
cd subasta-de-fe

# 2. Instalar dependencias
npm install

# 3. Iniciar en modo desarrollo
npm run dev
```

La aplicación estará disponible en `http://localhost:5173`.

---

## 🎯 Uso

### Configuración inicial

1. Abre `http://localhost:5173` en el computador del operador
2. Haz clic en **Pantalla Pública** — se abre en una nueva pestaña
3. Arrastra esa pestaña al proyector o pantalla secundaria
4. En el computador, haz clic en **Panel de Control**

### Flujo de una partida

```
Configurar equipos → Iniciar juego → [Por cada ronda]:
  1. Mostrar pregunta en pantalla pública
  2. Equipos anuncian su puja verbalmente
  3. Operador registra la puja ganadora
  4. Equipo responde en voz alta
  5. Operador marca Correcto / Incorrecto
  6. Sistema actualiza puntos automáticamente
```

### Configurar equipos

En la pantalla de configuración puedes elegir entre **2 y 8 equipos**. Los nombres son editables. Al iniciar, cada equipo recibe:

- `0` puntos iniciales
- `2` comodines Doble
- `2` comodines Salva
- `2` comodines Veto

---

## 🃏 Mecánica del Juego

### Sistema de Pujas

Cada ronda el operador selecciona qué equipo ganó la puja (se lo hacen saber verbalmente). La puja mínima es el valor base de la pregunta según su dificultad:

| Dificultad | Puja mínima |
|---|---|
| 🟢 Fácil | 10 pts |
| 🟡 Medio | 20 pts |
| 🔴 Avanzado | 30 pts |

### Resultado

| Situación | Efecto |
|---|---|
| Acierto normal | `+puja` |
| Fallo normal | `-puja` |
| Acierto con DOBLE | `+puja × 2` |
| Fallo con DOBLE | `-puja × 2` |
| Acierto con SALVA | `+puja` |
| Fallo con SALVA | `0` (protegido) |

> Los puntos nunca bajan de `0`. Un equipo no puede quedar en negativo.

### Saltar Pregunta

Si ningún equipo quiere pujar, el operador puede **saltar la pregunta** desde el panel. No se asignan ni restan puntos y se avanza a la siguiente ronda.

---

## 🔮 Comodines

Cada equipo dispone de **2 usos** por comodín durante toda la partida. El estado se muestra en tiempo real con indicadores visuales (● = disponible, ○ = usado).

### 🎯 DOBLE

Duplica la ganancia **o** la pérdida. Es de alto riesgo/alta recompensa.

```
Puja 100 pts + acierto → +200 pts
Puja 100 pts + fallo   → -200 pts
```

### 🛡️ SALVA

Protege al equipo de perder puntos si falla. Si acierta, gana normalmente.

```
Puja 100 pts + acierto → +100 pts
Puja 100 pts + fallo   →   0 pts (sin pérdida)
```

### 🚫 VETO

Bloquea a un equipo rival para que **no pueda pujar** en esa ronda. Se aplica antes de registrar pujas. Se libera automáticamente al inicio de la siguiente ronda.

> ⚠️ El comodín VETO se selecciona en el panel de control antes de que empiecen las pujas. El equipo bloqueado lo verá indicado en pantalla.

---

## 📁 Estructura del Proyecto

```
src/
├── components/
│   ├── control/
│   │   ├── ActionButtons.tsx     # Botones Correcto / Incorrecto
│   │   ├── BiddingPanel.tsx      # Formulario de puja con comodines
│   │   └── VetoPanel.tsx         # Panel para aplicar veto
│   └── game/
│       ├── RetoCard.tsx          # Tarjeta de pregunta (pantalla pública)
│       ├── ScoreBoard.tsx        # Marcador con grid responsivo
│       ├── TeamCard.tsx          # Card de equipo con indicadores
│       ├── VetoOverlay.tsx       # Overlay cinematográfico de veto
│       └── ResultOverlay.tsx     # Overlay de resultado (correcto/incorrecto)
│
├── data/
│   ├── retos.json                # Base de preguntas bíblicas
│   └── repositories/
│       └── RetoRepository.ts    # Gestión y aleatorización de preguntas
│
├── features/
│   ├── control/
│   │   └── ControlView.tsx       # Vista del operador
│   └── presentation/
│       └── PresentationView.tsx  # Vista pública (proyector)
│
├── hooks/
│   ├── gameReducer.ts            # Reducer principal con toda la lógica
│   ├── useGame.ts                # Hook orquestador del estado
│   └── useScoring.ts             # Hook de cálculo de puntos
│
├── models/
│   └── types.ts                  # Tipos TypeScript del dominio
│
├── services/
│   ├── ScoringService.ts         # Lógica de puntuación
│   └── StorageService.ts         # Persistencia en localStorage
│
├── utils/
│   └── constants.ts              # Constantes globales del juego
│
├── views/
│   ├── ConfigView.tsx            # Pantalla de configuración inicial
│   └── GameView.tsx              # Wrapper de la vista en juego
│
└── App.tsx                       # Rutas y punto de entrada
```

---

## ⚙️ Configuración

Las constantes del juego se centralizan en `src/utils/constants.ts`:

```typescript
export const GAME_CONSTANTS = {
    PUNTOS_INICIALES: 0,          // Puntos con los que inicia cada equipo

    COMODINES_INICIALES: {
        doble: 2,                 // Usos de comodín DOBLE por equipo
        salva: 2,                 // Usos de comodín SALVA por equipo
        veto: 2,                  // Usos de comodín VETO por equipo
    },

    MIN_EQUIPOS: 2,
    MAX_EQUIPOS: 8,

    MIN_PUJA: 10,
    MAX_PUJA: 1000,
    PUJA_INCREMENT: 10,
};
```

### Agregar preguntas

Las preguntas están en `src/data/retos.json`. Estructura de cada pregunta:

```json
{
    "id": 1,
    "pregunta": "¿Cuántos libros tiene el Nuevo Testamento?",
    "respuesta": "27",
    "dificultad": "FACIL",
    "puntosBase": 10,
    "categoria": "Estructura Bíblica",
    "referencia": "Biblia completa"
}
```

| Campo | Tipo | Valores |
|---|---|---|
| `id` | `number` | Único, incremental |
| `pregunta` | `string` | Texto de la pregunta |
| `respuesta` | `string` | Solo visible para el operador |
| `dificultad` | `string` | `FACIL` · `MEDIO` · `AVANZADO` |
| `puntosBase` | `number` | Puja mínima de la ronda |
| `categoria` | `string` | Categoría temática (opcional) |
| `referencia` | `string` | Cita bíblica (opcional) |

---

## 📜 Scripts Disponibles

```bash
# Iniciar servidor de desarrollo
npm run dev

# Compilar para producción
npm run build

# Vista previa del build
npm run preview

# Verificar tipos TypeScript
npm run typecheck
```

---

## 💡 Tips para el Evento

- **Antes de iniciar**: abre primero `/presentacion` en el proyector, luego `/control` en tu dispositivo
- **Sonido**: el sistema no requiere activación de audio (sin pantalla de bloqueo)
- **Reconexión**: si recargas el panel de control, puedes restaurar la partida desde localStorage
- **Múltiples dispositivos**: `/presentacion` puede abrirse en varios proyectores simultáneamente; todos se sincronizan solos
- **Ajustar dificultad**: modifica `puntosBase` en `retos.json` para controlar el ritmo de puntuación

---

## 📄 Licencia

MIT © 2025 — Hecho por Roy M ⚡ para eventos de comunidad.
