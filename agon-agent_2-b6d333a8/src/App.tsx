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
          <div className="min-h-screen">
            <Navbar onAuth={() => setAuthOpen(true)} onAdmin={() => openAdmin('updates')} />

            <main>
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
