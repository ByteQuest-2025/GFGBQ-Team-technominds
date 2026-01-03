import React from 'react';
import { cn } from '@/lib/utils';
import type { CallRecord } from '@/types';
import { Phone, Clock, AlertTriangle, Check, X } from 'lucide-react';
import { format } from 'date-fns';

interface CallHistoryProps {
  calls: CallRecord[];
}

const riskColors = {
  low: 'bg-success/10 text-success border-success/30',
  medium: 'bg-warning/10 text-warning border-warning/30',
  high: 'bg-danger/10 text-danger border-danger/30',
};

const riskIcons = {
  low: Check,
  medium: AlertTriangle,
  high: X,
};

export const CallHistory: React.FC<CallHistoryProps> = ({ calls }) => {
  if (calls.length === 0) {
    return (
      <div className="rounded-2xl border-2 border-dashed border-border p-8 text-center">
        <Phone className="mx-auto h-12 w-12 text-muted-foreground/50" />
        <h3 className="mt-4 text-lg font-semibold">No Call History</h3>
        <p className="mt-2 text-muted-foreground">
          Your monitored calls will appear here
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h3 className="text-xl font-bold flex items-center gap-2">
        <Clock className="h-6 w-6" />
        Recent Calls
      </h3>

      <div className="space-y-3">
        {calls.map((call) => {
          const RiskIcon = riskIcons[call.riskLevel];
          return (
            <div
              key={call.id}
              className={cn(
                'flex items-center gap-4 rounded-xl border-2 p-4 transition-all hover:shadow-md',
                riskColors[call.riskLevel]
              )}
            >
              <div
                className={cn(
                  'flex h-12 w-12 items-center justify-center rounded-full',
                  call.riskLevel === 'low' && 'bg-success/20',
                  call.riskLevel === 'medium' && 'bg-warning/20',
                  call.riskLevel === 'high' && 'bg-danger/20'
                )}
              >
                <RiskIcon className="h-6 w-6" />
              </div>

              <div className="flex-1 min-w-0">
                <p className="font-semibold">
                  {call.riskLevel.toUpperCase()} Risk Call
                </p>
                <p className="text-sm opacity-80">
                  {format(call.date, 'MMM d, yyyy • h:mm a')}
                </p>
              </div>

              <div className="text-right">
                <p className="text-2xl font-bold">{call.riskScore}%</p>
                <p className="text-xs opacity-80">
                  {Math.floor(call.duration / 60)}:{String(call.duration % 60).padStart(2, '0')} min
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
