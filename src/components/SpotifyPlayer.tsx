export default function SpotifyPlayer() {
  return (
    <section className="vibra-texture py-20 px-4">
      <div className="max-w-4xl mx-auto">

        <h2 className="font-display text-4xl md:text-5xl text-center text-white mb-4 tracking-wider">
          La Música del Festival
        </h2>
        <p className="text-center text-white/70 mb-10 text-lg">
          Escuchá la playlist oficial de Vibra Bolivia
        </p>

        <div className="rounded-2xl overflow-hidden border-2 border-vibra-blue/50 shadow-[0_0_40px_rgba(79,195,247,0.2)]">
          <iframe
            src="https://open.spotify.com/embed/playlist/5HIpNO8FbzDDGhHdyRLvib?utm_source=generator&theme=0"
            width="100%"
            height="380"
            allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
            loading="lazy"
            className="block"
            title="Playlist oficial Vibra Bolivia"
          />
        </div>

      </div>
    </section>
  )
}
