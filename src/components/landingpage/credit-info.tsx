export default function CreditInfo({ credit }: { credit: string }) {
  return (
    <div className="px-3 py-1.5 bg-gradient-to-r from-gray-50 to-gray-100 rounded-md shadow-sm">
      {credit && credit !== "" ? (
        <p className="text-sm text-gray-700 flex items-center gap-2">
          <span>You have</span>
          <span className="font-bold text-indigo-600 px-1">
            {credit}
          </span>
          <span>remaining credits</span>
        </p>
      ) : (
        <p className="text-sm text-red-600 flex items-center gap-2">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
              clipRule="evenodd"
            />
          </svg>
          Please sign in to use this feature
        </p>
      )}
    </div>
  );
}
