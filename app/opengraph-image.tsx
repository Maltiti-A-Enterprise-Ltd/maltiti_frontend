import { ImageResponse } from 'next/og';

export const runtime = 'edge';

export const alt = 'Maltiti A. Enterprise Ltd - Organic Shea Butter & Natural Products';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default function Image(): ImageResponse {
  return new ImageResponse(
    <div
      style={{
        background: 'linear-gradient(135deg, #3d2314 0%, #5A4036 40%, #0F6938 100%)',
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: 'sans-serif',
        position: 'relative',
      }}
    >
      {/* Background texture circles */}
      <div
        style={{
          position: 'absolute',
          top: -80,
          right: -80,
          width: 400,
          height: 400,
          borderRadius: '50%',
          background: 'rgba(255,255,255,0.05)',
        }}
      />
      <div
        style={{
          position: 'absolute',
          bottom: -60,
          left: -60,
          width: 300,
          height: 300,
          borderRadius: '50%',
          background: 'rgba(255,255,255,0.04)',
        }}
      />

      {/* Logo area */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: 32,
        }}
      >
        <div
          style={{
            width: 80,
            height: 80,
            borderRadius: '50%',
            background: 'rgba(255,255,255,0.15)',
            border: '3px solid rgba(255,255,255,0.4)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 40,
          }}
        >
          🌿
        </div>
      </div>

      {/* Brand name */}
      <div
        style={{
          fontSize: 56,
          fontWeight: 800,
          color: '#ffffff',
          letterSpacing: '-1px',
          textAlign: 'center',
          marginBottom: 16,
          textShadow: '0 2px 12px rgba(0,0,0,0.3)',
        }}
      >
        Maltiti A. Enterprise
      </div>

      {/* Tagline */}
      <div
        style={{
          fontSize: 26,
          color: 'rgba(255,255,255,0.85)',
          textAlign: 'center',
          maxWidth: 700,
          lineHeight: 1.4,
          marginBottom: 40,
        }}
      >
        Organic Shea Butter & Natural Products
      </div>

      {/* Badge row */}
      <div
        style={{
          display: 'flex',
          gap: 16,
        }}
      >
        {['🌱 Ethically Sourced', '🇬🇭 Made in Ghana', '✨ Premium Quality'].map((badge) => (
          <div
            key={badge}
            style={{
              background: 'rgba(255,255,255,0.15)',
              border: '1px solid rgba(255,255,255,0.3)',
              borderRadius: 100,
              padding: '8px 20px',
              fontSize: 18,
              color: '#ffffff',
            }}
          >
            {badge}
          </div>
        ))}
      </div>

      {/* Domain */}
      <div
        style={{
          position: 'absolute',
          bottom: 32,
          fontSize: 18,
          color: 'rgba(255,255,255,0.55)',
        }}
      >
        maltitiaenterprise.com
      </div>
    </div>,
    {
      ...size,
    },
  );
}
