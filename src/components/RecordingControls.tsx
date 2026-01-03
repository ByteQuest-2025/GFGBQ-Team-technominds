import React from 'react';
import { Button } from '@/components/ui/button';
import { AudioVisualizer } from './AudioVisualizer';
import { Mic, Square, Play, Pause, Upload } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

interface RecordingControlsProps {
  isRecording: boolean;
  isPaused: boolean;
  audioLevel: number;
  onStartRecording: () => void;
  onStopRecording: () => void;
  onPauseRecording: () => void;
  onResumeRecording: () => void;
  onUploadAudio: () => void;
  error: string | null;
}

export const RecordingControls: React.FC<RecordingControlsProps> = ({
  isRecording,
  isPaused,
  audioLevel,
  onStartRecording,
  onStopRecording,
  onPauseRecording,
  onResumeRecording,
  onUploadAudio,
  error,
}) => {
  const { t } = useLanguage();

  return (
    <div className="space-y-6">
      {/* Audio Visualizer */}
      <div className="rounded-2xl bg-card border-2 border-border p-6">
        <AudioVisualizer audioLevel={audioLevel} isRecording={isRecording && !isPaused} />
        
        <p className="mt-4 text-center text-muted-foreground">
          {isRecording
            ? isPaused
              ? t('recording.paused')
              : t('recording.listening')
            : t('recording.ready')}
        </p>
      </div>

      {/* Error Message */}
      {error && (
        <div className="rounded-lg bg-danger/10 border-2 border-danger/30 p-4 text-danger text-center">
          {error}
        </div>
      )}

      {/* Control Buttons */}
      <div className="flex flex-wrap justify-center gap-4">
        {!isRecording ? (
          <>
            <Button
              variant="hero"
              size="xl"
              onClick={onStartRecording}
              className="min-w-[200px]"
            >
              <Mic className="h-6 w-6" />
              {t('recording.start')}
            </Button>
            <Button
              variant="secondary"
              size="xl"
              onClick={onUploadAudio}
              className="min-w-[200px]"
            >
              <Upload className="h-6 w-6" />
              {t('recording.upload')}
            </Button>
          </>
        ) : (
          <>
            <Button
              variant="danger"
              size="xl"
              onClick={onStopRecording}
              className="min-w-[200px]"
            >
              <Square className="h-6 w-6" />
              {t('recording.stop')}
            </Button>
            <Button
              variant="secondary"
              size="xl"
              onClick={isPaused ? onResumeRecording : onPauseRecording}
              className="min-w-[200px]"
            >
              {isPaused ? (
                <>
                  <Play className="h-6 w-6" />
                  {t('recording.resume')}
                </>
              ) : (
                <>
                  <Pause className="h-6 w-6" />
                  {t('recording.pause')}
                </>
              )}
            </Button>
          </>
        )}
      </div>
    </div>
  );
};
