import Hero from '../components/Hero'
import TrustBar from '../components/TrustBar'
import WhoWeHelp from '../components/WhoWeHelp'
import SelectedProjects from '../components/SelectedProjects'
import Services from '../components/Services'
import VideoSection from '../components/VideoSection'
import Cases from '../components/Cases'
import HowItWorks from '../components/HowItWorks'
import ProposalBuilder from '../components/ProposalBuilder'
import Testimonials from '../components/Testimonials'
import FinalCTA from '../components/FinalCTA'
import Footer from '../components/Footer'
import StickyBar from '../components/StickyBar'

export default function Home() {
  return (
    <>
      <Hero />
      <TrustBar />
      <VideoSection />
      <WhoWeHelp />
      <SelectedProjects />
      <Services />
      <Cases />
      <HowItWorks />
      <ProposalBuilder />
      <Testimonials />
      <FinalCTA />
      <Footer />
      <StickyBar />
    </>
  )
}
