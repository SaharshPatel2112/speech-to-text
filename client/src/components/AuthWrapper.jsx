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
        <div className="min-h-screen bg-gray-950 flex items-center justify-center">
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-10 max-w-md w-full mx-4 text-center">
            <img
              src="/Logo.svg"
              alt="SpeechText"
              className="w-16 h-16 mx-auto mb-6"
            />
            <h1 className="text-2xl font-bold text-white mb-2">
              Welcome to SpeechText
            </h1>
            <p className="text-gray-400 text-sm mb-8">
              Sign in to start transcribing your audio files
            </p>
            <div className="flex flex-col gap-3">
              <SignInButton mode="modal">
                <button className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold transition">
                  Sign In
                </button>
              </SignInButton>
              <SignUpButton mode="modal">
                <button className="w-full py-3 bg-gray-800 hover:bg-gray-700 text-white rounded-xl font-semibold transition">
                  Create Account
                </button>
              </SignUpButton>
            </div>
          </div>
        </div>
      </SignedOut>
    </>
  );
}

export default AuthWrapper;
