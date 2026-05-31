# SpeechText — Speech to Text App

A full-stack web application that converts audio to text using AI. Built with the MERN stack, Supabase, Clerk authentication, and Deepgram's Nova-2 speech recognition model.

## Live Demo

- **Frontend:** https://speech-to-text-ochre.vercel.app
- **Backend:** https://speech-to-text-backend-ieec.onrender.com

## Features

- Upload audio files (MP3, WAV, WEBM, OGG) and get instant transcriptions
- Record audio directly in the browser
- Live real-time transcription with subtitle-style display
- Transcription history saved per user
- Secure authentication with Clerk
- Fully deployed and production ready

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React, Vite, Tailwind CSS |
| Backend | Node.js, Express.js |
| Database | Supabase (PostgreSQL) |
| Auth | Clerk |
| Speech-to-Text | Deepgram Nova-2 |
| File Upload | Multer |
| Real-time | WebSockets |
| Deployment | Vercel (frontend), Render (backend) |

## Project Structure
```
speech-to-text/
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   ├── pages/          # Page components
│   │   ├── hooks/          # Custom React hooks
│   │   ├── api.js          # Axios instance
│   │   └── App.jsx         # Main app with routing
│   └── .env                # Frontend environment variables
├── server/                 # Express backend
│   ├── routes/             # API routes
│   ├── middleware/         # Auth middleware
│   ├── uploads/            # Temp audio storage
│   ├── deepgram.js         # Deepgram client
│   ├── supabase.js         # Supabase client
│   ├── liveTranscription.js # WebSocket handler
│   └── index.js            # Server entry point
└── README.md
```

## Local Setup

### Prerequisites
- Node.js v18+
- A Supabase account
- A Deepgram account
- A Clerk account

### 1. Clone the repository

```bash
git clone https://github.com/SaharshPatel2112/speech-to-text.git
cd speech-to-text
```

### 2. Backend setup

```bash
cd server
npm install
```

Create `server/.env`:

```
SUPABASE_URL=your_supabase_url
SUPABASE_ANON_KEY=your_supabase_anon_key
DEEPGRAM_API_KEY=your_deepgram_api_key
CLERK_SECRET_KEY=your_clerk_secret_key
PORT=5000
```
Start the backend:

```bash
npm run dev
```

### 3. Frontend setup

```bash
cd client
npm install
```

Create `client/.env`:

```
VITE_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
VITE_API_URL=http://localhost:5000/api
VITE_WS_URL=ws://localhost:5000/live
```

Start the frontend:

```bash
npm run dev
```

### 4. Supabase table setup

Run this in your Supabase SQL editor:

```sql
CREATE TABLE transcriptions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id TEXT,
  filename TEXT NOT NULL,
  transcription TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE POLICY "Users can manage own transcriptions" ON transcriptions
FOR ALL
USING (true)
WITH CHECK (true);
```

## API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| POST | /api/upload | Upload audio and get transcription |
| GET | /api/transcriptions | Get user's transcription history |
| WS | /live | WebSocket for live transcription |

## Deployment

- **Frontend** deployed on Vercel with environment variables set in dashboard
- **Backend** deployed on Render with environment variables set in dashboard

## Author

Saharsh Patel — [GitHub](https://github.com/SaharshPatel2112)
