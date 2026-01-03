import React from 'react';
import { Shield, Phone, History, HelpCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { LanguageSelector } from './LanguageSelector';
import { useLanguage } from '@/contexts/LanguageContext';

interface HeaderProps {
  currentView: 'monitor' | 'history' | 'help';
  onViewChange: (view: 'monitor' | 'history' | 'help') => void;
}

export const Header: React.FC<HeaderProps> = ({ currentView, onViewChange }) => {
  const { t } = useLanguage();

  return (
    <header className="sticky top-0 z-50 w-full border-b-2 border-border bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/80">
      <div className="container flex h-20 items-center justify-between px-4">
        {/* Logo */}
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary text-primary-foreground">
            <Shield className="h-7 w-7" />
          </div>
          <div>
            <h1 className="text-xl font-bold">{t('app.name')}</h1>
            <p className="text-xs text-muted-foreground">{t('app.tagline')}</p>
          </div>
        </div>

        {/* Navigation and Language */}
        <div className="flex items-center gap-4">
          <nav className="flex items-center gap-2">
            <Button
              variant={currentView === 'monitor' ? 'default' : 'ghost'}
              size="lg"
              onClick={() => onViewChange('monitor')}
              className="gap-2"
            >
              <Phone className="h-5 w-5" />
              <span className="hidden sm:inline">{t('nav.monitor')}</span>
            </Button>
            <Button
              variant={currentView === 'history' ? 'default' : 'ghost'}
              size="lg"
              onClick={() => onViewChange('history')}
              className="gap-2"
            >
              <History className="h-5 w-5" />
              <span className="hidden sm:inline">{t('nav.history')}</span>
            </Button>
            <Button
              variant={currentView === 'help' ? 'default' : 'ghost'}
              size="lg"
              onClick={() => onViewChange('help')}
              className="gap-2"
            >
              <HelpCircle className="h-5 w-5" />
              <span className="hidden sm:inline">{t('nav.help')}</span>
            </Button>
          </nav>
          
          <div className="hidden md:block">
            <LanguageSelector />
          </div>
        </div>
      </div>
      
      {/* Mobile language selector */}
      <div className="md:hidden border-t border-border px-4 py-2">
        <LanguageSelector />
      </div>
    </header>
  );
};
