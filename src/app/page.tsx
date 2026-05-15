import Hero from '@/components/Hero'
import Stats from '@/components/Stats'
import Aftermovie from '@/components/Aftermovie'
import Timeline from '@/components/Timeline'
import SpotifyPlayer from '@/components/SpotifyPlayer'
import EmailRegister from '@/components/EmailRegister'

export default function Home() {
  return (
    <main>
      <Hero />
      <Stats />
      <Aftermovie />
      <Timeline />
      <SpotifyPlayer />
      <EmailRegister />
    </main>
  )
}
