import { ImageResponse } from 'next/og';

export const runtime = 'edge';

export const alt = 'Neolife Odontologia - Dentista no Brasil para Brasileiros no Exterior';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          background: 'linear-gradient(135deg, #008575 0%, #006B5F 50%, #004D44 100%)',
          fontFamily: 'sans-serif',
        }}
      >
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            padding: '60px',
            maxWidth: '900px',
          }}
        >
          <div
            style={{
              fontSize: 28,
              color: 'rgba(255,255,255,0.7)',
              letterSpacing: '6px',
              textTransform: 'uppercase',
              marginBottom: '20px',
              fontWeight: 600,
            }}
          >
            Neolife Odontologia
          </div>
          <div
            style={{
              fontSize: 52,
              fontWeight: 800,
              color: 'white',
              textAlign: 'center',
              lineHeight: 1.2,
              marginBottom: '24px',
            }}
          >
            Dentista no Brasil para Brasileiros no Exterior
          </div>
          <div
            style={{
              fontSize: 22,
              color: 'rgba(255,255,255,0.8)',
              textAlign: 'center',
              lineHeight: 1.5,
              maxWidth: '700px',
            }}
          >
            Reabilitação oral, lentes de porcelana e implantes com planejamento digital prévio. Tudo organizado à distância.
          </div>
          <div
            style={{
              display: 'flex',
              gap: '12px',
              marginTop: '40px',
              alignItems: 'center',
            }}
          >
            <div
              style={{
                padding: '12px 32px',
                background: 'rgba(255,255,255,0.15)',
                borderRadius: '50px',
                color: 'white',
                fontSize: 18,
                fontWeight: 600,
                border: '1px solid rgba(255,255,255,0.3)',
              }}
            >
              dentistanobrasil.com.br
            </div>
          </div>
        </div>
      </div>
    ),
    { ...size }
  );
}
