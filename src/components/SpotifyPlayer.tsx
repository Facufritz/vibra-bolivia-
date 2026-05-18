import SectionWrapper from '@/components/SectionWrapper'
import SectionPill from '@/components/SectionPill'
import Sparkles from '@/components/Sparkles'

export default function SpotifyPlayer() {
  return (
    <SectionWrapper clouds grassBottom parallax>
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-10">
          <div className="flex flex-col md:flex-row items-center justify-center gap-4 md:gap-6">
            <div className="transform md:translate-y-[6px]">
              <SectionPill>★ PLAYLIST OFICIAL ★</SectionPill>
            </div>
            <div className="relative inline-block">
              <Sparkles />
              <h2 className="font-display text-4xl md:text-5xl text-white tracking-wider section-title">
                La Música del Festival
              </h2>
            </div>
          </div>
          <p className="text-white/70 text-lg mt-6">
            Escuchá la playlist oficial de Vibra Bolivia
          </p>
        </div>
        <div className="rounded-2xl overflow-hidden border-2 border-vibra-blue/70 shadow-[0_0_50px_rgba(79,195,247,0.25)]">
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
    </SectionWrapper>
  )
}
