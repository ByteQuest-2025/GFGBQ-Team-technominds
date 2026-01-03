import React from 'react';
import { 
  Phone, 
  ShieldAlert, 
  Key, 
  Banknote, 
  Clock, 
  User, 
  AlertTriangle,
  CheckCircle,
  XCircle,
  Heart
} from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

export const HelpSection: React.FC = () => {
  const { t } = useLanguage();

  const tips = [
    {
      icon: Key,
      titleKey: 'tip.neverShareOtp',
      descKey: 'tip.neverShareOtp.desc',
      color: 'text-danger',
      bgColor: 'bg-danger/10',
    },
    {
      icon: Banknote,
      titleKey: 'tip.moneyRequest',
      descKey: 'tip.moneyRequest.desc',
      color: 'text-danger',
      bgColor: 'bg-danger/10',
    },
    {
      icon: Clock,
      titleKey: 'tip.ignoreUrgency',
      descKey: 'tip.ignoreUrgency.desc',
      color: 'text-warning',
      bgColor: 'bg-warning/10',
    },
    {
      icon: User,
      titleKey: 'tip.verifyIdentity',
      descKey: 'tip.verifyIdentity.desc',
      color: 'text-warning',
      bgColor: 'bg-warning/10',
    },
    {
      icon: ShieldAlert,
      titleKey: 'tip.trustInstincts',
      descKey: 'tip.trustInstincts.desc',
      color: 'text-primary',
      bgColor: 'bg-primary/10',
    },
    {
      icon: Heart,
      titleKey: 'tip.talkToFamily',
      descKey: 'tip.talkToFamily.desc',
      color: 'text-success',
      bgColor: 'bg-success/10',
    },
  ];

  const emergencyContacts = [
    { name: 'National Cyber Crime Helpline', number: '1930' },
    { name: 'Police Emergency', number: '100' },
    { name: 'Women Helpline', number: '1091' },
  ];

  return (
    <div className="space-y-8">
      {/* Safety Tips */}
      <section>
        <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
          <AlertTriangle className="h-8 w-8 text-warning" />
          {t('help.safetyTips')}
        </h2>
        
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {tips.map((tip, index) => {
            const Icon = tip.icon;
            return (
              <div
                key={index}
                className={`rounded-2xl border-2 border-border p-6 ${tip.bgColor} animate-fade-in`}
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <Icon className={`h-10 w-10 ${tip.color} mb-4`} />
                <h3 className="text-lg font-bold mb-2">{t(tip.titleKey)}</h3>
                <p className="text-muted-foreground">{t(tip.descKey)}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* Common Scam Types */}
      <section className="rounded-2xl border-2 border-border bg-card p-6">
        <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
          <XCircle className="h-8 w-8 text-danger" />
          {t('help.scamTypes')}
        </h2>
        
        <div className="space-y-4">
          <div className="rounded-lg bg-danger/5 p-4 border-l-4 border-danger">
            <h3 className="font-bold text-danger">{t('scam.bankOfficer')}</h3>
            <p className="text-muted-foreground mt-1">{t('scam.bankOfficer.desc')}</p>
          </div>
          
          <div className="rounded-lg bg-danger/5 p-4 border-l-4 border-danger">
            <h3 className="font-bold text-danger">{t('scam.government')}</h3>
            <p className="text-muted-foreground mt-1">{t('scam.government.desc')}</p>
          </div>
          
          <div className="rounded-lg bg-warning/5 p-4 border-l-4 border-warning">
            <h3 className="font-bold text-warning">{t('scam.lottery')}</h3>
            <p className="text-muted-foreground mt-1">{t('scam.lottery.desc')}</p>
          </div>
          
          <div className="rounded-lg bg-warning/5 p-4 border-l-4 border-warning">
            <h3 className="font-bold text-techSupport">{t('scam.techSupport')}</h3>
            <p className="text-muted-foreground mt-1">{t('scam.techSupport.desc')}</p>
          </div>
        </div>
      </section>

      {/* Emergency Contacts */}
      <section className="rounded-2xl border-2 border-primary bg-primary/5 p-6">
        <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
          <Phone className="h-8 w-8 text-primary" />
          {t('help.emergency')}
        </h2>
        
        <div className="grid gap-4 sm:grid-cols-3">
          {emergencyContacts.map((contact, index) => (
            <a
              key={index}
              href={`tel:${contact.number}`}
              className="flex flex-col items-center rounded-xl bg-card border-2 border-border p-6 transition-all hover:shadow-lg hover:border-primary"
            >
              <span className="text-3xl font-bold text-primary">{contact.number}</span>
              <span className="mt-2 text-center text-muted-foreground">{contact.name}</span>
            </a>
          ))}
        </div>
      </section>

      {/* How This App Works */}
      <section className="rounded-2xl border-2 border-border bg-card p-6">
        <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
          <CheckCircle className="h-8 w-8 text-success" />
          {t('help.howItWorks')}
        </h2>
        
        <div className="space-y-4 text-lg">
          <p className="flex items-start gap-3">
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground font-bold flex-shrink-0">1</span>
            <span>{t('howItWorks.step1')}</span>
          </p>
          <p className="flex items-start gap-3">
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground font-bold flex-shrink-0">2</span>
            <span>{t('howItWorks.step2')}</span>
          </p>
          <p className="flex items-start gap-3">
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground font-bold flex-shrink-0">3</span>
            <span>{t('howItWorks.step3')}</span>
          </p>
          <p className="flex items-start gap-3">
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground font-bold flex-shrink-0">4</span>
            <span>{t('howItWorks.step4')}</span>
          </p>
        </div>
      </section>
    </div>
  );
};
