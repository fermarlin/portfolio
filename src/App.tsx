import { Routes, Route, useNavigate, useLocation } from "react-router-dom";
import Home from "./pages/Home";
import Projects from "./pages/Projects";
import About from "./pages/About";
import { useRef } from "react";
import type { BattleTransitionHandle } from "./components/RetroFxDemo";
import { PixelBurstLayer, BattleTransition } from "./components/RetroFxDemo";

export default function App() {
  const navigate = useNavigate();
  const location = useLocation();
  const battleRef = useRef<BattleTransitionHandle>(null);

  /**
   * Navega con transición RPG si está disponible.
   * Si la animación no se dispara (ref nulo, etc.), hace fallback tras `maxDelay`.
   */
  const go = (path: string, maxDelay = 900) => {
    // Si ya estamos en esa ruta, sólo lanzamos anim opcionalmente
    if (location.pathname === path) {
      battleRef.current?.play?.();
      return;
    }

    // Fallback de seguridad por si el onComplete no llega
    let navigated = false;
    const timer = window.setTimeout(() => {
      if (!navigated) {
        navigated = true;
        navigate(path);
      }
    }, maxDelay);

    // Intenta reproducir la transición; si no hay ref, navega directo
    if (battleRef.current?.play) {
      battleRef.current.play(() => {
        if (!navigated) {
          navigated = true;
          window.clearTimeout(timer);
          navigate(path);
        }
      });
    } else {
      // Sin transición disponible
      navigated = true;
      window.clearTimeout(timer);
      navigate(path);
    }
  };

  return (
    <PixelBurstLayer
      options={{
        // Ajustes suaves; tu capa de píxeles seguirá funcionando al click
        size: 4,
        count: 40,
        speed: 1.1,
        swirl: true,
        swirlStrength: 0.85,
        radialImpulse: 0.9,
      }}>
        
      <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-200 dark:from-neutral-950 dark:to-neutral-900 text-slate-900 dark:text-slate-100">
        {/* NAVBAR */}
        <nav className="sticky top-0 z-30 backdrop-blur bg-white/60 dark:bg-neutral-900/60 border-b border-black/10 dark:border-white/10">
          <div className="max-w-5xl mx-auto px-6 h-14 flex items-center gap-4">
            <button
              onClick={() => go("/")}
              className="px-3 py-1 rounded-lg border border-black/10 dark:border-white/10 cursor-pointer"
            >
              Inicio
            </button>
            <button
              onClick={() => go("/projects")}
              className="px-3 py-1 rounded-lg border border-black/10 dark:border-white/10 cursor-pointer"
            >
              Proyectos
            </button>
            <button
              onClick={() => go("/about")}
              className="px-3 py-1 rounded-lg border border-black/10 dark:border-white/10 cursor-pointer"
            >
              Sobre mi
            </button>
          </div>
        </nav>

        {/* RUTAS */}
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/projects" element={<Projects />} />
          <Route path="/about" element={<About />} />
        </Routes>
      </div>

      {/* TRANSICIÓN RPG */}
      <BattleTransition
        ref={battleRef}
        modes={["bars", "iris", "checker"]}
      />
    </PixelBurstLayer>
  );
}
