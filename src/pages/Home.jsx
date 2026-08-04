import { useEffect, useState } from 'react'
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
import PageBlocks from '../components/PageBlocks'
import { cms } from '../lib/cms'

const DEFAULT_MODULES = [
  'trustBar',
  'video',
  'whoWeHelp',
  'selectedProjects',
  'services',
  'cases',
  'howItWorks',
  'proposal',
  'testimonials',
  'finalCta',
]

function Module({ name }) {
  switch (name) {
    case 'trustBar':
      return <TrustBar />
    case 'video':
      return <VideoSection />
    case 'whoWeHelp':
      return <WhoWeHelp />
    case 'selectedProjects':
      return <SelectedProjects />
    case 'services':
      return <Services />
    case 'cases':
      return <Cases />
    case 'howItWorks':
      return <HowItWorks />
    case 'proposal':
      return <ProposalBuilder />
    case 'testimonials':
      return <Testimonials />
    case 'finalCta':
      return <FinalCTA />
    default:
      return null
  }
}

function ContentIsland({ children }) {
  return (
    <section className="bg-white py-12 sm:py-16">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">{children}</div>
    </section>
  )
}

export default function Home() {
  const [blocks, setBlocks] = useState(null)

  useEffect(() => {
    let active = true
    cms.getHomePage().then((remote) => {
      if (!active) return
      setBlocks(remote?.blocks?.length ? remote.blocks : null)
    })
    return () => {
      active = false
    }
  }, [])

  const layout =
    blocks ||
    DEFAULT_MODULES.map((module) => ({
      blockType: 'module',
      module,
      id: module,
    }))

  const contentChunk = []
  const nodes = []

  const flushContent = () => {
    if (!contentChunk.length) return
    nodes.push(
      <ContentIsland key={`content-${nodes.length}`}>
        <PageBlocks blocks={[...contentChunk]} apiUrl={cms.apiUrl} />
      </ContentIsland>,
    )
    contentChunk.length = 0
  }

  layout.forEach((block, index) => {
    if (block.blockType === 'module') {
      flushContent()
      nodes.push(<Module key={block.id || `${block.module}-${index}`} name={block.module} />)
      return
    }
    contentChunk.push(block)
  })
  flushContent()

  return (
    <>
      <Hero />
      {nodes}
      <Footer />
      <StickyBar />
    </>
  )
}
