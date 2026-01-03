import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');

interface ScamIndicator {
  id: string;
  type: string;
  detected: boolean;
  confidence: number;
  evidence?: string;
}

interface AnalysisResult {
  riskLevel: 'low' | 'medium' | 'high';
  riskScore: number;
  indicators: ScamIndicator[];
  guidance: string[];
  transcript?: string;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { transcript, language = 'en' } = await req.json();

    if (!transcript || transcript.trim().length === 0) {
      return new Response(
        JSON.stringify({ error: 'No transcript provided' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    if (!LOVABLE_API_KEY) {
      throw new Error('LOVABLE_API_KEY is not configured');
    }

    console.log('Analyzing transcript:', transcript.substring(0, 200));
    console.log('Language:', language);

    const systemPrompt = `You are an expert scam detection AI. Analyze the following phone conversation transcript and detect scam indicators.

Analyze for these specific scam patterns:
1. impersonation - Caller claims to be from bank, government, police, or trusted organization
2. urgency - Creating false urgency like "act now", "immediate action required", "your account will be blocked"
3. emotional - Using fear, excitement, sympathy to manipulate (threats, prizes, emergencies)
4. authority - Claiming legal authority, threatening arrest, legal action, or fines
5. otp_request - Asking for OTP, PIN, CVV, password, or any sensitive codes
6. money_request - Requesting money transfer, gift cards, UPI payment, or bank details
7. voice_pattern - Scripted speech, background noise suggesting call center, multiple people coaching

Respond ONLY with valid JSON in this exact format:
{
  "riskLevel": "low" | "medium" | "high",
  "riskScore": 0-100,
  "indicators": [
    {
      "id": "impersonation",
      "type": "impersonation",
      "detected": true/false,
      "confidence": 0.0-1.0,
      "evidence": "brief quote or description from transcript"
    }
  ],
  "guidance": ["action item 1", "action item 2"]
}

Guidelines for scoring:
- low (0-30): Normal conversation, no suspicious patterns
- medium (31-60): Some suspicious patterns, proceed with caution
- high (61-100): Multiple red flags, likely scam, end call immediately

Provide guidance in the user's language (${language}). Be specific and actionable.`;

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: `Analyze this phone conversation transcript for scam indicators:\n\n${transcript}` }
        ],
        temperature: 0.3,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('AI gateway error:', response.status, errorText);
      
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: 'Rate limit exceeded. Please try again in a moment.' }),
          { status: 429, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: 'Usage limit reached. Please check your account.' }),
          { status: 402, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      throw new Error(`AI gateway error: ${response.status}`);
    }

    const aiResponse = await response.json();
    const content = aiResponse.choices?.[0]?.message?.content;
    
    console.log('AI response:', content);

    // Parse the JSON response
    let analysis: AnalysisResult;
    try {
      // Extract JSON from the response (handle markdown code blocks)
      let jsonStr = content;
      if (content.includes('```json')) {
        jsonStr = content.split('```json')[1].split('```')[0].trim();
      } else if (content.includes('```')) {
        jsonStr = content.split('```')[1].split('```')[0].trim();
      }
      analysis = JSON.parse(jsonStr);
    } catch (parseError) {
      console.error('Failed to parse AI response:', parseError);
      // Fallback to safe defaults
      analysis = {
        riskLevel: 'medium',
        riskScore: 50,
        indicators: [],
        guidance: ['Unable to fully analyze. Please be cautious.'],
      };
    }

    // Ensure all required indicator types are present
    const indicatorTypes = ['impersonation', 'urgency', 'emotional', 'authority', 'otp_request', 'money_request', 'voice_pattern'];
    const existingIds = new Set(analysis.indicators.map(i => i.id));
    
    for (const type of indicatorTypes) {
      if (!existingIds.has(type)) {
        analysis.indicators.push({
          id: type,
          type: type,
          detected: false,
          confidence: 0,
        });
      }
    }

    console.log('Final analysis:', analysis);

    return new Response(
      JSON.stringify(analysis),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error in analyze-scam function:', error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
