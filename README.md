## 📄 README.md – Detailed Guidelines & Template

## Problem Statement
Voice-based scams are increasing rapidly, where fraudsters manipulate users during live phone calls using impersonation, urgency, and emotional pressure. Vulnerable groups such as elderly individuals, digitally unaware users, and first-time internet adopters are most affected. Existing fraud detection systems work post-transaction or rely on text-based signals, providing little to no protection during live calls where most financial and emotional damage occurs. This project addresses this problem by developing an AI-powered, real-time audio fraud detection system that monitors live phone calls, identifies scam patterns, and alerts users immediately to prevent financial and emotional harm.

## Project Name
Real-Time Audio Fraud Detection for Scam Prevention

## Team Name
Team TechnoMinds 

## Deployed Link

🔗 https://your-app-link.com

## Demonstration Video Link

🎥 https://drive.google.com/your-demo-video-link

## PPT Link

📊 https://drive.google.com/your-ppt-link


## 📌 Project Overview
This project is a web-based application that leverages AI to detect scam calls in real time. The system analyzes live audio (from microphone or uploaded recordings) to detect indicators such as impersonation, urgency, emotional manipulation, authority pressure, repeated OTP/money requests, and suspicious voice patterns (tone, stress, pitch). Users receive immediate alerts and guidance during calls, helping prevent fraud before damage occurs. The application is especially designed for elderly and digitally unaware users with a simple, user-friendly interface.

## Key Features:
- Real-time audio analysis of phone calls
- Scam risk score (Low / Medium / High)
- Instant alerts and guidance during suspicious calls
- Multilingual support and adaptive learning
- Privacy-preserving on-device or encrypted processing
- Emergency contact notifications

## Setup and Installation Instructions

   # Prerequisites:
   - Node.js (if using React frontend)
   - Browser with microphone access

   Steps to Run Locally:

Clone the Repository

git clone https://github.com/your-repo-name.git
cd your-repo-name


Install dependencies (if using npm/yarn build)

npm install
# or
yarn install


Run the App

For pure HTML/CSS/JS/TypeScript:

Open index.html in your browser

Make sure the JSON config file is in the correct folder

Microphone access must be allowed for live detection

If using a build tool (Vite / Parcel / Webpack / Node):

npm run dev


Open the local URL shown in console (usually http://localhost:5173 or similar)

Test the App

Click “Start Listening” for live audio

Or upload a sample audio file (scam_call_sample.wav / normal_call_sample.wav)

Check the scam risk score and alerts

## Access the Web App:

Open http://localhost:3000 (React) in your browser

Allow microphone access when prompted

## Usage Instructions
1. Open the web app in your browser
2. Allow microphone access
3. Click “Start Listening” for live audio or upload a recorded call
4. Speak or play scam audio
5. View real-time scam risk level and alerts
5. Follow guidance (e.g., do not share OTP, end call)

## Screenshots

Home Page:


Live Audio Detection:


Scam Alert & Guidance:


Dashboard / Risk Score:

## Technology Stack
-  Frontend: HTML, CSS, JavaScript, TypeScript, Tailwind CSS
-  Configuration: JSON files for settings / scam patterns
-  Real-Time: Web Audio API / Browser microphone access
-  AI/ML: WebAssembly or Cloud API (optional for real-time analysis)

## Privacy & Ethics
1. Audio is processed only with user consent
2. No permanent storage of call recordings without permission
3. Encrypted communication for all data transmissions

## Future Enhancements
- Integration with telecom providers for live call detection
- Female/male voice models for better accuracy
- Deepfake and voice-clone scam detection
- Offline AI processing for low-end devices
