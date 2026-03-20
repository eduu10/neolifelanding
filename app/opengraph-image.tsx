import { ImageResponse } from 'next/og';
import { readFile } from 'node:fs/promises';
import { join } from 'node:path';

export const runtime = 'nodejs';

export const alt = 'Neolife Odontologia - Dentista no Brasil para Brasileiros no Exterior';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default async function Image() {
  const imgPath = join(process.cwd(), 'public', 'bghero.jpg');
  const imgData = await readFile(imgPath);
  const imgBase64 = `data:image/jpeg;base64,${imgData.toString('base64')}`;

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          position: 'relative',
        }}
      >
        <img
          src={imgBase64}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
          }}
        />
        <div
          style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'flex-end',
            padding: '40px 50px',
            background: 'linear-gradient(to top, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0) 100%)',
            height: '60%',
          }}
        >
          <div
            style={{
              fontSize: 22,
              color: 'rgba(255,255,255,0.8)',
              letterSpacing: '4px',
              textTransform: 'uppercase',
              marginBottom: '12px',
              fontWeight: 600,
              fontFamily: 'sans-serif',
            }}
          >
            Neolife Odontologia
          </div>
          <div
            style={{
              fontSize: 44,
              fontWeight: 800,
              color: 'white',
              lineHeight: 1.2,
              fontFamily: 'sans-serif',
            }}
          >
            Dentista no Brasil para Brasileiros no Exterior
          </div>
        </div>
      </div>
    ),
    { ...size }
  );
}
