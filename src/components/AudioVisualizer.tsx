import React from 'react';
import { cn } from '@/lib/utils';

interface AudioVisualizerProps {
  audioLevel: number;
  isRecording: boolean;
}

export const AudioVisualizer: React.FC<AudioVisualizerProps> = ({
  audioLevel,
  isRecording,
}) => {
  const bars = 12;

  return (
    <div className="flex items-center justify-center gap-1 h-16">
      {Array.from({ length: bars }).map((_, i) => {
        const barHeight = isRecording
          ? Math.max(0.2, Math.min(1, audioLevel * 2 + Math.sin(Date.now() / 100 + i) * 0.3))
          : 0.15;

        return (
          <div
            key={i}
            className={cn(
              'w-2 rounded-full transition-all duration-75',
              isRecording ? 'bg-primary' : 'bg-muted'
            )}
            style={{
              height: `${barHeight * 100}%`,
              opacity: isRecording ? 0.6 + barHeight * 0.4 : 0.3,
            }}
          />
        );
      })}
    </div>
  );
};
