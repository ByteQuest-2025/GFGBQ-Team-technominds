import React, { useState, useCallback } from 'react';
import { Header } from '@/components/Header';
import { MonitorView } from '@/components/MonitorView';
import { CallHistory } from '@/components/CallHistory';
import { HelpSection } from '@/components/HelpSection';
import type { CallRecord } from '@/types';
import { Toaster } from '@/components/ui/toaster';
import { useLanguage } from '@/contexts/LanguageContext';

const Index: React.FC = () => {
  const { t } = useLanguage();
  const [currentView, setCurrentView] = useState<'monitor' | 'history' | 'help'>('monitor');
  const [callHistory, setCallHistory] = useState<CallRecord[]>([]);

  const handleCallComplete = useCallback((call: CallRecord) => {
    setCallHistory((prev) => [call, ...prev].slice(0, 50));
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <Header currentView={currentView} onViewChange={setCurrentView} />
      
      <main className="container max-w-4xl px-4 py-8">
        {currentView === 'monitor' && (
          <MonitorView onCallComplete={handleCallComplete} />
        )}
        
        {currentView === 'history' && (
          <CallHistory calls={callHistory} />
        )}
        
        {currentView === 'help' && (
          <HelpSection />
        )}
      </main>

      {/* Footer */}
      <footer className="border-t-2 border-border bg-card py-6 mt-8">
        <div className="container max-w-4xl px-4 text-center">
          <p className="text-muted-foreground">
            🛡️ {t('footer.tagline')}
          </p>
          <p className="mt-2 text-sm text-muted-foreground">
            {t('footer.privacy')}
          </p>
        </div>
      </footer>

      <Toaster />
    </div>
  );
};

export default Index;
