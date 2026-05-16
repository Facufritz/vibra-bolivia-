import SectionWrapper from '@/components/SectionWrapper'
import SectionPill from '@/components/SectionPill'
import Sparkles from '@/components/Sparkles'

export default function Aftermovie() {
  return (
    <SectionWrapper clouds mountainsBottom parallax>
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-10">
          <SectionPill>★ AFTERMOVIE OFICIAL ★</SectionPill>
          <div className="relative inline-block">
            <Sparkles />
            <h2 className="font-display text-4xl md:text-5xl text-white tracking-wider section-title">
              Reviví la 2da Edición
            </h2>
          </div>
          <p className="font-display text-sm md:text-base text-white/70 tracking-[0.3em] mt-6">
            ★ ★ ★ AFTERMOVIE OFICIAL ★ ★ ★
          </p>
        </div>
        <div className="rounded-2xl overflow-hidden border-2 border-vibra-orange/80 shadow-[0_0_50px_rgba(245,160,32,0.3)]">
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
    </SectionWrapper>
  )
}
