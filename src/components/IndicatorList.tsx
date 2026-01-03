import React from 'react';
import { cn } from '@/lib/utils';
import type { ScamIndicator } from '@/types';
import { User, Clock, Heart, Gavel, Key, Banknote, AudioWaveform, Check, AlertTriangle } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

interface IndicatorListProps {
  indicators: ScamIndicator[];
}

const iconMap = {
  impersonation: User,
  urgency: Clock,
  emotional: Heart,
  authority: Gavel,
  otp_request: Key,
  money_request: Banknote,
  voice_pattern: AudioWaveform,
};

const severityColors = {
  low: 'bg-success/10 border-success/30 text-success',
  medium: 'bg-warning/10 border-warning/30 text-warning',
  high: 'bg-danger/10 border-danger/30 text-danger',
};

export const IndicatorList: React.FC<IndicatorListProps> = ({ indicators }) => {
  const { t } = useLanguage();
  const detectedIndicators = indicators.filter((i) => i.detected);
  const safeIndicators = indicators.filter((i) => !i.detected);

  const getLabel = (type: string, fallback: string) => {
    const key = `indicator.${type}`;
    const translated = t(key);
    return translated !== key ? translated : fallback;
  };

  return (
    <div className="space-y-4">
      {detectedIndicators.length > 0 && (
        <div className="space-y-2">
          <h4 className="flex items-center gap-2 font-semibold text-danger">
            <AlertTriangle className="h-5 w-5" />
            Detected ({detectedIndicators.length})
          </h4>
          <div className="grid gap-2 sm:grid-cols-2">
            {detectedIndicators.map((indicator) => {
              const Icon = iconMap[indicator.type];
              return (
                <div key={indicator.id} className={cn('flex items-start gap-3 rounded-lg border-2 p-4', severityColors[indicator.severity])}>
                  <Icon className="mt-0.5 h-6 w-6 flex-shrink-0" />
                  <div className="min-w-0 flex-1">
                    <p className="font-semibold">{getLabel(indicator.type, indicator.label)}</p>
                    <div className="mt-2 flex items-center gap-2">
                      <div className="h-2 flex-1 overflow-hidden rounded-full bg-card">
                        <div className={cn('h-full rounded-full', indicator.severity === 'high' && 'bg-danger', indicator.severity === 'medium' && 'bg-warning')} style={{ width: `${indicator.confidence * 100}%` }} />
                      </div>
                      <span className="text-xs font-medium">{Math.round(indicator.confidence * 100)}%</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {safeIndicators.length > 0 && (
        <div className="space-y-2">
          <h4 className="flex items-center gap-2 font-semibold text-success">
            <Check className="h-5 w-5" />
            Not Detected ({safeIndicators.length})
          </h4>
          <div className="flex flex-wrap gap-2">
            {safeIndicators.map((indicator) => {
              const Icon = iconMap[indicator.type];
              return (
                <div key={indicator.id} className="flex items-center gap-2 rounded-lg bg-muted px-4 py-2 text-muted-foreground">
                  <Icon className="h-4 w-4" />
                  <span className="text-sm font-medium">{getLabel(indicator.type, indicator.label)}</span>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
