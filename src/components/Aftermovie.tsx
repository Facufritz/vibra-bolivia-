export default function Aftermovie() {
  return (
    <section className="bg-black py-20 px-4">
      <div className="max-w-4xl mx-auto">

        <h2 className="font-display text-4xl md:text-5xl text-center text-white mb-4 tracking-wider">
          Reviví la 2da Edición
        </h2>
        <p className="text-center text-white/60 mb-10 text-lg">
          Vibra Bolivia 2026 — Aftermovie Oficial
        </p>

        <div className="rounded-2xl overflow-hidden border-2 border-vibra-orange/60 shadow-[0_0_40px_rgba(245,160,32,0.25)]">
          <div className="relative aspect-video w-full">
            <iframe
              src="https://www.youtube.com/embed/FHAXjtf_iOA?rel=0&modestbranding=1"
              title="Vibra Bolivia 2026 Aftermovie"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="absolute inset-0 w-full h-full"
            />
          </div>
        </div>

      </div>
    </section>
  )
}
