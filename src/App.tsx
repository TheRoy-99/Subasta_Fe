/**
 * ============================================================================
 * PROYECTO: SUBASTA DE FE
 * ARCHIVO: src/App.tsx
 * ============================================================================
 */

import { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import { Play, X, Monitor, Gamepad2, Scroll, Info, Zap } from 'lucide-react';
import Swal from 'sweetalert2';

// --- SERVICIOS Y HOOKS ---
import { useGame } from './hooks/useGame';
import { StorageService } from './services/StorageService';
import { GAME_RULES } from './utils/constants';
import retosData from './data/retos.json';

// --- VISTAS ---
import ConfigView from './views/ConfigView';
import ControlView from './features/control/ControlView';

// --- COMPONENTES ---
import RetoCard from './components/game/RetoCard';
import ScoreBoard from './components/game/ScoreBoard';
import VetoOverlay from './components/game/VetoOverlay';
import ResultOverlay from './components/game/ResultOverlay';

interface GameRouteProps {
  game: ReturnType<typeof useGame>;
}

// ============================================================================
// RUTA: /presentacion  —  Pantalla pública (proyector)
// ============================================================================
function PresentationRoute({ game }: GameRouteProps) {
  const { gameState } = game;

  // ── A. LOBBY ──────────────────────────────────────────────────────────────
  if (!gameState || gameState.phase === 'CONFIG') {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-6 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-slate-900 via-slate-950 to-black z-0" />

        <div className="relative z-10 w-full max-w-7xl grid lg:grid-cols-2 gap-12 items-center">

          {/* Branding */}
          <div className="text-center lg:text-left relative">
            <div className="absolute top-1/2 left-1/2 lg:left-1/4 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-amber-500/20 blur-[100px] rounded-full animate-pulse -z-10" />
            <h1 className="text-6xl md:text-8xl font-black text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-orange-600 drop-shadow-2xl mb-6 tracking-tight">
              SUBASTA<br />DE FE
            </h1>
            <div className="inline-block px-8 py-4 border border-slate-700/50 rounded-2xl bg-slate-900/50 backdrop-blur-md mb-8 shadow-xl">
              <p className="text-xl md:text-2xl text-slate-300 font-light tracking-[0.2em] uppercase animate-pulse flex items-center gap-3">
                <span className="w-3 h-3 bg-green-500 rounded-full animate-ping" />
                Esperando al operador...
              </p>
            </div>
          </div>

          {/* Reglas */}
          <div className="bg-slate-900/60 backdrop-blur-xl border border-slate-700/50 rounded-3xl p-8 shadow-2xl animate-in slide-in-from-right-10 duration-700">
            <div className="flex items-center gap-3 mb-6 border-b border-slate-700 pb-4">
              <div className="bg-blue-500/20 p-3 rounded-xl text-blue-400">
                <Scroll size={32} />
              </div>
              <h2 className="text-3xl font-bold text-white">Reglas del Juego</h2>
            </div>
            <ul className="space-y-4">
              {GAME_RULES.rules.map((regla, index) => (
                <li key={index} className="flex items-start gap-4 text-slate-300 text-lg leading-relaxed">
                  <span className="bg-slate-800 text-slate-500 font-bold w-8 h-8 flex-shrink-0 rounded-full flex items-center justify-center text-sm border border-slate-700 mt-1">
                    {index + 1}
                  </span>
                  <span>
                    {regla.includes('DOBLE') ? (
                      <>🎯 <strong>DOBLE:</strong> Ganas x2 o <span className="text-red-400 font-bold">Pierdes x2</span>.</>
                    ) : regla.includes('SALVA') ? (
                      <>🛡️ <strong>SALVA:</strong> Te protege de perder puntos.</>
                    ) : regla.includes('VETO') ? (
                      <>🚫 <strong>VETO:</strong> Bloquea a un rival (Estratégico).</>
                    ) : regla}
                  </span>
                </li>
              ))}
            </ul>
            <div className="mt-8 bg-blue-900/20 border border-blue-500/30 p-4 rounded-xl flex gap-3 items-start">
              <Info className="text-blue-400 flex-shrink-0 mt-1" size={20} />
              <p className="text-sm text-blue-200/80 italic">
                "La estrategia lo es todo. Usa tus comodines sabiamente y observa a tus oponentes."
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ── B. JUEGO ACTIVO ───────────────────────────────────────────────────────
  const lastResult = gameState.historial.length > 0
    ? gameState.historial[gameState.historial.length - 1]
    : null;

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col p-6 md:p-12 overflow-hidden relative">

      {/* Overlays */}
      <VetoOverlay vetadoId={gameState.equipoVetadoId} teams={gameState.equipos} />
      {gameState.phase === 'SHOWING_RESULT' && lastResult && (
        <ResultOverlay result={lastResult} teams={gameState.equipos} />
      )}

      {/* Fondo */}
      <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-900 via-slate-950 to-black -z-10" />

      {/* Header */}
      <div className="flex justify-between items-start mb-8 opacity-50 relative z-10">
        <h2 className="text-xl font-bold text-amber-500 flex items-center gap-2">
          <Zap size={20} /> Subasta de Fe
        </h2>
        {gameState.ronda > 0 && (
          <span className="text-slate-400 text-sm tracking-widest uppercase border border-slate-700 px-3 py-1 rounded-full bg-slate-900/50">
            Ronda {gameState.ronda}
          </span>
        )}
      </div>

      {/* Reto */}
      <div className="flex-1 flex items-center justify-center mb-12 relative z-10">
        {gameState.retoActual ? (
          <div className="w-full max-w-5xl transform transition-all duration-500 hover:scale-[1.01]">
            <RetoCard reto={gameState.retoActual} ronda={gameState.ronda} />
          </div>
        ) : (
          <div className="text-center text-slate-500 italic text-xl animate-bounce">
            Preparando siguiente reto...
          </div>
        )}
      </div>

      {/* ScoreBoard */}
      <div className="w-full max-w-7xl mx-auto relative z-10">
        <ScoreBoard
          teams={gameState.equipos}
          highlightTeamId={gameState.pujaActual?.equipoId}
        />
      </div>
    </div>
  );
}

// ============================================================================
// RUTA: /control  —  Panel del operador
// ============================================================================
function ControlRoute({ game }: GameRouteProps) {
  const [gameStarted, setGameStarted] = useState(false);
  const [showRestoreDialog, setShowRestoreDialog] = useState(false);

  useEffect(() => {
    if (StorageService.hasGameState()) setShowRestoreDialog(true);
  }, []);

  useEffect(() => {
    if (game.gameState && game.gameState.phase !== 'CONFIG') setGameStarted(true);
  }, [game.gameState]);

  const handleStartGame = (nombresEquipos: string[]) => {
    game.actions.initializeTeams(nombresEquipos);
    game.actions.startGame();
    setGameStarted(true);
  };

  const handleRestoreGame = () => {
    const restored = game.actions.restoreFromStorage();
    if (restored) {
      setShowRestoreDialog(false);
      setGameStarted(true);
    } else {
      Swal.fire({ title: 'Error', text: 'No se pudo restaurar.', icon: 'error', background: '#1e293b', color: '#fff' });
      handleNewGame();
    }
  };

  const handleNewGame = () => {
    StorageService.clearGameState();
    setShowRestoreDialog(false);
    game.actions.reset();
  };

  const handleReset = () => {
    Swal.fire({
      title: '¿Reiniciar Juego?',
      text: 'Se borrará todo el progreso. ¡No hay vuelta atrás!',
      icon: 'warning', background: '#1e293b', color: '#fff',
      showCancelButton: true,
      confirmButtonColor: '#ef4444', cancelButtonColor: '#475569',
      confirmButtonText: 'Sí, reiniciar',
    }).then(result => {
      if (result.isConfirmed) {
        game.actions.reset();
        StorageService.clearGameState();
        setGameStarted(false);
        Swal.fire({ title: 'Reiniciado', icon: 'success', timer: 1000, showConfirmButton: false, background: '#1e293b', color: '#fff' });
      }
    });
  };

  if (game.isLoading) return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center text-white">
      Cargando sistema...
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-900">
      {/* Modal restaurar sesión */}
      {showRestoreDialog && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-slate-800 rounded-2xl p-8 max-w-md w-full border-2 border-amber-500 shadow-2xl animate-in zoom-in duration-300">
            <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-3">
              <Play size={28} className="text-amber-500" /> Sesión Detectada
            </h2>
            <p className="text-slate-300 mb-6">Hemos encontrado una partida en curso. ¿Deseas continuarla?</p>
            <div className="space-y-3">
              <button onClick={handleRestoreGame} className="w-full bg-green-600 hover:bg-green-500 text-white font-bold py-4 px-6 rounded-xl transition-all flex items-center justify-center gap-2">
                <Play size={20} /> Continuar Partida
              </button>
              <button onClick={handleNewGame} className="w-full bg-slate-700 hover:bg-slate-600 text-white font-bold py-4 px-6 rounded-xl transition-all flex items-center justify-center gap-2">
                <X size={20} /> Nueva Partida
              </button>
            </div>
          </div>
        </div>
      )}

      {!gameStarted
        ? <ConfigView onStart={handleStartGame} />
        : <ControlView game={game} onReset={handleReset} />
      }
    </div>
  );
}

// ============================================================================
// RUTA: /  —  Home
// ============================================================================
function Home() {
  return (
    <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-6 text-white relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-slate-900 to-slate-950 z-0" />

      <div className="max-w-5xl w-full text-center z-10">
        <div className="mb-16 relative">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-amber-500/20 blur-[100px] rounded-full" />
          <h1 className="relative text-7xl md:text-9xl font-black text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-orange-600 drop-shadow-2xl tracking-tighter">
            SUBASTA DE FE
          </h1>
          <p className="text-slate-400 mt-4 text-xl tracking-[0.3em] uppercase font-light">
            Sistema de Gestión de Eventos
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          <Link to="/presentacion" target="_blank" className="group relative bg-slate-900/40 backdrop-blur-sm hover:bg-slate-800 p-10 rounded-[2rem] border border-slate-700 hover:border-blue-500/50 transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl hover:shadow-blue-500/10">
            <div className="absolute top-8 right-8 text-slate-700 group-hover:text-blue-500 transition-colors">
              <Monitor size={48} />
            </div>
            <div className="text-7xl mb-8 group-hover:scale-110 transition-transform duration-300">📺</div>
            <h2 className="text-3xl font-bold mb-3 text-white group-hover:text-blue-400">Pantalla Pública</h2>
            <p className="text-slate-500 text-sm leading-relaxed font-medium">
              Abre esta vista en una nueva pestaña y arrástrala al proyector.
            </p>
          </Link>

          <Link to="/control" className="group relative bg-slate-900/40 backdrop-blur-sm hover:bg-slate-800 p-10 rounded-[2rem] border border-slate-700 hover:border-amber-500/50 transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl hover:shadow-amber-500/10">
            <div className="absolute top-8 right-8 text-slate-700 group-hover:text-amber-500 transition-colors">
              <Gamepad2 size={48} />
            </div>
            <div className="text-7xl mb-8 group-hover:scale-110 transition-transform duration-300">🎮</div>
            <h2 className="text-3xl font-bold mb-3 text-white group-hover:text-amber-400">Panel de Control</h2>
            <p className="text-slate-500 text-sm leading-relaxed font-medium">
              Interfaz para el operador. Gestiona puntos, rondas y vetos.
            </p>
          </Link>
        </div>

        <div className="mt-16 inline-flex items-center gap-3 text-slate-600 text-xs uppercase tracking-widest opacity-70 bg-slate-900/50 px-6 py-2 rounded-full border border-slate-800">
          <span>💡 Tip:</span>
          <span>Usa "Extender Pantalla" (Windows+P) para proyectar.</span>
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// ROOT
// ============================================================================
function App() {
  const game = useGame(retosData as any);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/control" element={<ControlRoute game={game} />} />
        <Route path="/presentacion" element={<PresentationRoute game={game} />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;