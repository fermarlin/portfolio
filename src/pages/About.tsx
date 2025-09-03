import React from "react";

export default function About() {
  return (
    <div className="max-w-5xl mx-auto px-6 py-16 space-y-12">
      <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
        Sobre mí
      </h1>

        {/* Perfil */}
<section className="rounded-xl p-6 border border-black/10 dark:border-white/10 bg-white/80 dark:bg-neutral-900/80 backdrop-blur flex flex-col md:flex-row gap-6 items-start">
        {/* Texto */}
        <div className="flex-1 space-y-4">
            <h2 className="text-xl font-bold">Perfil</h2>
            <p className="opacity-90 leading-relaxed text-justify">
            Soy <strong>Fernando Martínez Lineros</strong>, de Sevilla/España y apasionado de los 
            <strong> videojuegos</strong>, en especial de los títulos retro, aquellos que marcaron mi infancia 
            y que aún hoy me inspiran a la hora de crear nuevas experiencias.  
            </p>
            <p className="opacity-90 leading-relaxed text-justify">
            Me defino como un <em>one man army</em> del desarrollo de videojuegos: sé modelar, 
            texturizar, riggear y animar etc, aunque mi foco principal está en el{" "}
            <strong>diseño de videojuegos</strong> y la <strong>programación</strong>, áreas en las que más disfruto 
            y aporto valor a los proyectos.
            </p>
            <p className="opacity-90 leading-relaxed text-justify">
            En mi tiempo libre continúo estudiando y explorando nuevas herramientas, lenguajes y 
            metodologías relacionadas con el desarrollo de videojuegos. Para mí, cada proyecto es 
            una oportunidad de aprender y llevar innovación técnica además de creatividad.
            </p>
                        <figure className="flex flex-col">
            <img
            src="/img/JuegoRana.gif"
            alt="Ejemplo de juego para la GBA desarrollado en C++"
            className="rounded-lg shadow-md border border-black/10 dark:border-white/10 object-cover"
            />
            <figcaption className="text-xs text-center mt-2 opacity-80">
            Juego para la GBA desarrollado en C++
            </figcaption>
        </figure>
        </div>

        {/* Galería de imágenes y video */}
        <div className="flex flex-col gap-6 md:w-1/3">
        <figure className="flex flex-col">
            <img
            src="/img/renderPKM.jpg"
            alt="Ejemplo de render"
            className="rounded-lg shadow-md border border-black/10 dark:border-white/10 object-cover"
            />
            <figcaption className="text-xs text-center mt-2 opacity-80">
            Render entrenador Pokémon
            </figcaption>
        </figure>

        <div>
            <div className="rounded-xl overflow-hidden border border-black/10 dark:border-white/10 aspect-video">
            <iframe
                className="w-full h-full"
                src="https://www.youtube.com/embed/ANVGPnuoUxk"
                title="Carro de combate 8x8 TES"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
            />
            </div>
            <p className="text-xs text-center mt-2 opacity-80">
            Mi trabajo como modelador en el carro de combate 8x8 TES
            </p>
        </div>

        <div>
            <div className="rounded-xl overflow-hidden border border-black/10 dark:border-white/10 aspect-video">
            <iframe
                className="w-full h-full"
                src="https://www.youtube.com/embed/AY4v49uaU4s"
                title="Modelo VOXEL de Sonic"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
            />
            </div>
            <p className="text-xs text-center mt-2 opacity-80">
            Modelo VOXEL de Sonic
            </p>
        </div>

        </div>
        
        </section>      
    </div>
  );
}
