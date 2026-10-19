import React, { useState } from 'react';
import { ASSETS } from '../assets/images';

export interface AgriTradeLogoProps {
  size?: number;
  className?: string;
  variant?: 'full' | 'emblem-only' | 'wordmark-only';
  theme?: 'dark' | 'light' | 'monochrome';
  accent?: 'green' | 'amber';
  showContainer?: boolean;
}

/**
 * Official Universal AgriTrade Brand Logo
 * 
 * Emblem design:
 * - Single outer agricultural green circle
 * - 3 agricultural leaves emerging upward (central pointed leaf with curved negative space vein, flanked by left and right angled leaves)
 * - Layered agricultural field furrows sweeping across the lower section within the circle
 */
export const AgriTradeLogo: React.FC<AgriTradeLogoProps> = ({
  size = 40,
  className = '',
  variant = 'full',
  theme = 'light'
}) => {
  const [imgError, setImgError] = useState(false);

  const primaryGreen = theme === 'dark' ? '#4ade80' : '#166534';
  const textColor = theme === 'dark' ? '#f8fafc' : '#0f172a';

  // SVG Fallback: Single outer circle + Leaves + Field Furrows
  const emblemSvg = (
    <svg
      width={size}
      height={size}
      viewBox="0 0 500 500"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="shrink-0 transition-transform select-none rounded-full"
      aria-label="AgriTrade Official Logo"
    >
      {/* Single Outer Circle */}
      <circle cx="250" cy="250" r="230" stroke="#166534" strokeWidth="24" fill="#FFFFFF" />

      {/* Inner clipping path to keep furrows neatly inside the single circle */}
      <defs>
        <clipPath id="singleCircleClip">
          <circle cx="250" cy="250" r="218" />
        </clipPath>
      </defs>

      <g clipPath="url(#singleCircleClip)">
        {/* Central Upright Leaf */}
        <path
          d="M250 105C250 105 195 192 195 264C195 295 214 315 250 315C286 315 305 295 305 264C305 192 250 105 250 105Z"
          fill="#166534"
        />
        {/* Central Leaf Inner Negative-Space White Vein */}
        <path
          d="M248 170C232 202 226 242 248 305C238 288 232 248 248 170Z"
          fill="#FFFFFF"
        />

        {/* Left Outward Leaf */}
        <path
          d="M95 224C135 238 186 268 204 340C170 340 140 318 95 224Z"
          fill="#166534"
        />

        {/* Right Outward Leaf */}
        <path
          d="M405 224C365 238 314 268 296 340C330 340 360 318 405 224Z"
          fill="#166534"
        />

        {/* Upper Vibrant Green Field Furrow Band */}
        <path
          d="M112 372C148 348 230 318 382 334C330 342 198 376 138 416L112 372Z"
          fill="#4ADE80"
        />

        {/* Middle Green Field Furrow Band */}
        <path
          d="M150 418C210 378 300 348 396 338C370 348 260 395 204 444L150 418Z"
          fill="#22C55E"
        />

        {/* Lower Deep Forest Green Field Furrow Band */}
        <path
          d="M220 448C274 402 362 354 402 340C400 392 348 456 270 472L220 448Z"
          fill="#166534"
        />
      </g>
    </svg>
  );

  const emblemDisplay = (
    <div
      style={{ width: `${size}px`, height: `${size}px` }}
      className="relative shrink-0 select-none flex items-center justify-center rounded-full overflow-hidden"
    >
      {!imgError && ASSETS.logo ? (
        <img
          src={ASSETS.logo}
          alt="AgriTrade Emblem"
          className="w-full h-full object-contain rounded-full"
          onError={() => setImgError(true)}
          loading="eager"
        />
      ) : (
        emblemSvg
      )}
    </div>
  );

  if (variant === 'emblem-only') {
    return (
      <div className={`inline-flex items-center justify-center ${className}`}>
        {emblemDisplay}
      </div>
    );
  }

  const wordmark = (
    <div className="flex flex-col select-none leading-none">
      <div className="flex items-baseline tracking-tight font-black">
        <span style={{ color: primaryGreen, fontSize: `${Math.round(size * 0.52)}px` }}>
          Agri
        </span>
        <span style={{ color: textColor, fontSize: `${Math.round(size * 0.52)}px` }}>
          Trade
        </span>
      </div>
    </div>
  );

  if (variant === 'wordmark-only') {
    return (
      <div className={`inline-flex items-center ${className}`}>
        {wordmark}
      </div>
    );
  }

  return (
    <div className={`inline-flex items-center gap-2.5 ${className}`}>
      {emblemDisplay}
      {wordmark}
    </div>
  );
};

/**
 * Clean SVG strings with single circle
 */
export const AGRITRADE_OFFICIAL_EMBLEM_SVG = `<svg width="512" height="512" viewBox="0 0 500 500" fill="none" xmlns="http://www.w3.org/2000/svg">
  <circle cx="250" cy="250" r="230" stroke="#166534" stroke-width="24" fill="#FFFFFF"/>
  <defs>
    <clipPath id="singleCircleClip">
      <circle cx="250" cy="250" r="218" />
    </clipPath>
  </defs>
  <g clip-path="url(#singleCircleClip)">
    <path d="M250 105C250 105 195 192 195 264C195 295 214 315 250 315C286 315 305 295 305 264C305 192 250 105 250 105Z" fill="#166534"/>
    <path d="M248 170C232 202 226 242 248 305C238 288 232 248 248 170Z" fill="#FFFFFF"/>
    <path d="M95 224C135 238 186 268 204 340C170 340 140 318 95 224Z" fill="#166534"/>
    <path d="M405 224C365 238 314 268 296 340C330 340 360 318 405 224Z" fill="#166534"/>
    <path d="M112 372C148 348 230 318 382 334C330 342 198 376 138 416L112 372Z" fill="#4ADE80"/>
    <path d="M150 418C210 378 300 348 396 338C370 348 260 395 204 444L150 418Z" fill="#22C55E"/>
    <path d="M220 448C274 402 362 354 402 340C400 392 348 456 270 472L220 448Z" fill="#166534"/>
  </g>
</svg>`;

export const AGRITRADE_PLAY_STORE_ICON_SVG = `<svg width="512" height="512" viewBox="0 0 512 512" fill="none" xmlns="http://www.w3.org/2000/svg">
  <rect width="512" height="512" fill="#14532D"/>
  <g transform="translate(64, 64) scale(0.768)">
    <circle cx="250" cy="250" r="230" stroke="#FFFFFF" stroke-width="24" fill="#FFFFFF"/>
    <defs>
      <clipPath id="psCircleInnerClip">
        <circle cx="250" cy="250" r="218" />
      </clipPath>
    </defs>
    <g clip-path="url(#psCircleInnerClip)">
      <path d="M250 105C250 105 195 192 195 264C195 295 214 315 250 315C286 315 305 295 305 264C305 192 250 105 250 105Z" fill="#166534"/>
      <path d="M248 170C232 202 226 242 248 305C238 288 232 248 248 170Z" fill="#FFFFFF"/>
      <path d="M95 224C135 238 186 268 204 340C170 340 140 318 95 224Z" fill="#166534"/>
      <path d="M405 224C365 238 314 268 296 340C330 340 360 318 405 224Z" fill="#166534"/>
      <path d="M112 372C148 348 230 318 382 334C330 342 198 376 138 416L112 372Z" fill="#4ADE80"/>
      <path d="M150 418C210 378 300 348 396 338C370 348 260 395 204 444L150 418Z" fill="#22C55E"/>
      <path d="M220 448C274 402 362 354 402 340C400 392 348 456 270 472L220 448Z" fill="#166534"/>
    </g>
  </g>
</svg>`;
