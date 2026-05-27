function ErrorMessage({ message }) {
  if (!message) return null;

  return (
    <div className="flex items-start gap-3 bg-red-950 border border-red-800 rounded-xl px-4 py-3">
      <svg
        className="w-4 h-4 text-red-400 mt-0.5 shrink-0"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M12 9v2m0 4h.01M12 3a9 9 0 100 18A9 9 0 0012 3z"
        />
      </svg>
      <p className="text-red-400 text-sm">{message}</p>
    </div>
  );
}

export default ErrorMessage;
