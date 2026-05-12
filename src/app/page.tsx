import Hero from '@/components/Hero'
import Stats from '@/components/Stats'
import Timeline from '@/components/Timeline'
import Aftermovie from '@/components/Aftermovie'
import SpotifyPlayer from '@/components/SpotifyPlayer'

export default function Home() {
  return (
    <main>
      <Hero />
      <Stats />
      <Timeline />
      <Aftermovie />
      <SpotifyPlayer />
    </main>
  )
}
