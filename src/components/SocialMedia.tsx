'use client'

import { useEffect } from 'react'

const IG_REELS = [
  'https://www.instagram.com/reel/DWKREqyEfF3/',
  'https://www.instagram.com/reel/DWLPeq4jGrN/',
]

const TIKTOK_VIDEOS = [
  { id: '7620189048388193557' },
  { id: '7619917081307286805' },
]

function InstagramEmbed({ url }: { url: string }) {
  useEffect(() => {
    if (typeof window !== 'undefined') {
      if (!(window as any).instgrm) {
        const script = document.createElement('script')
        script.src = 'https://www.instagram.com/embed.js'
        script.async = true
        document.body.appendChild(script)
      } else {
        (window as any).instgrm.Embeds.process()
      }
    }
  }, [url])

  return (
    <blockquote
      className="instagram-media w-full max-w-full"
      data-instgrm-captioned
      data-instgrm-permalink={url}
      data-instgrm-version="14"
      style={{ minWidth: '260px', width: '100%' }}
    />
  )
}

function TikTokEmbed({ id }: { id: string }) {
  useEffect(() => {
    if (typeof window !== 'undefined' && !document.querySelector('script[src="https://www.tiktok.com/embed.js"]')) {
      const script = document.createElement('script')
      script.src = 'https://www.tiktok.com/embed.js'
      script.async = true
      document.body.appendChild(script)
    }
  }, [id])

  return (
    <blockquote
      className="tiktok-embed w-full"
      cite={`https://www.tiktok.com/@vibra.bolivia/video/${id}`}
      data-video-id={id}
      style={{ minWidth: '260px', width: '100%' }}
    >
      <section />
    </blockquote>
  )
}

export default function SocialMedia() {
  return (
    <section className="bg-black/95 py-20 px-4">
      <div className="max-w-5xl mx-auto">

        <h2 className="font-display text-4xl md:text-5xl text-center text-white mb-4 tracking-wider">
          Seguinos en Redes
        </h2>
        <p className="text-center text-white/50 mb-12 text-lg">
          El festival también pasa online
        </p>

        <div className="grid md:grid-cols-2 gap-12">

          {/* Instagram */}
          <div>
            <h3 className="font-display text-2xl text-white mb-6 text-center tracking-wide">
              Instagram
            </h3>
            <div className="space-y-4">
              {IG_REELS.map((url) => (
                <InstagramEmbed key={url} url={url} />
              ))}
            </div>
            <div className="text-center mt-6">
              <a
                href="https://www.instagram.com/vibra.bolivia"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block px-8 py-3 bg-vibra-pink text-white font-display text-xl tracking-wider rounded-full hover:opacity-90 transition"
              >
                Seguinos en Instagram
              </a>
            </div>
          </div>

          {/* TikTok */}
          <div>
            <h3 className="font-display text-2xl text-white mb-6 text-center tracking-wide">
              TikTok
            </h3>
            <div className="space-y-4">
              {TIKTOK_VIDEOS.map(({ id }) => (
                <TikTokEmbed key={id} id={id} />
              ))}
            </div>
            <div className="text-center mt-6">
              <a
                href="https://www.tiktok.com/@vibra.bolivia"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block px-8 py-3 bg-black border-2 border-white text-white font-display text-xl tracking-wider rounded-full hover:bg-white hover:text-black transition"
              >
                Seguinos en TikTok
              </a>
            </div>
          </div>

        </div>
      </div>
    </section>
  )
}
