'use client'

import React, { useState } from 'react'

interface KingsChatLogoProps {
  size?: number | string
  className?: string
}

export function KingsChatLogo({ size = 24, className = '' }: KingsChatLogoProps) {
  const [imgError, setImgError] = useState(false)

  return (
    <span
      className={`relative inline-flex items-center justify-center flex-shrink-0 ${className}`}
      style={{ width: size, height: size }}
    >
      {!imgError ? (
        <img
          src="/kingschat-logo.png"
          alt="KingsChat"
          className="w-full h-full object-contain rounded-md"
          onError={() => setImgError(true)}
        />
      ) : (
        <svg
          viewBox="0 0 40 40"
          className="w-full h-full rounded-xl"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <rect width="40" height="40" rx="10" fill="#0077FF" />
          {/* Speech bubble */}
          <path
            d="M9 25.5V14.5C9 11.462 11.462 9 14.5 9H25.5C28.538 9 31 11.462 31 14.5V23.5C31 26.538 28.538 29 25.5 29H13.8L9 32.5V25.5Z"
            fill="white"
          />
          {/* Crown inside bubble */}
          <path
            d="M13.5 23.5L15 17.5L18 21.2L20 15.5L22 21.2L25 17.5L26.5 23.5H13.5Z"
            fill="#0077FF"
          />
          <circle cx="15" cy="16.5" r="1.1" fill="#FFB703" />
          <circle cx="20" cy="14.5" r="1.2" fill="#FFB703" />
          <circle cx="25" cy="16.5" r="1.1" fill="#FFB703" />
        </svg>
      )}
    </span>
  )
}
