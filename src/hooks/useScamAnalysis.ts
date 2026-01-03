import { useState, useCallback, useRef, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import type { AnalysisResult, ScamIndicator, RiskLevel } from '@/types';
import { useLanguage } from '@/contexts/LanguageContext';

const scamPatterns: Omit<ScamIndicator, 'detected' | 'confidence'>[] = [
  {
    id: 'impersonation',
    type: 'impersonation',
    label: 'Caller Impersonation',
    description: 'Caller claims to be from bank, government, or trusted organization',
    severity: 'high',
  },
  {
    id: 'urgency',
    type: 'urgency',
    label: 'Urgency Pressure',
    description: 'Creating false urgency - "Act now or face consequences"',
    severity: 'high',
  },
  {
    id: 'emotional',
    type: 'emotional',
    label: 'Emotional Manipulation',
    description: 'Using fear, excitement, or sympathy to manipulate',
    severity: 'medium',
  },
  {
    id: 'authority',
    type: 'authority',
    label: 'Authority Pressure',
    description: 'Claiming legal authority or threatening arrest',
    severity: 'high',
  },
  {
    id: 'otp_request',
    type: 'otp_request',
    label: 'OTP Request',
    description: 'Asking for OTP, PIN, or password',
    severity: 'high',
  },
  {
    id: 'money_request',
    type: 'money_request',
    label: 'Money Request',
    description: 'Requesting money transfer or gift cards',
    severity: 'high',
  },
  {
    id: 'voice_pattern',
    type: 'voice_pattern',
    label: 'Suspicious Voice Pattern',
    description: 'Unusual stress, pitch changes, or scripted speech',
    severity: 'medium',
  },
];

const getLocalizedGuidance = (riskLevel: RiskLevel, lang: string): string[] => {
  const guidance: Record<string, Record<RiskLevel, string[]>> = {
    en: {
      low: [
        '✓ Call appears safe',
        '✓ No suspicious patterns detected',
        '✓ Continue with normal caution',
      ],
      medium: [
        '⚠️ Be careful with this call',
        '⚠️ Do not share personal information yet',
        '⚠️ Verify the caller\'s identity independently',
        '⚠️ If unsure, hang up and call back using official numbers',
      ],
      high: [
        '🚫 HIGH RISK - This could be a scam!',
        '🚫 DO NOT share any OTP or passwords',
        '🚫 DO NOT transfer any money',
        '🚫 End this call immediately',
        '🚫 Block this number',
        '📞 Contact your family or bank directly',
      ],
    },
    hi: {
      low: [
        '✓ कॉल सुरक्षित लगती है',
        '✓ कोई संदिग्ध पैटर्न नहीं मिला',
        '✓ सामान्य सावधानी के साथ जारी रखें',
      ],
      medium: [
        '⚠️ इस कॉल में सावधान रहें',
        '⚠️ अभी व्यक्तिगत जानकारी साझा न करें',
        '⚠️ कॉलर की पहचान स्वतंत्र रूप से सत्यापित करें',
        '⚠️ अगर संदेह हो, फोन काटें और आधिकारिक नंबर से कॉल करें',
      ],
      high: [
        '🚫 उच्च जोखिम - यह धोखाधड़ी हो सकती है!',
        '🚫 कोई भी OTP या पासवर्ड साझा न करें',
        '🚫 कोई पैसा ट्रांसफर न करें',
        '🚫 इस कॉल को तुरंत समाप्त करें',
        '🚫 इस नंबर को ब्लॉक करें',
        '📞 अपने परिवार या बैंक से सीधे संपर्क करें',
      ],
    },
    ta: {
      low: [
        '✓ அழைப்பு பாதுகாப்பானதாக தெரிகிறது',
        '✓ சந்தேகமான முறைகள் இல்லை',
        '✓ சாதாரண எச்சரிக்கையுடன் தொடரவும்',
      ],
      medium: [
        '⚠️ இந்த அழைப்பில் கவனமாக இருங்கள்',
        '⚠️ இன்னும் தனிப்பட்ட தகவல்களைப் பகிர வேண்டாம்',
        '⚠️ அழைப்பாளரின் அடையாளத்தை சுயாதீனமாக சரிபார்க்கவும்',
      ],
      high: [
        '🚫 அதிக ஆபத்து - இது மோசடியாக இருக்கலாம்!',
        '🚫 எந்த OTP அல்லது கடவுச்சொற்களையும் பகிர வேண்டாம்',
        '🚫 பணம் மாற்ற வேண்டாம்',
        '🚫 இந்த அழைப்பை உடனடியாக முடிக்கவும்',
      ],
    },
  };

  return guidance[lang]?.[riskLevel] || guidance.en[riskLevel];
};

interface UseScamAnalysisReturn {
  isAnalyzing: boolean;
  analysis: AnalysisResult | null;
  startAnalysis: () => void;
  stopAnalysis: () => void;
  analyzeTranscript: (transcript: string) => Promise<AnalysisResult>;
  analyzeAudio: (audioBlob: Blob) => Promise<AnalysisResult>;
}

export const useScamAnalysis = (): UseScamAnalysisReturn => {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const { language } = useLanguage();

  const analyzeTranscript = useCallback(async (transcript: string): Promise<AnalysisResult> => {
    try {
      console.log('Sending transcript for analysis:', transcript.substring(0, 100));
      
      const { data, error } = await supabase.functions.invoke('analyze-scam', {
        body: { transcript, language }
      });

      if (error) {
        console.error('Edge function error:', error);
        throw error;
      }

      console.log('AI analysis result:', data);

      // Map the response to our indicator format
      const indicators: ScamIndicator[] = scamPatterns.map((pattern) => {
        const aiIndicator = data.indicators?.find((i: any) => i.id === pattern.id);
        return {
          ...pattern,
          detected: aiIndicator?.detected || false,
          confidence: aiIndicator?.confidence || 0,
        };
      });

      const result: AnalysisResult = {
        riskLevel: data.riskLevel || 'low',
        riskScore: data.riskScore || 0,
        indicators,
        guidance: data.guidance || getLocalizedGuidance(data.riskLevel || 'low', language),
        timestamp: new Date(),
      };

      setAnalysis(result);
      return result;
    } catch (error) {
      console.error('Error analyzing transcript:', error);
      // Return safe default
      const fallbackResult: AnalysisResult = {
        riskLevel: 'medium',
        riskScore: 50,
        indicators: scamPatterns.map(p => ({ ...p, detected: false, confidence: 0 })),
        guidance: getLocalizedGuidance('medium', language),
        timestamp: new Date(),
      };
      setAnalysis(fallbackResult);
      return fallbackResult;
    }
  }, [language]);

  // Simulate real-time analysis with periodic updates
  const simulateRealtimeAnalysis = useCallback((): AnalysisResult => {
    const detectedIndicators: ScamIndicator[] = scamPatterns.map((pattern) => {
      const detected = Math.random() > 0.7;
      const confidence = detected ? 0.5 + Math.random() * 0.5 : 0;
      return {
        ...pattern,
        detected,
        confidence,
      };
    });

    const highRiskCount = detectedIndicators.filter(
      (i) => i.detected && i.severity === 'high'
    ).length;
    const mediumRiskCount = detectedIndicators.filter(
      (i) => i.detected && i.severity === 'medium'
    ).length;

    let riskLevel: RiskLevel = 'low';
    let riskScore = 0;

    if (highRiskCount >= 2) {
      riskLevel = 'high';
      riskScore = 70 + Math.min(highRiskCount * 10, 30);
    } else if (highRiskCount === 1 || mediumRiskCount >= 2) {
      riskLevel = 'medium';
      riskScore = 40 + highRiskCount * 15 + mediumRiskCount * 10;
    } else if (mediumRiskCount === 1) {
      riskLevel = 'low';
      riskScore = 15 + mediumRiskCount * 10;
    } else {
      riskScore = Math.floor(Math.random() * 15);
    }

    return {
      riskLevel,
      riskScore: Math.min(riskScore, 100),
      indicators: detectedIndicators,
      guidance: getLocalizedGuidance(riskLevel, language),
      timestamp: new Date(),
    };
  }, [language]);

  const startAnalysis = useCallback(() => {
    setIsAnalyzing(true);
    // Initial analysis
    setAnalysis(simulateRealtimeAnalysis());

    // Update analysis every 3 seconds
    intervalRef.current = setInterval(() => {
      setAnalysis(simulateRealtimeAnalysis());
    }, 3000);
  }, [simulateRealtimeAnalysis]);

  const stopAnalysis = useCallback(() => {
    setIsAnalyzing(false);
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  const analyzeAudio = useCallback(
    async (audioBlob: Blob): Promise<AnalysisResult> => {
      // For now, use simulated analysis for uploaded files
      // In production, you'd send to a speech-to-text service first
      await new Promise((resolve) => setTimeout(resolve, 2000));
      const result = simulateRealtimeAnalysis();
      setAnalysis(result);
      return result;
    },
    [simulateRealtimeAnalysis]
  );

  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  return {
    isAnalyzing,
    analysis,
    startAnalysis,
    stopAnalysis,
    analyzeTranscript,
    analyzeAudio,
  };
};
