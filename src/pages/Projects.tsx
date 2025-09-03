import { useMemo, useRef } from "react";
import { useNavigate, useLocation, useSearchParams } from "react-router-dom";
import { BattleTransition } from "../components/RetroFxDemo";
import type { BattleTransitionHandle } from "../components/RetroFxDemo";


function parseYTTimeToSeconds(t: string) {
  // admite "90", "17s", "1m30s", "2h3m4s"
  const m = t.match(/(?:(\d+)h)?(?:(\d+)m)?(?:(\d+)s)?$/);
  if (!m) return Number(t) || 0;
  const h = Number(m[1] || 0), mi = Number(m[2] || 0), s = Number(m[3] || 0);
  return h * 3600 + mi * 60 + s;
}
function parseItchSize(html: string) {
  const width = Number(html.match(/width="(\d+)"/)?.[1] ?? 970);
  const height = Number(html.match(/height="(\d+)"/)?.[1] ?? 560);
  const src = html.match(/src="([^"]+)"/)?.[1] ?? "";
  return { width, height, src };
}

function getYouTubeEmbedSrc(input: string) {
  // Si ya es un embed válido, lo devolvemos tal cual
  if (/\/embed\//.test(input)) return input;

  // Si es un ID "puro", montamos embed directo
  if (!input.includes("http")) {
    return `https://www.youtube.com/embed/${input}`;
  }

  try {
    const url = new URL(input);
    let id = "";
    let start = 0;

    if (url.hostname.includes("youtu.be")) {
      // https://youtu.be/<id>?t=17s
      id = url.pathname.slice(1);
      const t = url.searchParams.get("t") || url.searchParams.get("start");
      if (t) start = parseYTTimeToSeconds(t);
    } else {
      // https://www.youtube.com/watch?v=<id>&t=17s&ab_channel=...
      if (url.pathname.includes("/watch")) {
        id = url.searchParams.get("v") || "";
        const t = url.searchParams.get("t") || url.searchParams.get("start");
        if (t) start = parseYTTimeToSeconds(t);
      } else if (url.pathname.includes("/shorts/")) {
        id = url.pathname.split("/shorts/")[1];
      } else if (url.pathname.includes("/embed/")) {
        id = url.pathname.split("/embed/")[1];
      }
    }

    const params = new URLSearchParams();
    if (start > 0) params.set("start", String(start));
    // Puedes añadir extras si quieres:
    // params.set("rel", "0"); params.set("modestbranding", "1");

    return `https://www.youtube.com/embed/${id}${params.toString() ? "?" + params.toString() : ""}`;
  } catch {
    // fallback
    return `https://www.youtube.com/embed/${input}`;
  }
}

// ===== Datos de proyectos =====
type ProjectEntry = {
  title: string;
  summary: string;
  roles: string[];
  tech: string[];
  youtubeId?: string;    // ahora puede ser la URL completa de YouTube
  itchEmbed?: string;    // aquí guardamos el iframe completo como string
  links?: { label: string; url: string }[];
};

const PROJECTS: Record<string, ProjectEntry> = {
    "Kami y la cartulina perdida": {
    title: "Kami y la cartulina perdida",
    summary: "Su último proyecto. Y una cartulina que nadie recordó comprar. Acompaña a Kami en una divertida y emocionante aventura para conseguir la cartulina que permitirá a su hijo entregar el trabajo final y salvar los esperados planes familiares de verano. Pero no será tan sencillo: te enfrentarás a un clima impredecible y desafiante, que pondrá a prueba tu ingenio y determinación. ¿Lograrás convertir el mal tiempo en tu aliado y cumplir tu misión, o terminarás arruinando las vacaciones soñadas de la familia Kami?",
    roles: ["Lead Game Designer", "3D Character modeler/animator", "Scripting"],
    tech: ["Unity (Built-In)", "C#"],
    itchEmbed: `<iframe  src="https://itch.io/embed-upload/14292590?color=35a934" allowfullscreen="" width="970" height="560"><a href="https://fermarlin.itch.io/kamiylacartulina">Play Kami y la Cartulina Perdida on itch.io</a></iframe>`,
    links: [{ label: "Página de Itch.io", url: "https://fermarlin.itch.io/kamiylacartulina" }],
    },

  "Sonic Adventure: Custom Stages Demo": {
    title: "Sonic Adventure: Custom Stages Demo",
    summary: "Demo de fisicas de Sonic Adventure en Unity",
    roles: ["Game Designer", "3D Enviroment modeler/animator", "Scripting", "Level Design"],
    tech: ["Unity", "C#", "Built-In"],
    itchEmbed: `<iframe  src="https://itch.io/embed-upload/12177432?color=5192d8" allowfullscreen="" width="1290" height="740"><a href="https://fermarlin.itch.io/sonic-adventure-custom-stages-demo">Play Sonic Adventure: Custom Stages Demo on itch.io</a></iframe>`,
  },
  "Brews of forever tavern": {
    title: "Brews of forever tavern",
    summary: "Brews of Forever Tavern está ambientado en un mundo de fantasía, donde eres el dueño de una taberna encargado de tomar decisiones cada día para asegurar su éxito y renombre. Hay cuatro acciones diferentes, cada una con sus pros y contras. ¿Puedes mantener la taberna abierta el tiempo suficiente?",
    roles: ["Video Game Programmer", "Game Designer", "Scripting"],
    tech: ["Unity", "C#", "Built-In"],
    itchEmbed: `<iframe  src="https://itch.io/embed-upload/9904240?color=e0af9a" allowfullscreen="" width="1290" height="740"><a href="https://fermarlin.itch.io/brews-of-forever-tavern">Play Brews of Forever Tavern on itch.io</a></iframe>`,
  },
  "Ristar: Reimagined in Unity": {
    title: "Ristar: Reimagined in Unity",
    summary: "Revive el clásico Ristar en Unity: gráficos mejorados, jugabilidad y el primer nivel. ¡Próximamente, combates contra jefes y más!",
    roles: ["Video Game Programmer", "Game Designer", "Scripting"],
    tech: ["Unity", "C#", "Built-In"],
    itchEmbed: `<iframe  src="https://itch.io/embed-upload/10563955?color=0200a1" allowfullscreen="" width="1290" height="740"><a href="https://fermarlin.itch.io/ristar-remaster">Play Ristar: Reimagined in Unity on itch.io</a></iframe>`,
  },
  "¡Come Queso Ratón!": {
    title: "¡Come Queso Ratón!",
    summary: "Dos ratones intentan almacenar comida mientras evaden a un gato feroz",
    roles: ["Video Game Programmer", "Game Designer", "Scripting"],
    tech: ["Unity", "C#", "Built-In"],
    itchEmbed: `<iframe  src="https://itch.io/embed-upload/10905478?color=e4a672" allowfullscreen="" width="1290" height="740"><a href="https://fermarlin.itch.io/come-queso-raton">Play ¡Come Queso, Ratón! on itch.io</a></iframe>`,
  },
  "Chongow, Defender of the Old West": {
    title: "Chongow, Defender of the Old West",
    summary: "Chongow está ambientado en el corazón del Viejo Oeste, donde juegas como un sheriff que defiende tu ciudad.",
    roles: ["Video Game Programmer", "Game Designer", "Scripting"],
    tech: ["Unity", "C#", "Built-In"],
    itchEmbed: `<iframe  src="https://itch.io/embed-upload/9134545?color=001e46" allowfullscreen="" width="960" height="740"><a href="https://fermarlin.itch.io/chongow">Play Chongow, Defender of the Old West on itch.io</a></iframe>`,
  },
  "AR virtual briefing": {
    title: "AR virtual briefing",
    summary: "Una aplicación en realidad aumentada nos permite representar con precisión cómo sería una operación militar.",
    roles: ["AR Dev", "Scripting"],
    tech: ["Unity", "Vuforia", "C#"],
    youtubeId: "https://www.youtube.com/watch?v=H5EWiWagMLI&ab_channel=Fermarlin",
  },
  "Mantenimiento en VR: Cambio del resorte de retroceso de un AK-47": {
    title: "Mantenimiento en VR",
    summary: "Cambio del resorte de retroceso de un AK-47",
    roles: ["XR Dev", "Scripting"],
    tech: ["Unity", "OVR", "Shaders básicos"],
    youtubeId: "https://youtu.be/aHTAtc80mFk",
  },
};

export default function Projects() {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const [search] = useSearchParams();
  const battleRef = useRef<BattleTransitionHandle>(null);

  // Navegación con transición (sin tocar App.tsx)
  const go = (to: string, maxDelay = 900) => {
    let done = false;
    const t = window.setTimeout(() => { if (!done) { done = true; navigate(to); } }, maxDelay);
    if (battleRef.current?.play) {
      battleRef.current.play(() => {
        if (!done) { done = true; window.clearTimeout(t); navigate(to); }
      });
    } else {
      done = true; window.clearTimeout(t); navigate(to);
    }
  };

  // Abrir y cerrar detalle usando query param ?slug=...
  const openDetail = (slug: string) => {
    const params = new URLSearchParams(search);
    params.set("slug", slug);
    // no cambiamos ruta, seguimos en /projects
    go(`${pathname}?${params.toString()}`);
  };
  const closeDetail = () => {
    const params = new URLSearchParams(search);
    params.delete("slug");
    go(params.toString() ? `${pathname}?${params.toString()}` : pathname);
  };

  const slug = search.get("slug") || "";
  const data = useMemo(() => (slug ? PROJECTS[slug] : undefined), [slug]);

  // ===== Vista DETALLE (cuando hay ?slug=...) =====
  if (data) {
    const { title, summary, roles, tech, youtubeId, itchEmbed, links } = data;
    return (
      <>
        <div className="max-w-5xl mx-auto px-6 py-16 space-y-8">
          <div className="flex items-start justify-between gap-4">
            <h1 className="text-3xl font-extrabold tracking-tight">{title}</h1>
            <button
              onClick={closeDetail}
              className="px-3 py-1 rounded-lg border border-black/10 dark:border-white/10 cursor-pointer"
            >
              ← Volver
            </button>
          </div>
        {/* YouTube: acepta URL completa o ID */}
        {youtubeId && (
        <div className="rounded-xl overflow-hidden border border-black/10 dark:border-white/10 aspect-video">
            <iframe
            className="w-full h-full"
            src={getYouTubeEmbedSrc(youtubeId)}
            title="YouTube video"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
            />
        </div>
        )}

        {/* itch.io: tamaño original del embed, centrado a nivel de página (full-bleed) */}
        {itchEmbed && (() => {
          const { width, height, src } = parseItchSize(itchEmbed);
          return (
            // “rompe” el contenedor de texto y ocupa todo el ancho del viewport
            <div className="mx-[calc(50%-50vw)] w-screen">
              {/* centrado real + scroll horizontal seguro en pantallas pequeñas */}
              <div className="flex justify-center overflow-x-auto">
                <div
                  className="rounded-xl overflow-hidden border border-black/10 dark:border-white/10"
                  style={{ width: `${width}px`, height: `${height}px` }}
                >
                  <iframe
                    title={title}
                    src={src}
                    width={width}
                    height={height}
                    
                    allowFullScreen
                    className="block"
                  />
                </div>
              </div>
            </div>
          );
        })()}



          <p className="opacity-90">{summary}</p>

          <section className="grid sm:grid-cols-2 gap-6">
            <div className="rounded-xl p-5 border border-black/10 dark:border-white/10 bg-white/70 dark:bg-neutral-900/70">
              <h2 className="font-semibold mb-3">Rol</h2>
              <ul className="flex flex-wrap gap-2">
                {roles.map(r => (
                  <li key={r} className="px-2.5 py-1 rounded-lg text-xs border border-black/10 dark:border-white/10 bg-black/5 dark:bg-white/10">
                    {r}
                  </li>
                ))}
              </ul>
            </div>

            <div className="rounded-xl p-5 border border-black/10 dark:border-white/10 bg-white/70 dark:bg-neutral-900/70">
              <h2 className="font-semibold mb-3">Tecnologías</h2>
              <ul className="flex flex-wrap gap-2">
                {tech.map(t => (
                  <li key={t} className="px-2.5 py-1 rounded-lg text-xs border border-black/10 dark:border-white/10 bg-black/5 dark:bg-white/10">
                    {t}
                  </li>
                ))}
              </ul>
            </div>
          </section>

          {links && links.length > 0 && (
            <section className="rounded-xl p-5 border border-black/10 dark:border-white/10 bg-white/70 dark:bg-neutral-900/70">
              <h2 className="font-semibold mb-3">Enlaces</h2>
              <ul className="list-disc pl-5 space-y-1 text-sm">
                {links.map((l, i) => (
                  <li key={i}>
                    <a href={l.url} target="_blank" rel="noreferrer" className="text-emerald-600 dark:text-emerald-400 hover:underline">
                      {l.label}
                    </a>
                  </li>
                ))}
              </ul>
            </section>
          )}
        </div>

        {/* transición local */}
        <BattleTransition ref={battleRef} modes={["bars", "iris", "checker"]} />
      </>
    );
  }

  // ===== Vista LISTA (sin ?slug) =====
  const videogames = [
    { slug: "Kami y la cartulina perdida", title: "Kami y la cartulina perdida", desc: "Su último proyecto. Y una cartulina que nadie recordó comprar...", thumb: "/img/projects/kami-thumb.jpg",},
    { slug: "Sonic Adventure: Custom Stages Demo", title: "Sonic Adventure: Custom Stages Demo", desc: "Demo de fisicas de Sonic Adventure en Unity", thumb: "/img/projects/sonic-thumb.jpg", },
    { slug: "Brews of forever tavern", title: "Brews of forever tavern", desc: "Brews of Forever Tavern está ambientado en un mundo de fantasía...", thumb: "/img/projects/brews-thumb.jpg",},
    { slug: "Ristar: Reimagined in Unity", title: "Ristar: Reimagined in Unity", desc: "Revive el clásico Ristar en Unity: gráficos mejorados, jugabilidad y el primer nivel...", thumb: "/img/projects/ristar-thumb.jpg",},
    { slug: "¡Come Queso Ratón!", title: "¡Come Queso Ratón!", desc: "¡Come Queso Ratón!. En él, dos ratones intentan almacenar comida mientras evaden a un feroz gato.", thumb: "/img/projects/raton-thumb.jpg",},
    { slug: "Chongow, Defender of the Old West", title: "Chongow, Defender of the Old West", desc: "Chongow está ambientado en el corazón del Viejo Oeste, donde juegas como un sheriff que defiende tu ciudad.", thumb: "/img/projects/chongow-thumb.jpg",},

  ];
  const serious = [
    { slug: "AR virtual briefing", title: "AR virtual briefing", desc: "Una aplicación en realidad aumentada nos permite representar con precisión...", thumb: "/img/projects/arbriefing-thumb.jpg", },
    { slug: "Mantenimiento en VR: Cambio del resorte de retroceso de un AK-47", title: "Mantenimiento en VR", desc: "Cambio del resorte de retroceso de un AK-47",thumb: "/img/projects/AK-thumb.jpg", },
  ];

  const Card = ({ item }: { item: { slug: string; title: string; desc: string; thumb?: string } }) => (
    <div
      onClick={() => openDetail(item.slug)}
      className="cursor-pointer flex items-center gap-4 p-5 rounded-2xl border border-black/10 dark:border-white/10 bg-white/80 dark:bg-neutral-900/80 hover:shadow-lg transition"
    >
      {item.thumb && (
        <div className="w-28 h-20 flex-shrink-0 overflow-hidden rounded-lg bg-black/5 dark:bg-white/5">
          <img
            src={item.thumb}
            alt={item.title}
            className="w-full h-full object-cover"
            loading="lazy"
          />
        </div>
      )}
      <div>
        <h3 className="font-semibold text-lg">{item.title}</h3>
        <p className="opacity-80 text-sm">{item.desc}</p>
      </div>
    </div>
  );


  return (
    <>
      <div className="max-w-5xl mx-auto px-6 py-16 space-y-10">
        <h1 className="text-3xl font-extrabold tracking-tight mb-2">Proyectos</h1>

        {/* Serious Games */}
        <section>
          <h2 className="text-2xl font-bold mb-4">Serious Games</h2>
          <div className="grid sm:grid-cols-2 gap-6">
            {serious.map(s => <Card key={s.slug} item={s} />)}
          </div>
        </section>
        
        {/* Videojuegos */}
        <section>
          <h2 className="text-2xl font-bold mb-4">Videojuegos</h2>
          <div className="grid sm:grid-cols-2 gap-6">
            {videogames.map(v => <Card key={v.slug} item={v} />)}
          </div>
        </section>


      </div>

      {/* transición local */}
      <BattleTransition ref={battleRef} modes={["bars", "iris", "checker"]} />
    </>
  );
}
