import React, { useEffect, useRef, useState, useCallback } from "react";
import { AnimatePresence, motion } from "framer-motion";

/**
 * React Retro FX – v3.3
 * Objetivo: Remolino visible, poca dispersión y desvanecimiento rápido.
 *
 * Cambios clave:
 * - Vida más corta (life 600ms aprox + random).
 * - Velocidad/impulso radial bajos.
 * - Damping radial: reduce la salida hacia fuera sin atraer de vuelta (no “ida y vuelta”).
 * - Swirl (giro) más marcado para que se perciba el remolino.
 */

type BurstOptions = {
  count?: number;                 // nº de partículas
  size?: number;                  // tamaño píxel
  speed?: number;                 // velocidad base inicial
  life?: number;                  // vida media (ms)
  gravity?: number;               // gravedad
  palette?: string[];             // colores

  swirl?: boolean;                // activar remolino
  swirlStrength?: number;         // fuerza tangencial

  radialImpulse?: number;         // “kick” radial hacia fuera
  radialDamp?: number;            // 0..1 frena el componente radial de la velocidad (0 = nada, 1 = lo anula)

  // variación por partícula
  speedVar?: [number, number];    // multiplicador de velocidad [min,max]
  radialImpulseVar?: [number, number]; // multiplicador del kick [min,max]
};

class Particle {
  x: number; y: number; vx: number; vy: number; life: number; age = 0; size: number; color: string;
  cx: number; cy: number; kick: number; dragX: number; dragY: number;
  constructor(
    x:number, y:number, vx:number, vy:number, life:number, size:number, color:string,
    cx:number, cy:number, kick:number
  ){
    this.x=x; this.y=y; this.vx=vx; this.vy=vy; this.life=life; this.size=size; this.color=color;
    this.cx=cx; this.cy=cy; this.kick=kick;
    // fricción sutil con pequeña variación por partícula
    this.dragX = 0.994 + Math.random()*0.003; // 0.994..0.997
    this.dragY = 0.994 + Math.random()*0.003;
  }
}

function useCanvasSize(){
  const [size,setSize]=useState({w:0,h:0});
  useEffect(()=>{
    const u=()=>setSize({w:window.innerWidth,h:window.innerHeight});
    u(); window.addEventListener("resize",u);
    return()=>window.removeEventListener("resize",u);
  },[]);
  return size;
}

const DEFAULT_PALETTE = ["#00E5FF","#A855F7","#22C55E","#F59E0B","#EF4444","#F43F5E"];

export const PixelBurstLayer: React.FC<React.PropsWithChildren<{ options?: BurstOptions }>> = ({ children, options }) => {
  const canvasRef = useRef<HTMLCanvasElement|null>(null);
  const { w, h } = useCanvasSize();
  const particles = useRef<Particle[]>([]);
  const rafRef = useRef<number|null>(null);

  const opts: Required<BurstOptions> = {
    count: options?.count ?? 40,           // menos partículas = más discreto
    size: options?.size ?? 4,              // píxel un pelín más pequeño
    speed: options?.speed ?? .9,          // velocidad inicial baja
    life: options?.life ?? 400,            // vida corta (se desvanece antes)
    gravity: options?.gravity ?? 0.02,     // caída muy suave
    palette: options?.palette ?? DEFAULT_PALETTE,

    swirl: options?.swirl ?? true,
    swirlStrength: options?.swirlStrength ?? 0.85,  // giro claro para ver remolino

    radialImpulse: options?.radialImpulse ?? 0.6,   // impulso hacia fuera bajo
    radialDamp: options?.radialDamp ?? 0.7,        // frena bastante la salida radial

    speedVar: options?.speedVar ?? [0.7, 1.4],      // dispersión controlada
    radialImpulseVar: options?.radialImpulseVar ?? [0.8, 1.3],
  } as Required<BurstOptions>;

  const spawn = (x:number, y:number) => {
    for (let i=0; i<opts.count; i++){
      // Dirección radial aleatoria (siempre sale desde el cursor)
      const angle = Math.random() * Math.PI * 2;

      // Velocidad inicial + variación por partícula
      const speedFactor = opts.speedVar[0] + Math.random()*(opts.speedVar[1]-opts.speedVar[0]);
      const speed = opts.speed * speedFactor;
      const vx = Math.cos(angle) * speed;
      const vy = Math.sin(angle) * speed;

      const size = Math.max(3, Math.round(opts.size * (0.8 + Math.random()*0.4)));
      // Vida corta con ligera variación
      const life = opts.life * (0.85 + Math.random()*0.4);
      const color = opts.palette[(Math.random()*opts.palette.length) | 0];

      // Kick radial por partícula
      const kickFactor = opts.radialImpulseVar[0] + Math.random()*(opts.radialImpulseVar[1]-opts.radialImpulseVar[0]);
      const kick = opts.radialImpulse * kickFactor;

      particles.current.push(new Particle(x,y,vx,vy,life,size,color,x,y,kick));
    }
  };

  const step = (ctx: CanvasRenderingContext2D, dt: number) => {
    ctx.imageSmoothingEnabled = false;
    ctx.clearRect(0,0,w,h);

    const list = particles.current;
    const tScale = dt / 16.67;

    for (let i=list.length-1; i>=0; i--){
      const p = list[i];
      p.age += dt;
      if (p.age >= p.life) { list.splice(i,1); continue; }

      // gravedad muy ligera
      p.vy += opts.gravity * tScale;

      // vectores base
      const dx = p.x - p.cx, dy = p.y - p.cy;
      const dist = Math.hypot(dx,dy) || 1e-6;
      const rx = dx / dist, ry = dy / dist;     // radial unitario
      const tx = -ry, ty = rx;                  // tangencial (perpendicular)

      // 1) swirl: solo giro (no atraemos hacia dentro)
      if (opts.swirl){
        const swirl = opts.swirlStrength * (1 / (1 + dist*0.02)); // decae con distancia
        p.vx += tx * swirl * tScale;
        p.vy += ty * swirl * tScale;
      }

      // 2) impulso radial hacia fuera, con decaimiento rápido
      if (opts.radialImpulse > 0){
        const kickDecay = Math.max(0, 1 - p.age/(p.life * 0.30)); // se extingue muy pronto
        const k = p.kick * kickDecay;
        p.vx += rx * k * tScale;
        p.vy += ry * k * tScale;
      }

      // 3) Damping del componente radial de la velocidad (limita la “salida”)
      if (opts.radialDamp > 0){
        // proyecta la velocidad sobre el radial
        const vRad = p.vx*rx + p.vy*ry; // componente radial (signo + = hacia fuera)
        const damp = opts.radialDamp * tScale;   // proporcional al frame
        const vRadAfter = vRad * Math.max(0, 1 - damp);
        const delta = vRadAfter - vRad;
        p.vx += rx * delta;
        p.vy += ry * delta;
      }

      // Avance + fricción leve por partícula
      p.x += p.vx * tScale;
      p.y += p.vy * tScale;
      p.vx *= p.dragX;
      p.vy *= p.dragY;

      // render 8-bit (alpha con caída rápida)
      const t = p.age / p.life;
      const alpha = Math.max(0, 1 - t * 1.25); // desvanecimiento un poco más rápido
      ctx.globalAlpha = alpha;
      ctx.fillStyle = p.color;
      ctx.fillRect(p.x|0, p.y|0, p.size, p.size);
    }

    ctx.globalAlpha = 1;
  };

  useEffect(()=>{
    const canvas = canvasRef.current;
    if (!canvas || !w || !h) return;
    const ctx = canvas.getContext("2d"); if (!ctx) return;

    let last = performance.now();
    const loop = () => {
      const now = performance.now();
      const dt = now - last; last = now;
      step(ctx, dt);
      rafRef.current = requestAnimationFrame(loop);
    };
    rafRef.current = requestAnimationFrame(loop);
    return ()=>{ if (rafRef.current) cancelAnimationFrame(rafRef.current); };
  }, [w,h]);

  const onClick = (e: React.MouseEvent) => {
    // El canvas es fixed a viewport: usamos clientX/clientY sin restas
    spawn(e.clientX, e.clientY);
  };


  return (
    <div id="retrofx-root" className="relative" onClick={onClick}>
      {children}
      <canvas ref={canvasRef} width={w} height={h} className="pointer-events-none fixed inset-0 z-40" />
    </div>
  );
};

/************************
 * BattleTransition (RPG)
 ************************/

/************************
 * BattleTransition (RPG)
 ************************/

export type BattleTransitionHandle = { play: (onComplete?: () => void) => void };
export type BattleMode = "bars" | "iris" | "checker";

export const BattleTransition = React.forwardRef<BattleTransitionHandle, { modes?: BattleMode[] }>(
  ({ modes }, ref) => {
    const [active, setActive] = useState(false);
    const [phase, setPhase] = useState<"in" | "flash" | "out">("in");
    const [mode, setMode] = useState<BattleMode>("bars");
    const doneCb = useRef<(() => void) | null>(null);
    const timeoutRef = useRef<number | null>(null);

    const chooseMode = useCallback((): BattleMode => {
      const pool: BattleMode[] = (modes && modes.length ? modes : ["bars","iris","checker"]);
      return pool[(Math.random()*pool.length)|0];
    }, [modes]);

    React.useImperativeHandle(ref, () => ({
      play: (onComplete?: () => void) => {
        doneCb.current = onComplete ?? null;
        setMode(chooseMode());
        setPhase("in");
        setActive(true);
      }
    }));

    // Failsafe para no bloquear la pantalla
    useEffect(() => {
      if (active) {
        timeoutRef.current = window.setTimeout(() => {
          setActive(false);
          setPhase("in");
          doneCb.current?.();
        }, 1200); // ajusta si cambias duraciones
        return () => {
          if (timeoutRef.current) window.clearTimeout(timeoutRef.current);
          timeoutRef.current = null;
        };
      }
    }, [active]);

    const onSequenceComplete = useCallback(() => {
      if (phase === "in") setPhase("flash");
      else if (phase === "flash") setPhase("out");
      else {
        setActive(false);
        setPhase("in");
        if (timeoutRef.current) { window.clearTimeout(timeoutRef.current); timeoutRef.current = null; }
        doneCb.current?.();
      }
    }, [phase]);

    return (
      <AnimatePresence>
        {active && (
          <motion.div className="fixed inset-0 z-50" initial={{opacity:1}} animate={{opacity:1}} exit={{opacity:0}}>
            {/* overlay */}
            <div className="absolute inset-0 bg-black/60" />

            {/* BARRAS */}
            {mode === "bars" && (
              <div className="absolute inset-0 grid z-10" style={{gridTemplateRows:"repeat(9,1fr)"}}>
                {Array.from({length:9}).map((_,i)=>(
                  <motion.div key={i} className="overflow-hidden">
                    <motion.div
                      className="w-full h-full bg-black"
                      initial={{scaleY:0}}
                      animate={{scaleY: phase==="in"?1: phase==="out"?0:1}}
                      transition={{type:"spring",stiffness:220,damping:22,delay:i*0.04}}
                    />
                  </motion.div>
                ))}
              </div>
            )}

            {/* IRIS */}
            {mode === "iris" && (
              <motion.div
                className="absolute inset-0 flex items-center justify-center z-10"
                initial={{clipPath:"circle(0% at 50% 50%)"}}
                animate={{clipPath: phase==="in"?"circle(150% at 50% 50%)": phase==="out"?"circle(0% at 50% 50%)":"circle(150% at 50% 50%)"}}
                transition={{duration:0.6, ease:"easeInOut"}}
              >
                <div className="absolute inset-0 bg-black"/>
              </motion.div>
            )}

            {/* CHECKER */}
            {mode === "checker" && (
              <div className="absolute inset-0 grid z-10" style={{gridTemplateColumns:"repeat(10,1fr)",gridTemplateRows:"repeat(6,1fr)"}}>
                {Array.from({length:60}).map((_,i)=>{
                  const delay=(i%10)*0.04 + Math.floor(i/10)*0.03;
                  return (
                    <motion.div
                      key={i}
                      className="bg-black"
                      initial={{scale:0}}
                      animate={{scale: phase==="in"?1: phase==="out"?0:1}}
                      transition={{duration:0.45, delay}}
                    />
                  );
                })}
              </div>
            )}
            
            {/* FLASH */}
            <AnimatePresence>
              {phase === "flash" && (
                <motion.div
                  key="flash"
                  className="absolute inset-0 z-20"
                  initial={{opacity:0}}
                  animate={{opacity:.4}}
                  exit={{opacity:0}}
                  transition={{duration:0.18}}
                  onAnimationComplete={onSequenceComplete}
                  style={{background:"radial-gradient(circle at 50% 50%, white 0%, white 18%, #e5e7eb 35%, #111827 60%, #000 100%)", mixBlendMode:"screen"}}
                />
              )}
            </AnimatePresence>

            {/* Avance de fases: clave -> key={phase} */}
            <motion.div
              key={phase}
              aria-hidden
              initial={{opacity:0}}
              animate={{opacity:1}}
              transition={{ duration: phase==="in"?0.75:0.6, delay: phase==="in"?0.18:0 }}
              onAnimationComplete={() => { if (phase !== "flash") onSequenceComplete(); }}
            />
          </motion.div>
        )}
      </AnimatePresence>
    );
  }
);


const Card: React.FC<React.PropsWithChildren<{ title: string }>> = ({ title, children }) => (
  <div className="rounded-2xl shadow-lg p-5 bg-white/80 dark:bg-neutral-900/80 backdrop-blur border border-black/5">
    <h3 className="text-lg font-semibold mb-2">{title}</h3>
    <div className="text-sm opacity-90">{children}</div>
  </div>
);

const RetroFxDemo: React.FC = () => {
  const battleRef = useRef<BattleTransitionHandle>(null);
  const trigger = () => battleRef.current?.play(()=>console.log("Transición lista"));
  return (
    <PixelBurstLayer
      options={{
        count: 40,
        size: 4,
        speed: 1.1,
        life: 650,
        gravity: 0.02,
        swirl: true,
        swirlStrength: 2,
        radialImpulse: 0.9,
        radialDamp: 0.55,
        speedVar: [0.7, 1.4],
        radialImpulseVar: [0.8, 1.3],
      }}
    >
      <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-200 dark:from-neutral-950 dark:to-neutral-900 text-slate-900 dark:text-slate-100">
        <div className="max-w-5xl mx-auto px-6 py-16 space-y-8">
          <header className="flex items-center justify-between">
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">Portfolio · Retro FX v3.3</h1>
            <button onClick={trigger} className="px-4 py-2 rounded-xl bg-black text-white dark:bg-white dark:text-black hover:opacity-90 transition">
              Transición RPG (aleatoria)
            </button>
          </header>
          <div className="grid md:grid-cols-3 gap-6">
            <Card title="Click = remolino discreto">Giro claro, poca dispersión y fade rápido.</Card>
            <Card title="Transiciones">Barras, iris, mosaico, slashes.</Card>
            <Card title="Integración">
              Usa <code>{"battleRef.current?.play(() => navigate('/ruta'))"}</code>.
            </Card>
          </div>
        </div>
      </div>
      <BattleTransition ref={battleRef} modes={["bars","iris","checker"]}/>
    </PixelBurstLayer>
  );
};

export default RetroFxDemo;
