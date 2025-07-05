# AI Mock Interviews - Voice-Powered Interview Practice Platform

A Next.js application that provides AI-powered mock interviews with real-time voice interaction, instant feedback, and comprehensive scoring. Practice technical, behavioral, and mixed interviews with personalized feedback based on your actual performance.

## 🚀 Features

### Core Functionality
- **Voice-Powered Interviews**: Real-time voice conversations with AI interviewers
- **Multiple Interview Types**: Technical, Behavioral, and Mixed interviews
- **Dynamic Question Generation**: AI-generated questions based on role and tech stack
- **Instant Feedback**: Comprehensive scoring and detailed feedback after each interview
- **Performance-Based Analysis**: Strengths and areas for improvement based on actual responses

### Interview System
- **Static Company Interviews**: Pre-configured interviews for top tech companies (Google, Netflix, etc.)
- **Custom Interviews**: Create personalized interviews with specific roles and tech stacks
- **Question Filtering**: Questions filtered strictly by interview type (Technical/Behavioral/Mixed)
- **Real-time Transcription**: Powered by Deepgram for accurate speech-to-text

### Feedback & Scoring
- **5-Category Scoring**: Technical Knowledge, Problem Solving, Communication Skills, Leadership & Teamwork, Adaptability & Learning
- **Performance-Based Feedback**: Strengths and areas for improvement based on actual responses
- **Total Score**: Overall score out of 100 displayed on interview cards
- **Detailed Breakdown**: Category-wise scores with specific comments

### User Experience
- **Interview History**: Track all completed interviews with scores
- **Preparation Guide**: Comprehensive tips and behavioral questions guide
- **Reset Functionality**: Clear interview history when needed
- **Responsive Design**: Works seamlessly on desktop and mobile devices

## 🛠️ Tech Stack

- **Frontend**: Next.js 15, React, TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes, Firebase Admin SDK
- **Database**: Firestore (Firebase)
- **Authentication**: Firebase Authentication
- **Voice AI**: Vapi.ai for real-time voice conversations
- **AI Feedback**: Google Generative AI (Gemini) for interview analysis
- **Transcription**: Deepgram for speech-to-text
- **Deployment**: Vercel (recommended)

## 📋 Prerequisites

- Node.js 18+ 
- npm or yarn
- Firebase project
- Vapi.ai account
- Google Generative AI API key
- Deepgram account (for transcription)

## 🔧 Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd ai_mock_interviews
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   Create a `.env.local` file in the root directory:
   ```env
   # Firebase Configuration
   FIREBASE_PROJECT_ID=your-project-id
   FIREBASE_CLIENT_EMAIL=your-client-email
   FIREBASE_PRIVATE_KEY="your-private-key"
   NEXT_PUBLIC_FIREBASE_API_KEY=your-api-key
   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
   NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
   NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
   NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your-sender-id
   NEXT_PUBLIC_FIREBASE_APP_ID=your-app-id

   # Vapi.ai Configuration
   NEXT_PUBLIC_VAPI_WEB_TOKEN=your-vapi-web-token
   NEXT_PUBLIC_VAPI_ASSISTANT_ID=your-assistant-id

   # Google Generative AI
   GOOGLE_GENERATIVE_AI_API_KEY=your-gemini-api-key

   # Deepgram (for transcription)
   DEEPGRAM_API_KEY=your-deepgram-api-key
   ```

4. **Firebase Setup**
   - Create a Firebase project
   - Enable Authentication (Email/Password)
   - Create a Firestore database
   - Download service account key and add to environment variables
   - Set up Firestore security rules

5. **Vapi.ai Setup**
   - Create a Vapi.ai account
   - Generate web token
   - Create assistant or use dynamic assistant configuration

6. **Run the development server**
   ```bash
   npm run dev
   ```

## 🏗️ Project Structure

```
ai_mock_interviews/
├── app/                          # Next.js app directory
│   ├── (auth)/                   # Authentication pages
│   ├── (root)/                   # Main application pages
│   │   ├── interview/            # Interview pages
│   │   │   ├── [id]/            # Dynamic interview pages
│   │   │   └── static/          # Static company interviews
│   │   ├── prepare/             # Preparation guide
│   │   └── reset/               # Reset functionality
│   └── api/                     # API routes
├── components/                   # React components
│   ├── ui/                      # UI components (shadcn/ui)
│   ├── Agent.tsx               # Voice interview agent
│   ├── InterviewCard.tsx       # Interview display cards
│   └── ...
├── lib/                         # Utility libraries
│   ├── actions/                 # Server actions
│   ├── utils.ts                # Helper functions
│   └── vapi.sdk.ts            # Vapi.ai integration
├── constants/                   # Application constants
├── types/                      # TypeScript type definitions
└── firebase/                   # Firebase configuration
```

## 🎯 Usage

### Starting an Interview

1. **Navigate to Home Page**: Visit the main dashboard
2. **Choose Interview Type**:
   - **Static Companies**: Click on company cards (Google, Netflix, etc.)
   - **Custom Interview**: Click "Create Custom Interview"
   - **Available Interviews**: Take interviews from other users

3. **Interview Process**:
   - Click "View Interview" to start
   - Allow microphone access
   - Speak clearly and answer questions
   - Click "Disconnect" when finished

### Understanding Feedback

After completing an interview, you'll receive:

- **Overall Score**: Total score out of 100
- **Category Scores**: Individual scores for each assessment area
- **Strengths**: What you did well based on your responses
- **Areas for Improvement**: Specific areas to focus on
- **Final Assessment**: Comprehensive evaluation

### Interview Types

- **Technical**: Focus on programming skills, algorithms, system design
- **Behavioral**: Assess soft skills, past experiences, STAR method
- **Mixed**: Combination of technical and behavioral questions

## 🚀 Deployment

### Vercel Deployment (Recommended)

1. **Push to GitHub**
   ```bash
   git add .
   git commit -m "Ready for deployment"
   git push origin main
   ```

2. **Deploy on Vercel**
   - Connect your GitHub repository to Vercel
   - Add all environment variables in Vercel dashboard
   - Deploy automatically

3. **Environment Variables in Vercel**
   - Go to Project Settings → Environment Variables
   - Add all variables from `.env.local`
   - Ensure production environment is selected

### Manual Deployment

1. **Build the application**
   ```bash
   npm run build
   ```

2. **Start production server**
   ```bash
   npm start
   ```

## 🔒 Security Considerations

- All API keys are stored as environment variables
- Firebase security rules protect database access
- User authentication required for all interview features
- Voice data is processed securely through Vapi.ai

## 🐛 Troubleshooting

### Common Issues

1. **Firebase Connection Errors**
   - Verify service account credentials
   - Check Firestore security rules
   - Ensure project ID matches

2. **Voice Interview Issues**
   - Check microphone permissions
   - Verify Vapi.ai token is valid
   - Ensure stable internet connection

3. **Feedback Generation Errors**
   - Verify Google Generative AI API key
   - Check API quota limits
   - Review transcript quality

4. **Authentication Issues**
   - Clear browser cookies
   - Verify Firebase Auth configuration
   - Check domain whitelist

### Network Issues
If experiencing connectivity issues:
- Check firewall settings
- Verify DNS configuration
- Try different network connection

## 📝 API Reference

### Key Endpoints

- `POST /api/vapi/generate` - Generate interview questions
- `GET /interview/[id]` - Get interview details
- `GET /interview/[id]/feedback` - Get interview feedback

### Data Models

```typescript
interface Interview {
  id: string;
  userId: string;
  role: string;
  type: string;
  techstack: string[];
  questions?: string[];
  finalized: boolean;
  createdAt: string;
}

interface Feedback {
  id: string;
  interviewId: string;
  userId: string;
  totalScore: number;
  categoryScores: CategoryScore[];
  strengths: string[];
  areasForImprovement: string[];
  finalAssessment: string;
  createdAt: string;
}
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

For support and questions:
- Create an issue in the GitHub repository
- Check the troubleshooting section
- Review Firebase and Vapi.ai documentation

## 🎉 Acknowledgments

- [Vapi.ai](https://vapi.ai) for voice AI capabilities
- [Firebase](https://firebase.google.com) for backend services
- [Google Generative AI](https://ai.google.dev/) for feedback generation
- [Next.js](https://nextjs.org/) for the framework
- [Tailwind CSS](https://tailwindcss.com/) for styling

---

**Built with ❤️ for better interview preparation** 
