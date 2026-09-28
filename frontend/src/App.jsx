import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import Hero from './sections/Hero';
import StudioStatement from './sections/StudioStatement';
import StorytellingSection from './sections/StorytellingSection';
import ArchitectureInterior from './sections/ArchitectureInterior';
import ServicesSection from './sections/ServicesSection';
import Process from './sections/Process';
import Testimonials from './sections/Testimonials';
import FinalCTA from './sections/FinalCTA';
import ProjectsSection from './sections/ProjectsSection';
import CursorDot from './components/CursorDot';
import { CursorProvider } from './components/CursorContext';
import Projects from './components/Projects'; 
import Studio from './components/Studio';
import Services from './components/Services';
import Contact from './components/Contact';

// Pages admin
import AdminLogin from './pages/AdminLogin';
import AdminDashboard from './pages/AdminDashboard';
import DevisList from './pages/admin/devis/DevisList';
import DevisNew from './pages/admin/devis/DevisNew';
import DevisEditor from './pages/admin/devis/DevisEditor';
import DevisDetail from './pages/admin/devis/DevisDetail';

// Composant pour la page d'accueil (Landing Page)
function Home() {
  return (
    <>
      <Hero />  
      <StudioStatement />
      <ProjectsSection /> 
      <StorytellingSection />
      <ArchitectureInterior />
      <ServicesSection />
      <Process />
      <Testimonials />
      <FinalCTA />
    </>
  );
}

export default function App() {
  const location = useLocation();
  
  // Vérifie si on est sur une page admin pour masquer Navbar et Footer publics
  const isAdminRoute = location.pathname.startsWith('/admin');

  return (
    <CursorProvider>
      <main className="bg-ink min-h-screen text-paper">
        <CursorDot />
        
        {/* La Navbar s'affiche uniquement si on n'est PAS sur une route admin */}
        {!isAdminRoute && <Navbar />}
        
        {/* Gestion des routes */}
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/projects" element={<Projects />} />
          <Route path="/studio" element={<Studio />} />
          <Route path="/services" element={<Services />} />
          <Route path="/contact" element={<Contact />} />

          {/* Routes Administration (isolées sans Navbar/Footer publics) */}
          <Route path="/admin/login" element={<AdminLogin />} />

          {/* Dashboard : coque (sidebar) + sous-pages Devis */}
          <Route element={<AdminDashboard />}>
            <Route path="/admin/dashboard" element={<Navigate to="/admin/devis" replace />} />
            <Route path="/admin/devis" element={<DevisList />} />
            <Route path="/admin/devis/nouveau" element={<DevisNew />} />
            <Route path="/admin/devis/nouveau/:type" element={<DevisEditor />} />
            <Route path="/admin/devis/:id" element={<DevisDetail />} />
            <Route path="/admin/devis/:id/modifier" element={<DevisEditor />} />
          </Route>
        </Routes>

        {/* Le Footer s'affiche uniquement si on n'est PAS sur une route admin */}
        {!isAdminRoute && <Footer />}
      </main>
    </CursorProvider>
  );
}