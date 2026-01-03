import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';

export type Language = 'en' | 'hi' | 'ta' | 'te' | 'bn' | 'mr' | 'gu' | 'kn' | 'ml';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
  languageNames: Record<Language, string>;
}

const languageNames: Record<Language, string> = {
  en: 'English',
  hi: 'हिंदी',
  ta: 'தமிழ்',
  te: 'తెలుగు',
  bn: 'বাংলা',
  mr: 'मराठी',
  gu: 'ગુજરાતી',
  kn: 'ಕನ್ನಡ',
  ml: 'മലയാളം',
};

const translations: Record<Language, Record<string, string>> = {
  en: {
    // Header
    'app.name': 'ScamGuard',
    'app.tagline': 'Protect Your Calls',
    'nav.monitor': 'Monitor',
    'nav.history': 'History',
    'nav.help': 'Help',
    
    // Recording Controls
    'recording.start': 'Start Monitoring',
    'recording.stop': 'Stop',
    'recording.pause': 'Pause',
    'recording.resume': 'Resume',
    'recording.upload': 'Upload Recording',
    'recording.listening': 'Listening and analyzing...',
    'recording.paused': 'Recording paused',
    'recording.ready': 'Press the button to start monitoring',
    
    // Risk Levels
    'risk.low': 'LOW RISK',
    'risk.medium': 'MEDIUM RISK',
    'risk.high': 'HIGH RISK',
    'risk.analyzing': 'Analyzing...',
    'risk.score': 'Risk Score',
    
    // Guidance
    'guidance.allClear': 'All Clear',
    'guidance.caution': 'Proceed with Caution',
    'guidance.action': 'Take Action Now!',
    
    // Indicators
    'indicator.impersonation': 'Caller Impersonation',
    'indicator.impersonation.desc': 'Caller claims to be from bank, government, or trusted organization',
    'indicator.urgency': 'Urgency Pressure',
    'indicator.urgency.desc': 'Creating false urgency - "Act now or face consequences"',
    'indicator.emotional': 'Emotional Manipulation',
    'indicator.emotional.desc': 'Using fear, excitement, or sympathy to manipulate',
    'indicator.authority': 'Authority Pressure',
    'indicator.authority.desc': 'Claiming legal authority or threatening arrest',
    'indicator.otp_request': 'OTP Request',
    'indicator.otp_request.desc': 'Asking for OTP, PIN, or password',
    'indicator.money_request': 'Money Request',
    'indicator.money_request.desc': 'Requesting money transfer or gift cards',
    'indicator.voice_pattern': 'Suspicious Voice Pattern',
    'indicator.voice_pattern.desc': 'Unusual stress, pitch changes, or scripted speech',
    
    // Help Section
    'help.safetyTips': 'How to Stay Safe',
    'help.scamTypes': 'Common Scam Types',
    'help.emergency': 'Emergency Contacts',
    'help.howItWorks': 'How ScamGuard Works',
    
    // Tips
    'tip.neverShareOtp': 'Never Share OTP',
    'tip.neverShareOtp.desc': 'Banks and government offices will NEVER ask for your OTP, PIN, or password over phone.',
    'tip.moneyRequest': 'Beware of Money Requests',
    'tip.moneyRequest.desc': 'Do not transfer money to unknown accounts. Verify requests with family first.',
    'tip.ignoreUrgency': 'Ignore Urgency',
    'tip.ignoreUrgency.desc': 'Scammers create fake urgency. Take your time, hang up, and verify independently.',
    'tip.verifyIdentity': 'Verify Caller Identity',
    'tip.verifyIdentity.desc': 'If someone claims to be from a bank, hang up and call the bank\'s official number.',
    'tip.trustInstincts': 'Trust Your Instincts',
    'tip.trustInstincts.desc': 'If something feels wrong, it probably is. It\'s okay to end the call.',
    'tip.talkToFamily': 'Talk to Family',
    'tip.talkToFamily.desc': 'When in doubt, discuss with family members before making any decisions.',
    
    // Scam Types
    'scam.bankOfficer': 'Bank Officer Scam',
    'scam.bankOfficer.desc': 'Caller pretends to be from your bank, asks for card details or OTP to "block suspicious transaction"',
    'scam.government': 'Government Official Scam',
    'scam.government.desc': 'Threatens arrest or legal action if you don\'t pay immediately via specific apps',
    'scam.lottery': 'Prize/Lottery Scam',
    'scam.lottery.desc': 'Claims you won money but need to pay "processing fee" to receive it',
    'scam.techSupport': 'Tech Support Scam',
    'scam.techSupport.desc': 'Claims your computer has virus, asks for remote access or payment to fix it',
    
    // How it works
    'howItWorks.step1': 'Press "Start Monitoring" when you receive a suspicious call',
    'howItWorks.step2': 'The app listens and analyzes the conversation in real-time',
    'howItWorks.step3': 'See the risk level and follow the guidance shown',
    'howItWorks.step4': 'If HIGH RISK is shown, end the call immediately',
    
    // Footer
    'footer.tagline': 'ScamGuard - Protecting you from phone scams',
    'footer.privacy': 'Your privacy matters. Audio is processed securely.',
    
    // Toasts
    'toast.monitoringStarted': 'Monitoring Started',
    'toast.listeningForScams': 'Listening for scam indicators...',
    'toast.monitoringComplete': 'Monitoring Complete',
    'toast.analyzingRecording': 'Analyzing Recording',
    'toast.pleaseWait': 'Please wait while we analyze the audio...',
    'toast.analysisComplete': 'Analysis Complete',
    
    // Call History
    'history.title': 'Call History',
    'history.empty': 'No calls analyzed yet',
    'history.duration': 'Duration',
    'history.seconds': 'seconds',
    
    // Misc
    'ready.title': 'Ready to Protect You',
    'ready.description': 'Start monitoring to detect scam calls in real-time',
    'language': 'Language',
  },
  hi: {
    'app.name': 'स्कैमगार्ड',
    'app.tagline': 'आपकी कॉल की सुरक्षा',
    'nav.monitor': 'निगरानी',
    'nav.history': 'इतिहास',
    'nav.help': 'सहायता',
    
    'recording.start': 'निगरानी शुरू करें',
    'recording.stop': 'रोकें',
    'recording.pause': 'रुकें',
    'recording.resume': 'जारी रखें',
    'recording.upload': 'रिकॉर्डिंग अपलोड करें',
    'recording.listening': 'सुन रहे हैं और विश्लेषण कर रहे हैं...',
    'recording.paused': 'रिकॉर्डिंग रुकी हुई है',
    'recording.ready': 'निगरानी शुरू करने के लिए बटन दबाएं',
    
    'risk.low': 'कम जोखिम',
    'risk.medium': 'मध्यम जोखिम',
    'risk.high': 'उच्च जोखिम',
    'risk.analyzing': 'विश्लेषण हो रहा है...',
    'risk.score': 'जोखिम स्कोर',
    
    'guidance.allClear': 'सब ठीक है',
    'guidance.caution': 'सावधानी से आगे बढ़ें',
    'guidance.action': 'अभी कार्रवाई करें!',
    
    'indicator.impersonation': 'कॉलर का प्रतिरूपण',
    'indicator.impersonation.desc': 'कॉलर बैंक, सरकार या भरोसेमंद संगठन से होने का दावा करता है',
    'indicator.urgency': 'तत्काल दबाव',
    'indicator.urgency.desc': 'झूठी तात्कालिकता पैदा करना - "अभी करें वरना परिणाम भुगतें"',
    'indicator.emotional': 'भावनात्मक हेरफेर',
    'indicator.emotional.desc': 'डर, उत्साह या सहानुभूति का उपयोग करके हेरफेर',
    'indicator.authority': 'अधिकार का दबाव',
    'indicator.authority.desc': 'कानूनी अधिकार का दावा या गिरफ्तारी की धमकी',
    'indicator.otp_request': 'OTP मांगना',
    'indicator.otp_request.desc': 'OTP, PIN या पासवर्ड मांगना',
    'indicator.money_request': 'पैसे मांगना',
    'indicator.money_request.desc': 'पैसे ट्रांसफर या गिफ्ट कार्ड की मांग',
    'indicator.voice_pattern': 'संदिग्ध आवाज पैटर्न',
    'indicator.voice_pattern.desc': 'असामान्य तनाव, पिच में बदलाव या स्क्रिप्टेड बोलना',
    
    'help.safetyTips': 'सुरक्षित कैसे रहें',
    'help.scamTypes': 'सामान्य धोखाधड़ी के प्रकार',
    'help.emergency': 'आपातकालीन संपर्क',
    'help.howItWorks': 'स्कैमगार्ड कैसे काम करता है',
    
    'tip.neverShareOtp': 'OTP कभी साझा न करें',
    'tip.neverShareOtp.desc': 'बैंक और सरकारी कार्यालय फोन पर कभी OTP, PIN या पासवर्ड नहीं मांगते।',
    'tip.moneyRequest': 'पैसों की मांग से सावधान',
    'tip.moneyRequest.desc': 'अनजान खातों में पैसे ट्रांसफर न करें। पहले परिवार से पुष्टि करें।',
    'tip.ignoreUrgency': 'तत्काल दबाव को नजरअंदाज करें',
    'tip.ignoreUrgency.desc': 'धोखेबाज झूठी तात्कालिकता बनाते हैं। समय लें, फोन काटें और स्वतंत्र रूप से सत्यापित करें।',
    'tip.verifyIdentity': 'कॉलर की पहचान सत्यापित करें',
    'tip.verifyIdentity.desc': 'अगर कोई बैंक से होने का दावा करे, फोन काटें और बैंक के आधिकारिक नंबर पर कॉल करें।',
    'tip.trustInstincts': 'अपनी सहज बुद्धि पर भरोसा करें',
    'tip.trustInstincts.desc': 'अगर कुछ गलत लगे, तो शायद गलत है। कॉल समाप्त करना ठीक है।',
    'tip.talkToFamily': 'परिवार से बात करें',
    'tip.talkToFamily.desc': 'संदेह होने पर, कोई भी निर्णय लेने से पहले परिवार के सदस्यों से चर्चा करें।',
    
    'scam.bankOfficer': 'बैंक अधिकारी धोखाधड़ी',
    'scam.bankOfficer.desc': 'कॉलर आपके बैंक से होने का नाटक करता है, "संदिग्ध लेनदेन" को ब्लॉक करने के लिए कार्ड विवरण या OTP मांगता है',
    'scam.government': 'सरकारी अधिकारी धोखाधड़ी',
    'scam.government.desc': 'अगर आप तुरंत विशेष ऐप्स के माध्यम से भुगतान नहीं करते तो गिरफ्तारी या कानूनी कार्रवाई की धमकी',
    'scam.lottery': 'इनाम/लॉटरी धोखाधड़ी',
    'scam.lottery.desc': 'दावा करता है कि आपने पैसे जीते लेकिन इसे प्राप्त करने के लिए "प्रोसेसिंग शुल्क" देना होगा',
    'scam.techSupport': 'टेक सपोर्ट धोखाधड़ी',
    'scam.techSupport.desc': 'दावा करता है कि आपके कंप्यूटर में वायरस है, इसे ठीक करने के लिए रिमोट एक्सेस या भुगतान मांगता है',
    
    'howItWorks.step1': 'जब आपको संदिग्ध कॉल आए तो "निगरानी शुरू करें" दबाएं',
    'howItWorks.step2': 'ऐप वास्तविक समय में बातचीत सुनता और विश्लेषण करता है',
    'howItWorks.step3': 'जोखिम स्तर देखें और दिखाए गए मार्गदर्शन का पालन करें',
    'howItWorks.step4': 'अगर उच्च जोखिम दिखे, तुरंत कॉल समाप्त करें',
    
    'footer.tagline': 'स्कैमगार्ड - फोन धोखाधड़ी से आपकी सुरक्षा',
    'footer.privacy': 'आपकी गोपनीयता महत्वपूर्ण है। ऑडियो सुरक्षित रूप से प्रोसेस होता है।',
    
    'toast.monitoringStarted': 'निगरानी शुरू',
    'toast.listeningForScams': 'धोखाधड़ी संकेतकों को सुन रहे हैं...',
    'toast.monitoringComplete': 'निगरानी पूर्ण',
    'toast.analyzingRecording': 'रिकॉर्डिंग का विश्लेषण',
    'toast.pleaseWait': 'कृपया प्रतीक्षा करें जब तक हम ऑडियो का विश्लेषण करते हैं...',
    'toast.analysisComplete': 'विश्लेषण पूर्ण',
    
    'history.title': 'कॉल इतिहास',
    'history.empty': 'अभी तक कोई कॉल विश्लेषित नहीं',
    'history.duration': 'अवधि',
    'history.seconds': 'सेकंड',
    
    'ready.title': 'आपकी सुरक्षा के लिए तैयार',
    'ready.description': 'वास्तविक समय में स्कैम कॉल का पता लगाने के लिए निगरानी शुरू करें',
    'language': 'भाषा',
  },
  ta: {
    'app.name': 'ஸ்கேம்கார்ட்',
    'app.tagline': 'உங்கள் அழைப்புகளைப் பாதுகாக்கவும்',
    'nav.monitor': 'கண்காணிப்பு',
    'nav.history': 'வரலாறு',
    'nav.help': 'உதவி',
    
    'recording.start': 'கண்காணிப்பைத் தொடங்கு',
    'recording.stop': 'நிறுத்து',
    'recording.pause': 'இடைநிறுத்து',
    'recording.resume': 'தொடர்',
    'recording.upload': 'பதிவை பதிவேற்று',
    'recording.listening': 'கேட்கிறேன் மற்றும் பகுப்பாய்வு செய்கிறேன்...',
    'recording.paused': 'பதிவு இடைநிறுத்தப்பட்டது',
    'recording.ready': 'கண்காணிப்பைத் தொடங்க பொத்தானை அழுத்தவும்',
    
    'risk.low': 'குறைந்த ஆபத்து',
    'risk.medium': 'நடுத்தர ஆபத்து',
    'risk.high': 'அதிக ஆபத்து',
    'risk.analyzing': 'பகுப்பாய்வு செய்கிறேன்...',
    'risk.score': 'ஆபத்து மதிப்பெண்',
    
    'guidance.allClear': 'எல்லாம் சரி',
    'guidance.caution': 'கவனமாக முன்னேறுங்கள்',
    'guidance.action': 'இப்போதே நடவடிக்கை எடுங்கள்!',
    
    'indicator.impersonation': 'அழைப்பாளர் ஆள்மாறாட்டம்',
    'indicator.impersonation.desc': 'அழைப்பாளர் வங்கி, அரசு அல்லது நம்பகமான அமைப்பிலிருந்து என்று கூறுகிறார்',
    'indicator.urgency': 'அவசர அழுத்தம்',
    'indicator.urgency.desc': 'தவறான அவசரத்தை உருவாக்குதல் - "இப்போது செய்யுங்கள் இல்லையெனில் விளைவுகளை எதிர்கொள்ளுங்கள்"',
    'indicator.emotional': 'உணர்ச்சி சூழ்ச்சி',
    'indicator.emotional.desc': 'பயம், உற்சாகம் அல்லது அனுதாபத்தைப் பயன்படுத்தி கையாளுதல்',
    'indicator.authority': 'அதிகார அழுத்தம்',
    'indicator.authority.desc': 'சட்ட அதிகாரம் கூறுதல் அல்லது கைது செய்வதாக மிரட்டல்',
    'indicator.otp_request': 'OTP கோரிக்கை',
    'indicator.otp_request.desc': 'OTP, PIN அல்லது கடவுச்சொல் கேட்கிறார்கள்',
    'indicator.money_request': 'பண கோரிக்கை',
    'indicator.money_request.desc': 'பண பரிமாற்றம் அல்லது பரிசு அட்டைகள் கோருதல்',
    'indicator.voice_pattern': 'சந்தேகமான குரல் முறை',
    'indicator.voice_pattern.desc': 'அசாதாரண அழுத்தம், சுருதி மாற்றங்கள் அல்லது ஸ்கிரிப்ட் படித்தல்',
    
    'help.safetyTips': 'பாதுகாப்பாக இருப்பது எப்படி',
    'help.scamTypes': 'பொதுவான மோசடி வகைகள்',
    'help.emergency': 'அவசர தொடர்புகள்',
    'help.howItWorks': 'ஸ்கேம்கார்ட் எப்படி வேலை செய்கிறது',
    
    'footer.tagline': 'ஸ்கேம்கார்ட் - தொலைபேசி மோசடிகளிலிருந்து உங்களைப் பாதுகாக்கிறது',
    'footer.privacy': 'உங்கள் தனியுரிமை முக்கியமானது. ஆடியோ பாதுகாப்பாக செயலாக்கப்படுகிறது.',
    
    'ready.title': 'உங்களைப் பாதுகாக்க தயார்',
    'ready.description': 'நிகழ்நேரத்தில் மோசடி அழைப்புகளைக் கண்டறிய கண்காணிப்பைத் தொடங்கவும்',
    'language': 'மொழி',
  },
  te: {
    'app.name': 'స్కామ్‌గార్డ్',
    'app.tagline': 'మీ కాల్‌లను రక్షించండి',
    'nav.monitor': 'పర్యవేక్షణ',
    'nav.history': 'చరిత్ర',
    'nav.help': 'సహాయం',
    
    'recording.start': 'పర్యవేక్షణ ప్రారంభించండి',
    'recording.stop': 'ఆపు',
    'recording.pause': 'పాజ్',
    'recording.resume': 'కొనసాగించు',
    'recording.upload': 'రికార్డింగ్ అప్‌లోడ్',
    'recording.listening': 'వింటున్నాను మరియు విశ్లేషిస్తున్నాను...',
    'recording.paused': 'రికార్డింగ్ ఆపివేయబడింది',
    'recording.ready': 'పర్యవేక్షణ ప్రారంభించడానికి బటన్ నొక్కండి',
    
    'risk.low': 'తక్కువ ప్రమాదం',
    'risk.medium': 'మధ్యస్థ ప్రమాదం',
    'risk.high': 'అధిక ప్రమాదం',
    'risk.analyzing': 'విశ్లేషిస్తున్నాను...',
    'risk.score': 'ప్రమాద స్కోరు',
    
    'guidance.allClear': 'అంతా సరిగ్గా ఉంది',
    'guidance.caution': 'జాగ్రత్తగా ముందుకు సాగండి',
    'guidance.action': 'ఇప్పుడే చర్య తీసుకోండి!',
    
    'footer.tagline': 'స్కామ్‌గార్డ్ - ఫోన్ మోసాల నుండి మిమ్మల్ని రక్షిస్తుంది',
    'footer.privacy': 'మీ గోప్యత ముఖ్యం. ఆడియో సురక్షితంగా ప్రాసెస్ చేయబడుతుంది.',
    
    'ready.title': 'మిమ్మల్ని రక్షించడానికి సిద్ధంగా ఉన్నాను',
    'ready.description': 'నిజ సమయంలో స్కామ్ కాల్‌లను గుర్తించడానికి పర్యవేక్షణ ప్రారంభించండి',
    'language': 'భాష',
  },
  bn: {
    'app.name': 'স্ক্যামগার্ড',
    'app.tagline': 'আপনার কল সুরক্ষিত করুন',
    'nav.monitor': 'নজরদারি',
    'nav.history': 'ইতিহাস',
    'nav.help': 'সাহায্য',
    
    'recording.start': 'নজরদারি শুরু করুন',
    'recording.stop': 'থামান',
    'recording.pause': 'বিরতি',
    'recording.resume': 'আবার শুরু',
    'recording.upload': 'রেকর্ডিং আপলোড',
    'recording.listening': 'শুনছি এবং বিশ্লেষণ করছি...',
    'recording.paused': 'রেকর্ডিং বিরতি দেওয়া হয়েছে',
    'recording.ready': 'নজরদারি শুরু করতে বোতাম টিপুন',
    
    'risk.low': 'কম ঝুঁকি',
    'risk.medium': 'মাঝারি ঝুঁকি',
    'risk.high': 'উচ্চ ঝুঁকি',
    'risk.analyzing': 'বিশ্লেষণ করছি...',
    'risk.score': 'ঝুঁকি স্কোর',
    
    'footer.tagline': 'স্ক্যামগার্ড - ফোন প্রতারণা থেকে আপনাকে রক্ষা করছে',
    'footer.privacy': 'আপনার গোপনীয়তা গুরুত্বপূর্ণ। অডিও নিরাপদে প্রক্রিয়া করা হয়।',
    
    'ready.title': 'আপনাকে রক্ষা করতে প্রস্তুত',
    'ready.description': 'রিয়েল-টাইমে স্ক্যাম কল সনাক্ত করতে নজরদারি শুরু করুন',
    'language': 'ভাষা',
  },
  mr: {
    'app.name': 'स्कॅमगार्ड',
    'app.tagline': 'तुमच्या कॉल्सचे रक्षण करा',
    'nav.monitor': 'निरीक्षण',
    'nav.history': 'इतिहास',
    'nav.help': 'मदत',
    
    'recording.start': 'निरीक्षण सुरू करा',
    'recording.stop': 'थांबवा',
    'recording.pause': 'विराम',
    'recording.resume': 'पुन्हा सुरू',
    'recording.upload': 'रेकॉर्डिंग अपलोड करा',
    'recording.listening': 'ऐकत आहे आणि विश्लेषण करत आहे...',
    'recording.paused': 'रेकॉर्डिंग थांबवली',
    'recording.ready': 'निरीक्षण सुरू करण्यासाठी बटण दाबा',
    
    'risk.low': 'कमी धोका',
    'risk.medium': 'मध्यम धोका',
    'risk.high': 'उच्च धोका',
    'risk.analyzing': 'विश्लेषण करत आहे...',
    'risk.score': 'धोका स्कोर',
    
    'footer.tagline': 'स्कॅमगार्ड - फोन फसवणुकीपासून तुमचे संरक्षण',
    'footer.privacy': 'तुमची गोपनीयता महत्त्वाची आहे. ऑडिओ सुरक्षितपणे प्रक्रिया केला जातो.',
    
    'ready.title': 'तुमचे रक्षण करण्यास तयार',
    'ready.description': 'रिअल-टाइममध्ये स्कॅम कॉल शोधण्यासाठी निरीक्षण सुरू करा',
    'language': 'भाषा',
  },
  gu: {
    'app.name': 'સ્કેમગાર્ડ',
    'app.tagline': 'તમારા કૉલ્સનું રક્ષણ કરો',
    'nav.monitor': 'દેખરેખ',
    'nav.history': 'ઇતિહાસ',
    'nav.help': 'મદદ',
    
    'recording.start': 'દેખરેખ શરૂ કરો',
    'recording.stop': 'રોકો',
    'recording.pause': 'થોભો',
    'recording.resume': 'ફરી શરૂ કરો',
    'recording.upload': 'રેકોર્ડિંગ અપલોડ કરો',
    'recording.listening': 'સાંભળી રહ્યો છું અને વિશ્લેષણ કરી રહ્યો છું...',
    'recording.paused': 'રેકોર્ડિંગ થોભાવેલ',
    'recording.ready': 'દેખરેખ શરૂ કરવા માટે બટન દબાવો',
    
    'risk.low': 'ઓછું જોખમ',
    'risk.medium': 'મધ્યમ જોખમ',
    'risk.high': 'ઊંચું જોખમ',
    'risk.analyzing': 'વિશ્લેષણ કરી રહ્યો છું...',
    'risk.score': 'જોખમ સ્કોર',
    
    'footer.tagline': 'સ્કેમગાર્ડ - ફોન છેતરપિંડીથી તમારું રક્ષણ',
    'footer.privacy': 'તમારી ગોપનીયતા મહત્વપૂર્ણ છે. ઓડિયો સુરક્ષિત રીતે પ્રક્રિયા થાય છે.',
    
    'ready.title': 'તમારું રક્ષણ કરવા તૈયાર',
    'ready.description': 'રીઅલ-ટાઇમમાં સ્કેમ કૉલ્સ શોધવા માટે દેખરેખ શરૂ કરો',
    'language': 'ભાષા',
  },
  kn: {
    'app.name': 'ಸ್ಕ್ಯಾಮ್‌ಗಾರ್ಡ್',
    'app.tagline': 'ನಿಮ್ಮ ಕರೆಗಳನ್ನು ರಕ್ಷಿಸಿ',
    'nav.monitor': 'ಮೇಲ್ವಿಚಾರಣೆ',
    'nav.history': 'ಇತಿಹಾಸ',
    'nav.help': 'ಸಹಾಯ',
    
    'recording.start': 'ಮೇಲ್ವಿಚಾರಣೆ ಪ್ರಾರಂಭಿಸಿ',
    'recording.stop': 'ನಿಲ್ಲಿಸಿ',
    'recording.pause': 'ವಿರಾಮ',
    'recording.resume': 'ಮುಂದುವರಿಸಿ',
    'recording.upload': 'ರೆಕಾರ್ಡಿಂಗ್ ಅಪ್‌ಲೋಡ್',
    'recording.listening': 'ಕೇಳುತ್ತಿದ್ದೇನೆ ಮತ್ತು ವಿಶ್ಲೇಷಿಸುತ್ತಿದ್ದೇನೆ...',
    'recording.paused': 'ರೆಕಾರ್ಡಿಂಗ್ ವಿರಾಮಗೊಂಡಿದೆ',
    'recording.ready': 'ಮೇಲ್ವಿಚಾರಣೆ ಪ್ರಾರಂಭಿಸಲು ಬಟನ್ ಒತ್ತಿ',
    
    'risk.low': 'ಕಡಿಮೆ ಅಪಾಯ',
    'risk.medium': 'ಮಧ್ಯಮ ಅಪಾಯ',
    'risk.high': 'ಹೆಚ್ಚಿನ ಅಪಾಯ',
    'risk.analyzing': 'ವಿಶ್ಲೇಷಿಸುತ್ತಿದ್ದೇನೆ...',
    'risk.score': 'ಅಪಾಯ ಸ್ಕೋರ್',
    
    'footer.tagline': 'ಸ್ಕ್ಯಾಮ್‌ಗಾರ್ಡ್ - ಫೋನ್ ವಂಚನೆಗಳಿಂದ ನಿಮ್ಮನ್ನು ರಕ್ಷಿಸುತ್ತದೆ',
    'footer.privacy': 'ನಿಮ್ಮ ಗೋಪ್ಯತೆ ಮುಖ್ಯ. ಆಡಿಯೋ ಸುರಕ್ಷಿತವಾಗಿ ಪ್ರಕ್ರಿಯೆಗೊಳ್ಳುತ್ತದೆ.',
    
    'ready.title': 'ನಿಮ್ಮನ್ನು ರಕ್ಷಿಸಲು ಸಿದ್ಧ',
    'ready.description': 'ನೈಜ ಸಮಯದಲ್ಲಿ ಸ್ಕ್ಯಾಮ್ ಕರೆಗಳನ್ನು ಪತ್ತೆ ಮಾಡಲು ಮೇಲ್ವಿಚಾರಣೆ ಪ್ರಾರಂಭಿಸಿ',
    'language': 'ಭಾಷೆ',
  },
  ml: {
    'app.name': 'സ്കാംഗാർഡ്',
    'app.tagline': 'നിങ്ങളുടെ കോളുകൾ സംരക്ഷിക്കുക',
    'nav.monitor': 'നിരീക്ഷണം',
    'nav.history': 'ചരിത്രം',
    'nav.help': 'സഹായം',
    
    'recording.start': 'നിരീക്ഷണം ആരംഭിക്കുക',
    'recording.stop': 'നിർത്തുക',
    'recording.pause': 'താൽക്കാലികമായി നിർത്തുക',
    'recording.resume': 'തുടരുക',
    'recording.upload': 'റെക്കോർഡിംഗ് അപ്‌ലോഡ് ചെയ്യുക',
    'recording.listening': 'കേൾക്കുന്നു, വിശകലനം ചെയ്യുന്നു...',
    'recording.paused': 'റെക്കോർഡിംഗ് താൽക്കാലികമായി നിർത്തി',
    'recording.ready': 'നിരീക്ഷണം ആരംഭിക്കാൻ ബട്ടൺ അമർത്തുക',
    
    'risk.low': 'കുറഞ്ഞ അപകടസാധ്യത',
    'risk.medium': 'ഇടത്തരം അപകടസാധ്യത',
    'risk.high': 'ഉയർന്ന അപകടസാധ്യത',
    'risk.analyzing': 'വിശകലനം ചെയ്യുന്നു...',
    'risk.score': 'അപകട സ്കോർ',
    
    'footer.tagline': 'സ്കാംഗാർഡ് - ഫോൺ തട്ടിപ്പുകളിൽ നിന്ന് നിങ്ങളെ സംരക്ഷിക്കുന്നു',
    'footer.privacy': 'നിങ്ങളുടെ സ്വകാര്യത പ്രധാനമാണ്. ഓഡിയോ സുരക്ഷിതമായി പ്രോസസ്സ് ചെയ്യുന്നു.',
    
    'ready.title': 'നിങ്ങളെ സംരക്ഷിക്കാൻ തയ്യാർ',
    'ready.description': 'തത്സമയം സ്കാം കോളുകൾ കണ്ടെത്താൻ നിരീക്ഷണം ആരംഭിക്കുക',
    'language': 'ഭാഷ',
  },
};

// Fill missing translations with English fallback
Object.keys(translations).forEach((lang) => {
  if (lang !== 'en') {
    Object.keys(translations.en).forEach((key) => {
      if (!translations[lang as Language][key]) {
        translations[lang as Language][key] = translations.en[key];
      }
    });
  }
});

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>(() => {
    const saved = localStorage.getItem('scamguard-language');
    return (saved as Language) || 'en';
  });

  const setLanguage = useCallback((lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('scamguard-language', lang);
  }, []);

  const t = useCallback((key: string): string => {
    return translations[language][key] || translations.en[key] || key;
  }, [language]);

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t, languageNames }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
