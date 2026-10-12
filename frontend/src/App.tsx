import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Layout } from '@/components/layout/Layout';
import { Landing } from '@/pages/Landing';

function Shell() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<div className="min-h-[100dvh] flex items-center justify-center">Login page coming soon</div>} />
        <Route path="/signup" element={<div className="min-h-[100dvh] flex items-center justify-center">Signup page coming soon</div>} />
        <Route path="/docs" element={<div className="min-h-[100dvh] flex items-center justify-center">Docs page coming soon</div>} />
        <Route path="/changelog" element={<div className="min-h-[100dvh] flex items-center justify-center">Changelog page coming soon</div>} />
        <Route path="/about" element={<div className="min-h-[100dvh] flex items-center justify-center">About page coming soon</div>} />
        <Route path="/blog" element={<div className="min-h-[100dvh] flex items-center justify-center">Blog page coming soon</div>} />
        <Route path="/careers" element={<div className="min-h-[100dvh] flex items-center justify-center">Careers page coming soon</div>} />
        <Route path="/press" element={<div className="min-h-[100dvh] flex items-center justify-center">Press page coming soon</div>} />
        <Route path="/contact" element={<div className="min-h-[100dvh] flex items-center justify-center">Contact page coming soon</div>} />
        <Route path="/community" element={<div className="min-h-[100dvh] flex items-center justify-center">Community page coming soon</div>} />
        <Route path="/help" element={<div className="min-h-[100dvh] flex items-center justify-center">Help page coming soon</div>} />
        <Route path="/api-docs" element={<div className="min-h-[100dvh] flex items-center justify-center">API Docs page coming soon</div>} />
        <Route path="/status" element={<div className="min-h-[100dvh] flex items-center justify-center">Status page coming soon</div>} />
        <Route path="/security" element={<div className="min-h-[100dvh] flex items-center justify-center">Security page coming soon</div>} />
        <Route path="/privacy" element={<div className="min-h-[100dvh] flex items-center justify-center">Privacy page coming soon</div>} />
        <Route path="/terms" element={<div className="min-h-[100dvh] flex items-center justify-center">Terms page coming soon</div>} />
        <Route path="/cookies" element={<div className="min-h-[100dvh] flex items-center justify-center">Cookies page coming soon</div>} />
      </Routes>
    </Layout>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Shell />
    </BrowserRouter>
  );
}