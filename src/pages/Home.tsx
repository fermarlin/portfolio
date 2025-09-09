import { useNavigate } from "react-router-dom";

/** Barra estilo RPG */
type Stat = { label: string; value: number; max?: number; color?: string };

function StatBar({ label, value, max = 100, color = "bg-emerald-500" }: Stat) {
  const pct = Math.max(0, Math.min(100, Math.round((value / max) * 100)));
  return (
    <div className="space-y-1">
      <div className="flex items-baseline justify-between">
        <span className="font-medium tracking-wide">{label}</span>
        <span className="text-xs opacity-70 tabular-nums">{value}/{max}</span>
      </div>
      <div className="h-3 rounded border border-black/10 dark:border-white/10 bg-black/5 dark:bg-white/5 overflow-hidden">
        <div className={`h-full ${color}`} style={{ width: `${pct}%`, imageRendering: "pixelated" }} />
      </div>
    </div>
  );
}

type Skill = {
  name: string;
  level: number;
  note?: string;
  tags?: string[];
  color: string;   // ← nuevo
};

function SkillMeter({ name, level, note, tags, color }: Skill) {
  const pct = Math.max(0, Math.min(100, Math.round(level)));
  return (
    <div className="space-y-2">
      <div className="flex items-baseline justify-between">
        <div className="font-medium">{name}</div>
        <div className="text-xs opacity-70 tabular-nums">{pct}%</div>
      </div>
      <div className="h-2.5 rounded-md border border-black/10 dark:border-white/10 bg-black/5 dark:bg-white/5 overflow-hidden">
      <div
        className={`h-full bg-gradient-to-r ${color}`}
        style={{ width: `${pct}%` }}
      />
      </div>
      {note && <div className="text-xs opacity-80">{note}</div>}
      {tags && tags.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {tags.map(t => (
            <span key={t} className="px-2 py-0.5 rounded text-[10px] border border-black/10 dark:border-white/10 bg-black/5 dark:bg-white/10">
              {t}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}

export default function Home() {
  const navigate = useNavigate();

  const name = "Fernando Martínez Lineros";
  const role = "Unity / Unreal Developer";
  const level = 6;
  const phone = "+34 697570234";
  const email = "fermartilin@gmail.com";
  const linkedin = "https://www.linkedin.com/in/ferma/";
  const itchio = "https://fermarlin.itch.io/";
  const location = "Sevilla, España";
  const archetype = "Developer";

  const languages = [
    { label: "Español (Nativo)", color: "bg-emerald-500" },
    { label: "Inglés (B2)", color: "bg-sky-500" },
  ];

const skills: Skill[] = [
  {
    name: "Unity (C#)",
    level: 88,
    note: "URP, arquitectura de gameplay, tooling, perfilado básico.",
    tags: ["URP", "ScriptableObjects", "Editor Tools", "Cinemachine", "Timeline"],
    color: "from-emerald-500 to-teal-500"
  },
  {
    name: "XR / VR con Unity",
    level: 90,
    note: "Quest 2/Pro, interacción natural, confort, UI diegética.",
    tags: ["XR Interaction Toolkit", "OVR", "Locomotion", "UX VR"],
    color: "from-fuchsia-500 to-pink-500"
  },
  {
    name: "Unreal Engine",
    level: 70,
    note: "Blueprints y materiales; integración básica de gameplay.",
    tags: ["Blueprints", "Materials"],
    color: "from-sky-500 to-indigo-500"
  },
  {
    name: "Optimización y Rendimiento",
    level: 78,
    note: "Batching, LODs, lightmaps, perfilado y micro-optimizaciones.",
    tags: ["Profiler", "LOD/Lightmap", "GC/Allocations"],
    color: "from-amber-500 to-yellow-500"
  },
  {
    name: "Multiplayer / Netcode",
    level: 65,
    note: "Sincronización básica, LAN, autoridad y estados.",
    tags: ["Netcode for GO", "RPC", "SyncVars"],
    color: "from-rose-500 to-red-500"
  },
  {
    name: "3D / Pipeline",
    level: 75,
    note: "Modelado y optimización para tiempo real.",
    tags: ["Blender", "UVs", "Normals", "Export FBX"],
    color: "from-lime-500 to-green-500"
  },
  {
    name: "Shaders y VFX",
    level: 60,
    note: "Shaders simples para feedback y look & feel.",
    tags: ["URP ShaderGraph", "Post Processing"],
    color: "from-purple-500 to-violet-600"
  },
];

   const education = [
    { title: "U-TAD — Diseño de Productos Interactivos", period: "2024–2028" },
    { title: "ILERNA FP — Animaciones 3D, Juegos y Entornos Interactivos", period: "2020–2022" },
  ];

  const hardSkills = [
    "Unity (URP, Netcode, XR)",
    "C#",
    "Unreal Engine (Blueprints)",
    "VR/AR (Meta Quest, Vuforia)",
    "Optimización de experiencias XR",
    "Interacción/UI diegética en VR",
    "Multiplayer (LAN)",
    "Blender (modelado y optimización 3D)",
    "Shaders básicos",
    "HTML/CSS/JavaScript",
    "Git / control de versiones",
    "Substance Painter",
    "Photoshop",
    "Illustrator"
  ];
  const softSkills = [
    "Trabajo en equipo",
    "Capacidad de aprendizaje autónomo (self-learning)",
    "Resolución de problemas técnicos y creativos",
    "Adaptabilidad a nuevas herramientas y flujos de trabajo",
    "Gestión del tiempo y organización de tareas",
    "Proactividad",
    "Resiliencia ante la presión y plazos ajustados",
    "Capacidad de liderazgo",
    "Pasión por los videojuegos y la innovación"
  ];


  const certifications = [
    {
      title: "Complete Game Design Course",
      url: "https://www.udemy.com/certificate/UC-c1bac7af-8be5-4bb9-8f22-b196c0a4f1cd/"
    },
    {
      title: "Narrative design and video game script course",
      url: "https://www.udemy.com/certificate/UC-d11e4685-b5c9-4dac-a9cf-f18b88ace5f4/"
    },
    {
      title: "Unreal Engine 5 VR Blueprint Crash Course",
      url: "https://www.udemy.com/certificate/UC-7f81f829-a8c2-4c2d-8402-f42604b8f9c8/"
    },
    {
      title: "The Psychology of Games - Secrets of Good Game Design",
      url: "https://www.udemy.com/certificate/UC-2a336e04-0151-4fa5-9e07-f438a9de6155/"
    },
    {
      title: "Alemán A1 - Comenzando Desde Cero",
      url: "https://www.udemy.com/certificate/UC-40604a17-891b-4553-b83c-1c1a04cdeff5/"
    },
    {
      title: "Curso interno de Scrum",
      url: "https://www.linkedin.com/in/ferma/details/certifications/"
    },
  ];


  // ===== NUEVO: Experiencia laboral =====
  type Job = {
    company: string;
    role: string;
    period: string;
    bullets: string[];
  };

  const experience: Job[] = [
    {
      company: "ATEXIS",
      role: "Middle Software Developer",
      period: "2024 – Presente",
      bullets: [
        "Experiencia XR interactiva para Airbus (Unity, Quest 2, 3 y Pro)",
        "Modelado 3D de vehículo de combate para TES + tareas de mantenimiento con Eyeflow.",
        "Gestión de equipos y mejora de flujo de trabajo a traves de optimizaciones de codigo.",
      ],
    },
    {
      company: "ATEXIS",
      role: "Junior Software Developer",
      period: "2022 – 2024",
      bullets: [
        "Proyecto VR multijugador para Airbus: rescate de paracaidistas, uso de mismos objetos y todo en una conexión LAN segura.",
        "Brief concept de mantenimiento para vehículo de combate (VR y AR Vuforia) con generacion de tareas con XML + modelos 3D.",
        "Modelado 3D de submarino para Navantia.",
        "Módulos interactivos web (JS/CSS/HTML) para entrenar pilotos en los distintos ATAS.",
      ],
    },
    {
      company: "Erynek3D",
      role: "3D Modeler",
      period: "2021",
      bullets: [
        "Modelado y animación de personajes en Cinema 4D.",
        "Trabajo internacional (Polonia) usando inglés en entorno profesional.",
      ],
    },
    {
      company: "CadmiaTeam",
      role: "Web Designer & Programmer",
      period: "2019 – 2021",
      bullets: [
        "Desarrollo web (HTML, CSS, JS) y diseño (Photoshop/Illustrator).",
        "Sitios comerciales como cibercafés y soluciones a medida.",
      ],
    },
  ];

  const hp = 90, mp = 72;

  return (
    <main className="min-h-[calc(100vh-3.5rem)]">
      <div className="max-w-5xl mx-auto px-6 py-10">
        <div className="relative rounded-2xl border border-black/10 dark:border-white/10 bg-white/80 dark:bg-neutral-900/70 backdrop-blur">
          <div
            className="absolute inset-0 -z-10 rounded-2xl"
            style={{
              background:
                "repeating-linear-gradient(0deg, transparent 0px, transparent 3px, rgba(0,0,0,0.03) 4px), radial-gradient(1200px 300px at 10% -20%, rgba(0,0,0,0.06), transparent), radial-gradient(1200px 300px at 110% 120%, rgba(0,0,0,0.06), transparent)",
              maskImage: "linear-gradient(to bottom, black 70%, transparent 100%)",
            }}
          />
          <div className="pointer-events-none absolute inset-[6px] rounded-xl border border-black/10 dark:border-white/10" style={{ imageRendering: "pixelated" }} />

          <div className="p-6 sm:p-10">
            {/* Cabecera tipo ficha */}
            <section className="flex flex-col md:flex-row md:items-center gap-6">
              <div className="shrink-0 relative">
              <img
                src="/me.jpg"
                alt="Foto de perfil"
                className="h-50 w-50 rounded-xl object-cover shadow-lg border border-black/20"
              />
                <div className="absolute -bottom-2 -right-2 text-xs px-2 py-1 rounded-md bg-emerald-600 text-white shadow">
                  LV {level}
                </div>
              </div>

              <div className="flex-1">
                <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">{name}</h1>
                <p className="mt-1 text-lg opacity-90">{role}</p>
                <p className="mt-1 text-sm opacity-70">
                  <span className="font-medium">{archetype}</span> · {location}
                </p>

                <div className="mt-3 flex flex-wrap items-center gap-2 text-sm">
                  <a href={`tel:${phone.replace(/\s+/g, "")}`} className="px-2.5 py-1 rounded-lg border border-black/10 dark:border-white/10 bg-black/5 dark:bg-white/10">{phone}</a>
                  <a href={`mailto:${email}`} className="px-2.5 py-1 rounded-lg border border-black/10 dark:border-white/10 bg-black/5 dark:bg-white/10">{email}</a>
                  <a href={linkedin} target="_blank" rel="noreferrer" className="px-2.5 py-1 rounded-lg border border-black/10 dark:border-white/10 hover:bg-black/5 dark:hover:bg-white/10">LinkedIn</a>
                  <a href={itchio} target="_blank" rel="noreferrer" className="px-2.5 py-1 rounded-lg border border-black/10 dark:border-white/10 hover:bg-black/5 dark:hover:bg-white/10">Itch.io</a>
                </div>

                <div className="mt-4 flex flex-wrap gap-3">
                  <button onClick={() => navigate("/projects")} className="px-4 py-2 rounded-xl border border-black/10 dark:border-white/10 bg-black text-white dark:bg-white dark:text-black hover:opacity-90 transition cursor-pointer">
                    Ver proyectos
                  </button>
                  <a href={`mailto:${email}`} className="px-4 py-2 rounded-xl border border-black/10 dark:border-white/10 hover:bg-black/5 dark:hover:bg-white/10 transition">
                    Contactar
                  </a>
                  <a
                    href="/cv.pdf"
                    download="Fernando_Martinez_Lineros_CV.pdf"
                    className="px-4 py-2 rounded-xl border border-black/10 dark:border-white/10 hover:bg-black/5 dark:hover:bg-white/10 transition"
                  >
                    Descargar CV
                  </a>
                </div>
              </div>
            </section>

            {/* HP/MP */}
            <section className="mt-8 grid gap-4 sm:grid-cols-2">
              <StatBar label="HP" value={hp} max={100} color="bg-red-500" />
              <StatBar label="MP" value={mp} max={100} color="bg-blue-500" />
            </section>

            {/* Competencias técnicas (profesional) */}
            <section className="mt-8 rounded-xl p-5 border border-black/10 dark:border-white/10 bg-white/70 dark:bg-neutral-900/70">
              <h2 className="font-semibold mb-3 tracking-wide">Competencias técnicas</h2>
              <div className="grid gap-5 md:grid-cols-2">
                {skills.map((s) => (
                  <SkillMeter key={s.name} {...s} />
                ))}
              </div>

            </section>

            {/* NUEVO: Experiencia */}
            <section className="mt-8 rounded-xl p-5 border border-black/10 dark:border-white/10 bg-white/70 dark:bg-neutral-900/70">
              <h2 className="font-semibold mb-3 tracking-wide">Experiencia</h2>
              <div className="space-y-5">
                {experience.map((job) => (
                  <div key={`${job.company}-${job.period}`} className="p-4 rounded-lg border border-black/10 dark:border-white/10 bg-black/5 dark:bg-white/5">
                    <div className="flex flex-wrap items-baseline justify-between gap-2">
                      <div className="font-semibold">{job.company}</div>
                      <div className="text-xs opacity-70 tabular-nums">{job.period}</div>
                    </div>
                    <div className="text-sm opacity-90">{job.role}</div>
                    <ul className="mt-2 space-y-1 text-sm leading-relaxed">
                      {job.bullets.map((b, i) => (
                        <li key={i} className="flex items-start gap-2">
                          <span className="mt-1 h-2 w-2 rounded-sm bg-violet-500" />
                          <span>{b}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </section>

            {/* Educación */}
            <section className="mt-8 rounded-xl p-5 border border-black/10 dark:border-white/10 bg-white/70 dark:bg-neutral-900/70">
              <h2 className="font-semibold mb-3 tracking-wide">Educación</h2>
              <ul className="space-y-2 text-sm">
                {education.map((e) => (
                  <li key={e.title} className="flex items-center justify-between">
                    <span>{e.title}</span>
                    <span className="opacity-70">{e.period}</span>
                  </li>
                ))}
              </ul>
            </section>
            {/* Misiones + Idiomas */}
            <section className="mt-8 grid gap-6 md:grid-cols-2">
              <div className="rounded-xl p-5 border border-black/10 dark:border-white/10 bg-white/70 dark:bg-neutral-900/70">
                <h2 className="font-semibold mb-3 tracking-wide">Certificaciones</h2>
                <ol className="list-disc pl-5 space-y-1 text-sm">
                  {certifications.map((c, i) => (
                    <li key={i}>
                      <a
                        href={c.url}
                        target="_blank"
                        rel="noreferrer"
                        className="text-emerald-600 dark:text-emerald-400 hover:underline"
                      >
                        {c.title}
                      </a>
                    </li>
                  ))}
                </ol>
              </div>
              <div className="rounded-xl p-5 border border-black/10 dark:border-white/10 bg-white/70 dark:bg-neutral-900/70">
                <h2 className="font-semibold mb-3 tracking-wide">Soft Skills</h2>
                <ul className="flex flex-wrap gap-2">
                  {softSkills.map((skill) => (
                    <li
                      key={skill}
                      className="px-2.5 py-1 rounded-lg text-xs border border-black/10 dark:border-white/10 bg-black/5 dark:bg-white/10"
                    >
                      {skill}
                    </li>
                  ))}
                </ul>
              </div>
            </section>

          {/* Hard Skills */}
          <section className="mt-8 rounded-xl p-5 border border-black/10 dark:border-white/10 bg-white/70 dark:bg-neutral-900/70">
            <h2 className="font-semibold mb-3 tracking-wide">Hard Skills</h2>
            <ul className="flex flex-wrap gap-2">
              {hardSkills.map((skill) => (
                <li
                  key={skill}
                  className="px-2.5 py-1 rounded-lg text-xs border border-black/10 dark:border-white/10 bg-black/5 dark:bg-white/10"
                >
                  {skill}
                </li>
              ))}
            </ul>
          </section>
            {/* Soft Skills */}
          <section className="mt-8 rounded-xl p-5 border border-black/10 dark:border-white/10 bg-white/70 dark:bg-neutral-900/70">
            <h2 className="font-semibold mb-3 tracking-wide">Idiomas</h2>
                <div className="flex flex-wrap gap-2">
                  {languages.map((l) => (
                    <span key={l.label} className={`px-2.5 py-1 rounded-lg text-xs border border-black/10 dark:border-white/10 ${l.color} text-white`}>
                      {l.label}
                    </span>
                  ))}
                </div>
          </section>
            
          </div>
        </div>
      </div>
    </main>
  );
}
