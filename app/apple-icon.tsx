import { ImageResponse } from 'next/og';

export const size = { width: 180, height: 180 };
export const contentType = 'image/png';

export default function AppleIcon() {
  return new ImageResponse(
    <div
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#F7F4EE',
        color: '#006B4D',
        fontSize: 120,
        fontWeight: 'bold',
        fontFamily: 'Georgia, serif',
      }}
    >
      D
    </div>,
    {
      ...size,
    }
  );
}
