import {
  SignedIn,
  SignedOut,
  SignInButton,
  SignUpButton,
} from "@clerk/clerk-react";

function AuthWrapper({ children }) {
  return (
    <>
      <SignedIn>{children}</SignedIn>
      <SignedOut>
        <div className="min-h-screen bg-gray-950 flex">
          {/* Left Panel */}
          <div className="hidden lg:flex flex-col justify-between w-1/2 bg-gradient-to-br from-blue-950 via-gray-900 to-gray-950 p-12 border-r border-gray-800">
            <div className="flex items-center gap-3">
              <img src="/Logo.svg" alt="SpeechText" className="w-9 h-9" />
              <span className="text-white font-bold text-xl">SpeechText</span>
            </div>

            <div>
              <h1 className="text-4xl font-extrabold text-white leading-tight mb-4">
                Turn your voice into
                <br />
                <span className="text-blue-400">text instantly.</span>
              </h1>
              <p className="text-gray-400 text-base leading-relaxed mb-8">
                Upload audio files or record directly in your browser. Powered
                by Deepgram's Nova-2 model for industry-leading accuracy.
              </p>

              <div className="flex flex-col gap-4">
                {[
                  {
                    icon: "🎙️",
                    title: "Live Transcription",
                    desc: "Real-time subtitles as you speak",
                  },
                  {
                    icon: "📁",
                    title: "File Upload",
                    desc: "MP3, WAV, WEBM and more",
                  },
                  {
                    icon: "📜",
                    title: "History",
                    desc: "All your transcriptions saved securely",
                  },
                ].map((f) => (
                  <div key={f.title} className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-xl bg-gray-800 flex items-center justify-center text-lg shrink-0">
                      {f.icon}
                    </div>
                    <div>
                      <p className="text-white text-sm font-semibold">
                        {f.title}
                      </p>
                      <p className="text-gray-500 text-xs">{f.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <p className="text-gray-400 text-xs">
              © 2026 SpeechText.
            </p>
          </div>

          {/* Right Panel */}
          <div className="flex flex-col items-center justify-center w-full lg:w-1/2 px-8">
            <div className="w-full max-w-sm">
              {/* Mobile logo */}
              <div className="flex items-center gap-2 justify-center mb-10 lg:hidden">
                <img src="/Logo.svg" alt="SpeechText" className="w-8 h-8" />
                <span className="text-white font-bold text-lg">SpeechText</span>
              </div>

              <h2 className="text-3xl font-bold text-white mb-2">
                Welcome back
              </h2>
              <p className="text-gray-500 text-sm mb-8">
                Sign in to your account to continue
              </p>

              <div className="flex flex-col gap-3">
                <SignInButton mode="modal">
                  <button className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold transition text-sm">
                    Sign In
                  </button>
                </SignInButton>

                <div className="flex items-center gap-3 my-1">
                  <div className="flex-1 h-px bg-gray-800"></div>
                  <span className="text-gray-600 text-xs">or</span>
                  <div className="flex-1 h-px bg-gray-800"></div>
                </div>

                <SignUpButton mode="modal">
                  <button className="w-full py-3 bg-transparent border border-gray-700 hover:border-gray-500 text-gray-300 hover:text-white rounded-xl font-semibold transition text-sm">
                    Create Account
                  </button>
                </SignUpButton>
              </div>
            </div>
          </div>
        </div>
      </SignedOut>
    </>
  );
}

export default AuthWrapper;
