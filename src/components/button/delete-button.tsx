import React from 'react';

interface DeleteButtonProps {
  onClick: (e: React.MouseEvent<HTMLButtonElement>) => void;
  className?: string;
}

export default function DeleteButton({ onClick, className = '' }: DeleteButtonProps) {
  return (
    <button
      onClick={(e) => {
        e.preventDefault();
        onClick(e);
      }}
      className={`absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 ${className}`}
    >
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
      </svg>
    </button>
  );
}