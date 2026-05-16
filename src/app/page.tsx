import Hero from '@/components/Hero'
import Stats from '@/components/Stats'
import Aftermovie from '@/components/Aftermovie'
import Timeline from '@/components/Timeline'
import SpotifyPlayer from '@/components/SpotifyPlayer'
import EmailRegister from '@/components/EmailRegister'
import SectionDivider from '@/components/SectionDivider'

export default function Home() {
  return (
    <main>
      <Hero />
      <SectionDivider />
      <Stats />
      <SectionDivider />
      <Aftermovie />
      <SectionDivider />
      <Timeline />
      <SectionDivider />
      <SpotifyPlayer />
      <SectionDivider />
      <EmailRegister />
    </main>
  )
}
