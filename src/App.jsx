import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom'
import Header from './components/Header'
import LivePreviewBridge from './components/LivePreviewBridge'
import Home from './pages/Home'
import Projects from './pages/Projects'
import ProjectDetail from './pages/ProjectDetail'
import Cases from './pages/Cases'
import ClientProposal from './pages/ClientProposal'
import Preview from './pages/Preview'

function AppShell() {
  const location = useLocation()
  const hideHeader =
    location.pathname.startsWith('/proposta/') || location.pathname.startsWith('/preview')

  return (
    <>
      {!hideHeader && <Header />}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/projetos" element={<Projects />} />
        <Route path="/projetos/:slug" element={<ProjectDetail />} />
        <Route path="/cases" element={<Cases />} />
        <Route path="/preview" element={<Preview />} />
        <Route path="/proposta/:token" element={<ClientProposal />} />
      </Routes>
      <LivePreviewBridge />
    </>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <AppShell />
    </BrowserRouter>
  )
}
