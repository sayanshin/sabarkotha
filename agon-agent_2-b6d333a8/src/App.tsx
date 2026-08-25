import { useState } from 'react';
import Navbar from './components/Navbar';
import AuthModal from './components/AuthModal';
import AdminPanel, { type AdminTab } from './components/AdminPanel';
import VideoModal from './components/VideoModal';
import AlponaDivider from './components/AlponaDivider';
import Home from './sections/Home';
import Updates from './sections/Updates';
import Live from './sections/Live';
import Paper from './sections/Paper';
import Story from './sections/Story';
import About from './sections/About';
import { AuthProvider } from './context/AuthContext';
import { AdminProvider } from './context/AdminContext';
import { DataProvider } from './context/DataContext';
import type { Playable } from './lib/api';
import { handleGoogleRedirect } from './lib/googleAuth';
import { Phone, AtSign, MapPinned } from 'lucide-react';

// Handles the Google OAuth redirect fallback once on app startup.
void handleGoogleRedirect();

function App() {
  const [authOpen, setAuthOpen] = useState(false);
  const [adminOpen, setAdminOpen] = useState(false);
  const [adminTab, setAdminTab] = useState<AdminTab>('updates');
  const [playing, setPlaying] = useState<Playable | null>(null);

  const openAdmin = (tab: AdminTab) => {
    setAdminTab(tab);
    setAdminOpen(true);
  };

  return (
    <AuthProvider>
      <AdminProvider>
        <DataProvider>
          <div className="min-h-screen flex flex-col justify-between">
            <Navbar onAuth={() => setAuthOpen(true)} onAdmin={() => openAdmin('updates')} />

            <main className="flex-grow">
              <Home onJoin={() => setAuthOpen(true)} />
              <AlponaDivider from="rgba(246,238,218,0)" to="rgba(246,238,218,0)" />
              <Updates onPlay={setPlaying} onManage={() => openAdmin('updates')} />
              <AlponaDivider from="rgba(246,238,218,0)" to="rgba(143,29,22,1)" />
              <Live onManage={() => openAdmin('live')} />
              <AlponaDivider from="rgba(143,29,22,0.85)" to="rgba(246,238,218,1)" />
              <Paper />
              <AlponaDivider from="rgba(246,238,218,0)" to="rgba(27,18,11,1)" />
              <Story onPlay={setPlaying} />
              <AlponaDivider from="rgba(27,18,11,0.95)" to="rgba(246,238,218,1)" />
              <About />
            </main>

            {/* Contact Footer Section */}
            <footer className="bg-[#1b120b] text-[#f6eeda] py-10 px-6 border-t border-[#8f1d16]/30">
              <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
                <div className="flex flex-col gap-3">
                  <h3 className="text-xl font-bold text-[#f6eeda] border-b border-[#8f1d16] pb-2 w-fit">
                    যোগাযোগ
                  </h3>
                  <div className="flex flex-col gap-2.5 text-sm text-[#f6eeda]/80">
                    <div className="flex items-center gap-3">
                      <MapPinned className="w-4 h-4 text-[#8f1d16] shrink-0" />
                      <span>Kolkata, West Bengal</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Phone className="w-4 h-4 text-[#8f1d16] shrink-0" />
                      <a href="tel:9474148703" className="hover:text-amber-400 transition-colors">
                        +91 9474148703
                      </a>
                    </div>
                    <div className="flex items-center gap-3">
                      <AtSign className="w-4 h-4 text-[#8f1d16] shrink-0" />
                      <a href="mailto:rajib1975.chatterjee@gmail.com" className="hover:text-amber-400 transition-colors">
                        rajib1975.chatterjee@gmail.com
                      </a>
                    </div>
                  </div>
                </div>

                <div className="text-xs text-[#f6eeda]/50 self-center md:self-end">
                  © 2026 Sabar Kotha. All rights reserved.
                </div>
              </div>
            </footer>

            <AuthModal
              open={authOpen}
              onClose={() => setAuthOpen(false)}
              onAdminSuccess={() => openAdmin('updates')}
            />
            <AdminPanel
              open={adminOpen}
              tab={adminTab}
              onClose={() => setAdminOpen(false)}
              onTabChange={(t) => {
                setAdminTab(t);
                setAdminOpen(true);
              }}
            />
            <VideoModal video={playing} onClose={() => setPlaying(null)} />
          </div>
        </DataProvider>
      </AdminProvider>
    </AuthProvider>
  );
}

export default App;
