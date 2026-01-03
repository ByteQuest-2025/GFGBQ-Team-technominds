import React, { useRef } from 'react';
import { RecordingControls } from './RecordingControls';
import { RiskMeter } from './RiskMeter';
import { GuidancePanel } from './GuidancePanel';
import { IndicatorList } from './IndicatorList';
import { useAudioRecorder } from '@/hooks/useAudioRecorder';
import { useScamAnalysis } from '@/hooks/useScamAnalysis';
import { useLanguage } from '@/contexts/LanguageContext';
import type { CallRecord } from '@/types';
import { useToast } from '@/hooks/use-toast';

interface MonitorViewProps {
  onCallComplete: (call: CallRecord) => void;
}

export const MonitorView: React.FC<MonitorViewProps> = ({ onCallComplete }) => {
  const { toast } = useToast();
  const { t } = useLanguage();
  const startTimeRef = useRef<Date | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const {
    isRecording,
    isPaused,
    audioLevel,
    startRecording: startAudioRecording,
    stopRecording: stopAudioRecording,
    pauseRecording,
    resumeRecording,
    error: recorderError,
  } = useAudioRecorder();

  const {
    isAnalyzing,
    analysis,
    startAnalysis,
    stopAnalysis,
    analyzeAudio,
  } = useScamAnalysis();

  const handleStartRecording = async () => {
    await startAudioRecording();
    startAnalysis();
    startTimeRef.current = new Date();
    toast({
      title: t('toast.monitoringStarted'),
      description: t('toast.listeningForScams'),
    });
  };

  const handleStopRecording = () => {
    stopAudioRecording();
    stopAnalysis();

    if (analysis && startTimeRef.current) {
      const duration = Math.floor(
        (new Date().getTime() - startTimeRef.current.getTime()) / 1000
      );
      
      const callRecord: CallRecord = {
        id: crypto.randomUUID(),
        date: startTimeRef.current,
        duration,
        riskLevel: analysis.riskLevel,
        riskScore: analysis.riskScore,
        indicators: analysis.indicators.filter((i) => i.detected),
      };
      
      onCallComplete(callRecord);
      
      toast({
        title: t('toast.monitoringComplete'),
        description: `${t('risk.' + analysis.riskLevel)} - ${analysis.riskScore}%`,
        variant: analysis.riskLevel === 'high' ? 'destructive' : 'default',
      });
    }
  };

  const handleUploadAudio = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    toast({
      title: t('toast.analyzingRecording'),
      description: t('toast.pleaseWait'),
    });

    const result = await analyzeAudio(file);
    
    const callRecord: CallRecord = {
      id: crypto.randomUUID(),
      date: new Date(),
      duration: 60,
      riskLevel: result.riskLevel,
      riskScore: result.riskScore,
      indicators: result.indicators.filter((i) => i.detected),
    };
    
    onCallComplete(callRecord);
    
    toast({
      title: t('toast.analysisComplete'),
      description: `${t('risk.' + result.riskLevel)} - ${result.riskScore}%`,
      variant: result.riskLevel === 'high' ? 'destructive' : 'default',
    });

    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="space-y-6">
      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="audio/*"
        onChange={handleFileChange}
        className="hidden"
      />

      {/* Recording Controls */}
      <RecordingControls
        isRecording={isRecording}
        isPaused={isPaused}
        audioLevel={audioLevel}
        onStartRecording={handleStartRecording}
        onStopRecording={handleStopRecording}
        onPauseRecording={pauseRecording}
        onResumeRecording={resumeRecording}
        onUploadAudio={handleUploadAudio}
        error={recorderError}
      />

      {/* Analysis Results */}
      {analysis && (
        <div className="space-y-6 animate-fade-in">
          {/* Risk Meter */}
          <RiskMeter
            riskLevel={analysis.riskLevel}
            riskScore={analysis.riskScore}
            isAnalyzing={isAnalyzing}
          />

          {/* Guidance Panel */}
          <GuidancePanel
            riskLevel={analysis.riskLevel}
            guidance={analysis.guidance}
          />

          {/* Indicator List */}
          <div className="rounded-2xl border-2 border-border bg-card p-6">
            <IndicatorList indicators={analysis.indicators} />
          </div>
        </div>
      )}

      {/* Initial State - No Analysis */}
      {!isRecording && !analysis && (
        <div className="rounded-2xl border-2 border-dashed border-border p-8 text-center">
          <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-primary/10">
            <span className="text-4xl">🛡️</span>
          </div>
          <h3 className="text-xl font-bold">{t('ready.title')}</h3>
          <p className="mt-2 text-muted-foreground text-lg">
            {t('ready.description')}
          </p>
        </div>
      )}
    </div>
  );
};
