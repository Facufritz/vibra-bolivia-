import Hero from '@/components/Hero'
import Stats from '@/components/Stats'
import Aftermovie from '@/components/Aftermovie'
import Timeline from '@/components/Timeline'
import SpotifyPlayer from '@/components/SpotifyPlayer'
import MembersSection from '@/components/MembersSection'
import EmailRegister from '@/components/EmailRegister'
import Navbar from '@/components/Navbar'

export default function Home() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <Stats />
        <Aftermovie />
        <Timeline />
        <SpotifyPlayer />
        <MembersSection />
        <EmailRegister />
      </main>
    </>
  )
}
